import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

const SCREEN_TITLES: Record<string, string> = {
  sell:      'Sell',
  dashboard: 'Dashboard',
  inventory: 'Inventory',
  items:     'Items',
  settings:  'Settings',
};

export default function App() {
  const [screen, setScreen] = useState('sell');
  const [isDark, setIsDark] = useState(false);
  const [aiOn, setAiOn] = useState(true);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  }, [isDark]);

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
        <div className="screen screen-pad">
          <p style={{ color: 'var(--ink-3)', fontSize: 13 }}>
            {SCREEN_TITLES[screen]} screen placeholder
          </p>
        </div>
      </main>
    </div>
  );
}
