export const categories = [
  { id: "all",         label: "All" },
  { id: "drinks",      label: "Drinks" },
  { id: "snacks",      label: "Snacks" },
  { id: "home",        label: "Home" },
  { id: "stationery",  label: "Stationery" },
  { id: "apparel",     label: "Apparel" },
  { id: "personal",    label: "Personal Care" },
];

export const products = [
  { id: "p01", sku: "DRK-001", name: "Kape Barako · 200g",          category: "drinks",     price: 195.00, stock: 38, swatch: "#4e342e", variants: ["Whole Bean", "Ground"], modifiers: ["Gift wrap"] },
  { id: "p02", sku: "DRK-002", name: "Buko Juice · 250ml",           category: "drinks",     price:  38.00, stock:  6, swatch: "#c8e6c4", variants: ["Plain", "Pandan"] },
  { id: "p03", sku: "DRK-003", name: "Milo 3-in-1 · Box of 10",     category: "drinks",     price:  68.00, stock: 22, swatch: "#3e2723" },
  { id: "p04", sku: "DRK-004", name: "Nestea Calamansi · 500ml",    category: "drinks",     price:  25.00, stock: 14, swatch: "#aed581", variants: ["Regular", "Sugar-free"] },
  { id: "p05", sku: "SNK-101", name: "Boy Bawang Cornick",           category: "snacks",     price:  32.00, stock: 41, swatch: "#f9a825" },
  { id: "p06", sku: "SNK-102", name: "Chippy BBQ Corn Chips",        category: "snacks",     price:  28.00, stock:  3, swatch: "#bf360c" },
  { id: "p07", sku: "SNK-103", name: "Piattos Cheese · 85g",         category: "snacks",     price:  35.00, stock: 27, swatch: "#e65100" },
  { id: "p08", sku: "SNK-104", name: "Polvoron de Leche · 12pc",     category: "snacks",     price:  90.00, stock: 19, swatch: "#fff3cd", modifiers: ["Gift box"] },
  { id: "p09", sku: "HOM-201", name: "Banig Woven Mat",              category: "home",       price: 380.00, stock: 11, swatch: "#8d6e63", variants: ["Small", "Medium", "Large"] },
  { id: "p10", sku: "HOM-202", name: "Philippine Beeswax Candle",    category: "home",       price: 185.00, stock:  8, swatch: "#e6c478", modifiers: ["Gift wrap"] },
  { id: "p11", sku: "HOM-203", name: "Coconut Shell Bowl",           category: "home",       price: 135.00, stock: 17, swatch: "#4a3728", variants: ["Natural", "Lacquered Dark", "Lacquered Gold"] },
  { id: "p12", sku: "HOM-204", name: "Bamboo Cutting Board",         category: "home",       price: 295.00, stock: 24, swatch: "#827717" },
  { id: "p13", sku: "STA-301", name: "Kraft Notebook · A5",          category: "stationery", price:  85.00, stock: 32, swatch: "#c8a97a", variants: ["Dot", "Ruled", "Blank"] },
  { id: "p14", sku: "STA-302", name: "Mongol Pencil Set · 12pc",     category: "stationery", price:  55.00, stock:  9, swatch: "#f9a825" },
  { id: "p15", sku: "STA-303", name: "Pilot G-2 Pen · 0.5mm",       category: "stationery", price:  65.00, stock: 44, swatch: "#1c1c1c" },
  { id: "p16", sku: "STA-304", name: "Baybayin Art Postcards · 5pc", category: "stationery", price:  45.00, stock: 88, swatch: "#d7b48a" },
  { id: "p17", sku: "APP-401", name: "Barong Tagalog",               category: "apparel",    price: 890.00, stock: 12, swatch: "#f5f0e8", variants: ["White", "Ecru"], modifiers: ["Gift wrap"] },
  { id: "p18", sku: "APP-402", name: "Abaca Tote Bag",               category: "apparel",    price: 350.00, stock:  2, swatch: "#c9b27c" },
  { id: "p19", sku: "PER-501", name: "Eskinol Facial Wash · 50ml",   category: "personal",   price:  98.00, stock: 15, swatch: "#b3e0f7", modifiers: ["Gift wrap"] },
  { id: "p20", sku: "PER-502", name: "Safeguard Bar Soap · 135g",    category: "personal",   price:  48.00, stock:  5, swatch: "#e8f5e9" },
  { id: "p21", sku: "PER-503", name: "Human Nature Body Lotion",     category: "personal",   price: 215.00, stock: 18, swatch: "#a5d6a7", variants: ["Sunflower", "Coconut", "Ylang-ylang"] },
  { id: "p22", sku: "PER-504", name: "Hapee Toothpaste · 65g",       category: "personal",   price:  68.00, stock: 33, swatch: "#b2ebf2" },
  { id: "p23", sku: "DRK-005", name: "C2 Green Tea · 500ml",         category: "drinks",     price:  22.00, stock: 21, swatch: "#c5e1a5" },
  { id: "p24", sku: "HOM-205", name: "Abaca Placemat Set · 4pc",     category: "home",       price: 245.00, stock:  7, swatch: "#a1887f" },
];

