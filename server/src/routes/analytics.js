const { Router } = require('express');
const Order = require('../models/Order');
const { requireAuth, requireManager } = require('../middleware/auth');

const router = Router();

// 8 AM – 9 PM (hours 8–21 UTC; UTC midnight == midnight is fine per spec)
const HOUR_NUMS   = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
const HOUR_LABELS = ['8a','9a','10a','11a','12p','1p','2p','3p','4p','5p','6p','7p','8p','9p'];

// deterministic day-of-week forecast weights (Sun=0 … Sat=6)
const DAY_WEIGHTS = [0.85, 1.00, 1.08, 1.12, 1.18, 1.10, 0.92];

function dayBounds(d) {
  const start = new Date(d); start.setHours(0, 0, 0, 0);
  const end   = new Date(d); end.setHours(23, 59, 59, 999);
  return { start, end };
}

// ─── GET /api/analytics/today ─────────────────────────────────────────────────

router.get('/today', requireAuth, requireManager, async (req, res) => {
  try {
    const now = new Date();
    const { start: todayStart, end: todayEnd } = dayBounds(now);

    const lastWeekSame = new Date(now);
    lastWeekSame.setDate(lastWeekSame.getDate() - 7);
    const { start: lwStart, end: lwEnd } = dayBounds(lastWeekSame);

    const [
      todayAgg,
      lwAgg,
      hourlyAgg,
      topSellersAgg,
      recentToday,
    ] = await Promise.all([

      // summary totals for today
      Order.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: todayStart, $lte: todayEnd } } },
        { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
      ]),

      // same weekday last week revenue (for vsLastWeek)
      Order.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: lwStart, $lte: lwEnd } } },
        { $group: { _id: null, revenue: { $sum: '$total' } } },
      ]),

      // revenue per hour-of-day for today
      Order.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: todayStart, $lte: todayEnd } } },
        { $group: { _id: { $hour: '$createdAt' }, v: { $sum: '$total' } } },
      ]),

      // top 5 products by qty sold today
      Order.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: todayStart, $lte: todayEnd } } },
        { $unwind: '$lines' },
        {
          $group: {
            _id:     '$lines.productId',
            name:    { $first: '$lines.name' },
            sku:     { $first: '$lines.sku' },
            qty:     { $sum: '$lines.qty' },
            revenue: { $sum: '$lines.lineTotal' },
          },
        },
        { $sort: { qty: -1 } },
        { $limit: 5 },
        { $project: { productId: '$_id', _id: 0, name: 1, sku: 1, qty: 1, revenue: 1 } },
      ]),

      // last 6 orders placed today
      Order.find({ status: 'completed', createdAt: { $gte: todayStart, $lte: todayEnd } })
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    // fall back to last 6 ever if today has no orders yet
    const recentRaw = recentToday.length > 0
      ? recentToday
      : await Order.find({ status: 'completed' }).sort({ createdAt: -1 }).limit(6).lean();

    // derived scalars
    const revenueToday      = todayAgg[0]?.revenue ?? 0;
    const transactionsToday = todayAgg[0]?.count   ?? 0;
    const avgTicket         = transactionsToday > 0 ? revenueToday / transactionsToday : 0;
    const lwRevenue         = lwAgg[0]?.revenue ?? 0;
    const vsLastWeek        = lwRevenue > 0 ? (revenueToday - lwRevenue) / lwRevenue : 0;

    // build 14-bucket hourly array (fill missing hours with 0)
    const hourMap = Object.fromEntries(hourlyAgg.map(b => [b._id, b.v]));
    const hourly  = HOUR_NUMS.map((h, i) => ({ h: HOUR_LABELS[i], v: hourMap[h] ?? 0 }));

    // shape recent transactions
    const recentTransactions = recentRaw.map(o => ({
      id:          o._id,
      orderNumber: o.orderNumber,
      time:        o.createdAt,
      items:       o.lines.reduce((s, l) => s + l.qty, 0),
      total:       o.total,
      method:      o.paymentMethod,
    }));

    res.json({
      revenueToday,
      transactionsToday,
      avgTicket,
      vsLastWeek,
      hourly,
      topSellers: topSellersAgg,
      recentTransactions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/analytics/revenue ───────────────────────────────────────────────

router.get('/revenue', requireAuth, requireManager, async (req, res) => {
  try {
    const now = new Date();

    // build 14 calendar day slots, oldest first
    const slots = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (13 - i));
      return d;
    });

    const rangeStart = new Date(slots[0]); rangeStart.setHours(0, 0, 0, 0);
    const rangeEnd   = new Date(now);      rangeEnd.setHours(23, 59, 59, 999);

    const buckets = await Order.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: rangeStart, $lte: rangeEnd } } },
      {
        $group: {
          _id:     { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
        },
      },
    ]);

    const byDate = Object.fromEntries(buckets.map(b => [b._id, b.revenue]));

    const revenue = slots.map(d => byDate[d.toISOString().slice(0, 10)] ?? 0);

    // forecast: base = avg of last 3 non-zero days, scaled by day-of-week weight
    const last3     = revenue.slice(-3).filter(v => v > 0);
    const base      = last3.length > 0 ? last3.reduce((s, v) => s + v, 0) / last3.length : 0;
    const forecast  = Array.from({ length: 7 }, (_, i) => {
      const fd = new Date(now);
      fd.setDate(fd.getDate() + i + 1);
      return parseFloat((base * DAY_WEIGHTS[fd.getDay()]).toFixed(2));
    });

    res.json({ revenue, forecast });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
