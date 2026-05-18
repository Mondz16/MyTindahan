import { useState, useEffect } from 'react';
import { useCart } from './context/CartContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import SellScreen from './screens/SellScreen';
import PaymentScreen from './screens/PaymentScreen';
import ReceiptScreen from './screens/ReceiptScreen';
import type { CompletedOrder } from './screens/ReceiptScreen';

const SCREEN_TITLES: Record<string, string> = {
  sell:      'Sell',
  dashboard: 'Dashboard',
  inventory: 'Inventory',
  items:     'Items',
  settings:  'Settings',
};

export default function App() {
  const { lines, clearCart, subtotal, tax, total } = useCart();

  const [screen,         setScreen]         = useState('sell');
  const [isDark,         setIsDark]         = useState(false);
  const [aiOn,           setAiOn]           = useState(true);
  const [paymentOpen,    setPaymentOpen]    = useState(false);
  const [showReceipt,    setShowReceipt]    = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  }, [isDark]);

  function handlePaymentComplete(method: string, tip: number) {
    setCompletedOrder({
      method,
      tip,
      subtotal,
      tax,
      total,
      lines: [...lines],
      orderNumber: 'T-2843',
      completedAt: Date.now(),
    });
    clearCart();
    setPaymentOpen(false);
    setShowReceipt(true);
  }

  return (
    <div className="app">
      <Sidebar
        activeScreen={screen}
        onScreenChange={setScreen}
        isDark={isDark}
        onToggleDark={() => setIsDark(d => !d)}
        aiOn={aiOn}
        onToggleAi={() => setAiOn(a => !a)}
      />
      <main className="canvas">
        <Topbar title={SCREEN_TITLES[screen]} />
        {screen === 'sell' ? (
          <div className="screen">
            <SellScreen onCharge={() => setPaymentOpen(true)} aiOn={aiOn} />
          </div>
        ) : (
          <div className="screen screen-pad">
            <p style={{ color: 'var(--ink-3)', fontSize: 13 }}>
              {SCREEN_TITLES[screen]} screen — coming soon
            </p>
          </div>
        )}
      </main>

      {paymentOpen && (
        <PaymentScreen
          subtotal={subtotal}
          tax={tax}
          total={total}
          onCancel={() => setPaymentOpen(false)}
          onComplete={handlePaymentComplete}
        />
      )}

      {showReceipt && completedOrder && (
        <ReceiptScreen
          order={completedOrder}
          onNewSale={() => {
            setShowReceipt(false);
            setCompletedOrder(null);
          }}
        />
      )}
    </div>
  );
}
