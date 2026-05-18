import { useState } from 'react';

type Method     = 'card' | 'cash' | 'applepay';
type TipPreset  = 0 | 10 | 15 | 20 | 'custom';

// ─── icons ───────────────────────────────────────────────────────────────────

function IconChevronLeft() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2L4 6.5L8 11" />
    </svg>
  );
}

function IconCard() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="16" height="11" rx="2" />
      <path d="M2 8h16" />
      <path d="M5 12h3" />
    </svg>
  );
}

function IconCash() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="16" height="10" rx="2" />
      <circle cx="10" cy="10" r="2.5" />
      <path d="M5.5 10h.01M14.5 10h.01" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="10" height="16" rx="2.5" />
      <path d="M8.5 15h3" />
    </svg>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function buildQuickAmounts(gt: number): number[] {
  const round = (n: number, to: number) => Math.ceil(n / to) * to;
  const candidates = [
    round(gt, 5),
    round(gt, 10),
    round(gt, 50),
    round(gt, 100),
    round(gt, 100) + 100,
    round(gt, 100) + 200,
  ];
  const result: number[] = [];
  for (const c of candidates) {
    if (!result.includes(c) && result.length < 4) result.push(c);
  }
  return result;
}

const TIP_PRESETS: TipPreset[] = [10, 15, 20, 'custom'];

// ─── PaymentScreen ────────────────────────────────────────────────────────────

export default function PaymentScreen({
  subtotal,
  tax,
  total,
  onCancel,
  onComplete,
}: {
  subtotal: number;
  tax: number;
  total: number;
  onCancel: () => void;
  onComplete: (method: Method, tip: number) => void;
}) {
  const [method,       setMethod]       = useState<Method>('card');
  const [tipPercent,   setTipPercent]   = useState<TipPreset>(0);
  const [customTip,    setCustomTip]    = useState('');
  const [cashTendered, setCashTendered] = useState('');
  const [processing,   setProcessing]   = useState(false);
  const [cashError,    setCashError]    = useState('');

  const tipAmount =
    tipPercent === 'custom'
      ? parseFloat(customTip) || 0
      : (subtotal * (tipPercent as number)) / 100;

  const grandTotal = total + tipAmount;
  const tendered   = parseFloat(cashTendered) || 0;
  const change     = Math.max(0, tendered - grandTotal);

  function handleTipPreset(preset: TipPreset) {
    setTipPercent(prev => (prev === preset ? 0 : preset));
    if (preset !== 'custom') setCustomTip('');
  }

  function handleCharge() {
    if (method === 'cash') {
      if (tendered < grandTotal) {
        setCashError('Cash tendered must cover the total.');
        return;
      }
      onComplete('cash', tipAmount);
    } else {
      setProcessing(true);
      setTimeout(() => onComplete(method, tipAmount), 1500);
    }
  }

  const quickAmounts = buildQuickAmounts(grandTotal);

  return (
    <div className="overlay">
      <div className="overlay-bg" onClick={onCancel} />

      <div className="pay-card">

        {/* ── header ──────────────────────────────────────────────────────── */}
        <div className="pay-hd">
          <button className="back-btn" onClick={onCancel}>
            <IconChevronLeft /> Cancel
          </button>
          <div className="pay-id">T-2843</div>
        </div>

        {/* ── amount ──────────────────────────────────────────────────────── */}
        <div className="pay-amount">
          <div className="pay-label">Amount Due</div>
          <div className="pay-grand mono">${grandTotal.toFixed(2)}</div>
          <div className="pay-breakdown">
            <span>Subtotal ${subtotal.toFixed(2)}</span>
            <span>·</span>
            <span>Tax ${tax.toFixed(2)}</span>
            {tipAmount > 0 && (
              <>
                <span>·</span>
                <span>Tip ${tipAmount.toFixed(2)}</span>
              </>
            )}
          </div>
        </div>

        {/* ── tip row ─────────────────────────────────────────────────────── */}
        <div className="tip-row">
          <span className="tip-label">Tip</span>
          {TIP_PRESETS.map(p => (
            <button
              key={p}
              className={`tip-btn${tipPercent === p ? ' is-on' : ''}`}
              onClick={() => handleTipPreset(p)}
            >
              {p === 'custom' ? 'Custom' : `${p}%`}
            </button>
          ))}
        </div>

        {tipPercent === 'custom' && (
          <div style={{ padding: '4px 22px 10px' }}>
            <input
              className="cash-input"
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={customTip}
              onChange={e => setCustomTip(e.target.value)}
            />
          </div>
        )}

        {/* ── payment methods ─────────────────────────────────────────────── */}
        <div className="pay-methods">
          <button
            className={`pay-method${method === 'card' ? ' is-on' : ''}`}
            onClick={() => setMethod('card')}
          >
            <IconCard />
            <div>
              <div className="pm-label">Card</div>
              <div className="pm-sub">Debit or credit</div>
            </div>
            <div className="pm-radio" />
          </button>

          <button
            className={`pay-method${method === 'cash' ? ' is-on' : ''}`}
            onClick={() => setMethod('cash')}
          >
            <IconCash />
            <div>
              <div className="pm-label">Cash</div>
              <div className="pm-sub">Exact change preferred</div>
            </div>
            <div className="pm-radio" />
          </button>

          <button
            className={`pay-method${method === 'applepay' ? ' is-on' : ''}`}
            onClick={() => setMethod('applepay')}
          >
            <IconPhone />
            <div>
              <div className="pm-label">Apple Pay</div>
              <div className="pm-sub">Tap with iPhone or Watch</div>
            </div>
            <div className="pm-radio" />
          </button>
        </div>

        {/* ── method body ─────────────────────────────────────────────────── */}
        {processing ? (
          <div className="processing">
            <div className="processing-spinner" />
            <div className="processing-text">Processing payment…</div>
          </div>
        ) : method === 'cash' ? (
          <div className="cash-block">
            <span className="cash-label">Cash tendered</span>
            <input
              className="cash-input"
              type="number"
              inputMode="decimal"
              placeholder={grandTotal.toFixed(2)}
              value={cashTendered}
              onChange={e => { setCashTendered(e.target.value); setCashError(''); }}
            />
            <div className="cash-quick">
              {quickAmounts.map(amt => (
                <button
                  key={amt}
                  className="cash-q"
                  onClick={() => { setCashTendered(String(amt)); setCashError(''); }}
                >
                  ${amt}
                </button>
              ))}
            </div>
            {tendered > 0 && (
              <div className="cash-change">
                Change due <span className="mono">${change.toFixed(2)}</span>
              </div>
            )}
            {cashError && (
              <div style={{ fontSize: 12, color: 'var(--neg)', marginTop: 8 }}>
                {cashError}
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '24px 22px', textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
            {method === 'card' ? 'Tap or insert card on reader' : 'Hold device near reader'}
          </div>
        )}

        {/* ── confirm ─────────────────────────────────────────────────────── */}
        {!processing && (
          <button className="pay-btn pay-btn-confirm" onClick={handleCharge}>
            Charge <span className="mono">${grandTotal.toFixed(2)}</span>
          </button>
        )}

      </div>
    </div>
  );
}
