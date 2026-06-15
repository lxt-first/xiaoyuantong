import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { FeedItem } from "../types";
import BottomNav from "../components/BottomNav";

export default function Search() {
  const nav = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.items || []);
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(t);
  }, [query, doSearch]);

  const MODULE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    referral:  { label: "校招内推", color: "#2563EB", bg: "#DBEAFE" },
    interview: { label: "面经",     color: "#2563EB", bg: "#DBEAFE" },
    rental:    { label: "租房找房", color: "#16A34A", bg: "#DCFCE7" },
    secondhand:{ label: "二手交易", color: "#DC2626", bg: "#FEE2E2" },
    food:      { label: "美食推荐", color: "#D97706", bg: "#FEF3C7" },
    exam:      { label: "考研考公", color: "#7C3AED", bg: "#EDE9FE" },
  };

  return (
    <div className="app-shell">
      <div className="nav-bar">
        <span className="nav-back" onClick={() => nav(-1)}>← 返回</span>
        <span className="nav-title">搜索</span>
        <span style={{ minWidth: 48 }} />
      </div>

      <div className="search-bar">
        <span style={{ color: "#9CA3AF" }}>🔍</span>
        <input
          placeholder="搜索公司、岗位、房源、美食..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className="scroll-content">
        {!searched && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">搜索校园内容</div>
            <div className="empty-desc">试试搜索公司、职位、菜品、小区...</div>
          </div>
        )}

        {loading && <div className="loading-state">搜索中...</div>}

        {searched && !loading && results.length === 0 && query.trim() && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-title">没有找到相关内容</div>
            <div className="empty-desc">换个关键词试试</div>
          </div>
        )}

        {results.map((item) => {
          const cfg = MODULE_CONFIG[item.type] || MODULE_CONFIG.food;
          return (
            <div
              key={item.id}
              className="list-item list-item-row"
              onClick={() => nav(`/post/${item.type}/${item.id}`)}
            >
              <div className="list-item-thumb" style={{ background: cfg.bg }}>
                <span style={{ opacity: 0.6 }}>
                  {item.type === "referral" ? "💼" :
                   item.type === "rental" ? "🏡" :
                   item.type === "secondhand" ? "🔄" :
                   item.type === "food" ? "🍜" :
                   item.type === "exam" ? "📚" : "📝"}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <span className="mod-tag" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                <div className="list-item-title">
                  {item.title || item.restaurant || item.company || ""}
                </div>
                <div className="list-item-meta">
                  {item.type === "referral" && item.position ? item.position : ""}
                  {item.type === "rental" && item.price ? `¥${item.price}/月 · ` : ""}
                  {item.type === "secondhand" && item.price ? `¥${item.price}` : ""}
                  {item.type === "food" && "⭐".repeat(item.rating || 0)}
                </div>
                <div className="list-item-time">{new Date(item.createdAt).toLocaleDateString("zh-CN")}</div>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