export const revenue        = [18420, 15980, 16110, 14790, 19640, 25810, 27120, 17210, 19580, 18340, 20920, 22220, 28380, 30740];
export const forecastRevenue = [22180, 23320, 21090, 24510, 26880, 32020, 33610];

export const hourly = [
  { h: "8a",  v:  620 },
  { h: "9a",  v: 1240 },
  { h: "10a", v: 1980 },
  { h: "11a", v: 2470 },
  { h: "12p", v: 3610 },
  { h: "1p",  v: 3720 },
  { h: "2p",  v: 2540 },
  { h: "3p",  v: 2110 },
  { h: "4p",  v: 1860 },
  { h: "5p",  v: 2990 },
  { h: "6p",  v: 3480 },
  { h: "7p",  v: 2220, projected: true },
  { h: "8p",  v: 1480, projected: true },
  { h: "9p",  v:  860, projected: true },
];

export const restockAlerts = [
  { sku: "SNK-102", name: "Chippy BBQ Corn Chips",      stock: 3, daysLeft: 1.2, reorder: 48, confidence: 0.93, severity: "critical", reason: "Sells 2.5×/day, last 7d" },
  { sku: "APP-402", name: "Abaca Tote Bag",              stock: 2, daysLeft: 1.8, reorder: 24, confidence: 0.88, severity: "critical", reason: "Featured in window display" },
  { sku: "PER-502", name: "Safeguard Bar Soap · 135g",  stock: 5, daysLeft: 2.4, reorder: 60, confidence: 0.81, severity: "high",     reason: "Seasonal demand lift expected" },
  { sku: "DRK-002", name: "Buko Juice · 250ml",         stock: 6, daysLeft: 3.1, reorder: 72, confidence: 0.79, severity: "high",     reason: "Summer weekend velocity 1.8×" },
  { sku: "HOM-205", name: "Abaca Placemat Set · 4pc",   stock: 7, daysLeft: 4.0, reorder: 16, confidence: 0.72, severity: "medium",   reason: "Fiesta gifting season" },
  { sku: "HOM-202", name: "Philippine Beeswax Candle",  stock: 8, daysLeft: 4.4, reorder: 20, confidence: 0.68, severity: "medium",   reason: "Restock cadence due" },
];

export const recentSales = [
  { id: "T-2841", time: "14:22", items: 4, total: 342.50, method: "GCash" },
  { id: "T-2840", time: "14:18", items: 1, total: 195.00, method: "Cash"  },
  { id: "T-2839", time: "14:11", items: 2, total: 380.00, method: "Card"  },
  { id: "T-2838", time: "14:04", items: 6, total: 875.50, method: "Maya"  },
  { id: "T-2837", time: "13:58", items: 3, total: 418.00, method: "Card"  },
  { id: "T-2836", time: "13:52", items: 2, total: 283.00, method: "Cash"  },
];

export const insights = [
  { kind: "forecast",    title: "Saturday will outperform last week by 14%",          body: "Foot traffic + payday weekend + local fiesta nearby suggest a strong day. Stock up on best sellers.", confidence: 0.86 },
  { kind: "anomaly",     title: "Boy Bawang Cornick sold 3× normal velocity today",   body: "Likely tied to the new snack pairing display. Consider promoting alongside Piattos through Sunday.",  confidence: 0.74 },
  { kind: "opportunity", title: "Bundle Beeswax Candle + Abaca Placemat Set",         body: "Co-purchased 9 times this week. A bundle at ₱398 (-8%) projects +₱2,800 weekly.",                   confidence: 0.69 },
];
