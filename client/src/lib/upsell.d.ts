import type { CartLine } from '../context/CartContext';
import type { Product } from './mockData';

export declare function getUpsellSuggestion(
  lines: CartLine[],
  products: Product[],
): Product | null;
