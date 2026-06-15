import os

out_dir = r"C:\Users\86153\Documents\Codex\2026-06-12\new-chat\xiaoyuantong\prototypes\svg-screens"

T = {"primary":"#2563EB","primary_light":"#DBEAFE","success":"#16A34A","success_light":"#DCFCE7","danger":"#DC2626","danger_light":"#FEE2E2","warning":"#F59E0B","warning_light":"#FEF3C7","bg_page":"#F3F4F6","bg_surface":"#FFFFFF","text_primary":"#111827","text_secondary":"#6B7280","text_tertiary":"#9CA3AF","border":"#E5E7EB"}
W=390;H_STATUSBAR=44;H_NAVBAR=48;H_BOTTOMNAV=64
F='"Inter, Noto Sans SC, -apple-system, sans-serif"'

def svg(w,h,body):
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">\n  <defs><style>text{{font-family: {F};}}</style></defs>\n{body}\n</svg>'

def text(x,y,content,size=13,weight="400",color=T["text_primary"],anchor="start"):
    return f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{weight}" fill="{color}" text-anchor="{anchor}">{content}</text>\n'

def rect(x,y,w,h,fill="#fff",rx=0,stroke="",sw=0):
    s=f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"{s}/>\n'

def line(x1,y1,x2,y2,color=T["border"]):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="1"/>\n'

def circle(cx,cy,r,fill=T["primary"]):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"/>\n'

def status_bar():
    return rect(0,0,W,H_STATUSBAR,T["bg_surface"])+text(24,28,"9:41",14,"700")

