import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { BottomSheet, ToastContainer, showToast } from "../components/BottomSheet";

const MODULES = [
  { key: "referral", label: "校招内推", icon: "💼", color: "#2563EB", bg: "#DBEAFE" },
  { key: "rental", label: "出租房源", icon: "🏡", color: "#16A34A", bg: "#DCFCE7" },
  { key: "secondhand", label: "二手物品", icon: "🔄", color: "#DC2626", bg: "#FEE2E2" },
  { key: "food", label: "美食推荐", icon: "🍜", color: "#D97706", bg: "#FEF3C7" },
  { key: "exam", label: "考研考公", icon: "📚", color: "#7C3AED", bg: "#EDE9FE" },
];

export default function Publish() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [showSheet, setShowSheet] = useState(true);
  const [module, setModule] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [extra, setExtra] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle module from URL param
  useEffect(() => {
    const m = params.get("module");
    if (m && MODULES.some(mod => mod.key === m)) {
      setModule(m);
      setShowSheet(false);
    }
  }, [params]);

  const handleSheetSelect = (key: string) => {
    setModule(key);
    setShowSheet(false);
  };

  const handlePublish = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) { nav("/login"); return; }
    if (!title.trim()) { showToast("请填写标题"); return; }
    if (!content.trim()) { showToast("请填写详细描述"); return; }

    const data: Record<string, unknown> = {};
    if (module === "referral") { data.company = title; data.position = extra.position || ""; data.description = content; data.referralCode = extra.referralCode || ""; }
    else if (module === "rental") { if (!extra.area) { showToast("请填写区域"); return; } data.title = title; data.area = extra.area; data.price = Number(price) || 0; data.description = content; data.community = extra.community || ""; data.layout = extra.layout || ""; }
    else if (module === "secondhand") { data.title = title; data.category = extra.category || "书本"; data.price = Number(price) || 0; data.description = content; data.campus = extra.campus || "本部校区"; }
    else if (module === "food") { data.restaurant = title; data.rating = Number(extra.rating) || 5; data.review = content; }
    else if (module === "exam") { if (!extra.subject) { showToast("请填写科目"); return; } data.title = title; data.category = extra.category || "kaoyan"; data.content = content; data.subject = extra.subject; }

    try {
      await api.createPost(module as any, data);
      showToast("发布成功");
      setTimeout(() => nav("/"), 500);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "发布失败，请重试";
      showToast(msg);
      if (msg.includes("登录") || msg.includes("认证") || msg.includes("用户不存在")) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setTimeout(() => nav("/login"), 800);
      }
    }
  };

  if (showSheet) {
    return (
      <div className="app-shell">
        <BottomSheet
          options={MODULES.map(m => ({ key: m.key, label: m.label, icon: m.icon, color: m.color, bg: m.bg }))}
          onSelect={handleSheetSelect}
          onClose={() => nav(-1)}
        />
      </div>
    );
  }

  const moduleConfig = MODULES.find(m => m.key === module);

  return (
    <div className="app-shell">
      <ToastContainer />
      <div className="nav-bar">
        <span className="nav-action red" onClick={() => nav(-1)}>取消</span>
        <span className="nav-title">{moduleConfig?.label || "发布"}</span>
        <span className="nav-action" onClick={title.trim() ? handlePublish : undefined}>发布</span>
      </div>
      <div className="scroll-content">
        <div className="form-section">
          <div className="form-group">
            <label className="form-label">
              {module === "food" ? "餐厅/档口" : module === "referral" ? "公司名称" : "标题"}
              <span className="form-required">*</span>
            </label>
            <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder={module === "food" ? "如: 餐厅三楼重庆小面" : module === "referral" ? "如: 字节跳动" : ""} />
          </div>

          {module === "referral" && (
            <>
              <div className="form-group"><label className="form-label">职位</label><input className="form-input" value={extra.position || ""} onChange={e => setExtra({...extra, position: e.target.value})} placeholder="如: 后端开发实习生" /></div>
              <div className="form-group"><label className="form-label">内推码</label><input className="form-input" value={extra.referralCode || ""} onChange={e => setExtra({...extra, referralCode: e.target.value})} placeholder="如: BT2026XYZ" /></div>
            </>
          )}

          {(module === "rental" || module === "secondhand") && (
            <div className="form-group"><label className="form-label">价格 (￥)</label><input className="form-input" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" /></div>
          )}

          {module === "rental" && (
            <div className="form-row">
              <div className="form-group"><label className="form-label">区域</label><input className="form-input" value={extra.area || ""} onChange={e => setExtra({...extra, area: e.target.value})} placeholder="如: 校内/理工北门" /></div>
              <div className="form-group"><label className="form-label">小区</label><input className="form-input" value={extra.community || ""} onChange={e => setExtra({...extra, community: e.target.value})} /></div>
            </div>
          )}

          {module === "secondhand" && (
            <div className="form-row">
              <div className="form-group"><label className="form-label">分类</label>
                <select className="form-input" value={extra.category || "书本"} onChange={e => setExtra({...extra, category: e.target.value})}>
                  <option>书本</option><option>生活用品</option><option>数码</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">校区</label><input className="form-input" value={extra.campus || ""} onChange={e => setExtra({...extra, campus: e.target.value})} placeholder="本部校区" /></div>
            </div>
          )}

          {module === "food" && (
            <div className="form-group"><label className="form-label">评分</label>
              <div className="star-rating">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" className={`star-btn ${s <= Number(extra.rating || 0) ? "active" : ""}`} onClick={() => setExtra({...extra, rating: String(s)})}>★</button>
                ))}
              </div>
            </div>
          )}

          {module === "exam" && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">方向 <span className="form-required">*</span></label>
                  <select className="form-input" value={extra.category || "kaoyan"} onChange={e => setExtra({...extra, category: e.target.value})}>
                    <option value="kaoyan">考研</option>
                    <option value="gongkao">考公</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">科目</label>
                  <input className="form-input" value={extra.subject || ""} onChange={e => setExtra({...extra, subject: e.target.value})} placeholder="如: 政治、英语" />
                </div>
              </div>
            </>
          )}

          {/* Photo grid */}
          <div className="form-group">
            <label className="form-label">添加照片 (最多3张)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const remaining = 3 - photos.length;
                const selected = files.slice(0, remaining);
                Promise.all(selected.map(f => new Promise<string>((resolve) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result as string);
                  reader.readAsDataURL(f);
                }))).then(urls => {
                  setPhotos(prev => [...prev, ...urls].slice(0, 3));
                });
              }}
            />
            <div className="photo-grid">
              {photos.map((src, i) => (
                <div key={i} className="photo-cell" style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                  <span onClick={(e) => { e.stopPropagation(); setPhotos(prev => prev.filter((_, j) => j !== i)); }} style={{ position: "absolute", top: 2, right: 4, color: "#DC2626", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>✕</span>
                </div>
              ))}
              {photos.length < 3 && (
                <div className="photo-cell" onClick={() => fileInputRef.current?.click()} style={{ cursor: "pointer" }}>+</div>
              )}
              {Array.from({ length: Math.max(0, 2 - photos.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="photo-cell" onClick={() => fileInputRef.current?.click()} style={{ cursor: "pointer" }}></div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">详细描述 <span className="form-required">*</span></label>
            <textarea className="form-textarea" value={content} onChange={e => setContent(e.target.value)} placeholder="分享更多细节..." />
          </div>
        </div>
      </div>
    </div>
  );
}