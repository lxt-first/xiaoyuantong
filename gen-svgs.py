"""Generate 14 SVG design files for Figma import."""
import os

# Design tokens matching PRD
TOKENS = {
    "primary": "#2563EB", "primary_light": "#DBEAFE",
    "success": "#16A34A", "success_light": "#DCFCE7",
    "danger": "#DC2626", "danger_light": "#FEE2E2",
    "warning": "#F59E0B", "warning_light": "#FEF3C7",
    "purple": "#7C3AED", "purple_light": "#EDE9FE",
    "bg_page": "#F3F4F6", "bg_surface": "#FFFFFF",
    "text_primary": "#111827", "text_secondary": "#6B7280",
    "text_tertiary": "#9CA3AF", "border": "#E5E7EB",
}
W = 390  # screen width
H_STATUSBAR = 44
H_NAVBAR = 48
H_BOTTOMNAV = 64
FONT = "Inter, Noto Sans SC, -apple-system, sans-serif"

out_dir = r"C:\Users\86153\Documents\Codex\2026-06-12\new-chat\xiaoyuantong\prototypes\svg-screens"
os.makedirs(out_dir, exist_ok=True)

def SVG(w, h, body):
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
  <defs>
    <style>
      text {{ font-family: '{FONT}'; }}
    </style>
  </defs>
  {body}
