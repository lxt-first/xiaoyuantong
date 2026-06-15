// 校园通 · 高保真原型生成器
// Figma Plugin Code

// ============ 设计 Token ============
const TOKENS = {
  colors: {
    primary: { r: 0.145, g: 0.388, b: 0.922 },
    primaryLight: { r: 0.859, g: 0.918, b: 0.996 },
    success: { r: 0.086, g: 0.639, b: 0.290 },
    successLight: { r: 0.863, g: 0.965, b: 0.906 },
    danger: { r: 0.863, g: 0.149, b: 0.149 },
    dangerLight: { r: 0.996, g: 0.886, b: 0.886 },
    warning: { r: 0.961, g: 0.620, b: 0.043 },
    warningLight: { r: 0.996, g: 0.953, b: 0.780 },
    bgPage: { r: 0.953, g: 0.957, b: 0.965 },
    bgSurface: { r: 1, g: 1, b: 1 },
    textPrimary: { r: 0.067, g: 0.094, b: 0.153 },
    textSecondary: { r: 0.420, g: 0.447, b: 0.502 },
    textTertiary: { r: 0.612, g: 0.639, b: 0.686 },
    border: { r: 0.898, g: 0.906, b: 0.925 },
  },
  font: { family: "Inter", style: "Regular" },
  fontSemiBold: { family: "Inter", style: "Semi Bold" },
  fontBold: { family: "Inter", style: "Bold" },
};

const W = 390;
const STATUS_H = 44;

function solidPaint(rgb) { return { type: 'SOLID', color: rgb, opacity: 1 }; }

// ============ 辅助函数 ============
function createFrame(name, x, y, w, h, bg, parent) {
  const f = jsDesign.createFrame();
  f.name = name; f.x = x; f.y = y; f.resize(w, h);
  if (bg) f.fills = [solidPaint(bg)];
  f.clipsContent = false;
  if (parent) parent.appendChild(f);
  return f;
}

function createText(name, content, x, y, w, fontSize, fontWeight, color, parent, opts) {
  const t = jsDesign.createText();
  t.name = name; t.x = x; t.y = y;
  t.characters = content;
  t.fontSize = fontSize;
  t.fontName = fontWeight === 600 ? TOKENS.fontSemiBold : fontWeight === 700 ? TOKENS.fontBold : TOKENS.font;
  if (color) t.fills = [solidPaint(color)];
  t.lineHeight = opts && opts.lineHeight ? { value: opts.lineHeight, unit: 'PIXELS' } : { value: fontSize * 1.4, unit: 'PIXELS' };
  if (opts && opts.textAlign) t.textAlignHorizontal = opts.textAlign;
  if (w) t.resize(w, t.height);
  t.textAutoResize = w ? 'HEIGHT' : 'WIDTH_AND_HEIGHT';
  if (parent) parent.appendChild(t);
  return t;
}

function createRect(name, x, y, w, h, fill, parent, radius, stroke) {
  const r = jsDesign.createRectangle();
  r.name = name; r.x = x; r.y = y; r.resize(w, h);
  if (fill) r.fills = [fill];
  if (radius) r.cornerRadius = radius;
  if (stroke) r.strokes = [stroke];
  if (parent) parent.appendChild(r);
  return r;
}

function createStatusBar(parent) {
  const bar = createFrame('状态栏', 0, 0, W, STATUS_H, TOKENS.colors.bgSurface, parent);
  createText('时间', '9:41', 24, 12, 60, 14, 600, TOKENS.colors.textPrimary, bar, { lineHeight: 18 });
  const signal = createRect('信号', 310, 18, 15, 11, null, bar);
  const battery = createRect('电池', 340, 18, 22, 11, null, bar);
  battery.strokes = [solidPaint(TOKENS.colors.textPrimary)];
  battery.cornerRadius = 2;
  // Battery inner
  createRect('电池内部', 342, 20, 18, 7, solidPaint(TOKENS.colors.textPrimary), bar, 1);
  // Signal bars (simple rect)
  createRect('信号格1', 310, 24, 3, 4, solidPaint(TOKENS.colors.textPrimary), bar, 0.5);
  createRect('信号格2', 314, 22, 3, 6, solidPaint(TOKENS.colors.textPrimary), bar, 0.5);
  createRect('信号格3', 318, 20, 3, 8, solidPaint(TOKENS.colors.textPrimary), bar, 0.5);
  createRect('信号格4', 322, 18, 3, 10, solidPaint(TOKENS.colors.textPrimary), bar, 0.5);
  createText('5G标签', '5G', 327, 17, 18, 10, 400, TOKENS.colors.textPrimary, bar);
}

function createNavBar(name, title, parent, leftText, rightText, leftColor, rightColor) {
  const bar = createFrame(name, 0, STATUS_H, W, 48, TOKENS.colors.bgSurface, parent);
  bar.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  bar.strokeWeight = 1;
  bar.strokeAlign = 'INSIDE';
  bar.dashPattern = [0, W * 2 + 96];
  if (leftText) {
    createText('返回按钮', leftText, 16, 14, 80, 14, 400, leftColor || TOKENS.colors.primary, bar);
  }
  if (title) {
    createText('导航标题', title, 0, 14, W, 16, 600, TOKENS.colors.textPrimary, bar, { textAlign: 'CENTER' });
  }
  if (rightText) {
    createText('右侧操作', rightText, W - 80, 14, 64, 14, 600, rightColor || TOKENS.colors.primary, bar, { textAlign: 'RIGHT' });
  }
  return bar;
}

function createModuleTabs(parent, tabs, activeIdx) {
  const bar = createFrame('模块标签栏', 0, 0, W, 38, TOKENS.colors.bgSurface, parent);
  bar.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  bar.dashPattern = [0, W * 2 + 76];
  let x = 0;
  tabs.forEach((label, i) => {
    const tab = createText('标签-' + label, label, x + 16, 10, 60, 13, i === activeIdx ? 600 : 400, i === activeIdx ? TOKENS.colors.primary : TOKENS.colors.textSecondary, bar);
    if (i === activeIdx) {
      const line = createRect('激活指示线', x + 16, 36, 60, 2, solidPaint(TOKENS.colors.primary), bar);
    }
    x += 76;
  });
}

function createBottomNav(parent, activeIdx) {
  const bar = createFrame('底部导航', 0, 0, W, 64, TOKENS.colors.bgSurface, parent);
  bar.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  bar.dashPattern = [0, W * 2 + 128];
  const items = [
    { label: '首页', icon: '🏠' },
    { label: '求职', icon: '💼' },
    { label: '发布', icon: '+' },
    { label: '消息', icon: '🔔' },
    { label: '我的', icon: '👤' },
  ];
  items.forEach((item, i) => {
    const x = (W / 5) * i + (W / 5 - 40) / 2;
    if (i === 2) {
      const circle = createRect('发布按钮', x, 4, 44, 44, solidPaint(TOKENS.colors.primary), bar, 22);
      circle.effects = [{ type: 'DROP_SHADOW', color: { r: 0.145, g: 0.388, b: 0.922, a: 0.35 }, offset: { x: 0, y: 2 }, radius: 8, visible: true, blendMode: 'NORMAL' }];
      createText('发布文字', item.label, x + 2, 50, 40, 10, 400, TOKENS.colors.textTertiary, bar, { textAlign: 'CENTER' });
    } else {
      createText('导航标签' + i, item.label, x, 48, 40, 10, 400, i === activeIdx ? TOKENS.colors.primary : TOKENS.colors.textTertiary, bar, { textAlign: 'CENTER' });
    }
  });
}

