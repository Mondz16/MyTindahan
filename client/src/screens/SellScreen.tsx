import { useState, useMemo } from 'react';
import { products, categories } from '../lib/mockData.js';
import type { Product } from '../lib/mockData.js';
import { useCart } from '../context/CartContext.js';
import type { CartLine } from '../context/CartContext.js';
import { getUpsellSuggestion } from '../lib/upsell.js';

// ─── icons ───────────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="6.5" cy="6.5" r="4.5" />
      <path d="M10 10 13.5 13.5" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="5" height="5" rx="1" />
      <rect x="8" y="1" width="5" height="5" rx="1" />
      <rect x="1" y="8" width="5" height="5" rx="1" />
      <rect x="8" y="8" width="5" height="5" rx="1" />
    </svg>
  );
}

function IconList() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round">
      <path d="M2 3.5h10M2 7h10M2 10.5h10" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="6" cy="4" r="2" />
      <path d="M2 11a4 4 0 0 1 8 0" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 2l6 6M8 2l-6 6" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M5 1v8M1 5h8" />
    </svg>
  );
}

function IconMinus() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M1.5 5h7" />
    </svg>
  );
}

// ─── ConfigurePopover ─────────────────────────────────────────────────────────

function ConfigurePopover({
  product,
  onAdd,
  onClose,
}: {
  product: Product;
  onAdd: (opts: { variant?: string; modifiers: string[] }) => void;
  onClose: () => void;
}) {
  const [selectedVariant,  setSelectedVariant]  = useState<string | undefined>(product.variants?.[0]);
  const [selectedMods,     setSelectedMods]     = useState<Set<string>>(new Set());

  function toggleMod(mod: string) {
    setSelectedMods(prev => {
      const next = new Set(prev);
      if (next.has(mod)) {
        next.delete(mod);
      } else {
        next.add(mod);
      }
      return next;
    });
  }

  function handleAdd() {
    onAdd({ variant: selectedVariant, modifiers: [...selectedMods] });
  }

  return (
    <div className="popover-backdrop" onClick={onClose}>
      <div className="popover" onClick={e => e.stopPropagation()}>

        {/* header */}
        <div className="popover-hd">
          <div>
            <div className="popover-title">{product.name}</div>
            <div className="popover-sub">${product.price.toFixed(2)}</div>
          </div>
          <div
            style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: product.swatch,
              boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.08)',
            }}
          />
        </div>

        {/* variants */}
        {product.variants && product.variants.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="popover-sect">Variant</div>
            <div className="popover-grid">
              {product.variants.map(v => (
                <button
                  key={v}
                  className={`variant-pill${selectedVariant === v ? ' is-on' : ''}`}
                  onClick={() => setSelectedVariant(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* modifiers */}
        {product.modifiers && product.modifiers.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="popover-sect">Add-ons</div>
            <div className="popover-list">
              {product.modifiers.map(mod => (
                <label key={mod} className="mod-row">
                  <input
                    type="checkbox"
                    checked={selectedMods.has(mod)}
                    onChange={() => toggleMod(mod)}
                  />
                  {mod}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* actions */}
        <div className="popover-actions" style={{ gap: 8 }}>
          <button className="ghost-btn" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleAdd}>Add to cart</button>
        </div>

      </div>
    </div>
  );
}

// ─── ProductTile ──────────────────────────────────────────────────────────────

function ProductTile({
  product,
  view,
  onAdd,
  onConfigure,
}: {
  product: Product;
  view: 'grid' | 'list';
  onAdd: () => void;
  onConfigure: () => void;
}) {
  const lowStock = product.stock > 0 && product.stock <= 5;
  const outStock = product.stock === 0;
  const needsPop = !!(product.variants?.length || product.modifiers?.length);
  const handleClick = needsPop ? onConfigure : onAdd;

  if (view === 'list') {
    return (
      <button
        className={`tile tile-list${outStock ? ' is-out' : ''}`}
        onClick={handleClick}
        disabled={outStock}
      >
        {lowStock && <div className="badge-warn" />}
        <div className="swatch swatch-sm" style={{ background: product.swatch }}>
          {outStock && <div className="badge-out">Out</div>}
        </div>
        <div className="tile-name" style={{ flex: 1, textAlign: 'left' }}>{product.name}</div>
        <div className="tile-price mono">${product.price.toFixed(2)}</div>
      </button>
    );
  }

  return (
    <button
      className={`tile tile-grid${outStock ? ' is-out' : ''}`}
      onClick={handleClick}
      disabled={outStock}
    >
      {lowStock && <div className="badge-warn" />}
      <div className="swatch" style={{ background: product.swatch }}>
        {outStock && <div className="badge-out">Out</div>}
      </div>
      <div className="tile-name">{product.name}</div>
      <div className="tile-row">
        <div className="tile-price mono">${product.price.toFixed(2)}</div>
        <div className="tile-sku mono">{product.sku}</div>
      </div>
    </button>
  );
}

// ─── CartLineRow ─────────────────────────────────────────────────────────────

function CartLineRow({
  line,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  line: CartLine;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="cart-line">
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="cart-line-name">{line.name}</div>
        {line.variant && <div className="cart-line-variant">{line.variant}</div>}
      </div>
      <div className="qty">
        <button className="qty-btn" onClick={onDecrement}><IconMinus /></button>
        <span className="qty-n">{line.qty}</span>
        <button className="qty-btn" onClick={onIncrement}><IconPlus /></button>
      </div>
      <div className="cart-line-price mono">${(line.qty * line.unitPrice).toFixed(2)}</div>
      <button className="cart-line-x" onClick={onRemove}><IconX /></button>
    </div>
  );
}

// ─── AriaStrip ───────────────────────────────────────────────────────────────

function AriaStrip({ suggestion, onAdd }: { suggestion: Product; onAdd: () => void }) {
  return (
    <div className="aria-strip">
      <div className="aria-mark">
        <span className="aria-dot" style={{ background: 'var(--accent-fg)' }} />
      </div>
      <div className="aria-text">
        Try adding <strong>{suggestion.name}</strong> for ${suggestion.price.toFixed(2)}
      </div>
      <button className="aria-action" onClick={onAdd}>Add</button>
    </div>
  );
}

// ─── SellScreen ──────────────────────────────────────────────────────────────

export default function SellScreen({ onCharge, aiOn }: { onCharge: () => void; aiOn: boolean }) {
  const { lines, addLine, incrementLine, decrementLine, removeLine, subtotal, tax, total, itemCount } = useCart();
  const [searchQuery,      setSearchQuery]      = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [view,             setView]             = useState<'grid' | 'list'>('grid');
  const [pop,              setPop]              = useState<Product | null>(null);

  const suggestion = useMemo(
    () => (lines.length > 0 ? getUpsellSuggestion(lines, products) : null),
    [lines],
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return products.filter(p => {
      const catMatch    = activeCategoryId === 'all' || p.category === activeCategoryId;
      const searchMatch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }, [searchQuery, activeCategoryId]);

  function handlePopoverAdd(opts: { variant?: string; modifiers: string[] }) {
    if (!pop) return;
    addLine(pop, opts);
    setPop(null);
  }

  return (
    <div className="sell">

      {/* ── variant/modifier popover ──────────────────────────────────────── */}
      {pop && (
        <ConfigurePopover
          key={pop.id}
          product={pop}
          onAdd={handlePopoverAdd}
          onClose={() => setPop(null)}
        />
      )}

      {/* ── LEFT ──────────────────────────────────────────────────────────── */}
      <div className="sell-left">

        <div className="search-bar">
          <IconSearch />
          <input
            placeholder="Search items, SKUs, or tap ⌘K"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <span className="kbd">⌘K</span>
        </div>

        <div className="cat-row">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`cat${activeCategoryId === cat.id ? ' is-active' : ''}`}
              onClick={() => setActiveCategoryId(cat.id)}
            >
              {cat.label}
            </button>
          ))}
          <div className="cat-spacer" />
          <button
            className={`view-tog${view === 'grid' ? ' is-on' : ''}`}
            aria-label="Grid view"
            onClick={() => setView('grid')}
          >
            <IconGrid />
          </button>
          <button
            className={`view-tog${view === 'list' ? ' is-on' : ''}`}
            aria-label="List view"
            onClick={() => setView('list')}
          >
            <IconList />
          </button>
        </div>

        <div className={`product-area ${view === 'grid' ? 'view-grid' : 'view-list'}`}>
          {filteredProducts.length === 0 ? (
            <div className="empty">No items match.</div>
          ) : filteredProducts.map(product => (
            <ProductTile
              key={product.sku}
              product={product}
              view={view}
              onAdd={() => addLine(product)}
              onConfigure={() => setPop(product)}
            />
          ))}
        </div>

      </div>

      {/* ── RIGHT ─────────────────────────────────────────────────────────── */}
      <div className="sell-right">

        <div className="cart-hd">
          <div>
            <div>
              <span className="cart-title">Cart</span>
              <span className="cart-id">T-2842</span>
            </div>
            <div className="cart-meta">{itemCount} {itemCount === 1 ? 'item' : 'items'}</div>
          </div>
        </div>

        <div className="customer-row">
          <div className="cust-pill">
            <IconUser />
            Walk-in customer
          </div>
        </div>

        <div className="cart-lines">
          {lines.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-glyph">🛒</div>
              <div>Cart is empty</div>
              <div className="cart-empty-sub">Scan or tap items to add</div>
            </div>
          ) : lines.map(line => (
            <CartLineRow
              key={line.id}
              line={line}
              onIncrement={() => incrementLine(line.id)}
              onDecrement={() => decrementLine(line.id)}
              onRemove={() => removeLine(line.id)}
            />
          ))}
        </div>

        {aiOn && itemCount > 0 && suggestion && (
          <AriaStrip suggestion={suggestion} onAdd={() => addLine(suggestion)} />
        )}

        <div className="totals">
          <div className="tot-row">
            <span>Subtotal</span>
            <span className="mono">${subtotal.toFixed(2)}</span>
          </div>
          <div className="tot-row">
            <span>Tax (8.75%)</span>
            <span className="mono">${tax.toFixed(2)}</span>
          </div>
          <div className="tot-row tot-grand">
            <span>Total</span>
            <span className="mono">${total.toFixed(2)}</span>
          </div>
        </div>

        <button className="primary-btn" disabled={itemCount === 0} onClick={onCharge}>
          Charge <span className="mono">${total.toFixed(2)}</span>
        </button>

      </div>

    </div>
  );
}
