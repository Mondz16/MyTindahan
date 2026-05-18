require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const Product  = require('../models/Product');
const User     = require('../models/User');

// ─── seed data ───────────────────────────────────────────────────────────────

const PRODUCTS = [
  { sku: 'DRK-001', name: 'Kape Barako · 200g',          category: 'drinks',     price: 195, stock: 38, swatch: '#4e342e', variants: ['Whole Bean', 'Ground'], modifiers: ['Gift wrap'] },
  { sku: 'DRK-002', name: 'Buko Juice · 250ml',           category: 'drinks',     price:  38, stock:  6, swatch: '#c8e6c4', variants: ['Plain', 'Pandan'] },
  { sku: 'DRK-003', name: 'Milo 3-in-1 · Box of 10',     category: 'drinks',     price:  68, stock: 22, swatch: '#3e2723' },
  { sku: 'DRK-004', name: 'Nestea Calamansi · 500ml',    category: 'drinks',     price:  25, stock: 14, swatch: '#aed581', variants: ['Regular', 'Sugar-free'] },
  { sku: 'SNK-101', name: 'Boy Bawang Cornick',           category: 'snacks',     price:  32, stock: 41, swatch: '#f9a825' },
  { sku: 'SNK-102', name: 'Chippy BBQ Corn Chips',        category: 'snacks',     price:  28, stock:  3, swatch: '#bf360c' },
  { sku: 'SNK-103', name: 'Piattos Cheese · 85g',         category: 'snacks',     price:  35, stock: 27, swatch: '#e65100' },
  { sku: 'SNK-104', name: 'Polvoron de Leche · 12pc',     category: 'snacks',     price:  90, stock: 19, swatch: '#fff3cd', modifiers: ['Gift box'] },
  { sku: 'HOM-201', name: 'Banig Woven Mat',              category: 'home',       price: 380, stock: 11, swatch: '#8d6e63', variants: ['Small', 'Medium', 'Large'] },
  { sku: 'HOM-202', name: 'Philippine Beeswax Candle',    category: 'home',       price: 185, stock:  8, swatch: '#e6c478', modifiers: ['Gift wrap'] },
  { sku: 'HOM-203', name: 'Coconut Shell Bowl',           category: 'home',       price: 135, stock: 17, swatch: '#4a3728', variants: ['Natural', 'Lacquered Dark', 'Lacquered Gold'] },
  { sku: 'HOM-204', name: 'Bamboo Cutting Board',         category: 'home',       price: 295, stock: 24, swatch: '#827717' },
  { sku: 'STA-301', name: 'Kraft Notebook · A5',          category: 'stationery', price:  85, stock: 32, swatch: '#c8a97a', variants: ['Dot', 'Ruled', 'Blank'] },
  { sku: 'STA-302', name: 'Mongol Pencil Set · 12pc',     category: 'stationery', price:  55, stock:  9, swatch: '#f9a825' },
  { sku: 'STA-303', name: 'Pilot G-2 Pen · 0.5mm',       category: 'stationery', price:  65, stock: 44, swatch: '#1c1c1c' },
  { sku: 'STA-304', name: 'Baybayin Art Postcards · 5pc', category: 'stationery', price:  45, stock: 88, swatch: '#d7b48a' },
  { sku: 'APP-401', name: 'Barong Tagalog',               category: 'apparel',    price: 890, stock: 12, swatch: '#f5f0e8', variants: ['White', 'Ecru'], modifiers: ['Gift wrap'] },
  { sku: 'APP-402', name: 'Abaca Tote Bag',               category: 'apparel',    price: 350, stock:  2, swatch: '#c9b27c' },
  { sku: 'PER-501', name: 'Eskinol Facial Wash · 50ml',   category: 'personal',   price:  98, stock: 15, swatch: '#b3e0f7', modifiers: ['Gift wrap'] },
  { sku: 'PER-502', name: 'Safeguard Bar Soap · 135g',    category: 'personal',   price:  48, stock:  5, swatch: '#e8f5e9' },
  { sku: 'PER-503', name: 'Human Nature Body Lotion',     category: 'personal',   price: 215, stock: 18, swatch: '#a5d6a7', variants: ['Sunflower', 'Coconut', 'Ylang-ylang'] },
  { sku: 'PER-504', name: 'Hapee Toothpaste · 65g',       category: 'personal',   price:  68, stock: 33, swatch: '#b2ebf2' },
  { sku: 'DRK-005', name: 'C2 Green Tea · 500ml',         category: 'drinks',     price:  22, stock: 21, swatch: '#c5e1a5' },
  { sku: 'HOM-205', name: 'Abaca Placemat Set · 4pc',     category: 'home',       price: 245, stock:  7, swatch: '#a1887f' },
];

const DEMO_USER = {
  email:    'demo@northpine.test',
  password: 'demopass123',
  name:     'Mia Chen',
  role:     'manager',
};

// ─── seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // products
  await Product.deleteMany({});
  const docs = PRODUCTS.map(p => ({
    sku:          p.sku,
    name:         p.name,
    category:     p.category,
    price:        p.price,
    stock:        p.stock,
    swatch:       p.swatch,
    variants:     p.variants  ?? [],
    modifiers:    p.modifiers ?? [],
    reorderPoint: 5,
  }));
  await Product.insertMany(docs);

  // demo user — upsert so re-running seed is idempotent
  const passwordHash = await bcrypt.hash(DEMO_USER.password, 12);
  await User.findOneAndUpdate(
    { email: DEMO_USER.email },
    { email: DEMO_USER.email, passwordHash, name: DEMO_USER.name, role: DEMO_USER.role },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.log(`Seeded ${docs.length} products and 1 user`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