function createModuleTag(name, module, parent, x, y) {
  const colors = {
    career: { bg: TOKENS.colors.primaryLight, fg: TOKENS.colors.primary },
    rental: { bg: TOKENS.colors.successLight, fg: TOKENS.colors.success },
    secondhand: { bg: TOKENS.colors.dangerLight, fg: TOKENS.colors.danger },
    life: { bg: TOKENS.colors.warningLight, fg: { r: 0.851, g: 0.467, b: 0.024 } },
  };
  const c = colors[module] || colors.life;
  const tagW = module === 'secondhand' ? 40 : module === 'life' ? 40 : 36;
  const bg = createRect('标签背景', x, y, tagW, 24, solidPaint(c.bg), parent, 99);
  createText('标签文字', name, x + 8, y + 4, tagW - 16, 10, 600, c.fg, bg);
  return bg;
}

function createCard(parent, x, y, module, title, desc, time, price, hasThumb) {
  const card = createFrame('卡片', x, y, W - 24, hasThumb ? 86 : 72, TOKENS.colors.bgSurface, parent);
  card.cornerRadius = 8;
  card.strokes = [solidPaint(TOKENS.colors.border)];
  card.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.08 }, offset: { x: 0, y: 1 }, radius: 3, visible: true, blendMode: 'NORMAL' }];
  
  const bodyW = hasThumb ? W - 24 - 88 - 24 : W - 24 - 32;
  createModuleTag(module === 'career' ? '校招' : module === 'rental' ? '租房' : module === 'secondhand' ? '二手' : '美食', module, card, 16, 14);
  
  createText('卡片标题', title, 16, 40, bodyW, 14, 600, TOKENS.colors.textPrimary, card);
  createText('卡片描述', desc, 16, 56, bodyW, 12, 400, TOKENS.colors.textSecondary, card);
  
  if (price) {
    createText('卡片价格', price, 16, 72, bodyW, 14, 700, TOKENS.colors.danger, card);
  }
  
  createText('卡片时间', time, W - 24 - 60, 72, 52, 11, 400, TOKENS.colors.textTertiary, card, { textAlign: 'RIGHT' });
  
  if (hasThumb) {
    const thumb = createRect('缩略图', W - 24 - 16 - 72, 16, 72, 56, solidPaint(TOKENS.colors.primaryLight), card, 6);
  }
  
  return card;
}

function createHomeScreen() {
  const screenH = STATUS_H + 56 + 38 + 42 + 10 + 86 * 5 + 64;
  const page = createFrame('首页', 20 + 420 * 0, 20, W, screenH, TOKENS.colors.bgPage);
  createStatusBar(page);
  
  // Header
  const header = createFrame('页面头部', 0, STATUS_H, W, 56, TOKENS.colors.bgSurface, page);
  createText('品牌名', '🏫 校园通', 16, 16, 120, 20, 700, TOKENS.colors.textPrimary, header);
  createText('学校名', '华北理工大学 ▾', W - 130, 18, 120, 12, 400, TOKENS.colors.textSecondary, header, { textAlign: 'RIGHT' });
  header.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  header.dashPattern = [0, W * 2 + 112];
  
  createModuleTabs(page, ['全部', '校招', '租房', '二手', '生活'], 0);
  page.children[page.children.length - 1].y = STATUS_H + 56;
  
  // Quick post bar
  const qpBar = createFrame('快捷发布栏', 0, STATUS_H + 56 + 38, W, 42, TOKENS.colors.bgSurface, page);
  qpBar.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  qpBar.dashPattern = [0, W * 2 + 84];
  createRect('用户头像', 16, 5, 32, 32, solidPaint(TOKENS.colors.primaryLight), qpBar, 16);
  const input = createRect('输入背景', 56, 8, W - 100, 26, solidPaint({ r: 0.953, g: 0.957, b: 0.965 }), qpBar, 99);
  createText('占位文字', '分享校园新鲜事...', 70, 14, W - 130, 12, 400, TOKENS.colors.textTertiary, input);
  const plusBtn = createRect('快捷加号', W - 40, 5, 28, 28, solidPaint(TOKENS.colors.primaryLight), qpBar, 8);
  
  // Feed
  const feedY = STATUS_H + 56 + 38 + 42 + 10;
  const cards = [
    { module: 'secondhand', title: '几乎全新数据结构教材', desc: '紫金港校区 · 计算机专业适用', time: '2小时前', price: '￥15', thumb: true },
    { module: 'life', title: '紫金港食堂三楼麻辣烫 ⭐4.2', desc: '汤底浓郁，食材新鲜，性价比高', time: '3小时前', price: null, thumb: true },
    { module: 'career', title: '字节跳动 后端开发实习生内推', desc: '张三 · 计算机学院 · 有效期至6/30', time: '5小时前', price: null, thumb: false },
    { module: 'rental', title: '紫金港周边单间转租', desc: '1室0厅 · 步行10分钟到校', time: '6小时前', price: '￥1200/月', thumb: true },
    { module: 'secondhand', title: '机械键盘 Cherry MX 青轴', desc: '9成新 · 使用半年 · 配件齐全', time: '昨天', price: '￥120', thumb: true },
  ];
  let cy = feedY;
  cards.forEach(c => {
    createCard(page, 12, cy, c.module, c.title, c.desc, c.time, c.price, c.thumb);
    cy += c.thumb ? 98 : 84;
  });
  
  // Bottom Nav
  const btn = createFrame('底部导航容器', 0, screenH - 64, W, 64, null, page);
  createBottomNav(btn, 0);
  
  return page;
}

function createCareerListScreen() {
  const screenH = STATUS_H + 48 + 38 + 54 + 4 * 60;
  const page = createFrame('校招列表', 20 + 420 * 1, 20, W, screenH, TOKENS.colors.bgPage);
  createStatusBar(page);
  createNavBar('导航栏', '校招内推', page, '← 返回', '发布');
  
  // Sub tabs
  const subTabs = createFrame('子标签栏', 0, STATUS_H + 48, W, 38, TOKENS.colors.bgSurface, page);
  subTabs.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  subTabs.dashPattern = [0, W * 2 + 76];
  createText('子标签-内推', '内推信息', 0, 10, W / 2, 13, 600, TOKENS.colors.primary, subTabs, { textAlign: 'CENTER' });
  const activeLine = createRect('子标签激活线', W / 2 - 40, 36, 80, 2, solidPaint(TOKENS.colors.primary), subTabs);
  createText('子标签-面经', '面经/笔试', W / 2, 10, W / 2, 13, 400, TOKENS.colors.textSecondary, subTabs, { textAlign: 'CENTER' });
  
  // Search
  const search = createFrame('搜索栏', 16, STATUS_H + 48 + 38 + 8, W - 32, 38, { r: 0.941, g: 0.941, b: 0.941 }, page);
  search.cornerRadius = 8;
  createText('搜索图标', '🔍', 14, 10, 20, 16, 400, TOKENS.colors.textTertiary, search);
  createText('搜索占位', '搜索公司/岗位...', 38, 11, W - 80, 13, 400, TOKENS.colors.textTertiary, search);
  
  // List items
  const items = [
    { title: '字节跳动 后端开发实习生', meta: '张三 · 计算机学院 · 内推码 BT2026XYZ', time: '2小时前', exp: '有效期至 2026/06/30' },
    { title: '阿里巴巴 前端工程师校招', meta: '李四 · 软件学院 · 直推淘宝技术部', time: '1天前', exp: '有效期至 2026/07/15' },
    { title: '腾讯 产品经理实习生', meta: '王五 · 经管学院', time: '2天前', exp: '有效期至 2026/06/25' },
    { title: '美团 数据开发工程师', meta: '赵六 · 计算机学院 · 内推码 MT2026DEV', time: '3天前', exp: '有效期至 2026/07/01' },
  ];
  let liY = STATUS_H + 48 + 38 + 54;
  items.forEach((item, i) => {
    const li = createFrame('列表项 ' + i, 0, liY, W, 60, TOKENS.colors.bgSurface, page);
    li.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
    li.dashPattern = [0, W * 2 + 120];
    createText('列表标题', item.title, 16, 10, W - 32, 15, 600, TOKENS.colors.textPrimary, li);
    createText('列表元信息', item.meta, 16, 28, W - 32, 12, 400, TOKENS.colors.textSecondary, li);
    createText('列表有效期', item.exp, 16, 42, W - 32, 11, 400, TOKENS.colors.danger, li);
    createText('列表时间', item.time, W - 70, 42, 54, 11, 400, TOKENS.colors.textTertiary, li, { textAlign: 'RIGHT' });
    liY += 61;
  });
  
  return page;
}

