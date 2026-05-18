require('dotenv').config();

const express  = require('express');
const mongoose = require('mongoose');
const helmet   = require('helmet');
const cors     = require('cors');
const morgan   = require('morgan');

const authRouter      = require('./routes/auth');
const productsRouter  = require('./routes/products');
const ordersRouter    = require('./routes/orders');
const analyticsRouter = require('./routes/analytics');
const insightsRouter  = require('./routes/insights');

const PORT        = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// ─── database ────────────────────────────────────────────────────────────────

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB connection error:', err); process.exit(1); });

// ─── app ─────────────────────────────────────────────────────────────────────

const app = express();

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

// ─── routes ──────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

app.use('/api/auth',      authRouter);
app.use('/api/products',  productsRouter);
app.use('/api/orders',    ordersRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/insights',  insightsRouter);

// ─── listen ──────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
