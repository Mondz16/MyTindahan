const { Router } = require('express');
const Order   = require('../models/Order');
const Product = require('../models/Product');
const { requireAuth, requireManager } = require('../middleware/auth');

const router = Router();

// ─── POST /api/orders ─────────────────────────────────────────────────────────

router.post('/', requireAuth, async (req, res) => {
  try {
    const { lines: lineInput, paymentMethod, tip = 0 } = req.body;

    if (!Array.isArray(lineInput) || lineInput.length === 0) {
      return res.status(400).json({ error: 'lines must be a non-empty array' });
    }

    // ── 1. fetch products + validate stock (all reads before any writes) ──────
    const resolved = [];
    for (const item of lineInput) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `product not found: ${item.productId}` });
      }
      if (product.stock < item.qty) {
        return res.status(409).json({
          error: `insufficient stock for SKU ${product.sku}`,
          sku:   product.sku,
          have:  product.stock,
          need:  item.qty,
        });
      }
      resolved.push({ product, qty: item.qty, variant: item.variant ?? null, modifiers: item.modifiers ?? [] });
    }

    // ── 2. build line docs ────────────────────────────────────────────────────
    const lines = resolved.map(({ product, qty, variant, modifiers }) => ({
      productId: product._id,
      name:      product.name,
      sku:       product.sku,
      variant,
      modifiers,
      qty,
      unitPrice: product.price,
      lineTotal: qty * product.price,
    }));

    // ── 3. compute totals ─────────────────────────────────────────────────────
    const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    const tax      = subtotal * 0.0875;
    const total    = subtotal + tax + Number(tip);

    // ── 4. persist order (orderNumber auto-set by pre-save hook) ─────────────
    const order = await Order.create({
      lines,
      subtotal,
      tax,
      tip:           Number(tip),
      total,
      paymentMethod,
      cashierId:     req.user.id,
    });

    // ── 5. decrement stock ────────────────────────────────────────────────────
    for (const { product, qty } of resolved) {
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -qty } });
    }

    res.status(201).json(order);
  } catch (err) {
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
});

// ─── GET /api/orders ──────────────────────────────────────────────────────────

router.get('/', requireAuth, requireManager, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/orders/:id ──────────────────────────────────────────────────────

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('lines.productId', 'name sku swatch category');
    if (!order) return res.status(404).json({ error: 'order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