function createSecondhandDetailScreen() {
  const screenH = STATUS_H + 48 + 260 + 100 + 16 + 60 + 68;
  const page = createFrame('二手详情', 20 + 420 * 2, 20, W, screenH, TOKENS.colors.bgPage);
  createStatusBar(page);
  
  // Nav
  const nav = createFrame('导航栏', 0, STATUS_H, W, 48, TOKENS.colors.bgSurface, page);
  nav.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  nav.dashPattern = [0, W * 2 + 96];
  createText('返回按钮', '← 返回', 16, 14, 60, 14, 400, TOKENS.colors.primary, nav);
  createText('更多按钮', '⋯', W - 40, 10, 24, 20, 400, TOKENS.colors.textSecondary, nav, { textAlign: 'RIGHT' });
  
  // Carousel
  const carousel = createRect('轮播区', 0, STATUS_H + 48, W, 260, solidPaint({ r: 0.941, g: 0.941, b: 0.941 }), page);
  createText('轮播图片', '📖 数据结构教材', W / 2 - 60, 100, 120, 18, 600, TOKENS.colors.textTertiary, carousel, { textAlign: 'CENTER' });
  // Dots
  for (let i = 0; i < 4; i++) {
    const dot = createRect('轮播圆点' + i, W / 2 - 24 + i * 14, 240, i === 0 ? 18 : 6, 6, solidPaint(i === 0 ? { r: 1, g: 1, b: 1 } : { r: 1, g: 1, b: 1, a: 0.5 }), carousel, i === 0 ? 3 : 3);
  }
  
  // Body
  const bodyY = STATUS_H + 48 + 260;
  const detail = createFrame('详情主体', 0, bodyY, W, 100, TOKENS.colors.bgSurface, page);
  createModuleTag('二手', 'secondhand', detail, 16, 14);
  const catTag = createRect('分类标签', 62, 14, 36, 24, solidPaint({ r: 0.953, g: 0.957, b: 0.965 }), detail, 99);
  createText('分类文字', '书本', 70, 18, 20, 10, 600, TOKENS.colors.textSecondary, catTag);
  createText('详情标题', '几乎全新的数据结构教材', 16, 48, W - 32, 20, 600, TOKENS.colors.textPrimary, detail);
  createText('详情价格', '￥15', 16, 74, 60, 24, 700, TOKENS.colors.danger, detail);
  
  // Description area
  const desc = createFrame('描述区域', 0, bodyY + 100 + 16, W, 60, TOKENS.colors.bgSurface, page);
  createText('描述文字', '📍 交易地点：紫金港校区', 16, 12, W - 32, 13, 400, TOKENS.colors.textSecondary, desc);
  createText('提示文字', '🔒 仅校园认证用户可查看联系方式', 16, 34, W - 32, 11, 400, TOKENS.colors.success, desc);
  
  // Author card
  const authorY = bodyY + 100 + 16 + 60;
  const author = createFrame('作者卡片', 16, authorY, W - 32, 60, { r: 0.976, g: 0.980, b: 0.984 }, page);
  author.cornerRadius = 12;
  createRect('作者头像', 14, 8, 44, 44, solidPaint(TOKENS.colors.primaryLight), author, 22);
  createText('头像文字', '王', 28, 20, 16, 18, 600, TOKENS.colors.primary, author, { textAlign: 'CENTER' });
  createText('作者名字', '王五', 68, 10, 60, 14, 600, TOKENS.colors.textPrimary, author);
  createText('作者学校', '华北理工大学 · 计算机学院', 68, 28, 180, 12, 400, TOKENS.colors.textSecondary, author);
  const badge = createRect('认证徽章', 68, 44, 80, 16, solidPaint(TOKENS.colors.successLight), author, 4);
  createText('徽章文字', '✓ 已认证学生', 74, 46, 68, 10, 10, TOKENS.colors.success, badge);
  
  // Bottom action
  const baY = screenH - 68;
  const baBar = createFrame('底部操作栏', 0, baY, W, 68, TOKENS.colors.bgSurface, page);
  baBar.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  baBar.dashPattern = [0, W * 2 + 136];
  const favBtn = createRect('收藏按钮', 16, 12, W / 2 - 24, 44, solidPaint(TOKENS.colors.bgSurface), baBar, 6);
  favBtn.strokes = [solidPaint(TOKENS.colors.border)];
  favBtn.strokeWeight = 1.5;
  createText('收藏文字', '☆ 收藏', 16, 26, W / 2 - 24, 14, 600, TOKENS.colors.textPrimary, baBar, { textAlign: 'CENTER' });
  const contactBtn = createRect('联系按钮', W / 2 + 8, 12, W / 2 - 24, 44, solidPaint(TOKENS.colors.primary), baBar, 6);
  createText('联系文字', '📋 复制联系方式', W / 2 + 8, 26, W / 2 - 24, 14, 600, { r: 1, g: 1, b: 1 }, baBar, { textAlign: 'CENTER' });
  
  return page;
}

