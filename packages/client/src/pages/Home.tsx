import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { FeedItem, ModuleType } from "../types";
import BottomNav from "../components/BottomNav";
import FeedCard from "../components/FeedCard";
import { BottomSheet, ToastContainer } from "../components/BottomSheet";

const HOME_TABS: { key: string; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "career", label: "校招" },
  { key: "rental", label: "租房" },
  { key: "secondhand", label: "二手" },
  { key: "exam", label: "考研考公" },
  { key: "life", label: "生活" },
];

const SUB_CATS: Record<string, { key: string; label: string }[]> = {
  career: [
    { key: "all", label: "全部" },
    { key: "referral", label: "内推信息" },
    { key: "interview", label: "面经笔试" },
  ],
  rental: [
    { key: "all", label: "全部" },
    { key: "zhengzu", label: "整租" },
    { key: "hezu", label: "合租" },
  ],
  secondhand: [
    { key: "all", label: "全部" },
    { key: "books", label: "书本" },
    { key: "daily", label: "生活用品" },
    { key: "virtual", label: "非实体" },
  ],
  exam: [
    { key: "all", label: "全部" },
    { key: "kaoyan", label: "考研" },
    { key: "gongkao", label: "考公" },
  ],
  life: [
    { key: "all", label: "全部" },
    { key: "food", label: "美食推荐" },
  ],
};
const SHEET_OPTIONS = [
  { key: "referral", label: "校招内推", icon: "💼", color: "#2563EB", bg: "#DBEAFE" },
  { key: "rental", label: "出租房源", icon: "🏡", color: "#16A34A", bg: "#DCFCE7" },
  { key: "secondhand", label: "二手物品", icon: "🔄", color: "#DC2626", bg: "#FEE2E2" },
  { key: "food", label: "美食推荐", icon: "🍜", color: "#D97706", bg: "#FEF3C7" },
  { key: "exam", label: "考研考公", icon: "📚", color: "#7C3AED", bg: "#EDE9FE" },
];

export default function Home() {
  const nav = useNavigate();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [subTab, setSubTab] = useState("all");
  const [showSheet, setShowSheet] = useState(false);
  const nextCursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadFeed = useCallback(async (reset = false) => {
    if (reset) {
      setLoading(true);
      nextCursorRef.current = null;
      hasMoreRef.current = true;
    } else {
      if (!hasMoreRef.current || loadingMore) return;
      setLoadingMore(true);
    }
    try {
      const data = await api.getFeed(nextCursorRef.current ?? undefined);
      if (reset) {
        setItems(data.items);
      } else {
        setItems((prev) => [...prev, ...data.items]);
      }
      nextCursorRef.current = data.nextCursor;
      hasMoreRef.current = data.hasMore;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [loadingMore]);

  useEffect(() => {
    loadFeed(true);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current && !loadingMore) {
          loadFeed(false);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadFeed, loadingMore]);

  const getFilteredItems = () => {
    // First filter by main tab
    let base = items;
    if (activeTab === "career") {
      base = items.filter((i: FeedItem) => i.type === "referral" || i.type === "interview");
    } else if (activeTab === "life") {
      base = items.filter((i: FeedItem) => i.type === "food");
    } else if (activeTab !== "all") {
      base = items.filter((i: FeedItem) => i.type === activeTab);
    }
    // Then filter by sub-tab
    if (subTab === "all") return base;
    if (activeTab === "career") {
      return subTab === "referral"
        ? base.filter((i: FeedItem) => i.type === "referral")
        : base.filter((i: FeedItem) => i.type === "interview");
    }
    if (activeTab === "rental") {
      return subTab === "zhengzu"
        ? base.filter((i: FeedItem) => (i.title || "").includes("整") || (i.title || "").includes("室"))
        : base.filter((i: FeedItem) => (i.title || "").includes("合") || (i.title || "").includes("室友") || (i.title || "").includes("单间"));
    }
    if (activeTab === "secondhand") {
      const catMap: Record<string, string[]> = {
        books: ["书本"],
        daily: ["生活用品"],
        virtual: ["非实体"],
      };
      const cats = catMap[subTab] || [];
      return base.filter((i: FeedItem) => cats.includes(i.category || ""));
    }
    if (activeTab === "exam") {
      const examCatMap: Record<string, string[]> = {
        kaoyan: ["考研"],
        gongkao: ["考公"],
      };
      const cats = examCatMap[subTab] || [];
      return base.filter((i: FeedItem) => cats.includes(i.category || ""));
    }
    if (activeTab === "life") {
      return base.filter((i: FeedItem) => i.type === "food");
    }
    return base;
  };

  const filtered = getFilteredItems();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleQuickPost = () => {
    if (!userStr) {
      nav("/login");
    } else {
      setShowSheet(true);
    }
  };

  const handleSheetSelect = (key: string) => {
    setShowSheet(false);
    nav(`/publish?module=${key}`);
  };

  return (
    <div className="app-shell">
      <ToastContainer />
      {showSheet && (
        <BottomSheet
          options={SHEET_OPTIONS}
          onSelect={handleSheetSelect}
          onClose={() => setShowSheet(false)}
        />
      )}

      <header className="home-header">
        <div className="home-title">
          <span className="home-logo">🏫</span>
          <span>校园通</span>
        </div>
        <span className="home-school">华北理工大学 ▾</span>
      </header>

      <div className="module-tabs">
        {HOME_TABS.map((tab) => (
          <div
            key={tab.key}
            className={`module-tab${activeTab === tab.key ? " active" : ""}`}
            onClick={() => { setActiveTab(tab.key); setSubTab("all"); }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {activeTab !== "all" && SUB_CATS[activeTab] && (
        <div className="sub-tabs">
          {SUB_CATS[activeTab].map((s) => (
            <div
              key={s.key}
              className={`sub-tab ${subTab === s.key ? "active" : ""}`}
              onClick={() => setSubTab(s.key)}
            >
              {s.label}
            </div>
          ))}
        </div>
      )}
      <div className="quick-post">
        <div className="qp-avatar">
          {user ? user.nickname[0] : "?"}
        </div>
        <div className="qp-input" onClick={handleQuickPost}>
          分享校园新鲜事...
        </div>
      </div>

      <div className="scroll-content">
        {loading ? (
          <div className="loading-state">加载中...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-title">暂无内容</div>
            <div className="empty-desc">快来发布第一条吧</div>
            <button className="empty-btn" onClick={handleQuickPost}>立即发布</button>
          </div>
        ) : (
          <div className="feed">
            {filtered.map((item) => (
              <FeedCard key={item.type + item.id} item={item} />
            ))}
            <div ref={observerRef} style={{ height: 1 }} />
            {loadingMore && <div className="loading-more">加载中...</div>}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}