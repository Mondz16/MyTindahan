import { useState } from 'react';
import type { CartLine } from '../context/CartContext.js';

// ─── types ───────────────────────────────────────────────────────────────────

export interface CompletedOrder {
  orderNumber: string;
  lines: CartLine[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  method: string;
  completedAt: number;
}

// ─── icons ───────────────────────────────────────────────────────────────────

function IconPrint() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4V2h7v2" />
      <rect x="1" y="4" width="11" height="6" rx="1.2" />
      <path d="M3 10v1h7v-1" />
      <circle cx="9.5" cy="7" r=".6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="11" height="7" rx="1.2" />
      <path d="M1 4l5.5 4L12 4" />
    </svg>
  );
}

function IconSms() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 2H2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.5L5 11l1.5-2H11a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
    </svg>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────

const METHOD_LABEL: Record<string, string> = {
  card:     'Card',
  cash:     'Cash',
  applepay: 'Apple Pay',
};

// ─── ReceiptScreen ────────────────────────────────────────────────────────────

export default function ReceiptScreen({
  order,
  onNewSale,
}: {
  order: CompletedOrder;
  onNewSale: () => void;
}) {
  const [email, setEmail] = useState('');

  const grandTotal = order.total + order.tip;
  const time = new Date(order.completedAt).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  });

  return (
    <>
      <style>{`
        @keyframes checkDraw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      <div className="overlay">
        <div className="overlay-bg" onClick={onNewSale} />

        <div className="receipt-card" style={{ overflowY: 'auto', maxHeight: '92vh' }}>

          {/* ── success ring ──────────────────────────────────────────────── */}
          <div className="receipt-success">
            <svg
              width="60" height="60" viewBox="0 0 60 60" fill="none"
              style={{ display: 'block', margin: '0 auto 14px' }}
            >
              <circle
                cx="30" cy="30" r="28"
                fill="var(--accent)"
                style={{ animation: 'ringPop 400ms cubic-bezier(0.2,1.4,0.5,1) both' }}
              />
              <path
                d="M19 30 L27 38 L42 22"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="37"
                strokeDashoffset="37"
                style={{ animation: 'checkDraw 380ms ease forwards 220ms' }}
              />
            </svg>
            <div className="success-title">Thanks!</div>
            <div className="success-sub">{order.orderNumber} · {time}</div>
          </div>

          {/* ── receipt paper ─────────────────────────────────────────────── */}
          <div className="receipt-paper">

            <div className="rp-header">
              <div className="rp-store">NORTH &amp; PINE</div>
              <div className="rp-sub">3rd &amp; Hayes · Reg 1</div>
            </div>

            <div className="rp-divider" />

            {order.lines.map(line => (
              <div key={line.id} className="rp-line">
                <span className="rp-qty">{line.qty}×</span>
                <span className="rp-name">
                  {line.name}
                  {line.variant && (
                    <span className="rp-variant"> · {line.variant}</span>
                  )}
                </span>
                <span className="rp-price mono">
                  ${(line.qty * line.unitPrice).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="rp-divider" />

            <div className="rp-line">
              <span className="rp-name">Subtotal</span>
              <span className="rp-price mono">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="rp-line">
              <span className="rp-name">Tax (8.75%)</span>
              <span className="rp-price mono">${order.tax.toFixed(2)}</span>
            </div>
            {order.tip > 0 && (
              <div className="rp-line">
                <span className="rp-name">Tip</span>
                <span className="rp-price mono">${order.tip.toFixed(2)}</span>
              </div>
            )}

            <div className="rp-divider" />

            <div className="rp-line rp-total">
              <span className="rp-name">Total</span>
              <span className="rp-price mono">${grandTotal.toFixed(2)}</span>
            </div>

            <div style={{ textAlign: 'center', marginTop: 6 }}>
              <span className="rp-method">
                Paid by {METHOD_LABEL[order.method] ?? order.method}
              </span>
            </div>

            <div className="rp-thanks">
              <div className="rp-thanks-em">Come back soon!</div>
            </div>

          </div>

          {/* ── loyalty enrollment ────────────────────────────────────────── */}
          <div className="receipt-aria">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, marginBottom: 3 }}>
                Want your receipt by email?
              </div>
              <div style={{ color: 'var(--ink-3)', fontSize: 11, marginBottom: 8 }}>
                Get $5 off your next visit.
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    flex: 1, padding: '7px 10px', fontSize: 12,
                    background: 'var(--surface)', border: 0, outline: 0,
                    borderRadius: 7,
                    boxShadow: 'inset 0 0 0 0.5px var(--line)',
                    color: 'var(--ink)',
                  }}
                />
                <button
                  className="aria-action"
                  style={{
                    padding: '7px 14px', fontSize: 12, borderRadius: 7,
                    fontWeight: 500, whiteSpace: 'nowrap',
                  }}
                  onClick={() => {}}
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* ── actions ───────────────────────────────────────────────────── */}
          <div className="receipt-actions">
            <button className="receipt-btn" onClick={() => {}}>
              <IconPrint /> Print
            </button>
            <button className="receipt-btn" onClick={() => {}}>
              <IconMail /> Email
            </button>
            <button className="receipt-btn" onClick={() => {}}>
              <IconSms /> SMS
            </button>
            <button className="receipt-btn receipt-btn-primary" onClick={onNewSale}>
              New sale
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