function createFoodDetailScreen() {
  const screenH = STATUS_H + 48 + 260 + 90 + 16 + 60 + 68;
  const page = createFrame('美食详情', 20 + 420 * 3, 20, W, screenH, TOKENS.colors.bgPage);
  createStatusBar(page);
  
  const nav = createFrame('导航栏', 0, STATUS_H, W, 48, TOKENS.colors.bgSurface, page);
  nav.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  nav.dashPattern = [0, W * 2 + 96];
  createText('返回按钮', '← 返回', 16, 14, 60, 14, 400, TOKENS.colors.primary, nav);
  createText('更多按钮', '⋯', W - 40, 10, 24, 20, 400, TOKENS.colors.textSecondary, nav, { textAlign: 'RIGHT' });
  
  const carousel = createRect('轮播区', 0, STATUS_H + 48, W, 260, solidPaint(TOKENS.colors.warningLight), page);
  createText('轮播图片', '🍜 重庆小面', W / 2 - 60, 100, 120, 18, 600, { r: 0.573, g: 0.251, b: 0.055 }, carousel, { textAlign: 'CENTER' });
  for (let i = 0; i < 2; i++) {
    createRect('轮播圆点' + i, W / 2 - 10 + i * 14, 240, i === 0 ? 18 : 6, 6, solidPaint(i === 0 ? { r: 1, g: 1, b: 1 } : { r: 1, g: 1, b: 1, a: 0.5 }), carousel, i === 0 ? 3 : 3);
  }
  
  const bodyY = STATUS_H + 48 + 260;
  const detail = createFrame('详情主体', 0, bodyY, W, 90, TOKENS.colors.bgSurface, page);
  createModuleTag('美食', 'life', detail, 16, 14);
  createText('详情标题', '紫金港食堂三楼 重庆小面', 16, 44, W - 32, 20, 600, TOKENS.colors.textPrimary, detail);
  // Stars
  let sx = 16;
  for (let i = 0; i < 5; i++) {
    createText('星星' + i, i < 4 ? '★' : '☆', sx, 70, 20, 20, 400, i < 4 ? TOKENS.colors.warning : TOKENS.colors.textTertiary, detail);
    sx += 22;
  }
  createText('评分数字', '4.0', sx + 4, 70, 30, 16, 600, TOKENS.colors.warning, detail);
  
  const desc = createFrame('描述区域', 0, bodyY + 90 + 16, W, 60, TOKENS.colors.bgSurface, page);
  createText('描述文字', '📍 紫金港食堂三楼 · 11号档口', 16, 12, W - 32, 13, 400, TOKENS.colors.textSecondary, desc);
  
  // Author
  const authorY = bodyY + 90 + 16 + 60;
  const author = createFrame('作者卡片', 16, authorY, W - 32, 60, { r: 0.976, g: 0.980, b: 0.984 }, page);
  author.cornerRadius = 12;
  createRect('作者头像', 14, 8, 44, 44, solidPaint(TOKENS.colors.warningLight), author, 22);
  createText('头像文字', '李', 28, 20, 16, 18, 600, { r: 0.851, g: 0.467, b: 0.024 }, author, { textAlign: 'CENTER' });
  createText('作者名字', '李思思', 68, 10, 80, 14, 600, TOKENS.colors.textPrimary, author);
  createText('作者学校', '华北理工大学 · 经管学院', 68, 28, 180, 12, 400, TOKENS.colors.textSecondary, author);
  const badge = createRect('认证徽章', 68, 44, 80, 16, solidPaint(TOKENS.colors.successLight), author, 4);
  createText('徽章文字', '✓ 已认证学生', 74, 46, 68, 10, 10, TOKENS.colors.success, badge);
  
  const baY = screenH - 68;
  const baBar = createFrame('底部操作栏', 0, baY, W, 68, TOKENS.colors.bgSurface, page);
  baBar.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  baBar.dashPattern = [0, W * 2 + 136];
  const favBtn = createRect('收藏按钮', 16, 12, W / 2 - 24, 44, solidPaint(TOKENS.colors.bgSurface), baBar, 6);
  favBtn.strokes = [solidPaint(TOKENS.colors.border)];
  favBtn.strokeWeight = 1.5;
  createText('收藏文字', '☆ 收藏', 16, 26, W / 2 - 24, 14, 600, TOKENS.colors.textPrimary, baBar, { textAlign: 'CENTER' });
  const shareBtn = createRect('分享按钮', W / 2 + 8, 12, W / 2 - 24, 44, solidPaint(TOKENS.colors.bgSurface), baBar, 6);
  shareBtn.strokes = [solidPaint(TOKENS.colors.border)];
  shareBtn.strokeWeight = 1.5;
  createText('分享文字', '📝 我也要推荐', W / 2 + 8, 26, W / 2 - 24, 14, 600, TOKENS.colors.textPrimary, baBar, { textAlign: 'CENTER' });
  
  return page;
}

function createCareerDetailScreen() {
  const screenH = STATUS_H + 48 + 200 + 200 + 16 + 60 + 68;
  const page = createFrame('校招详情', 20 + 420 * 4, 20, W, screenH, TOKENS.colors.bgPage);
  createStatusBar(page);
  
  const nav = createFrame('导航栏', 0, STATUS_H, W, 48, TOKENS.colors.bgSurface, page);
  nav.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  nav.dashPattern = [0, W * 2 + 96];
  createText('返回按钮', '← 返回', 16, 14, 60, 14, 400, TOKENS.colors.primary, nav);
  createText('更多按钮', '⋯', W - 40, 10, 24, 20, 400, TOKENS.colors.textSecondary, nav, { textAlign: 'RIGHT' });
  
  const carousel = createRect('轮播区', 0, STATUS_H + 48, W, 200, solidPaint(TOKENS.colors.primaryLight), page);
  createText('轮播图片', '💼 字节跳动', W / 2 - 60, 80, 120, 18, 600, { r: 0.118, g: 0.251, b: 0.686 }, carousel, { textAlign: 'CENTER' });
  
  const bodyY = STATUS_H + 48 + 200;
  const detail = createFrame('详情主体', 0, bodyY, W, 200, TOKENS.colors.bgSurface, page);
  createModuleTag('校招', 'career', detail, 16, 14);
  const tag2 = createRect('分类标签', 58, 14, 36, 24, solidPaint({ r: 0.953, g: 0.957, b: 0.965 }), detail, 99);
  createText('分类文字', '内推', 64, 18, 24, 10, 600, TOKENS.colors.textSecondary, tag2);
  createText('详情标题', '字节跳动 后端开发实习生', 16, 48, W - 32, 20, 600, TOKENS.colors.textPrimary, detail);
  createText('有效期', '📌 有效期至 2026/06/30', 16, 72, W - 32, 14, 400, TOKENS.colors.danger, detail);
  // Referral code box
  const codeBox = createRect('内推码区域', 16, 96, W - 32, 60, { r: 0.976, g: 0.980, b: 0.984 }, detail, 8);
  createText('内推码标签', '内推码', 28, 104, 60, 12, 400, TOKENS.colors.textSecondary, codeBox);
  createText('内推码值', 'BT2026XYZ', 28, 120, W - 64, 20, 700, TOKENS.colors.primary, codeBox);
  createText('内推码描述', '字节抖音电商团队招后端实习生', 16, 170, W - 32, 14, 400, TOKENS.colors.textSecondary, detail);
  
  const authorY = bodyY + 200 + 16;
  const author = createFrame('作者卡片', 16, authorY, W - 32, 60, { r: 0.976, g: 0.980, b: 0.984 }, page);
  author.cornerRadius = 12;
  createRect('作者头像', 14, 8, 44, 44, solidPaint(TOKENS.colors.primaryLight), author, 22);
  createText('头像文字', '张', 28, 20, 16, 18, 600, TOKENS.colors.primary, author, { textAlign: 'CENTER' });
  createText('作者名字', '张三', 68, 10, 60, 14, 600, TOKENS.colors.textPrimary, author);
  createText('作者学校', '华北理工大学 · 计算机学院 · 2024届', 68, 28, 200, 12, 400, TOKENS.colors.textSecondary, author);
  const badge = createRect('认证徽章', 68, 44, 80, 16, solidPaint(TOKENS.colors.successLight), author, 4);
  createText('徽章文字', '✓ 已认证校友', 74, 46, 68, 10, 10, TOKENS.colors.success, badge);
  
  const baY = screenH - 68;
  const baBar = createFrame('底部操作栏', 0, baY, W, 68, TOKENS.colors.bgSurface, page);
  baBar.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  baBar.dashPattern = [0, W * 2 + 136];
  const favBtn = createRect('收藏按钮', 16, 12, W / 2 - 24, 44, solidPaint(TOKENS.colors.bgSurface), baBar, 6);
  favBtn.strokes = [solidPaint(TOKENS.colors.border)];
  favBtn.strokeWeight = 1.5;
  createText('收藏文字', '☆ 收藏', 16, 26, W / 2 - 24, 14, 600, TOKENS.colors.textPrimary, baBar, { textAlign: 'CENTER' });
  const codeBtn = createRect('内推码按钮', W / 2 + 8, 12, W / 2 - 24, 44, solidPaint(TOKENS.colors.primary), baBar, 6);
  createText('内推码按钮文字', '📋 复制内推码', W / 2 + 8, 26, W / 2 - 24, 14, 600, { r: 1, g: 1, b: 1 }, baBar, { textAlign: 'CENTER' });
  
  return page;
}

