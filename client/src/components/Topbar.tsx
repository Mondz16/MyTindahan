function UserIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="6" cy="4" r="2" />
      <path d="M2 11c0-2.21 1.79-4 4-4s4 1.79 4 4" />
    </svg>
  );
}

export default function Topbar({ title }: { title: string }) {
  return (
    <div className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-meta">
        <span className="topbar-status">
          <span className="status-dot" />
          Open · 9:00a — 8:00p
        </span>
        <span className="topbar-pill">Reg 1</span>
        <span className="topbar-pill">
          <UserIcon />
          Mia C.
        </span>
      </div>
    </div>
  );
}
