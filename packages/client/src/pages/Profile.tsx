import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User, FeedItem } from "../types";
import BottomNav from "../components/BottomNav";
import { ToastContainer, showToast } from "../components/BottomSheet";

const FAV_TYPE_CONFIG: Record<string, { label: string; icon: string }> = {
  referral:   { label: "校招内推", icon: "💼" },
  interview:  { label: "面经", icon: "📝" },
  rental:     { label: "租房找房", icon: "🏠" },
  secondhand: { label: "二手交易", icon: "🔄" },
  food:       { label: "美食推荐", icon: "🍜" },
  exam:       { label: "考研考公", icon: "📚" },
  default:    { label: "内容", icon: "📌" },
};

export default function Profile() {
  const nav = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<"posts" | "favorites">("posts");
  const [posts, setPosts] = useState<FeedItem[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { nav("/login"); return; }
    const u = JSON.parse(stored) as User;
    setUser(u);

    const token = localStorage.getItem("token") || "";
    Promise.all([
      fetch("/api/posts/mine", {
        headers: { "Authorization": "Bearer " + token }
      }).then(r => r.json()).then(d => d.items || []),
      fetch("/api/favorites", {
        headers: { "Authorization": "Bearer " + token }
      }).then(r => r.json()).then(d => d.items || []),
    ])
      .then(([p, f]) => {
        setPosts(p);
        setFavorites(f);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [nav]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showToast("已退出登录");
    setTimeout(() => nav("/"), 500);
  };

  if (!user) return <div className="loading-state">加载中...</div>;

  return (
    <div className="app-shell">
      <ToastContainer />
      <div className="nav-bar">
        <span style={{ minWidth: 48 }} />
        <span className="nav-title">我的</span>
        <span className="nav-action" style={{ color: "#DC2626" }} onClick={handleLogout}>退出</span>
      </div>

      <div className="scroll-content">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.nickname?.[0] || "?"}
          </div>
          <div className="profile-name">{user.nickname}</div>
          {user.certified && <span className="author-badge" style={{ marginTop: 4 }}>✅ 已认证</span>}
          <div className="profile-school">{user.school || "未设置学校"} · {user.major || ""}</div>

          <div className="profile-stats">
            <div className="profile-stat" onClick={() => setTab("posts")}>
              <div className="profile-stat-num">{posts.length}</div>
              <div className="profile-stat-label">我的发布</div>
            </div>
            <div className="profile-stat-divider" />
            <div className="profile-stat" onClick={() => setTab("favorites")}>
              <div className="profile-stat-num">{favorites.length}</div>
              <div className="profile-stat-label">收藏</div>
            </div>
          </div>
        </div>

        <div className="sub-tabs">
          <div className={`sub-tab${tab === "posts" ? " active" : ""}`} onClick={() => setTab("posts")}>
            我的发布
          </div>
          <div className={`sub-tab${tab === "favorites" ? " active" : ""}`} onClick={() => setTab("favorites")}>
            收藏
          </div>
        </div>

        {loading ? (
          <div className="loading-state">加载中...</div>
        ) : tab === "posts" ? (
          posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <div className="empty-title">还没有发布内容</div>
              <div className="empty-desc">分享你的第一条校园信息</div>
              <button className="empty-btn" onClick={() => nav("/publish")}>立即发布</button>
            </div>
          ) : (
            <div>
              {posts.map((item: any) => (
                <div
                  key={item.id}
                  className="list-item"
                  onClick={() => nav(`/post/${item.type}/${item.id}`)}
                >
                  <div className="list-item-title">
                    {item.title || item.restaurant || item.company || ""}
                  </div>
                  <div className="list-item-time">
                    {new Date(item.createdAt).toLocaleDateString("zh-CN")} · 已发布
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          favorites.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⭐</div>
              <div className="empty-title">还没有收藏</div>
              <div className="empty-desc">发现感兴趣的内容就收藏起来</div>
              <button className="empty-btn" onClick={() => nav("/")}>去逛逛</button>
            </div>
          ) : (
            <div>
              {favorites.map((f: any) => (
                <div
                  key={f.id}
                  className="list-item"
                  onClick={() => nav(`/post/${f.targetType}/${f.targetId}`)}
                >
                  <div className="list-item-title">{FAV_TYPE_CONFIG[f.targetType]?.label || f.targetType}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{f.targetType === "referral" ? "校招" : f.targetType === "interview" ? "面经" : f.targetType === "rental" ? "租房" : f.targetType === "secondhand" ? "二手" : f.targetType === "food" ? "美食" : f.targetType === "exam" ? "考研考公" : f.targetType}</div>
                  <div className="list-item-time">
                    {new Date(f.createdAt).toLocaleDateString("zh-CN")}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      <BottomNav />
    </div>
  );
}