function createRentalDetailScreen() {
  const screenH = STATUS_H + 48 + 200 + 120 + 16 + 60 + 68;
  const page = createFrame('租房详情', 20 + 420 * 5, 20, W, screenH, TOKENS.colors.bgPage);
  createStatusBar(page);
  
  const nav = createFrame('导航栏', 0, STATUS_H, W, 48, TOKENS.colors.bgSurface, page);
  nav.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  nav.dashPattern = [0, W * 2 + 96];
  createText('返回按钮', '← 返回', 16, 14, 60, 14, 400, TOKENS.colors.primary, nav);
  createText('更多按钮', '⋯', W - 40, 10, 24, 20, 400, TOKENS.colors.textSecondary, nav, { textAlign: 'RIGHT' });
  
  const carousel = createRect('轮播区', 0, STATUS_H + 48, W, 200, solidPaint(TOKENS.colors.successLight), page);
  createText('轮播图片', '🏠 单间实拍', W / 2 - 60, 80, 120, 18, 600, { r: 0.086, g: 0.396, b: 0.204 }, carousel, { textAlign: 'CENTER' });
  
  const bodyY = STATUS_H + 48 + 200;
  const detail = createFrame('详情主体', 0, bodyY, W, 120, TOKENS.colors.bgSurface, page);
  createModuleTag('租房', 'rental', detail, 16, 14);
  createText('详情标题', '紫金港周边单间转租', 16, 44, W - 32, 20, 600, TOKENS.colors.textPrimary, detail);
  createText('详情价格', '￥1200/月', 16, 68, 100, 24, 700, TOKENS.colors.danger, detail);
  createText('详情信息', '🏢 紫金港新村 · 1室0厅 · 25㎡', 16, 100, W - 32, 13, 400, TOKENS.colors.textSecondary, detail);
  
  const authorY = bodyY + 120 + 16;
  const author = createFrame('作者卡片', 16, authorY, W - 32, 60, { r: 0.976, g: 0.980, b: 0.984 }, page);
  author.cornerRadius = 12;
  createRect('作者头像', 14, 8, 44, 44, solidPaint(TOKENS.colors.successLight), author, 22);
  createText('头像文字', '陈', 28, 20, 16, 18, 600, { r: 0.086, g: 0.396, b: 0.204 }, author, { textAlign: 'CENTER' });
  createText('作者名字', '陈大鹏', 68, 10, 80, 14, 600, TOKENS.colors.textPrimary, author);
  createText('作者学校', '华北理工大学 · 机械学院 · 2026届', 68, 28, 200, 12, 400, TOKENS.colors.textSecondary, author);
  const badge = createRect('认证徽章', 68, 44, 80, 16, solidPaint(TOKENS.colors.successLight), author, 4);
  createText('徽章文字', '✓ 已认证学生', 74, 46, 68, 10, 10, TOKENS.colors.success, badge);
  
  const baY = screenH - 68;
  const baBar = createFrame('底部操作栏', 0, baY, W, 68, TOKENS.colors.bgSurface, page);
  baBar.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  baBar.dashPattern = [0, W * 2 + 136];
  const favBtn = createRect('收藏按钮', 16, 12, W / 2 - 24, 44, solidPaint(TOKENS.colors.bgSurface), baBar, 6);
  favBtn.strokes = [solidPaint(TOKENS.colors.border)];
  favBtn.strokeWeight = 1.5;
  createText('收藏文字', '☆ 收藏', 16, 26, W / 2 - 24, 14, 600, TOKENS.colors.textPrimary, baBar, { textAlign: 'CENTER' });
  const contactBtn = createRect('联系按钮', W / 2 + 8, 12, W / 2 - 24, 44, solidPaint(TOKENS.colors.primary), baBar, 6);
  createText('联系文字', '📋 复制联系方式', W / 2 + 8, 26, W / 2 - 24, 14, 600, { r: 1, g: 1, b: 1 }, baBar, { textAlign: 'CENTER' });
  
  return page;
}
function createFoodPublishScreen() {
  const screenH = STATUS_H + 48 + 420;
  const page = createFrame('发布美食', 20 + 420 * 6, 20, W, screenH, TOKENS.colors.bgPage);
  createStatusBar(page);
  
  const nav = createFrame('导航栏', 0, STATUS_H, W, 48, TOKENS.colors.bgSurface, page);
  nav.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  nav.dashPattern = [0, W * 2 + 96];
  createText('取消按钮', '✕ 取消', 16, 14, 60, 14, 400, TOKENS.colors.danger, nav);
  createText('导航标题', '发布美食推荐', 0, 14, W, 16, 600, TOKENS.colors.textPrimary, nav, { textAlign: 'CENTER' });
  createText('发布按钮', '发布 →', W - 80, 14, 64, 14, 600, TOKENS.colors.primary, nav, { textAlign: 'RIGHT' });
  
  const formY = STATUS_H + 48 + 16;
  // Restaurant name
  createText('表单标签1', '餐厅/档口名 *', 16, formY, 120, 14, 600, TOKENS.colors.textPrimary, page);
  createRect('名称输入', 16, formY + 28, W - 32, 44, solidPaint(TOKENS.colors.bgSurface), page, 8, solidPaint(TOKENS.colors.border));
  createText('占位文字1', '例如：紫金港食堂三楼 重庆小面', 28, formY + 42, W - 60, 14, 400, TOKENS.colors.textTertiary, page);
  
  // Stars
  createText('表单标签2', '评分 *', 16, formY + 90, 60, 14, 600, TOKENS.colors.textPrimary, page);
  let sx = 16;
  for (let i = 0; i < 5; i++) {
    createText('星星' + i, i < 4 ? '★' : '☆', sx, formY + 110, 28, 28, 400, i < 4 ? TOKENS.colors.warning : TOKENS.colors.textTertiary, page);
    sx += 32;
  }
  
  // Photo upload
  createText('表单标签3', '添加照片 (最多9张)', 16, formY + 160, 150, 14, 600, TOKENS.colors.textPrimary, page);
  for (let i = 0; i < 3; i++) {
    const cell = createRect('照片' + i, 16 + i * (W - 32 - 16) / 3 + i * 8, formY + 188, (W - 48) / 3, (W - 48) / 3, solidPaint({ r: 0.976, g: 0.980, b: 0.984 }), page, 8);
    cell.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
    cell.dashPattern = [4, 4];
    if (i === 0) {
      createText('相机图标', '📷', 16 + (W - 48) / 6 - 14, formY + 188 + (W - 48) / 6 - 14, 28, 28, 400, TOKENS.colors.textTertiary, cell, { textAlign: 'CENTER' });
    }
  }
  
  // Textarea
  const taY = formY + 188 + (W - 48) / 3 + 20;
  createText('表单标签4', '评价 *', 16, taY, 60, 14, 600, TOKENS.colors.textPrimary, page);
  const ta = createRect('文本域', 16, taY + 28, W - 32, 100, solidPaint(TOKENS.colors.bgSurface), page, 8, solidPaint(TOKENS.colors.border));
  createText('占位文字2', '说说这家店怎么样...', 28, taY + 42, W - 60, 14, 400, TOKENS.colors.textTertiary, ta);
  
  return page;
}

function createCareerPublishScreen() {
  const screenH = STATUS_H + 48 + 400;
  const page = createFrame('发布校招', 20 + 420 * 7, 20, W, screenH, TOKENS.colors.bgPage);
  createStatusBar(page);
  
  const nav = createFrame('导航栏', 0, STATUS_H, W, 48, TOKENS.colors.bgSurface, page);
  nav.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  nav.dashPattern = [0, W * 2 + 96];
  createText('取消按钮', '✕ 取消', 16, 14, 60, 14, 400, TOKENS.colors.danger, nav);
  createText('导航标题', '发布内推信息', 0, 14, W, 16, 600, TOKENS.colors.textPrimary, nav, { textAlign: 'CENTER' });
  createText('发布按钮', '发布 →', W - 80, 14, 64, 14, 600, TOKENS.colors.primary, nav, { textAlign: 'RIGHT' });
  
  const fy = STATUS_H + 48 + 16;
  const fields = [
    { label: '公司名称 *', placeholder: '例如：字节跳动', h: 44 },
    { label: '岗位名称 *', placeholder: '例如：后端开发实习生', h: 44 },
    { label: '内推码', placeholder: '输入内推码', h: 44 },
  ];
  let y = fy;
  fields.forEach(f => {
    createText('字段标签', f.label, 16, y, 120, 14, 600, TOKENS.colors.textPrimary, page);
    const input = createRect('字段输入框', 16, y + 28, W - 32, f.h, solidPaint(TOKENS.colors.bgSurface), page, 8, solidPaint(TOKENS.colors.border));
    createText('字段占位', f.placeholder, 28, y + 42, W - 60, 14, 400, TOKENS.colors.textTertiary, input);
    y += 28 + f.h + 16;
  });
  
  // Description
  createText('描述标签', '岗位描述', 16, y, 80, 14, 600, TOKENS.colors.textPrimary, page);
  const descTa = createRect('描述文本域', 16, y + 28, W - 32, 80, solidPaint(TOKENS.colors.bgSurface), page, 8, solidPaint(TOKENS.colors.border));
  y += 28 + 80 + 16;
  
  // Expiry date
  createText('有效期标签', '有效期 *', 16, y, 80, 14, 600, TOKENS.colors.textPrimary, page);
  createRect('有效期输入', 16, y + 28, W - 32, 44, solidPaint(TOKENS.colors.bgSurface), page, 8, solidPaint(TOKENS.colors.border));
  createText('有效期占位', '选择日期', 28, y + 42, W - 60, 14, 400, TOKENS.colors.textTertiary, page);
  
  return page;
}

