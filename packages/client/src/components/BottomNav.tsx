import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TABS = [
  { path: "/", icon: "🏠", label: "首页" },
  { path: "/module/referral", icon: "💼", label: "求职" },
  { path: "/publish", icon: "+", label: "发布", isCenter: true },
  { path: "/notifications", icon: "🔔", label: "消息" },
  { path: "/profile", icon: "👤", label: "我的" },
];

export default function BottomNav() {
  const nav = useNavigate();
  const loc = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (!userStr || !token) return;
    fetch("/api/notifications", {
      headers: { "Authorization": "Bearer " + token }
    })
      .then(r => r.json())
      .then(data => {
        const items = data.items || data.notifications || [];
        setUnreadCount(items.filter((n: any) => !n.read).length);
      })
      .catch(() => {});
  }, [loc.pathname]);

  const isActive = (path: string) => {
    if (path === "/") return loc.pathname === "/";
    if (path === "/profile") return loc.pathname === "/profile" || loc.pathname === "/favorites";
    return loc.pathname.startsWith(path);
  };

  return (
    <nav className="bottom-nav">
      {TABS.map((tab) =>
        tab.isCenter ? (
          <div
            key={tab.path}
            className="nav-item plus-btn"
            onClick={() => {
              const userStr = localStorage.getItem("user");
              if (!userStr) {
                nav("/login");
              } else {
                nav("/publish");
              }
            }}
          >
            <div className="plus-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
          </div>
        ) : (
          <div
            key={tab.path}
            className={`nav-item${isActive(tab.path) ? " active" : ""}`}
            onClick={() => nav(tab.path)}
          >
            <span className="nav-icon" style={{ position: "relative" }}>
              {tab.icon}
              {tab.path === "/notifications" && unreadCount > 0 && (
                <span style={{
                  position: "absolute", top: -4, right: -8,
                  background: "#DC2626", color: "#fff",
                  fontSize: 10, fontWeight: 700,
                  minWidth: 16, height: 16, borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "0 4px",
                }}>{unreadCount > 99 ? "99+" : unreadCount}</span>
              )}
            </span>
            <span>{tab.label}</span>
          </div>
        )
      )}
    </nav>
  );
}