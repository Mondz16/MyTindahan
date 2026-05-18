const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = Router();

// ─── helpers ─────────────────────────────────────────────────────────────────

function signToken(user) {
  return jwt.sign(
    { sub: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );
}

function userShape(user) {
  return { id: user._id, email: user.email, name: user.name, role: user.role };
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────

router.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'email, password, and name are required' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name, role });
    res.status(201).json({ user: userShape(user), token: signToken(user) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'email already in use' });
    }
    throw err;
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return res.status(401).json({ error: 'invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: 'invalid credentials' });
  }

  res.json({ user: userShape(user), token: signToken(user) });
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  if (!user) {
    return res.status(404).json({ error: 'user not found' });
  }
  res.json({ user: userShape(user) });
});

module.exports = router;
