// Stub upsell products — not in the main catalog, suggested by Aria
const OATMILK = {
  id: 'upsell-drk-001',
  sku: 'DRK-U01',
  name: 'Oat Milk · 1L',
  category: 'drinks',
  price: 85,
  stock: 99,
  swatch: '#f0ece4',
};

const BRASS_MATCH = {
  id: 'upsell-hom-001',
  sku: 'HOM-U01',
  name: 'Brass Match Holder',
  category: 'home',
  price: 320,
  stock: 99,
  swatch: '#c8a060',
};

/**
 * Returns a single upsell Product suggestion, or null if none applies.
 * @param {import('../context/CartContext').CartLine[]} lines
 * @param {import('./mockData').Product[]} _products  — reserved for future catalog lookups
 * @returns {import('./mockData').Product | null}
 */
export function getUpsellSuggestion(lines, _products) {
  const cartNames = new Set(lines.map(l => l.name));

  if (lines.some(l => l.sku.startsWith('DRK-')) && !cartNames.has(OATMILK.name)) {
    return OATMILK;
  }

  if (lines.some(l => l.sku.startsWith('HOM-202')) && !cartNames.has(BRASS_MATCH.name)) {
    return BRASS_MATCH;
  }

  return null;
}
