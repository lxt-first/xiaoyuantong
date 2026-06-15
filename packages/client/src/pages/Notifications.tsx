import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export default function Notifications() {
  const nav = useNavigate();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (!userStr || !token) { nav("/login"); return; }

    fetch("/api/notifications", {
      headers: { "Authorization": "Bearer " + token }
    })
      .then(r => r.json())
      .then(data => setNotifs(data.items || data.notifications || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [nav]);

  const handleMarkRead = async (nid: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`/api/notifications/${nid}/read`, {
      method: "PUT",
      headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json; charset=utf-8" }
    });
    setNotifs(prev => prev.map(n => n.id === nid ? { ...n, read: true } : n));
  };

  const ICONS: Record<string, string> = {
    favorite: "⭐",
    report: "🚩",
    system: "📢",
  };

  return (
    <div className="app-shell">
      <div className="nav-bar">
        <span className="nav-back" onClick={() => nav("/")}>← 返回</span>
        <span className="nav-title">消息</span>
        <span style={{ minWidth: 48 }} />
      </div>

      <div className="scroll-content">
        {loading ? (
          <div className="loading-state">加载中...</div>
        ) : notifs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <div className="empty-title">暂无消息</div>
            <div className="empty-desc">当有新的收藏或系统通知时会出现在这里</div>
          </div>
        ) : (
          notifs.map((n) => (
            <div
              key={n.id}
              className="list-item list-item-row"
              style={{ background: n.read ? "#fff" : "#F0F7FF" }}
              onClick={() => handleMarkRead(n.id)}
            >
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: n.read ? "#F3F4F6" : "#DBEAFE",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0
              }}>
                {ICONS[n.type] || "📌"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: n.read ? 400 : 600, marginBottom: 2 }}>
                  {n.title}
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  {n.content}
                </div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                  {new Date(n.createdAt).toLocaleDateString("zh-CN")}
                </div>
              </div>
              {!n.read && (
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563EB", flexShrink: 0 }} />
              )}
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}