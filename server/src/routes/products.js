const { Router } = require('express');
const Product = require('../models/Product');
const { requireAuth, requireManager } = require('../middleware/auth');

const router = Router();

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── GET /api/products ────────────────────────────────────────────────────────

router.get('/', requireAuth, async (req, res) => {
  try {
    const { category, search, limit = 100 } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      const re = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ name: re }, { sku: re }];
    }

    const products = await Product.find(filter).limit(Number(limit)).lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/products/:id ────────────────────────────────────────────────────

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ error: 'product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/products ───────────────────────────────────────────────────────

router.post('/', requireAuth, requireManager, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    const status = err.name === 'ValidationError' || err.code === 11000 ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
});

// ─── PATCH /api/products/:id ──────────────────────────────────────────────────

router.patch('/:id', requireAuth, requireManager, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!product) return res.status(404).json({ error: 'product not found' });
    res.json(product);
  } catch (err) {
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
});

// ─── DELETE /api/products/:id ─────────────────────────────────────────────────

router.delete('/:id', requireAuth, requireManager, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'product not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