def nav_bar(title,left="← 返回",right="",rc=T["primary"]):
    s=rect(0,H_STATUSBAR,W,H_NAVBAR,T["bg_surface"])+line(0,H_STATUSBAR+H_NAVBAR-0.5,W,H_STATUSBAR+H_NAVBAR-0.5)
    if left: s+=text(16,H_STATUSBAR+30,left,14,"400",rc)
    if title: s+=text(W//2,H_STATUSBAR+30,title,16,"600",T["text_primary"],"middle")
    if right: s+=text(W-16,H_STATUSBAR+30,right,14,"600",rc,"end")
    return s

def mod_tag(x,y,label,mod):
    d={"career":(T["primary_light"],T["primary"]),"rental":(T["success_light"],T["success"]),"secondhand":(T["danger_light"],T["danger"]),"life":(T["warning_light"],"#D97706")}
    bg,fg=d.get(mod,d["life"])
    tw=len(label)*12+4
    return rect(x,y,tw,24,bg,12)+text(x+tw//2,y+16,label,10,"600",fg,"middle")

def bottom_nav(y,active=0):
    items=["首页","求职","发布","消息","我的"]
    s=rect(0,y,W,H_BOTTOMNAV,T["bg_surface"])+line(0,y+0.5,W,y+0.5)
    for i,lb in enumerate(items):
        cx=(W//5)*i+W//10;c=T["primary"] if i==active else T["text_tertiary"]
        if i==2:s+=circle(cx,y+18,22,T["primary"])+text(cx,y+24,"+",18,"700","#fff","middle")
        s+=text(cx,y+50,lb,10,"400",c,"middle")
    return s

def author_card(y,name,dept,school,badge_text,avatar_bg=T["primary_light"],avatar_color=T["primary"],av="??"):
    s=rect(16,y,W-32,60,"#F9FAFB",12)
    s+=circle(44,y+30,22,avatar_bg)+text(44,y+36,av,18,"600",avatar_color,"middle")
    s+=text(76,y+20,name,14,"600")+text(76,y+38,dept+" · "+school,12,"400",T["text_secondary"])
    s+=rect(76,y+44,80,16,T["success_light"],4)+text(116,y+55,badge_text,10,"400",T["success"],"middle")
    return s

def bottom_action(y,left_label,right_label):
    s=rect(0,y,W,68,T["bg_surface"])+line(0,y+0.5,W,y+0.5)
    s+=rect(16,y+12,W//2-24,44,T["bg_surface"],6,T["border"],1.5)
    s+=text(W//4,y+38,left_label,14,"600",T["text_primary"],"middle")
    s+=rect(W//2+8,y+12,W//2-24,44,T["primary"],6)
    s+=text(3*W//4,y+38,right_label,14,"600","#fff","middle")
    return s

# SCREEN 4: Food Detail
def s04_food_detail():
    h=H_STATUSBAR+H_NAVBAR+260+90+16+60+68
    s=status_bar()+nav_bar("",right="")
    s+=text(W-40,H_STATUSBAR+30,"?",20,"400",T["text_secondary"],"end")
    cy=H_STATUSBAR+H_NAVBAR
    s+=rect(0,cy,W,260,T["warning_light"])
    s+=text(W//2,cy+120,"??",64,"400",T["text_tertiary"],"middle")
    s+=text(W//2,cy+145,"重庆小面",13,"600","#92400E","middle")
    s+=rect(W//2-6,cy+240,18,6,"#fff",3)
    s+=circle(W//2-16,cy+243,3,"rgba(255,255,255,0.5)")
    by=cy+260
    s+=rect(0,by,W,90,T["bg_surface"])
    s+=mod_tag(16,by+14,"美食","life")
    s+=text(16,by+44,"紫金港食堂三楼 重庆小面",20,"600")
    stars="★"*4+"☆"
    s+=text(16,by+70,stars,20,"400",T["warning"])
    s+=text(16+22*5+4,by+70,"4.0",16,"600",T["warning"])
    dy=by+90+16
    s+=rect(0,dy,W,60,T["bg_surface"])
    s+=text(16,dy+20,"?? 紫金港食堂三楼 · 11号档口",13,"400",T["text_secondary"])
    ay=dy+60
    s+=author_card(ay,"李思思","经管学院","华北理工大学","? 已认证学生",T["warning_light"],"#D97706","李")
    bay=h-68
    s+=rect(0,bay,W,68,T["bg_surface"])+line(0,bay+0.5,W,bay+0.5)
    s+=rect(16,bay+12,W//2-24,44,T["bg_surface"],6,T["border"],1.5)
    s+=text(W//4,bay+38,"☆ 收藏",14,"600",T["text_primary"],"middle")
    s+=rect(W//2+8,bay+12,W//2-24,44,T["bg_surface"],6,T["border"],1.5)
    s+=text(3*W//4,bay+38,"?? 我也要推荐",14,"600",T["text_primary"],"middle")
    return svg(W,h,s)

# SCREEN 5: Career Detail
def s05_career_detail():
    h=H_STATUSBAR+H_NAVBAR+200+200+16+60+68
    s=status_bar()+nav_bar("",right="")
    s+=text(W-40,H_STATUSBAR+30,"?",20,"400",T["text_secondary"],"end")
    cy=H_STATUSBAR+H_NAVBAR
    s+=rect(0,cy,W,200,T["primary_light"])
    s+=text(W//2,cy+90,"??",64,"400","#1E40AF","middle")
    s+=text(W//2,cy+115,"字节跳动",13,"600","#1E40AF","middle")
    by=cy+200
    s+=rect(0,by,W,200,T["bg_surface"])
    s+=mod_tag(16,by+14,"校招","career")
    s+=rect(58,by+14,36,24,"#F3F4F6",12)+text(76,by+30,"内推",10,"600",T["text_secondary"],"middle")
    s+=text(16,by+48,"字节跳动 后端开发实习生",20,"600")
    s+=text(16,by+72,"?? 有效期至 2026/06/30",14,"400",T["danger"])
    s+=rect(16,by+96,W-32,60,"#F9FAFB",8)
    s+=text(28,by+114,"内推码",12,"400",T["text_secondary"])
    s+=text(28,by+134,"BT2026XYZ",20,"700",T["primary"])
    s+=text(16,by+180,"字节抖音电商团队招后端实习生",13,"400",T["text_secondary"])
    ay=by+200+16
    s+=author_card(ay,"张三","计算机学院","华北理工大学 · 2024届","? 已认证校友")
    bay=h-68
    s+=bottom_action(bay,"☆ 收藏","?? 复制内推码")
    return svg(W,h,s)

# SCREEN 6: Rental Detail
def s06_rental_detail():
    h=H_STATUSBAR+H_NAVBAR+200+120+16+60+68
    s=status_bar()+nav_bar("",right="")
    s+=text(W-40,H_STATUSBAR+30,"?",20,"400",T["text_secondary"],"end")
    cy=H_STATUSBAR+H_NAVBAR
    s+=rect(0,cy,W,200,T["success_light"])
    s+=text(W//2,cy+90,"??",64,"400","#166534","middle")
    by=cy+200
    s+=rect(0,by,W,120,T["bg_surface"])
    s+=mod_tag(16,by+14,"租房","rental")
    s+=text(16,by+44,"紫金港周边单间转租",20,"600")
    s+=text(16,by+72,"￥1200/月",24,"700",T["danger"])
    s+=text(16,by+100,"?? 紫金港新村 · 1室0厅 · 25㎡",13,"400",T["text_secondary"])
    ay=by+120+16
    s+=author_card(ay,"陈大鹏","机械学院","华北理工大学 · 2026届","? 已认证学生",T["success_light"],"#166534","陈")
    bay=h-68
    s+=bottom_action(bay,"☆ 收藏","?? 复制联系方式")
    return svg(W,h,s)

# SCREEN 7: Publish Food
def s07_publish_food():
    h=H_STATUSBAR+H_NAVBAR+420
    s=status_bar()+nav_bar("发布美食推荐",left="? 取消",right="发布 →",rc=T["danger"])
    fy=H_STATUSBAR+H_NAVBAR+16
    s+=text(16,fy,"餐厅/档口名 *",14,"600")+rect(16,fy+28,W-32,44,T["bg_surface"],8,T["border"],1)
    s+=text(28,fy+42,"例如：紫金港食堂三楼 重庆小面",14,"400",T["text_tertiary"])
    s+=text(16,fy+90,"评分 *",14,"600")
    for i in range(5):
        c=T["warning"] if i<4 else T["text_tertiary"]
        s+=text(16+i*32,fy+110,"★" if i<4 else "☆",28,"400",c)
    s+=text(16,fy+160,"添加照片 (最多9张)",14,"600")
    for i in range(3):
        cx=16+i*(W-48)//3+i*8
        s+=rect(cx,fy+188,(W-48)//3,(W-48)//3,"#F9FAFB",8,T["border"],0)
        s+=line(cx+4,fy+192,cx+(W-48)//3-4,fy+188+(W-48)//3-4,T["border"])
    taY=fy+188+(W-48)//3+20
    s+=text(16,taY,"评价 *",14,"600")+rect(16,taY+28,W-32,100,T["bg_surface"],8,T["border"],1)
    s+=text(28,taY+42,"说说这家店怎么样...",14,"400",T["text_tertiary"])
    return svg(W,h,s)

# SCREEN 8: Publish Career
def s08_publish_career():
    h=H_STATUSBAR+H_NAVBAR+400
    s=status_bar()+nav_bar("发布内推信息",left="? 取消",right="发布 →")
    fy=H_STATUSBAR+H_NAVBAR+16
    fields=[("公司名称 *","例如：字节跳动"),("岗位名称 *","例如：后端开发实习生"),("内推码","输入内推码")]
    y=fy
    for lb,ph in fields:
        s+=text(16,y,lb,14,"600")+rect(16,y+28,W-32,44,T["bg_surface"],8,T["border"],1)
        s+=text(28,y+42,ph,14,"400",T["text_tertiary"])
        y+=88
    s+=text(16,y,"岗位描述",14,"600")+rect(16,y+28,W-32,80,T["bg_surface"],8,T["border"],1)
    y+=124
    s+=text(16,y,"有效期 *",14,"600")+rect(16,y+28,W-32,44,T["bg_surface"],8,T["border"],1)
    s+=text(28,y+42,"选择日期",14,"400",T["text_tertiary"])
    return svg(W,h,s)

# SCREEN 9: Publish Secondhand
def s09_publish_secondhand():
    h=H_STATUSBAR+H_NAVBAR+300
    s=status_bar()+nav_bar("发布二手",left="? 取消",right="发布 →")
    fy=H_STATUSBAR+H_NAVBAR+16
    s+=text(16,fy,"分类 *",14,"600")
    s+=rect(16,fy+28,56,28,T["danger_light"],99)+text(44,fy+34,'书本",12,"600",T["danger"],"middle")
    s+=rect(80,fy+28,72,28,"#F3F4F6",99)+text(116,fy+34,"生活用品",12,"600",T["text_secondary"],"middle")
    s+=text(16,fy+76,"标题 *",14,"600")+rect(16,fy+100,W-32,44,T["bg_surface"],8,T["border"],1)
    s+=text(28,fy+114,"例如：几乎全新数据结构教材",14,"400",T["text_tertiary"])
    s+=text(16,fy+160,"价格 *",14,"600")+rect(16,fy+184,W-32,44,T["bg_surface"],8,T["border"],1)
    s+=text(28,fy+198,"￥ 15",14,"400",T["text_tertiary"])
    return svg(W,h,s)

# SCREEN 10: Publish Rental
def s10_publish_rental():
    h=H_STATUSBAR+H_NAVBAR+360
    s=status_bar()+nav_bar("发布房源",left="? 取消",right="发布 →")
    fy=H_STATUSBAR+H_NAVBAR+16
    fields=[("标题 *","例如：紫金港周边单间转租"),("区域/小区 *","例如：紫金港新村")]
    y=fy
    for lb,ph in fields:
        s+=text(16,y,lb,14,"600")+rect(16,y+28,W-32,44,T["bg_surface"],8,T["border"],1)
        s+=text(28,y+42,ph,14,"400",T["text_tertiary"])
        y+=88
    s+=text(16,y,"月租金 *",14,"600")+rect(16,y+28,(W-48)//2,44,T["bg_surface"],8,T["border"],1)
    s+=text(28,y+42,"￥ 1200",14,"400",T["text_tertiary"])
    s+=text(16+(W-48)//2+16,y,"户型",14,"600")+rect(16+(W-48)//2+16,y+28,(W-48)//2,44,T["bg_surface"],8,T["border"],1)
    s+=text(28+(W-48)//2+16,y+42,"1室0厅",14,"400",T["text_tertiary"])
    return svg(W,h,s)

# SCREEN 11: Login
def s11_login():
    h=H_STATUSBAR+H_NAVBAR+440
    s=status_bar()+nav_bar("登录",left="← 返回")
    ly=H_STATUSBAR+H_NAVBAR+80
    s+=text(W//2,ly,"??",48,"400",T["text_primary"],"middle")
    s+=text(W//2,ly+60,"欢迎来到校园通",22,"700",T["text_primary"],"middle")
    s+=text(W//2,ly+90,"校园生活，一站聚合",13,"400",T["text_secondary"],"middle")
    piY=ly+130
    s+=rect(32,piY,W-64,48,T["bg_surface"],8,T["border"],1)
    s+=text(48,piY+30,"请输入手机号",14,"400",T["text_tertiary"])
    ciY=piY+64
    s+=rect(32,ciY,W-160,48,T["bg_surface"],8,T["border"],1)
    s+=text(48,ciY+30,"请输入验证码",14,"400",T["text_tertiary"])
    s+=rect(W-120,ciY,88,48,T["bg_surface"],8,T["border"],1)
    s+=text(W-76,ciY+30,"获取验证码",13,"600",T["primary"],"middle")
    lbY=ciY+64
    s+=rect(32,lbY,W-64,48,T["primary"],6)
    s+=text(W//2,lbY+30,"登录 / 注册",16,"600","#fff","middle")
    s+=text(W//2,lbY+70,"登录即表示同意《用户协议》和《隐私政策》",11,"400",T["text_tertiary"],"middle")
    return svg(W,h,s)

# SCREEN 12: Verify
def s12_verify():
    h=H_STATUSBAR+H_NAVBAR+420
    s=status_bar()+nav_bar("校园认证",left="← 返回")
    vy=H_STATUSBAR+H_NAVBAR+40
    s+=text(W//2,vy,"??",56,"400",T["text_primary"],"middle")
    s+=text(W//2,vy+70,"验证你的校园身份",20,"700",T["text_primary"],"middle")
    s+=text(W//2,vy+100,"认证后即可发布内容，并获得?认证标识",13,"400",T["text_secondary"],"middle")
    steps=["选择你的学校：华北理工大学","输入你的 edu 邮箱（如 student@ncst.edu.cn）","点击发送验证邮件，在邮箱中确认即可完成认证"]
    sy=vy+140
    for i,step in enumerate(steps):
        s+=circle(48,sy+11,11,T["primary_light"])+text(48,sy+16,str(i+1),12,"700",T["primary"],"middle")
        s+=text(64,sy+16,step,13,"400",T["text_secondary"])
        sy+=38
    s+=rect(32,sy+10,W-64,48,T["bg_surface"],8,T["border"],1)
    s+=text(48,sy+40,"请输入 edu 邮箱",14,"400",T["text_tertiary"])
    s+=rect(32,sy+74,W-64,48,T["primary"],6)
    s+=text(W//2,sy+100,"发送验证邮件",16,"600","#fff","middle")
    return svg(W,h,s)

# SCREEN 13: Profile
def s13_profile():
    h=H_STATUSBAR+H_NAVBAR+230+38+4*53+H_BOTTOMNAV
    s=status_bar()+nav_bar("我的",left="",right="?",rc=T["text_secondary"])
    hy=H_STATUSBAR+H_NAVBAR
    s+=rect(0,hy,W,230,T["bg_surface"])
    s+=circle(W//2,hy+72,40,T["primary_light"])+text(W//2,hy+86,"张",32,"600",T["primary"],"middle")
    s+=text(W//2,hy+140,"张三",18,"600",T["text_primary"],"middle")
    s+=rect(W//2-40,hy+148,80,18,T["success_light"],4)+text(W//2,hy+162,"? 已认证",10,"400",T["success"],"middle")
    s+=text(W//2,hy+178,"华北理工大学 · 计算机学院",13,"400",T["text_secondary"],"middle")
    s+=line(W//2,hy+190,W//2,hy+220)
    s+=text(W//4,hy+210,"12",20,"700",T["text_primary"],"middle")+text(W//4,hy+226,"我的发布",11,"400",T["text_secondary"],"middle")
    s+=text(3*W//4,hy+210,"5",20,"700",T["text_primary"],"middle")+text(3*W//4,hy+226,"收藏",11,"400",T["text_secondary"],"middle")
    ty=hy+230
    s+=rect(0,ty,W,38,T["bg_surface"])
    s+=text(W//4,ty+25,"我的发布",13,"600",T["primary"],"middle")+rect(W//4-30,ty+36,60,2,T["primary"])
    s+=text(3*W//4,ty+25,"收藏",13,"400",T["text_secondary"],"middle")
    s+=line(0,ty+37.5,W,ty+37.5)
    posts=[("校招","career","字节跳动后端内推","5天前 · 已发布"),("二手","secondhand","数据结构教材","2天前 · 已发布"),("美食","life","食堂三楼重庆小面","1周前 · 已发布"),("租房","rental","紫金港单间转租","2周前 · 已出租")]
    py=ty+38
    for tag,mod,title,time in posts:
        s+=rect(0,py,W,52,T["bg_surface"])+line(0,py+52-0.5,W,py+52-0.5)
        s+=mod_tag(16,py+14,tag,mod)+text(62,py+28,title,15,"600")
        s+=text(W-16,py+44,time,11,"400",T["text_tertiary"],"end")
        py+=53
    s+=bottom_nav(h-H_BOTTOMNAV,4)
    return svg(W,h,s)

# SCREEN 14: Rental List
def s14_rental_list():
    h=H_STATUSBAR+H_NAVBAR+54+300
    s=status_bar()+nav_bar("租房找房",right="发布")
    sy=H_STATUSBAR+H_NAVBAR+8
    s+=rect(16,sy,W-32,38,"#F0F0F0",8)+text(40,sy+24,"?? 搜索区域/小区...",13,"400",T["text_tertiary"])
    cards=[("紫金港周边单间","￥1200/月","1室0厅 · 曹妃甸"),("玉兰苑两室一厅整租","￥2200/月","2室1厅 · 步行5分钟"),("翰林苑主卧带独卫","￥1500/月","3室2厅 · 主卧"),("校内家属楼次卧","￥900/月","2室1厅 · 校内")]
    cw=(W-36)//2
    gy=sy+46
    for i,(title,price,meta) in enumerate(cards):
        cx=12+(i%2)*(cw+12)
        cy2=gy+(i//2)*150
        s+=rect(cx,cy2,cw,138,T["bg_surface"],8,T["border"],1)
        s+=rect(cx,cy2,cw,int(cw*0.75),T["success_light"])
        s+=text(cx+12,cy2+int(cw*0.75)+22,title,13,"600")
        s+=text(cx+12,cy2+int(cw*0.75)+44,price,14,"700",T["danger"])
        s+=text(cx+12,cy2+int(cw*0.75)+62,meta,11,"400",T["text_secondary"])
    return svg(W,h,s)

# Write all remaining screens
screens=[
    ("04-food-detail",s04_food_detail()),
    ("05-career-detail",s05_career_detail()),
    ("06-rental-detail",s06_rental_detail()),
    ("07-publish-food",s07_publish_food()),
    ("08-publish-career",s08_publish_career()),
    ("09-publish-secondhand",s09_publish_secondhand()),
    ("10-publish-rental",s10_publish_rental()),
    ("11-login",s11_login()),
    ("12-verify",s12_verify()),
    ("13-profile",s13_profile()),
    ("14-rental-list",s14_rental_list()),
]
for name,svg_content in screens:
    path=os.path.join(out_dir,f"{name}.svg")
    with open(path,'w',encoding='utf-8') as f:
        f.write(svg_content)
    print(f"Written: {name}.svg ({len(svg_content)} bytes)")

print(f"\nAll 14 SVG screens generated in: {out_dir}")
