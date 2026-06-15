import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { FeedItem, ModuleType } from "../types";
import { ToastContainer, showToast } from "../components/BottomSheet";

const MODULE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  referral:  { label: "校招内推", color: "#2563EB", bg: "#DBEAFE" },
  interview: { label: "面经",     color: "#2563EB", bg: "#DBEAFE" },
  rental:    { label: "租房找房", color: "#16A34A", bg: "#DCFCE7" },
  secondhand:{ label: "二手交易", color: "#DC2626", bg: "#FEE2E2" },
  food:      { label: "美食推荐", color: "#D97706", bg: "#FEF3C7" },
  exam:      { label: "考研考公", color: "#7C3AED", bg: "#EDE9FE" },
};

export default function Detail() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const nav = useNavigate();
  const [item, setItem] = useState<FeedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const moduleType = (type || "food") as ModuleType;
  const config = MODULE_CONFIG[moduleType] || MODULE_CONFIG.food;

  useEffect(() => {
    if (!id) return;
    api.getDetail(moduleType, id)
      .then((data) => {
        setItem(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [moduleType, id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !id || !moduleType) return;
    api.getFavorites()
      .then((favs) => {
        if (favs.items) {
          const isFav = favs.items.some((f) => f.targetType === moduleType && f.targetId === id);
          setFavorited(isFav);
        }
      })
      .catch(() => {});
  }, [id, moduleType]);

  const handleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) { nav("/login"); return; }

    try {
      if (favorited) {
        await api.removeFavorite(moduleType, id!);
        setFavorited(false);
        showToast("已取消收藏");
      } else {
        await api.addFavorite(moduleType, id!);
        setFavorited(true);
        showToast("已收藏");
      }
    } catch (e) {
      showToast("操作失败");
    }
  };

  const handleReport = async () => {
    const token = localStorage.getItem("token");
    if (!token) { nav("/login"); return; }

    try {
      await api.submitReport(moduleType, id!);
      setShowReport(false);
      setShowMore(false);
      showToast("举报已提交");
    } catch (e) {
      showToast("举报失败");
    }
  };

  if (loading) return <div className="loading-state">加载中...</div>;
  if (!item) return <div className="empty-state">内容不存在</div>;

  const author = item.author || {};

  return (
    <div className="app-shell">
      <ToastContainer />
      <div className="nav-bar" style={{ position: "relative" }}>
        <span className="nav-back" onClick={() => nav(-1)}>← 返回</span>
        <span className="nav-title">{config.label}详情</span>
        <span className="nav-more" onClick={() => setShowMore(!showMore)}>···</span>

        {showMore && (
          <div className="more-menu">
            <div className="more-menu-item" onClick={handleFavorite}>
              {favorited ? "⭐ 取消收藏" : "☆ 收藏"}
            </div>
            <div className="more-menu-divider" />
            <div className="more-menu-item" onClick={() => { setShowReport(true); setShowMore(false); }}>
              🚩 举报
            </div>
            <div className="more-menu-divider" />
            <div className="more-menu-item" onClick={() => {
              navigator.clipboard.writeText(window.location.href).then(() => showToast("链接已复制"));
              setShowMore(false);
            }}>
              🔗 分享
            </div>
          </div>
        )}
      </div>

      <div className="scroll-content">
        {/* Carousel placeholder */}
        <div className="detail-carousel">
          <span style={{ fontSize: 48, opacity: 0.3 }}>
            {moduleType === "referral" ? "💼" :
             moduleType === "rental" ? "🏡" :
             moduleType === "secondhand" ? "🔄" :
             moduleType === "food" ? "🍜" :
             moduleType === "exam" ? "📚" : "📝"}
          </span>
          <div className="carousel-dots">
            <div className="carousel-dot active" />
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-tags">
            <span className="mod-tag" style={{ color: config.color, background: config.bg }}>{config.label}</span>
            {item.deadline && <span className="detail-meta-text">截止: {item.deadline}</span>}
            {item.category && <span className="detail-meta-text">{item.category}</span>}
          </div>
          <h1 className="detail-title">
            {item.title || item.restaurant || item.company || ""}
          </h1>

          {item.type === "referral" && (
            <>
              <div className="detail-meta">{item.company} · {item.position}</div>
              {item.referralCode && (
                <div className="detail-ref-code" onClick={() => {
                  navigator.clipboard.writeText(item.referralCode!);
                  showToast("内推码已复制");
                }}>
                  内推码: {item.referralCode} <span style={{ fontSize: 12 }}>点击复制</span>
                </div>
              )}
              <div className="detail-desc">{item.description}</div>
            </>
          )}

          {item.type === "interview" && (
            <>
              <div className="detail-meta">{item.company} · {item.position} · {item.round}</div>
              {item.passed !== undefined && (
                <div className="detail-meta">{item.passed ? "✅ 通过" : "❌ 未通过"}</div>
              )}
              <div className="detail-desc" style={{ whiteSpace: "pre-wrap" }}>{item.experience}</div>
            </>
          )}

          {item.type === "rental" && (
            <>
              <div className="detail-price">¥{item.price}/月</div>
              <div className="detail-meta">{item.area} · {item.community} · {item.layout} · {item.size}㎡</div>
              <div className="detail-desc">{item.description}</div>
              {item.contact && <div className="detail-meta" style={{marginTop: 12, padding: 8, background: "#F0FDF4", borderRadius: 8}}>📞 联系方式: {item.contact}</div>}
            </>
          )}

          {item.type === "secondhand" && (
            <>
              <div className="detail-price">¥{item.price}</div>
              <div className="detail-meta">分类: {item.category} · {item.campus}</div>
              <div className="detail-desc">{item.description}</div>
            </>
          )}

          {item.type === "food" && (
            <>
              <div className="detail-meta" style={{ fontSize: 16 }}>{"⭐".repeat(item.rating || 0)} {item.rating}/5</div>
              <div className="detail-desc">{item.review}</div>
            </>
          )}

          {item.type === "exam" && (
            <>
              <div className="detail-meta">
                {item.category || ""} · {item.subject || ""}
              </div>
              <div className="detail-desc" style={{ whiteSpace: "pre-wrap" }}>
                {item.content || item.description || ""}
              </div>
            </>
          )}
        </div>

        {/* Author Card */}
        <div className="author-card" onClick={() => author.id && nav(`/profile/${author.id}`)}>
          <div className="author-avatar">{author.nickname?.[0] || "?"}</div>
          <div className="author-info">
            <div className="author-name">{author.nickname}</div>
            <div className="author-school">{author.school} · {author.major}</div>
            {author.certified && <span className="author-badge">已认证</span>}
          </div>
        </div>

        <div style={{ fontSize: 12, color: "#9CA3AF", padding: "0 16px 24px" }}>
          {new Date(item.createdAt).toLocaleString("zh-CN")} · {item.viewCount} 次浏览
        </div>
      </div>

      <div className="bottom-action">
        <button
          className="btn btn-outline"
          onClick={handleFavorite}
        >
          {favorited ? "⭐ 已收藏" : "☆ 收藏"}
        </button>
        <button className="btn btn-primary" onClick={() => setShowContact(true)}>💬 联系TA</button>
      </div>

      {/* Contact Info */}
      {showContact && (
        <div className="overlay show" onClick={() => setShowContact(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
            <div className="sheet-handle" />
            <div className="sheet-title">联系方式</div>
            <div style={{ padding: "16px 20px", fontSize: 14, color: "#374151", lineHeight: 1.8 }}>
              <div>👤 {author.nickname}</div>
              {author.school && <div>🏫 {author.school}</div>}
              {item.contact && <div style={{ marginTop: 8, padding: "8px 12px", background: "#F3F4F6", borderRadius: 6 }}>📞 {item.contact}</div>}
              {!item.contact && <div style={{ color: "#9CA3AF", marginTop: 8 }}>暂未提供联系方式</div>}
            </div>
            <button className="btn btn-block" style={{ margin: "0 20px 16px", width: "calc(100% - 40px)" }} onClick={() => setShowContact(false)}>
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Report Confirmation */}
      {showReport && (
        <div className="overlay show" onClick={() => setShowReport(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
            <div className="sheet-handle" />
            <div className="sheet-title" style={{ color: "#DC2626" }}>确认举报</div>
            <div style={{ padding: "12px 20px 16px", fontSize: 14, color: "#6B7280" }}>
              确定要举报这条内容吗？举报后将由管理员审核处理。
            </div>
            <button
              className="btn btn-block"
              style={{ background: "#DC2626", color: "#fff", margin: "0 20px 16px", width: "calc(100% - 40px)" }}
              onClick={handleReport}
            >
              确认举报
            </button>
            <div className="sheet-cancel" onClick={() => setShowReport(false)}>取消</div>
          </div>
        </div>
      )}
    </div>
  );
}