function createSecondhandPublishScreen() {
  const screenH = STATUS_H + 48 + 300;
  const page = createFrame('发布二手', 20 + 420 * 8, 20, W, screenH, TOKENS.colors.bgPage);
  createStatusBar(page);
  
  const nav = createFrame('导航栏', 0, STATUS_H, W, 48, TOKENS.colors.bgSurface, page);
  nav.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  nav.dashPattern = [0, W * 2 + 96];
  createText('取消按钮', '✕ 取消', 16, 14, 60, 14, 400, TOKENS.colors.danger, nav);
  createText('导航标题', '发布二手', 0, 14, W, 16, 600, TOKENS.colors.textPrimary, nav, { textAlign: 'CENTER' });
  createText('发布按钮', '发布 →', W - 80, 14, 64, 14, 600, TOKENS.colors.primary, nav, { textAlign: 'RIGHT' });
  
  const fy = STATUS_H + 48 + 16;
  // Category
  createText('分类标签', '分类 *', 16, fy, 60, 14, 600, TOKENS.colors.textPrimary, page);
  const c1 = createRect('分类按钮1', 16, fy + 28, 56, 28, solidPaint(TOKENS.colors.dangerLight), page, 99);
  createText('分类文字1', '书本', 24, 34 + fy, 40, 12, 600, TOKENS.colors.danger, c1);
  const c2 = createRect('分类按钮2', 80, fy + 28, 72, 28, solidPaint({ r: 0.953, g: 0.957, b: 0.965 }), page, 99);
  createText('分类文字2', '生活用品', 88, 34 + fy, 56, 12, 600, TOKENS.colors.textSecondary, c2);
  
  // Title
  createText('标题标签', '标题 *', 16, fy + 76, 60, 14, 600, TOKENS.colors.textPrimary, page);
  createRect('标题输入', 16, fy + 100, W - 32, 44, solidPaint(TOKENS.colors.bgSurface), page, 8, solidPaint(TOKENS.colors.border));
  createText('标题占位', '例如：几乎全新数据结构教材', 28, fy + 114, W - 60, 14, 400, TOKENS.colors.textTertiary, page);
  
  // Price
  createText('价格标签', '价格 *', 16, fy + 160, 60, 14, 600, TOKENS.colors.textPrimary, page);
  const priceInput = createRect('价格输入', 16, fy + 184, W - 32, 44, solidPaint(TOKENS.colors.bgSurface), page, 8, solidPaint(TOKENS.colors.border));
  createText('价格占位', '￥ 15', 28, fy + 198, W - 60, 14, 400, TOKENS.colors.textTertiary, priceInput);
  
  return page;
}

function createRentalPublishScreen() {
  const screenH = STATUS_H + 48 + 360;
  const page = createFrame('发布租房', 20 + 420 * 9, 20, W, screenH, TOKENS.colors.bgPage);
  createStatusBar(page);
  
  const nav = createFrame('导航栏', 0, STATUS_H, W, 48, TOKENS.colors.bgSurface, page);
  nav.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  nav.dashPattern = [0, W * 2 + 96];
  createText('取消按钮', '✕ 取消', 16, 14, 60, 14, 400, TOKENS.colors.danger, nav);
  createText('导航标题', '发布房源', 0, 14, W, 16, 600, TOKENS.colors.textPrimary, nav, { textAlign: 'CENTER' });
  createText('发布按钮', '发布 →', W - 80, 14, 64, 14, 600, TOKENS.colors.primary, nav, { textAlign: 'RIGHT' });
  
  const fy = STATUS_H + 48 + 16;
  const fields = [
    { label: '标题 *', placeholder: '例如：紫金港周边单间转租' },
    { label: '区域/小区 *', placeholder: '例如：紫金港新村' },
  ];
  let y = fy;
  fields.forEach(f => {
    createText('字段标签', f.label, 16, y, 120, 14, 600, TOKENS.colors.textPrimary, page);
    const input = createRect('字段输入框', 16, y + 28, W - 32, 44, solidPaint(TOKENS.colors.bgSurface), page, 8, solidPaint(TOKENS.colors.border));
    createText('字段占位', f.placeholder, 28, y + 42, W - 60, 14, 400, TOKENS.colors.textTertiary, input);
    y += 28 + 44 + 16;
  });
  
  // Price + Type side by side
  createText('价格标签', '月租金 *', 16, y, 80, 14, 600, TOKENS.colors.textPrimary, page);
  createRect('价格输入', 16, y + 28, (W - 48) / 2, 44, solidPaint(TOKENS.colors.bgSurface), page, 8, solidPaint(TOKENS.colors.border));
  createText('价格占位', '￥ 1200', 28, y + 42, (W - 48) / 2 - 16, 14, 400, TOKENS.colors.textTertiary, page);
  createText('类型标签', '户型', 16 + (W - 48) / 2 + 16, y, 40, 14, 600, TOKENS.colors.textPrimary, page);
  createRect('类型输入', 16 + (W - 48) / 2 + 16, y + 28, (W - 48) / 2, 44, solidPaint(TOKENS.colors.bgSurface), page, 8, solidPaint(TOKENS.colors.border));
  createText('类型占位', '1室0厅', 28 + (W - 48) / 2 + 16, y + 42, 60, 14, 400, TOKENS.colors.textTertiary, page);
  
  return page;
}