</svg>'''

def status_bar():
    return f'''
  <rect x="0" y="0" width="{W}" height="{H_STATUSBAR}" fill="{TOKENS['bg_surface']}"/>
  <text x="24" y="28" font-size="14" font-weight="700" fill="{TOKENS['text_primary']}">9:41</text>'''

def nav_bar(title, left="← 返回", right="", right_color=TOKENS['primary']):
    bar = f'''
  <rect x="0" y="{H_STATUSBAR}" width="{W}" height="{H_NAVBAR}" fill="{TOKENS['bg_surface']}"/>
  <line x1="0" y1="{H_STATUSBAR+H_NAVBAR-0.5}" x2="{W}" y2="{H_STATUSBAR+H_NAVBAR-0.5}" stroke="{TOKENS['border']}" stroke-width="1"/>'''
    if left:
        bar += f'''
  <text x="16" y="{H_STATUSBAR+30}" font-size="14" fill="{TOKENS['primary']}">{left}</text>'''
    if title:
        bar += f'''
  <text x="{W//2}" y="{H_STATUSBAR+30}" font-size="16" font-weight="600" fill="{TOKENS['text_primary']}" text-anchor="middle">{title}</text>'''
    if right:
        bar += f'''
  <text x="{W-16}" y="{H_STATUSBAR+30}" font-size="14" font-weight="600" fill="{right_color}" text-anchor="end">{right}</text>'''
    return bar

def module_tabs(y, tabs, active=0):
    tb = f'''
  <rect x="0" y="{y}" width="{W}" height="38" fill="{TOKENS['bg_surface']}"/>
  <line x1="0" y1="{y+38-0.5}" x2="{W}" y2="{y+38-0.5}" stroke="{TOKENS['border']}" stroke-width="1"/>'''
    x = 0
    for i, (label, color) in enumerate(tabs):
        c = color if i == active else TOKENS['text_secondary']
        fw = "600" if i == active else "400"
        tb += f'''
  <text x="{x+16}" y="{y+25}" font-size="13" font-weight="{fw}" fill="{c}">{label}</text>'''
        if i == active:
            tb += f'''
  <rect x="{x+16}" y="{y+36}" width="60" height="2" fill="{color}"/>'''
        x += 76
    return tb

def bottom_nav(y, active=0):
    items = [("首页","#2563EB"),("求职","#2563EB"),("发布","#2563EB"),("消息","#2563EB"),("我的","#2563EB")]
    bn = f'''
  <rect x="0" y="{y}" width="{W}" height="{H_BOTTOMNAV}" fill="{TOKENS['bg_surface']}"/>
  <line x1="0" y1="{y+0.5}" x2="{W}" y2="{y+0.5}" stroke="{TOKENS['border']}" stroke-width="1"/>'''
    for i, (label, _) in enumerate(items):
        cx = (W // 5) * i + W // 10
        c = TOKENS['primary'] if i == active else TOKENS['text_tertiary']
        if i == 2:
            bn += f'''
  <circle cx="{cx}" cy="{y+18}" r="22" fill="{TOKENS['primary']}"/>
  <text x="{cx}" y="{y+24}" font-size="18" fill="#fff" text-anchor="middle">+</text>'''
        bn += f'''
  <text x="{cx}" y="{y+50}" font-size="10" fill="{c}" text-anchor="middle">{label}</text>'''
    return bn

def module_tag(x, y, label, module):
    colors = {
        "career": (TOKENS['primary_light'], TOKENS['primary']),
        "rental": (TOKENS['success_light'], TOKENS['success']),
        "secondhand": (TOKENS['danger_light'], TOKENS['danger']),
        "life": (TOKENS['warning_light'], "#D97706"),
    }
    bg, fg = colors.get(module, colors['life'])
    tw = len(label) * 12 + 4
    return f'''
  <rect x="{x}" y="{y}" width="{tw}" height="24" rx="12" fill="{bg}"/>
  <text x="{x+tw//2}" y="{y+16}" font-size="10" font-weight="600" fill="{fg}" text-anchor="middle">{label}</text>'''

def feed_card(y, module, tag, title, desc, time, price="", thumb=False):
    h = 86 if thumb else 72
    card = f'''
  <rect x="12" y="{y}" width="{W-24}" height="{h}" rx="8" fill="{TOKENS['bg_surface']}" stroke="{TOKENS['border']}" stroke-width="1"/>'''
    card += module_tag(28, y+14, tag, module)
    card += f'''
  <text x="28" y="{y+40}" font-size="14" font-weight="600" fill="{TOKENS['text_primary']}">{title}</text>
  <text x="28" y="{y+56}" font-size="12" fill="{TOKENS['text_secondary']}">{desc}</text>'''
    if price:
        card += f'''
  <text x="28" y="{y+72}" font-size="14" font-weight="700" fill="{TOKENS['danger']}">{price}</text>'''
    card += f'''
  <text x="{W-40}" y="{y+72}" font-size="11" fill="{TOKENS['text_tertiary']}" text-anchor="end">{time}</text>'''
    if thumb:
        thumb_colors = {"career": TOKENS['primary_light'], "rental": TOKENS['success_light'], "secondhand": TOKENS['danger_light'], "life": TOKENS['warning_light']}
        tc = thumb_colors.get(module, TOKENS['primary_light'])
        card += f'''
  <rect x="{W-16-72-16}" y="{y+16}" width="72" height="56" rx="6" fill="{tc}"/>'''
    return card

# ====== SCREEN 1: HOME ======
def screen_home():
    h = H_STATUSBAR + 56 + 38 + 42 + 10 + 86*5 + H_BOTTOMNAV
    body = status_bar()
    # Header
    body += f'''
  <rect x="0" y="{H_STATUSBAR}" width="{W}" height="56" fill="{TOKENS['bg_surface']}"/>
  <text x="16" y="{H_STATUSBAR+36}" font-size="20" font-weight="700" fill="{TOKENS['text_primary']}">🏫 校园通</text>
  <text x="{W-16}" y="{H_STATUSBAR+36}" font-size="12" fill="{TOKENS['text_secondary']}" text-anchor="end">华北理工大学 ▾</text>'''
    body += module_tabs(H_STATUSBAR+56, [("全部",TOKENS['primary']),("校招",TOKENS['primary']),("租房",TOKENS['primary']),("二手",TOKENS['primary']),("生活",TOKENS['primary'])])
    # Quick post bar
    qy = H_STATUSBAR + 56 + 38
    body += f'''
  <rect x="0" y="{qy}" width="{W}" height="42" fill="{TOKENS['bg_surface']}"/>
  <rect x="16" y="{qy+5}" width="32" height="32" rx="16" fill="{TOKENS['primary_light']}"/>
  <rect x="56" y="{qy+8}" width="{W-100}" height="26" rx="13" fill="#F3F4F6"/>
  <text x="70" y="{qy+24}" font-size="12" fill="{TOKENS['text_tertiary']}">分享校园新鲜事...</text>
  <text x="{W-30}" y="{qy+26}" font-size="18" fill="{TOKENS['text_tertiary']}" text-anchor="middle">+</text>'''
    # Feed
    fy = qy + 42 + 12
    cards_data = [
        ("secondhand","二手","几乎全新数据结构教材","紫金港校区 · 计算机专业适用","2小时前","¥15",True),
        ("life","美食","紫金港食堂三楼麻辣烫","汤底浓郁，食材新鲜，性价比高","3小时前","",True),
        ("career","校招","字节跳动 后端开发实习生内推","张三 · 计算机学院 · 有效期至6/30","5小时前","",False),
        ("rental","租房","紫金港周边单间转租","1室0厅 · 步行10分钟到校","6小时前","¥1200/月",True),
        ("secondhand","二手","机械键盘 Cherry MX 青轴","9成新 · 使用半年 · 配件齐全","昨天","¥120",True),
    ]
    for mod, tag, title, desc, time, price, thumb in cards_data:
        body += feed_card(fy, mod, tag, title, desc, time, price, thumb)
        fy += 98 if thumb else 84
    body += bottom_nav(h - H_BOTTOMNAV)
    return SVG(W, h, body)

# ====== SCREEN 2: CAREER LIST ======
def screen_career_list():
    h = H_STATUSBAR + H_NAVBAR + 38 + 54 + 4*60
    body = status_bar()
    body += nav_bar("校招内推", right="发布")
    # Sub tabs
    sty = H_STATUSBAR + H_NAVBAR
    body += f'''
  <rect x="0" y="{sty}" width="{W}" height="38" fill="{TOKENS['bg_surface']}"/>
  <text x="{W//4}" y="{sty+25}" font-size="13" font-weight="600" fill="{TOKENS['primary']}" text-anchor="middle">内推信息</text>
  <rect x="{W//4-30}" y="{sty+36}" width="60" height="2" fill="{TOKENS['primary']}"/>
  <text x="{3*W//4}" y="{sty+25}" font-size="13" fill="{TOKENS['text_secondary']}" text-anchor="middle">面经/笔试</text>
  <line x1="0" y1="{sty+38-0.5}" x2="{W}" y2="{sty+38-0.5}" stroke="{TOKENS['border']}" stroke-width="1"/>'''
    # Search
    sy = sty + 38 + 8
    body += f'''
  <rect x="16" y="{sy}" width="{W-32}" height="38" rx="8" fill="#F0F0F0"/>
  <text x="40" y="{sy+24}" font-size="13" fill="{TOKENS['text_tertiary']}">🔍 搜索公司/岗位...</text>'''
    # List items
    liy = sy + 54
    items = [
        ("字节跳动 后端开发实习生","张三 · 计算机学院 · 内推码 BT2026XYZ","有效期至 2026/06/30","2小时前"),
        ("阿里巴巴 前端工程师校招","李四 · 软件学院 · 直推淘宝技术部","有效期至 2026/07/15","1天前"),
        ("腾讯 产品经理实习生","王五 · 经管学院","有效期至 2026/06/25","2天前"),
        ("美团 数据开发工程师","赵六 · 计算机学院 · 内推码 MT2026DEV","有效期至 2026/07/01","3天前"),
    ]
    for title, meta, exp, time in items:
        body += f'''
  <rect x="0" y="{liy}" width="{W}" height="60" fill="{TOKENS['bg_surface']}"/>
  <text x="16" y="{liy+22}" font-size="15" font-weight="600" fill="{TOKENS['text_primary']}">{title}</text>
  <text x="16" y="{liy+40}" font-size="12" fill="{TOKENS['text_secondary']}">{meta}</text>
  <text x="16" y="{liy+54}" font-size="11" fill="{TOKENS['danger']}">{exp}</text>
  <text x="{W-16}" y="{liy+54}" font-size="11" fill="{TOKENS['text_tertiary']}" text-anchor="end">{time}</text>
  <line x1="0" y1="{liy+60-0.5}" x2="{W}" y2="{liy+60-0.5}" stroke="{TOKENS['border']}" stroke-width="1"/>'''
        liy += 61
    return SVG(W, h, body)

# ====== SCREEN 3: SECONDHAND DETAIL ======
def screen_secondhand_detail():
    h = H_STATUSBAR + H_NAVBAR + 260 + 100 + 16 + 60 + 68
    body = status_bar()
    body += nav_bar("", left="← 返回") + f'''
  <text x="{W-40}" y="{H_STATUSBAR+30}" font-size="20" fill="{TOKENS['text_secondary']}" text-anchor="end">⋯</text>'''
    # Carousel
    cy = H_STATUSBAR + H_NAVBAR
    body += f'''
  <rect x="0" y="{cy}" width="{W}" height="260" fill="#F0F0F0"/>
  <text x="{W//2}" y="{cy+130}" font-size="64" fill="{TOKENS['text_tertiary']}" text-anchor="middle">📖</text>
  <rect x="{W//2-24}" y="{cy+240}" width="18" height="6" rx="3" fill="#fff"/>
  <circle cx="{W//2-6}" cy="{cy+243}" r="3" fill="rgba(255,255,255,0.5)"/>
  <circle cx="{W//2+6}" cy="{cy+243}" r="3" fill="rgba(255,255,255,0.5)"/>
  <circle cx="{W//2+18}" cy="{cy+243}" r="3" fill="rgba(255,255,255,0.5)"/>'''
    # Body
    by = cy + 260
    body += f'''
  <rect x="0" y="{by}" width="{W}" height="100" fill="{TOKENS['bg_surface']}"/>'''
    body += module_tag(16, by+14, "二手", "secondhand")
    body += f'''
  <rect x="62" y="{by+14}" width="36" height="24" rx="12" fill="#F3F4F6"/>
  <text x="80" y="{by+30}" font-size="10" font-weight="600" fill="{TOKENS['text_secondary']}" text-anchor="middle">书本</text>
  <text x="16" y="{by+52}" font-size="20" font-weight="600" fill="{TOKENS['text_primary']}">几乎全新的数据结构教材</text>
  <text x="16" y="{by+82}" font-size="24" font-weight="700" fill="{TOKENS['danger']}">¥15</text>'''
    # Desc
    dy = by + 100 + 16
    body += f'''
  <rect x="0" y="{dy}" width="{W}" height="60" fill="{TOKENS['bg_surface']}"/>
  <text x="16" y="{dy+22}" font-size="13" fill="{TOKENS['text_secondary']}">📍 交易地点：紫金港校区</text>
  <text x="16" y="{dy+44}" font-size="11" fill="{TOKENS['success']}">🔒 仅校园认证用户可查看联系方式</text>'''
    # Author
    ay = dy + 60
    body += f'''
  <rect x="16" y="{ay}" width="{W-32}" height="60" rx="12" fill="#F9FAFB"/>
  <circle cx="44" cy="{ay+30}" r="22" fill="{TOKENS['primary_light']}"/>
  <text x="44" y="{ay+36}" font-size="18" font-weight="600" fill="{TOKENS['primary']}" text-anchor="middle">王</text>
  <text x="76" y="{ay+20}" font-size="14" font-weight="600" fill="{TOKENS['text_primary']}">王五</text>
  <text x="76" y="{ay+38}" font-size="12" fill="{TOKENS['text_secondary']}">华北理工大学 · 计算机学院</text>
  <rect x="76" y="{ay+44}" width="80" height="16" rx="4" fill="{TOKENS['success_light']}"/>
  <text x="116" y="{ay+55}" font-size="10" fill="{TOKENS['success']}" text-anchor="middle">✓ 已认证学生</text>'''
    # Bottom action
    bay = h - 68
    body += f'''
  <rect x="0" y="{bay}" width="{W}" height="68" fill="{TOKENS['bg_surface']}"/>
  <rect x="16" y="{bay+12}" width="{W//2-24}" height="44" rx="6" fill="{TOKENS['bg_surface']}" stroke="{TOKENS['border']}" stroke-width="1.5"/>
  <text x="{W//4}" y="{bay+38}" font-size="14" font-weight="600" fill="{TOKENS['text_primary']}" text-anchor="middle">☆ 收藏</text>
  <rect x="{W//2+8}" y="{bay+12}" width="{W//2-24}" height="44" rx="6" fill="{TOKENS['primary']}"/>
  <text x="{3*W//4}" y="{bay+38}" font-size="14" font-weight="600" fill="#fff" text-anchor="middle">📋 复制联系方式</text>
  <line x1="0" y1="{bay+0.5}" x2="{W}" y2="{bay+0.5}" stroke="{TOKENS['border']}" stroke-width="1"/>'''
    return SVG(W, h, body)

# ====== Write files ======
screens = [
    ("01-home", screen_home()),
    ("02-career-list", screen_career_list()),
    ("03-secondhand-detail", screen_secondhand_detail()),
]

for name, svg in screens:
    path = os.path.join(out_dir, f"{name}.svg")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(svg)
    print(f"Written: {name}.svg ({len(svg)} bytes)")

print(f"\nDone! Files in: {out_dir}")
print(f"Drag these SVG files into Figma to import as editable layers.")
