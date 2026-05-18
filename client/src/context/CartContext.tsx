import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Product } from '../lib/mockData.js';

// ─── types ───────────────────────────────────────────────────────────────────

export interface CartLine {
  id: string;
  productId: string;
  name: string;
  sku: string;
  qty: number;
  unitPrice: number;
  variant: string | null;
  modifiers: string[];
}

interface CartContextValue {
  lines: CartLine[];
  addLine: (product: Product, opts?: { variant?: string; modifiers?: string[] }) => void;
  incrementLine: (lineId: string) => void;
  decrementLine: (lineId: string) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

// ─── context ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

// ─── provider ────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addLine = useCallback(
    (
      product: Product,
      { variant, modifiers = [] }: { variant?: string; modifiers?: string[] } = {},
    ) => {
      const sortedMods = [...modifiers].sort();

      setLines(prev => {
        const existing = prev.find(
          l =>
            l.productId === product.id &&
            l.variant === (variant ?? null) &&
            JSON.stringify([...l.modifiers].sort()) === JSON.stringify(sortedMods),
        );

        if (existing) {
          return prev.map(l =>
            l.id === existing.id ? { ...l, qty: l.qty + 1 } : l,
          );
        }

        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            productId: product.id,
            name: product.name,
            sku: product.sku,
            qty: 1,
            unitPrice: product.price,
            variant: variant ?? null,
            modifiers: sortedMods,
          },
        ];
      });
    },
    [],
  );

  const incrementLine = useCallback((lineId: string) => {
    setLines(prev =>
      prev.map(l => (l.id === lineId ? { ...l, qty: l.qty + 1 } : l)),
    );
  }, []);

  const decrementLine = useCallback((lineId: string) => {
    setLines(prev => {
      const line = prev.find(l => l.id === lineId);
      if (!line) return prev;
      if (line.qty <= 1) return prev.filter(l => l.id !== lineId);
      return prev.map(l => (l.id === lineId ? { ...l, qty: l.qty - 1 } : l));
    });
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setLines(prev => prev.filter(l => l.id !== lineId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const { subtotal, tax, total, itemCount } = useMemo(() => {
    const subtotal = lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
    const tax = subtotal * 0.0875;
    return {
      subtotal,
      tax,
      total: subtotal + tax,
      itemCount: lines.reduce((sum, l) => sum + l.qty, 0),
    };
  }, [lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      addLine,
      incrementLine,
      decrementLine,
      removeLine,
      clearCart,
      subtotal,
      tax,
      total,
      itemCount,
    }),
    [lines, addLine, incrementLine, decrementLine, removeLine, clearCart, subtotal, tax, total, itemCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── hook ────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