function createLoginScreen() {
  const screenH = STATUS_H + 48 + 440;
  const page = createFrame('登录', 20 + 420 * 10, 20, W, screenH, TOKENS.colors.bgSurface);
  createStatusBar(page);
  
  const nav = createFrame('导航栏', 0, STATUS_H, W, 48, TOKENS.colors.bgSurface, page);
  nav.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  nav.dashPattern = [0, W * 2 + 96];
  createText('返回按钮', '← 返回', 16, 14, 60, 14, 400, TOKENS.colors.primary, nav);
  createText('导航标题', '登录', 0, 14, W, 16, 600, TOKENS.colors.textPrimary, nav, { textAlign: 'CENTER' });
  
  const ly = STATUS_H + 48 + 80;
  createText('登录Logo', '🏫', W / 2 - 24, ly, 48, 48, 400, null, page, { textAlign: 'CENTER' });
  createText('欢迎标题', '欢迎来到校园通', 0, ly + 60, W, 22, 700, TOKENS.colors.textPrimary, page, { textAlign: 'CENTER' });
  createText('欢迎描述', '校园生活，一站聚合', 0, ly + 86, W, 13, 400, TOKENS.colors.textSecondary, page, { textAlign: 'CENTER' });
  
  // Phone input
  const piY = ly + 130;
  createRect('手机号输入', 32, piY, W - 64, 48, solidPaint(TOKENS.colors.bgSurface), page, 8, solidPaint(TOKENS.colors.border));
  createText('手机号占位', '请输入手机号', 48, piY + 14, W - 100, 15, 400, TOKENS.colors.textTertiary, page);
  
  // Code
  const ciY = piY + 64;
  createRect('验证码输入', 32, ciY, W - 160, 48, solidPaint(TOKENS.colors.bgSurface), page, 8, solidPaint(TOKENS.colors.border));
  createText('验证码占位', '请输入验证码', 48, ciY + 14, W - 200, 15, 400, TOKENS.colors.textTertiary, page);
  const codeBtn = createRect('验证码按钮', W - 120, ciY, 88, 48, solidPaint(TOKENS.colors.bgSurface), page, 8);
  codeBtn.strokes = [solidPaint(TOKENS.colors.primary)];
  createText('验证码按钮文字', '获取验证码', W - 120, ciY + 14, 88, 13, 600, TOKENS.colors.primary, codeBtn, { textAlign: 'CENTER' });
  
  // Login button
  const lbY = ciY + 64;
  const loginBtn = createRect('登录按钮', 32, lbY, W - 64, 48, solidPaint(TOKENS.colors.primary), page, 6);
  createText('登录文字', '登录 / 注册', 32, lbY + 12, W - 64, 16, 600, { r: 1, g: 1, b: 1 }, loginBtn, { textAlign: 'CENTER' });
  
  // Agreement
  createText('协议文字', '登录即表示同意《用户协议》和《隐私政策》', 0, lbY + 64, W, 11, 400, TOKENS.colors.textTertiary, page, { textAlign: 'CENTER' });
  
  return page;
}

function createVerifyScreen() {
  const screenH = STATUS_H + 48 + 420;
  const page = createFrame('校园认证', 20 + 420 * 11, 20, W, screenH, TOKENS.colors.bgSurface);
  createStatusBar(page);
  
  const nav = createFrame('导航栏', 0, STATUS_H, W, 48, TOKENS.colors.bgSurface, page);
  nav.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  nav.dashPattern = [0, W * 2 + 96];
  createText('返回按钮', '← 返回', 16, 14, 60, 14, 400, TOKENS.colors.primary, nav);
  createText('导航标题', '校园认证', 0, 14, W, 16, 600, TOKENS.colors.textPrimary, nav, { textAlign: 'CENTER' });
  
  const vy = STATUS_H + 48 + 40;
  createText('学位帽图标', '🎓', W / 2 - 28, vy, 56, 56, 400, null, page, { textAlign: 'CENTER' });
  createText('认证标题', '验证你的校园身份', 0, vy + 68, W, 20, 700, TOKENS.colors.textPrimary, page, { textAlign: 'CENTER' });
  createText('认证描述', '认证后即可发布内容，并获得✓认证标识', 0, vy + 96, W, 13, 400, TOKENS.colors.textSecondary, page, { textAlign: 'CENTER' });
  
  // Steps
  const steps = [
    '选择你的学校：华北理工大学',
    '输入你的 edu 邮箱（如 student@ncst.edu.cn）',
    '点击发送验证邮件，在邮箱中确认即可完成认证',
  ];
  let sy = vy + 140;
  steps.forEach((step, i) => {
    const circle = createRect('step-num-' + i, 32, sy, 22, 22, solidPaint(TOKENS.colors.primaryLight), page, 11);
    createText('step-num-text-' + i, '' + (i + 1), 38, sy + 2, 12, 12, 700, TOKENS.colors.primary, circle, { textAlign: 'CENTER' });
    createText('step-text-' + i, step, 64, sy + 2, W - 96, 13, 400, TOKENS.colors.textSecondary, page);
    sy += 38;
  });
  
  // Email input
  createRect('邮箱输入', 32, sy + 10, W - 64, 48, solidPaint(TOKENS.colors.bgSurface), page, 8, solidPaint(TOKENS.colors.border));
  createText('邮箱占位', '请输入 edu 邮箱', 48, sy + 24, W - 100, 15, 400, TOKENS.colors.textTertiary, page);
  
  const sendBtn = createRect('发送按钮', 32, sy + 74, W - 64, 48, solidPaint(TOKENS.colors.primary), page, 6);
  createText('发送文字', '发送验证邮件', 32, sy + 86, W - 64, 16, 600, { r: 1, g: 1, b: 1 }, sendBtn, { textAlign: 'CENTER' });
  
  return page;
}

function createProfileScreen() {
  const screenH = STATUS_H + 48 + 230 + 38 + 3 * 60 + 64;
  const page = createFrame('我的', 20 + 420 * 12, 20, W, screenH, TOKENS.colors.bgPage);
  createStatusBar(page);
  
  const nav = createFrame('导航栏', 0, STATUS_H, W, 48, TOKENS.colors.bgSurface, page);
  nav.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  nav.dashPattern = [0, W * 2 + 96];
  createText('导航标题', '我的', 0, 14, W, 16, 600, TOKENS.colors.textPrimary, nav, { textAlign: 'CENTER' });
  createText('设置图标', '⚙', W - 40, 10, 24, 18, 400, TOKENS.colors.textSecondary, nav, { textAlign: 'RIGHT' });
  
  // Profile header
  const headerY = STATUS_H + 48;
  const header = createFrame('个人中心头部', 0, headerY, W, 230, TOKENS.colors.bgSurface, page);
  const avatar = createRect('用户头像', W / 2 - 40, 32, 80, 80, solidPaint(TOKENS.colors.primaryLight), header, 40);
  createText('头像文字', '张', W / 2 - 12, 54, 24, 32, 600, TOKENS.colors.primary, avatar, { textAlign: 'CENTER' });
  createText('用户名字', '张三', 0, 122, W, 18, 600, TOKENS.colors.textPrimary, header, { textAlign: 'CENTER' });
  const badge = createRect('认证徽章', W / 2 - 40, 146, 80, 18, solidPaint(TOKENS.colors.successLight), header, 4);
  createText('徽章文字', '✓ 已认证', W / 2 - 34, 148, 68, 10, 10, TOKENS.colors.success, badge, { textAlign: 'CENTER' });
  createText('学校信息', '华北理工大学 · 计算机学院', 0, 172, W, 13, 400, TOKENS.colors.textSecondary, header, { textAlign: 'CENTER' });
  
  // Stats
  createText('统计数字1', '12', W / 4 - 20, 200, W / 2, 20, 700, TOKENS.colors.textPrimary, header, { textAlign: 'CENTER' });
  createText('统计标签1', '我的发布', W / 4 - 20, 218, W / 2, 11, 400, TOKENS.colors.textSecondary, header, { textAlign: 'CENTER' });
  createText('统计数字2', '5', W / 2 + W / 4 - 20, 200, W / 2, 20, 700, TOKENS.colors.textPrimary, header, { textAlign: 'CENTER' });
  createText('统计标签2', '收藏', W / 2 + W / 4 - 20, 218, W / 2, 11, 400, TOKENS.colors.textSecondary, header, { textAlign: 'CENTER' });
  
  // Separator
  createRect('分隔线', W / 2, 200, 1, 30, solidPaint(TOKENS.colors.border), header);
  
  // Tabs
  const tabsY = headerY + 230;
  const tabsBar = createFrame('个人中心标签栏', 0, tabsY, W, 38, TOKENS.colors.bgSurface, page);
  tabsBar.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
  tabsBar.dashPattern = [0, W * 2 + 76];
  createText('标签-发布', '我的发布', 0, 10, W / 2, 13, 600, TOKENS.colors.primary, tabsBar, { textAlign: 'CENTER' });
  createRect('标签激活线', W / 4 - 30, 36, 60, 2, solidPaint(TOKENS.colors.primary), tabsBar);
  createText('标签-收藏', '收藏', W / 2, 10, W / 2, 13, 400, TOKENS.colors.textSecondary, tabsBar, { textAlign: 'CENTER' });
  
  // Post list
  const posts = [
    { tag: '校招', mod: 'career', title: '字节跳动后端内推', time: '5天前 · 已发布' },
    { tag: '二手', mod: 'secondhand', title: '数据结构教材', time: '2天前 · 已发布' },
    { tag: '美食', mod: 'life', title: '食堂三楼重庆小面', time: '1周前 · 已发布' },
  ];
  let liY = tabsY + 38;
  posts.forEach((p, i) => {
    const li = createFrame('帖子项 ' + i, 0, liY, W, 52, TOKENS.colors.bgSurface, page);
    li.strokes = [{ type: 'SOLID', color: TOKENS.colors.border }];
    li.dashPattern = [0, W * 2 + 104];
    createModuleTag(p.tag, p.mod, li, 16, 16);
    createText('帖子标题', p.title, 62, 16, W - 140, 15, 600, TOKENS.colors.textPrimary, li);
    createText('帖子时间', p.time, W - 130, 36, 114, 11, 400, TOKENS.colors.textTertiary, li, { textAlign: 'RIGHT' });
    liY += 53;
  });
  
  // Bottom Nav
  const bnY = screenH - 64;
  const bn = createFrame('底部导航容器', 0, bnY, W, 64, null, page);
  createBottomNav(bn, 4);
  
  return page;
}

