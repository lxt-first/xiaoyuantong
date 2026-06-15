import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FeedItem } from "../types";
import { api } from "../api/client";

const MODULE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  referral:  { label: "校招内推", color: "#2563EB", bg: "#DBEAFE", icon: "💼" },
  interview: { label: "面经",     color: "#2563EB", bg: "#DBEAFE", icon: "📝" },
  rental:    { label: "租房找房", color: "#16A34A", bg: "#DCFCE7", icon: "🏠" },
  secondhand:{ label: "二手交易", color: "#DC2626", bg: "#FEE2E2", icon: "🔄" },
  food:      { label: "美食推荐", color: "#D97706", bg: "#FEF3C7", icon: "🍜" },
  exam:      { label: "考研考公", color: "#7C3AED", bg: "#EDE9FE", icon: "📚" },
};

export default function FeedCard({ item }: { item: FeedItem }) {
  const nav = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const [toast, setToast] = useState("");
  const config = MODULE_CONFIG[item.type] || MODULE_CONFIG.food;

  const title = item.title || item.restaurant || item.company || "";
  const subtitle = item.type === "referral"
    ? `${item.company} · ${item.position}`
    : item.type === "rental"
    ? `${item.area} ${item.community || ""}`
    : item.type === "secondhand"
    ? item.category || ""
    : item.type === "food"
    ? "⭐".repeat(item.rating || 0)
    : item.company || "";

  const desc = item.description || item.review || item.experience || "";

  const meta = item.type === "referral" && item.referralCode
    ? `内推码: ${item.referralCode}`
    : item.type === "rental"
    ? `¥${item.price}/月`
    : item.type === "secondhand"
    ? `¥${item.price}`
    : "";

  const time = new Date(item.createdAt).toLocaleDateString("zh-CN");

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) { nav("/login"); return; }
    try {
      await api.addFavorite(item.type, item.id);
      setToast("已收藏");
      setShowActions(false);
    } catch { setToast("收藏失败"); }
  };

  const handleReport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) { nav("/login"); return; }
    try {
      await api.submitReport(item.type, item.id);
      setToast("举报已提交");
      setShowActions(false);
    } catch { setToast("举报失败"); }
  };

  return (
    <div className="feed-card" onClick={() => nav(`/post/${item.type}/${item.id}`)} style={{ position: "relative" }}>

      <div
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); setShowActions(!showActions); }}
        style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#9CA3AF", borderRadius: "50%", cursor: "pointer", zIndex: 1 }}
      >···</div>

      {showActions && (
        <div style={{ position: "absolute", top: 36, right: 8, background: "#fff", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.12)", zIndex: 10, overflow: "hidden", minWidth: 100 }}>
          <div onClick={handleFavorite} style={{ padding: "8px 14px", fontSize: 13, cursor: "pointer", borderBottom: "1px solid #F3F4F6" }}>⭐ 收藏</div>
          <div onClick={handleReport} style={{ padding: "8px 14px", fontSize: 13, cursor: "pointer" }}>🚩 举报</div>
        </div>
      )}

      {toast && (
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", background: "#1F2937", color: "#fff", padding: "4px 12px", borderRadius: 6, fontSize: 12, zIndex: 10 }}>{toast}</div>
      )}

      <div className={`feed-card-thumb ${item.type}`}>{config.icon}</div>
      <div className="feed-card-body">
        <span className={`mod-tag ${item.type}`}>{config.label}</span>
        <div className="card-title">{title}</div>
        {subtitle && <div className="card-sub">{subtitle}</div>}
        {desc && <div className="card-desc">{desc.slice(0, 60)}{desc.length > 60 ? "..." : ""}</div>}
        <div className="card-footer">
          <span className="card-time">{time}</span>
          {meta && <span className="card-price">{meta}</span>}
        </div>
      </div>
    </div>
  );
}