import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { FeedItem, ModuleType } from "../types";
import BottomNav from "../components/BottomNav";

const MODULE_META: Record<string, { title: string }> = {
  referral: { title: "校招内推" },
  interview: { title: "面经分享" },
  rental: { title: "租房找房" },
  secondhand: { title: "二手交易" },
  food: { title: "美食推荐" },
  exam: { title: "考研考公" },
};

export default function ModuleList() {
  const { type } = useParams<{ type: string }>();
  const nav = useNavigate();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState<string>("all");

  const moduleType = (type || "food") as ModuleType;
  const meta = MODULE_META[moduleType] || { title: "列表" };

  useEffect(() => {
    setLoading(true);
    if (moduleType === "referral") {
      // Fetch both referral and interview for career view
      Promise.all([
        api.getList("referral"),
        api.getList("interview"),
      ])
        .then(([refData, intData]) => {
          const merged = [...refData.items, ...intData.items].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setItems(merged);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      api.getList(moduleType)
        .then((data) => setItems(data.items))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [moduleType]);

  // Sub-tab filter for career module
  const filtered = moduleType === "referral" && subTab !== "all"
    ? (subTab === "referral" ? items.filter(i => i.type === "referral") : items.filter(i => i.type === "interview"))
    : items;

  const isCareerModule = type === "referral";

  return (
    <div className="app-shell">
      <div className="nav-bar">
        <span className="nav-back" onClick={() => nav("/")}>← 返回</span>
        <span className="nav-title">{meta.title}</span>
        <span className="nav-action" onClick={() => nav(`/publish?module=${moduleType}`)}>发布</span>
      </div>

      {isCareerModule && (
        <div className="sub-tabs">
          <div className={`sub-tab ${subTab === "all" ? "active" : ""}`} onClick={() => setSubTab("all")}>
            全部
          </div>
          <div className={`sub-tab ${subTab === "referral" ? "active" : ""}`} onClick={() => setSubTab("referral")}>
            内推信息
          </div>
          <div className={`sub-tab ${subTab === "interview" ? "active" : ""}`} onClick={() => setSubTab("interview")}>
            面经/笔试
          </div>
        </div>
      )}

      <div className="scroll-content">
        {loading ? (
          <div className="loading-state">加载中...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-title">暂无内容</div>
            <div className="empty-desc">快来发布第一条吧</div>
          </div>
        ) : moduleType === "rental" ? (
          <div className="rental-grid">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="rental-card"
                onClick={() => nav(`/post/${moduleType}/${item.id}`)}
              >
                <div className="rental-card-img rental">🏡</div>
                <div className="rental-card-body">
                  <div className="rental-card-title">{item.title}</div>
                  <div className="rental-card-price">
                    ¥{item.price}
                    <span>/月</span>
                  </div>
                  <div className="rental-card-meta">{item.layout || item.area}</div>
                  <div className="rental-card-area">{item.community || item.area}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="feed">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="list-item"
                onClick={() => nav(`/post/${moduleType}/${item.id}`)}
              >
                <div className="list-item-title">
                  {item.title || item.restaurant || item.company || ""}
                  {item.price !== undefined && (
                    <span className="card-price" style={{ float: "right", fontSize: 15 }}>
                      ¥{item.price}{item.type === "rental" ? "/月" : ""}
                    </span>
                  )}
                </div>
                <div className="list-item-meta">
                  {item.type === "referral" && item.position ? `${item.position} · ` : ""}
                  {item.type === "interview" && item.company ? `${item.company} · ` : ""}
                  {item.type === "secondhand" && (item.category || "")}
                  {item.type === "food" && "⭐".repeat(item.rating || 0)}
                  {item.type === "exam" && (item.category || "")}
                  {item.type === "rental" && (item.area || "")}
                </div>
                <div className="list-item-time">
                  {new Date(item.createdAt).toLocaleDateString("zh-CN")}
                  {item.referralCode && (
                    <span className="list-item-tag mod-tag referral">内推码: {item.referralCode}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