function createRentalListScreen() {
  const screenH = STATUS_H + 48 + 54 + 300;
  const page = createFrame('租房列表', 20 + 420 * 13, 20, W, screenH, TOKENS.colors.bgPage);
  createStatusBar(page);
  createNavBar('导航栏', '租房找房', page, '← 返回', '发布');
  
  // Search
  const search = createFrame('搜索栏', 16, STATUS_H + 48 + 8, W - 32, 38, { r: 0.941, g: 0.941, b: 0.941 }, page);
  search.cornerRadius = 8;
  createText('搜索图标', '🔍', 14, 10, 20, 16, 400, TOKENS.colors.textTertiary, search);
  createText('搜索占位', '搜索区域/小区...', 38, 11, W - 80, 13, 400, TOKENS.colors.textTertiary, search);
  
  // Grid cards
  const cards = [
    { title: '紫金港周边单间', price: '￥1200', meta: '1室0厅 · 曹妃甸' },
    { title: '玉兰苑两室一厅整租', price: '￥2200', meta: '2室1厅 · 步行5分钟' },
    { title: '翰林苑主卧带独卫', price: '￥1500', meta: '3室2厅 · 主卧' },
    { title: '校内家属楼次卧', price: '￥900', meta: '2室1厅 · 校内' },
  ];
  const cw = (W - 36) / 2;
  const gy = STATUS_H + 48 + 54;
  cards.forEach((c, i) => {
    const cx = 12 + (i % 2) * (cw + 12);
    const cy = gy + Math.floor(i / 2) * 150;
    const card = createFrame('租房卡片-' + i, cx, cy, cw, 138, TOKENS.colors.bgSurface, page);
    card.cornerRadius = 8;
    card.strokes = [solidPaint(TOKENS.colors.border)];
    card.clipsContent = true;
    createRect('卡片图片', 0, 0, cw, cw * 0.75, solidPaint(TOKENS.colors.successLight), card);
    createText('卡片标题', c.title, 12, cw * 0.75 + 10, cw - 24, 13, 600, TOKENS.colors.textPrimary, card);
    createText('卡片价格', c.price + '/月', 12, cw * 0.75 + 28, cw - 24, 14, 700, TOKENS.colors.danger, card);
    createText('卡片元信息', c.meta, 12, cw * 0.75 + 46, cw - 24, 11, 400, TOKENS.colors.textSecondary, card);
  });
  
  return page;
}


function createEmptyStateScreen() {
  const screenH = STATUS_H + 48 + 300;
  const page = createFrame('空状态', 20 + 420 * 14, 20, W, screenH, TOKENS.colors.bgPage);
  createStatusBar(page);
  createNavBar('导航栏', '搜索结果', page, '← 返回');
  
  const ey = STATUS_H + 48 + 80;
  createText('空状态图标', '🔍', W / 2 - 28, ey, 56, 56, 400, null, page, { textAlign: 'CENTER' });
  createText('空状态标题', '没有找到相关内容', 0, ey + 72, W, 16, 600, TOKENS.colors.textPrimary, page, { textAlign: 'CENTER' });
  createText('空状态描述', '换个关键词试试，或者发布第一条内容', 0, ey + 96, W, 13, 400, TOKENS.colors.textSecondary, page, { textAlign: 'CENTER' });
  
  const btn = createRect('发布按钮', 32, ey + 140, W - 64, 44, solidPaint(TOKENS.colors.primary), page, 6);
  createText('按钮文字', '立即发布', 32, ey + 152, W - 64, 14, 600, { r: 1, g: 1, b: 1 }, btn, { textAlign: 'CENTER' });
  
  return page;
}

function createLoadingScreen() {
  const screenH = STATUS_H + 48 + 300;
  const page = createFrame('加载中', 20 + 420 * 15, 20, W, screenH, TOKENS.colors.bgPage);
  createStatusBar(page);
  createNavBar('导航栏', '加载中', page, '← 返回');
  
  const ly = STATUS_H + 48 + 12;
  for (let i = 0; i < 3; i++) {
    const sk = createFrame('骨架卡片 ' + i, 12, ly + i * 104, W - 24, 92, TOKENS.colors.bgSurface, page);
    sk.cornerRadius = 8;
    sk.strokes = [solidPaint(TOKENS.colors.border)];
    const skCol = { r: 0.941, g: 0.941, b: 0.941 };
    createRect('骨架线1', 16, 16, W * 0.4, 12, solidPaint(skCol), sk, 4);
    createRect('骨架线2', 16, 36, W * 0.8, 12, solidPaint(skCol), sk, 4);
    createRect('骨架线3', 16, 56, W * 0.6, 12, solidPaint(skCol), sk, 4);
    createRect('骨架缩略图', W - 24 - 16 - 72, 16, 72, 72, solidPaint(skCol), sk, 6);
  }
  
  return page;
}

// ============ 主程序 ============
function main() {
  const screens = [
    createHomeScreen,
    createCareerListScreen,
    createSecondhandDetailScreen,
    createFoodDetailScreen,
    createCareerDetailScreen,
    createRentalDetailScreen,
    createFoodPublishScreen,
    createCareerPublishScreen,
    createSecondhandPublishScreen,
    createRentalPublishScreen,
    createLoginScreen,
    createVerifyScreen,
    createProfileScreen,
    createRentalListScreen,
    createEmptyStateScreen,
    createLoadingScreen,
  ];
  
  // Create a single page
  const page = jsDesign.createPage();
  page.name = '校园通 · 高保真原型';
  
  const total = screens.length;
  screens.forEach((fn, i) => {
    try {
      fn();
      jsDesign.ui.postMessage({ type: 'progress', percent: Math.round((i + 1) / total * 100), text: `已生成 ${i + 1}/${total} 屏幕` });
    } catch (e) {
      jsDesign.ui.postMessage({ type: 'progress', percent: Math.round((i + 1) / total * 100), text: `错误: ${e.message}` });
    }
  });
  
  jsDesign.ui.postMessage({ type: 'done', text: `✅ 生成完成！共 ${total} 个屏幕。` });
  jsDesign.viewport.scrollAndZoomIntoView(page.children);
}

jsDesign.showUI(__html__, { width: 320, height: 260 });
jsDesign.ui.onmessage = (msg) => {
  if (msg.type === 'generate') {
    setTimeout(main, 200);
  } else if (msg.type === 'cancel') {
    jsDesign.closePlugin();
  }
};


