const { Router } = require('express');
const Anthropic  = require('@anthropic-ai/sdk');
const Order      = require('../models/Order');
const Product    = require('../models/Product');
const { requireAuth, requireManager } = require('../middleware/auth');

const router = Router();

// simple in-memory cache: { data, expiresAt }
let cache = null;

// ─── GET /api/insights ────────────────────────────────────────────────────────
// Returns Aria-generated business insights based on today's orders.
// Response is cached for 30 minutes to avoid redundant API calls.

router.get('/', requireAuth, requireManager, async (req, res) => {
  try {
    // serve from cache if still fresh
    if (cache && cache.expiresAt > Date.now()) {
      return res.json({ insights: cache.data, cached: true });
    }

    // ── build context snapshot ────────────────────────────────────────────────
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const [todayOrders, lowStockProducts] = await Promise.all([
      Order.find({ status: 'completed', createdAt: { $gte: todayStart } }).lean(),
      Product.find({ stock: { $gt: 0, $lte: 5 } }).select('name sku stock reorderPoint').lean(),
    ]);

    const totalRevenue  = todayOrders.reduce((s, o) => s + o.total, 0);
    const orderCount    = todayOrders.length;
    const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    // top 5 SKUs by qty sold today
    const skuQty = {};
    for (const order of todayOrders) {
      for (const line of order.lines) {
        skuQty[line.name] = (skuQty[line.name] ?? 0) + line.qty;
      }
    }
    const topItems = Object.entries(skuQty)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, qty]) => `${name} (×${qty})`);

    const contextBlock = [
      `Date: ${now.toISOString().slice(0, 10)}`,
      `Orders today: ${orderCount}`,
      `Revenue today: ₱${totalRevenue.toFixed(2)}`,
      `Avg order value: ₱${avgOrderValue.toFixed(2)}`,
      `Top items: ${topItems.length ? topItems.join(', ') : 'none yet'}`,
      `Low-stock items (≤5 units): ${
        lowStockProducts.length
          ? lowStockProducts.map(p => `${p.name} (${p.stock} left)`).join(', ')
          : 'none'
      }`,
    ].join('\n');

    // ── call Anthropic ────────────────────────────────────────────────────────
    const client = new Anthropic();
    const message = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system:
        'You are Aria, an AI assistant embedded in a point-of-sale app called North & Pine Smart POS. ' +
        'Give concise, actionable business insights for the store manager based on today\'s sales data. ' +
        'Use plain language. Return 3 short bullet points, each starting with "•". No markdown headers.',
      messages: [
        {
          role:    'user',
          content: `Here is today's sales summary:\n\n${contextBlock}\n\nProvide 3 insights or recommendations.`,
        },
      ],
    });

    const text = message.content[0]?.text ?? 'No insights available.';

    // cache for 30 minutes
    cache = { data: text, expiresAt: Date.now() + 30 * 60 * 1000 };

    res.json({ insights: text, cached: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
