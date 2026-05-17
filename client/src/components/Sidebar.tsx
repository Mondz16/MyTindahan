function SellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5h10l-1.5 8h-7L3 5Z" />
      <path d="M6 5V4a2 2 0 1 1 4 0v1" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="9" width="3" height="5" rx="0.75" />
      <rect x="6.5" y="6" width="3" height="8" rx="0.75" />
      <rect x="11" y="3" width="3" height="11" rx="0.75" />
    </svg>
  );
}

function InventoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5.5 8 2l6 3.5v5L8 14 2 10.5V5.5Z" />
      <path d="M2 5.5 8 9l6-3.5" />
      <path d="M8 9v5" />
    </svg>
  );
}

function ItemsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="3.5" height="3.5" rx="0.75" />
      <path d="M7.5 4.75h6.5" />
      <rect x="2" y="9.5" width="3.5" height="3.5" rx="0.75" />
      <path d="M7.5 11.25h6.5" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M2 4h12M2 8h12M2 12h12" />
      <circle cx="10" cy="4" r="2" fill="var(--bg-2)" />
      <circle cx="6" cy="8" r="2" fill="var(--bg-2)" />
      <circle cx="11" cy="12" r="2" fill="var(--bg-2)" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="7" cy="7" r="2.5" />
      <path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.93 2.93l1.41 1.41M9.66 9.66l1.41 1.41M9.66 4.34l1.41-1.41M2.93 11.07l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M12.5 9.5A6 6 0 0 1 4.5 1.5a6 6 0 1 0 8 8Z" />
    </svg>
  );
}

const NAV = [
  { id: 'sell',      label: 'Sell',      Icon: SellIcon },
  { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { id: 'inventory', label: 'Inventory', Icon: InventoryIcon, badge: '6' },
  { id: 'items',     label: 'Items',     Icon: ItemsIcon },
  { id: 'settings',  label: 'Settings',  Icon: SettingsIcon },
] as const;

export default function Sidebar({ activeScreen, onScreenChange, isDark, onToggleDark, aiOn, onToggleAi }: {
  activeScreen: string;
  onScreenChange: (id: string) => void;
  isDark: boolean;
  onToggleDark: () => void;
  aiOn: boolean;
  onToggleAi: () => void;
}) {
  return (
    <aside className="rail">
      <div className="brand">
        <div className="brand-mark">
          <span className="brand-glyph">◐</span>
        </div>
        <div className="brand-text">
          <div className="brand-name">North &amp; Pine</div>
          <div className="brand-sub mono">3rd &amp; Hayes</div>
        </div>
      </div>

      <nav className="rail-nav">
        {NAV.map(({ id, label, Icon, badge }) => (
          <button
            key={id}
            className={`nav-item${activeScreen === id ? ' is-on' : ''}`}
            onClick={() => onScreenChange(id)}
          >
            <span className="nav-icon"><Icon /></span>
            {label}
            {badge && (
              <span className="panel-badge" style={{ marginLeft: 'auto' }}>{badge}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="rail-foot">
        <button className="rail-aria" onClick={onToggleAi}>
          <div className={`aria-dot${aiOn ? '' : ' off'}`} />
          <div>
            <div className="rail-aria-name">Aria</div>
            <div className="rail-aria-status">{aiOn ? 'watching' : 'paused'}</div>
          </div>
        </button>
        <button className="theme-tog" onClick={onToggleDark} aria-label="Toggle theme">
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </aside>
  );
}
