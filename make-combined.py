# helpers.py - SVG generation functions

T = {'primary':'#2563EB','primary_light':'#DBEAFE','success':'#16A34A','success_light':'#DCFCE7','danger':'#DC2626','danger_light':'#FEE2E2','warning':'#F59E0B','warning_light':'#FEF3C7','bg_page':'#F3F4F6','bg_surface':'#FFFFFF','text_primary':'#111827','text_secondary':'#6B7280','text_tertiary':'#9CA3AF','border':'#E5E7EB'}
W,SB,NB,BN = 390,44,48,64

def svg(h,body,width=None):
    w = width or W
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">\n  <defs><style>text{{font-family:Inter,Noto Sans SC,sans-serif;}}</style></defs>\n{body}\n</svg>'

def r(x,y,w,h,f='#fff',rx=0):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{f}"/>\n'

def rb(x,y,w,h,f='#fff',rx=0,st='',sw=0):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{f}" stroke="{st}" stroke-width="{sw}"/>\n'

def tx(x,y,c,sz=13,wg='400',cl=None,an='start'):
    if cl is None: cl = T['text_primary']
    return f'<text x="{x}" y="{y}" font-size="{sz}" font-weight="{wg}" fill="{cl}" text-anchor="{an}">{c}</text>\n'

def ln(x1,y1,x2,y2,cl=None):
    if cl is None: cl = T['border']
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{cl}" stroke-width="1"/>\n'

def cc(cx,cy,rr,fl=None):
    if fl is None: fl = T['primary']
    return f'<circle cx="{cx}" cy="{cy}" r="{rr}" fill="{fl}"/>\n'

def mk_sb():
    return r(0,0,W,SB,T['bg_surface'])+tx(24,28,'9:41',14,'700')

def mk_nb(ti,le='',ri='',rc=None):
    rc = rc or T['primary']; s = r(0,SB,W,NB,T['bg_surface'])+ln(0,SB+NB,W,SB+NB)
    if le: s += tx(16,SB+30,le,14,'400',rc)
    if ti: s += tx(W//2,SB+30,ti,16,'600',T['text_primary'],'middle')
    if ri: s += tx(W-16,SB+30,ri,14,'600',rc,'end')
    return s

def mk_tag(x,y,lb,md):
    dd={'career':(T['primary_light'],T['primary']),'rental':(T['success_light'],T['success']),'secondhand':(T['danger_light'],T['danger']),'life':(T['warning_light'],'#D97706')}
    bg,fg=dd.get(md,dd['life']); tw=len(lb)*12+4
    return r(x,y,tw,24,bg,12)+tx(x+tw//2,y+16,lb,10,'600',fg,'middle')

def mk_ac(y,nm,dp,sc,bdg,ab=None,ac=None):
    ab = ab or T['primary_light']; ac = ac or T['primary']
    s = r(16,y,W-32,60,'#F9FAFB',12)+cc(44,y+30,22,ab)+tx(44,y+36,nm[0],18,'600',ac,'middle')
    s += tx(76,y+20,nm,14,'600')+tx(76,y+38,dp+' / '+sc,12,'400',T['text_secondary'])
    s += r(76,y+44,80,16,T['success_light'],4)+tx(116,y+55,bdg,10,'400',T['success'],'middle')
    return s

def mk_ba(y,ll,rl):
    s = r(0,y,W,68,T['bg_surface'])+ln(0,y,W,y); hw=W//2-24
    s += rb(16,y+12,hw,44,T['bg_surface'],6,T['border'],2)+tx(W//4,y+38,ll,14,'600',T['text_primary'],'middle')
    s += rb(W//2+8,y+12,hw,44,T['primary'],6)+tx(3*W//4,y+38,rl,14,'600','#fff','middle')
    return s

def mk_bn(y,a=0):
    items=['首页','求职','发布','消息','我的']
    s = r(0,y,W,BN,T['bg_surface'])+ln(0,y,W,y)
    for i,lb in enumerate(items):
        cx=(W//5)*i+W//10;cl=T['primary'] if i==a else T['text_tertiary']
        if i==2: s+=cc(cx,y+18,22,T['primary'])+tx(cx,y+24,'+',18,'700','#fff','middle')
        s+=tx(cx,y+50,lb,10,'400',cl,'middle')
    return s

def mtabs(y,tabs,active=0):
    s = r(0,y,W,38,T['bg_surface'])+ln(0,y+37,W,y+37)
    x = 0
    for i,(lb,c) in enumerate(tabs):
        cl = c if i==active else T['text_secondary']
        fw = '600' if i==active else '400'
        s += tx(x+16,y+25,lb,13,fw,cl)
        if i==active: s += r(x+16,y+36,60,2,c)
        x += 76
    return s



# ==== SCREEN GENERATION ====
import os, sys
sys.path.insert(0, r'"$PWD"')
# helpers loaded below *

out_dir = r'"$PWD"\prototypes\svg-screens'
os.makedirs(out_dir, exist_ok=True)

# ====== S04: Food Detail ======
h = SB+NB+260+90+16+60+68
s = mk_sb()+mk_nb('',right='')+tx(W-40,SB+30,'\u22ef',20,'400',T['text_secondary'],'end')
cy = SB+NB
s += r(0,cy,W,260,T['warning_light'])+tx(W//2,cy+120,'\U0001f35c',64,'400',T['text_tertiary'],'middle')+tx(W//2,cy+145,'\u91cd\u5e86\u5c0f\u9762',13,'600','#92400E','middle')
s += r(W//2-6,cy+240,18,6,'#fff',3)+cc(W//2-16,cy+243,3,'rgba(255,255,255,0.5)')
by = cy+260
s += r(0,by,W,90,T['bg_surface'])+mk_tag(16,by+14,'\u7f8e\u98df','life')
s += tx(16,by+44,'\u7d2b\u91d1\u6e2f\u98df\u5802\u4e09\u697c \u91cd\u5e86\u5c0f\u9762',20,'600')
s += tx(16,by+70,'\u2605\u2605\u2605\u2605\u2606',20,'400',T['warning'])+tx(16+22*5+4,by+70,'4.0',16,'600',T['warning'])
dy = by+90+16
s += r(0,dy,W,60,T['bg_surface'])+tx(16,dy+20,'\U0001f4cd \u7d2b\u91d1\u6e2f\u98df\u5802\u4e09\u697c \u00b7 11\u53f7\u6863\u53e3',13,'400',T['text_secondary'])
ay = dy+60
s += mk_ac(ay,'\u674e\u601d\u601d','\u7ecf\u7ba1\u5b66\u9662','\u534e\u5317\u7406\u5de5\u5927\u5b66','\u2713 \u5df2\u8ba4\u8bc1\u5b66\u751f',T['warning_light'],'#D97706')
bay = h-68
s += r(0,bay,W,68,T['bg_surface'])+ln(0,bay,W,bay)
s += rb(16,bay+12,W//2-24,44,T['bg_surface'],6,T['border'],2)+tx(W//4,bay+38,'\u2606 \u6536\u85cf',14,'600',T['text_primary'],'middle')
s += rb(W//2+8,bay+12,W//2-24,44,T['bg_surface'],6,T['border'],2)+tx(3*W//4,bay+38,'\U0001f4dd \u6211\u4e5f\u8981\u63a8\u8350',14,'600',T['text_primary'],'middle')
open(os.path.join(out_dir,'04-food-detail.svg'),'w',encoding='utf-8').write(svg(h,s))
print('04-food-detail done')

# ====== S05: Career Detail ======
h = SB+NB+200+200+16+60+68
s = mk_sb()+mk_nb('',right='')+tx(W-40,SB+30,'\u22ef',20,'400',T['text_secondary'],'end')
cy = SB+NB
s += r(0,cy,W,200,T['primary_light'])+tx(W//2,cy+90,'\U0001f4bc',64,'400','#1E40AF','middle')+tx(W//2,cy+115,'\u5b57\u8282\u8df3\u52a8',13,'600','#1E40AF','middle')
by = cy+200
s += r(0,by,W,200,T['bg_surface'])+mk_tag(16,by+14,'\u6821\u62db','career')
s += r(58,by+14,36,24,'#F3F4F6',12)+tx(76,by+30,'\u5185\u63a8',10,'600',T['text_secondary'],'middle')
s += tx(16,by+48,'\u5b57\u8282\u8df3\u52a8 \u540e\u7aef\u5f00\u53d1\u5b9e\u4e60\u751f',20,'600')
s += tx(16,by+72,'\U0001f4cc \u6709\u6548\u671f\u81f3 2026/06/30',14,'400',T['danger'])
s += r(16,by+96,W-32,60,'#F9FAFB',8)+tx(28,by+114,'\u5185\u63a8\u7801',12,'400',T['text_secondary'])+tx(28,by+134,'BT2026XYZ',20,'700',T['primary'])
s += tx(16,by+180,'\u5b57\u8282\u6296\u97f3\u7535\u5546\u56e2\u961f\u62db\u540e\u7aef\u5b9e\u4e60\u751f',13,'400',T['text_secondary'])
ay = by+200+16
s += mk_ac(ay,'\u5f20\u4e09','\u8ba1\u7b97\u673a\u5b66\u9662','\u534e\u5317\u7406\u5de5\u5927\u5b66 \u00b7 2024\u5c4a','\u2713 \u5df2\u8ba4\u8bc1\u6821\u53cb')
bay = h-68
s += mk_ba(bay,'\u2606 \u6536\u85cf','\U0001f4cb \u590d\u5236\u5185\u63a8\u7801')
open(os.path.join(out_dir,'05-career-detail.svg'),'w',encoding='utf-8').write(svg(h,s))
print('05-career-detail done')

# ====== S06: Rental Detail ======
h = SB+NB+200+120+16+60+68
s = mk_sb()+mk_nb('',right='')+tx(W-40,SB+30,'\u22ef',20,'400',T['text_secondary'],'end')
cy = SB+NB
s += r(0,cy,W,200,T['success_light'])+tx(W//2,cy+90,'\U0001f3e0',64,'400','#166534','middle')
by = cy+200
s += r(0,by,W,120,T['bg_surface'])+mk_tag(16,by+14,'\u79df\u623f','rental')
s += tx(16,by+44,'\u7d2b\u91d1\u6e2f\u5468\u8fb9\u5355\u95f4\u8f6c\u79df',20,'600')+tx(16,by+72,'\uffe51200/\u6708',24,'700',T['danger'])
s += tx(16,by+100,'\U0001f3e2 \u7d2b\u91d1\u6e2f\u65b0\u6751 \u00b7 1\u5ba40\u5385 \u00b7 25\u33a1',13,'400',T['text_secondary'])
ay = by+120+16
s += mk_ac(ay,'\u9648\u5927\u9e4f','\u673a\u68b0\u5b66\u9662','\u534e\u5317\u7406\u5de5\u5927\u5b66 \u00b7 2026\u5c4a','\u2713 \u5df2\u8ba4\u8bc1\u5b66\u751f',T['success_light'],'#166534')
bay = h-68
s += mk_ba(bay,'\u2606 \u6536\u85cf','\U0001f4cb \u590d\u5236\u8054\u7cfb\u65b9\u5f0f')
open(os.path.join(out_dir,'06-rental-detail.svg'),'w',encoding='utf-8').write(svg(h,s))
print('06-rental-detail done')

# ====== S07: Publish Food ======
h = SB+NB+420
s = mk_sb()+mk_nb('\u53d1\u5e03\u7f8e\u98df\u63a8\u8350',le='\u2715 \u53d6\u6d88',ri='\u53d1\u5e03 \u2192',rc=T['danger'])
fy = SB+NB+16
s += tx(16,fy,'\u9910\u5385/\u6863\u53e3\u540d *',14,'600')+rb(16,fy+28,W-32,44,T['bg_surface'],8,T['border'],1)+tx(28,fy+42,'\u4f8b\u5982\uff1a\u7d2b\u91d1\u6e2f\u98df\u5802\u4e09\u697c \u91cd\u5e86\u5c0f\u9762',14,'400',T['text_tertiary'])
s += tx(16,fy+90,'\u8bc4\u5206 *',14,'600')
for i in range(5): ch = '\u2605' if i<4 else '\u2606'; cl = T['warning'] if i<4 else T['text_tertiary']; s += tx(16+i*32,fy+110,ch,28,'400',cl)
s += tx(16,fy+160,'\u6dfb\u52a0\u7167\u7247 (\u6700\u591a9\u5f20)',14,'600')
for i in range(3): cx=16+i*(W-48)//3+i*8; s += rb(cx,fy+188,(W-48)//3,(W-48)//3,'#F9FAFB',8,T['border'],1)
taY = fy+188+(W-48)//3+20
s += tx(16,taY,'\u8bc4\u4ef7 *',14,'600')+rb(16,taY+28,W-32,100,T['bg_surface'],8,T['border'],1)+tx(28,taY+42,'\u8bf4\u8bf4\u8fd9\u5bb6\u5e97\u600e\u4e48\u6837...',14,'400',T['text_tertiary'])
open(os.path.join(out_dir,'07-publish-food.svg'),'w',encoding='utf-8').write(svg(h,s))
print('07-publish-food done')

# ====== S08: Publish Career ======
h = SB+NB+400
s = mk_sb()+mk_nb('\u53d1\u5e03\u5185\u63a8\u4fe1\u606f',le='\u2715 \u53d6\u6d88',ri='\u53d1\u5e03 \u2192')
fy = SB+NB+16
for lb,ph in [('\u516c\u53f8\u540d\u79f0 *','\u4f8b\u5982\uff1a\u5b57\u8282\u8df3\u52a8'),('\u5c97\u4f4d\u540d\u79f0 *','\u4f8b\u5982\uff1a\u540e\u7aef\u5f00\u53d1\u5b9e\u4e60\u751f'),('\u5185\u63a8\u7801','\u8f93\u5165\u5185\u63a8\u7801')]:
    s += tx(16,fy,lb,14,'600')+rb(16,fy+28,W-32,44,T['bg_surface'],8,T['border'],1)+tx(28,fy+42,ph,14,'400',T['text_tertiary']); fy+=88
s += tx(16,fy,'\u5c97\u4f4d\u63cf\u8ff0',14,'600')+rb(16,fy+28,W-32,80,T['bg_surface'],8,T['border'],1); fy+=124
s += tx(16,fy,'\u6709\u6548\u671f *',14,'600')+rb(16,fy+28,W-32,44,T['bg_surface'],8,T['border'],1)+tx(28,fy+42,'\u9009\u62e9\u65e5\u671f',14,'400',T['text_tertiary'])
open(os.path.join(out_dir,'08-publish-career.svg'),'w',encoding='utf-8').write(svg(h,s))
print('08-publish-career done')

# ====== S09: Publish Secondhand ======
h = SB+NB+300
s = mk_sb()+mk_nb('\u53d1\u5e03\u4e8c\u624b',le='\u2715 \u53d6\u6d88',ri='\u53d1\u5e03 \u2192')
fy = SB+NB+16
s += tx(16,fy,'\u5206\u7c7b *',14,'600')
s += r(16,fy+28,56,28,T['danger_light'],99)+tx(44,fy+34,'\u4e66\u672c',12,'600',T['danger'],'middle')
s += r(80,fy+28,72,28,'#F3F4F6',99)+tx(116,fy+34,'\u751f\u6d3b\u7528\u54c1',12,'600',T['text_secondary'],'middle')
s += tx(16,fy+76,'\u6807\u9898 *',14,'600')+rb(16,fy+100,W-32,44,T['bg_surface'],8,T['border'],1)+tx(28,fy+114,'\u4f8b\u5982\uff1a\u51e0\u4e4e\u5168\u65b0\u6570\u636e\u7ed3\u6784\u6559\u6750',14,'400',T['text_tertiary'])
s += tx(16,fy+160,'\u4ef7\u683c *',14,'600')+rb(16,fy+184,W-32,44,T['bg_surface'],8,T['border'],1)+tx(28,fy+198,'\uffe5 15',14,'400',T['text_tertiary'])
open(os.path.join(out_dir,'09-publish-secondhand.svg'),'w',encoding='utf-8').write(svg(h,s))
print('09-publish-secondhand done')

# ====== S10: Publish Rental ======
h = SB+NB+360
s = mk_sb()+mk_nb('\u53d1\u5e03\u623f\u6e90',le='\u2715 \u53d6\u6d88',ri='\u53d1\u5e03 \u2192')
fy = SB+NB+16
for lb,ph in [('\u6807\u9898 *','\u4f8b\u5982\uff1a\u7d2b\u91d1\u6e2f\u5468\u8fb9\u5355\u95f4\u8f6c\u79df'),('\u533a\u57df/\u5c0f\u533a *','\u4f8b\u5982\uff1a\u7d2b\u91d1\u6e2f\u65b0\u6751')]:
    s += tx(16,fy,lb,14,'600')+rb(16,fy+28,W-32,44,T['bg_surface'],8,T['border'],1)+tx(28,fy+42,ph,14,'400',T['text_tertiary']); fy+=88
s += tx(16,fy,'\u6708\u79df\u91d1 *',14,'600')+rb(16,fy+28,(W-48)//2,44,T['bg_surface'],8,T['border'],1)+tx(28,fy+42,'\uffe5 1200',14,'400',T['text_tertiary'])
s += tx(16+(W-48)//2+16,fy,'\u6237\u578b',14,'600')+rb(16+(W-48)//2+16,fy+28,(W-48)//2,44,T['bg_surface'],8,T['border'],1)+tx(28+(W-48)//2+16,fy+42,'1\u5ba40\u5385',14,'400',T['text_tertiary'])
open(os.path.join(out_dir,'10-publish-rental.svg'),'w',encoding='utf-8').write(svg(h,s))
print('10-publish-rental done')

# ====== S11: Login ======
h = SB+NB+440
s = mk_sb()+mk_nb('\u767b\u5f55',le='\u2190 \u8fd4\u56de')
ly = SB+NB+80
s += tx(W//2,ly,'\U0001f3eb',48,'400',T['text_primary'],'middle')+tx(W//2,ly+60,'\u6b22\u8fce\u6765\u5230\u6821\u56ed\u901a',22,'700',T['text_primary'],'middle')
s += tx(W//2,ly+90,'\u6821\u56ed\u751f\u6d3b\uff0c\u4e00\u7ad9\u805a\u5408',13,'400',T['text_secondary'],'middle')
piY = ly+130
s += rb(32,piY,W-64,48,T['bg_surface'],8,T['border'],1)+tx(48,piY+30,'\u8bf7\u8f93\u5165\u624b\u673a\u53f7',14,'400',T['text_tertiary'])
ciY = piY+64
s += rb(32,ciY,W-160,48,T['bg_surface'],8,T['border'],1)+tx(48,ciY+30,'\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801',14,'400',T['text_tertiary'])
s += rb(W-120,ciY,88,48,T['bg_surface'],8,T['border'],1)+tx(W-76,ciY+30,'\u83b7\u53d6\u9a8c\u8bc1\u7801',13,'600',T['primary'],'middle')
lbY = ciY+64
s += rb(32,lbY,W-64,48,T['primary'],6)+tx(W//2,lbY+30,'\u767b\u5f55 / \u6ce8\u518c',16,'600','#fff','middle')
s += tx(W//2,lbY+70,'\u767b\u5f55\u5373\u8868\u793a\u540c\u610f\u300a\u7528\u6237\u534f\u8bae\u300b\u548c\u300a\u9690\u79c1\u653f\u7b56\u300b',11,'400',T['text_tertiary'],'middle')
open(os.path.join(out_dir,'11-login.svg'),'w',encoding='utf-8').write(svg(h,s))
print('11-login done')

# ====== S12: Verify ======
h = SB+NB+420
s = mk_sb()+mk_nb('\u6821\u56ed\u8ba4\u8bc1',le='\u2190 \u8fd4\u56de')
vy = SB+NB+40
s += tx(W//2,vy,'\U0001f393',56,'400',T['text_primary'],'middle')+tx(W//2,vy+70,'\u9a8c\u8bc1\u4f60\u7684\u6821\u56ed\u8eab\u4efd',20,'700',T['text_primary'],'middle')
s += tx(W//2,vy+100,'\u8ba4\u8bc1\u540e\u5373\u53ef\u53d1\u5e03\u5185\u5bb9\uff0c\u5e76\u83b7\u5f97\u2713\u8ba4\u8bc1\u6807\u8bc6',13,'400',T['text_secondary'],'middle')
steps = ['\u9009\u62e9\u4f60\u7684\u5b66\u6821\uff1a\u534e\u5317\u7406\u5de5\u5927\u5b66','\u8f93\u5165\u4f60\u7684 edu \u90ae\u7bb1\uff08\u5982 student@ncst.edu.cn\uff09','\u70b9\u51fb\u53d1\u9001\u9a8c\u8bc1\u90ae\u4ef6\uff0c\u5728\u90ae\u7bb1\u4e2d\u786e\u8ba4\u5373\u53ef\u5b8c\u6210\u8ba4\u8bc1']
sy = vy+140
for i,st in enumerate(steps):
    s += cc(48,sy+11,11,T['primary_light'])+tx(48,sy+16,str(i+1),12,'700',T['primary'],'middle')+tx(64,sy+16,st,13,'400',T['text_secondary']); sy+=38
s += rb(32,sy+10,W-64,48,T['bg_surface'],8,T['border'],1)+tx(48,sy+40,'\u8bf7\u8f93\u5165 edu \u90ae\u7bb1',14,'400',T['text_tertiary'])
s += rb(32,sy+74,W-64,48,T['primary'],6)+tx(W//2,sy+100,'\u53d1\u9001\u9a8c\u8bc1\u90ae\u4ef6',16,'600','#fff','middle')
open(os.path.join(out_dir,'12-verify.svg'),'w',encoding='utf-8').write(svg(h,s))
print('12-verify done')

# ====== S13: Profile ======
h = SB+NB+230+38+4*53+BN
s = mk_sb()+mk_nb('\u6211\u7684',le='',ri='\u2699',rc=T['text_secondary'])
hy = SB+NB
s += r(0,hy,W,230,T['bg_surface'])+cc(W//2,hy+72,40,T['primary_light'])+tx(W//2,hy+86,'\u5f20',32,'600',T['primary'],'middle')
s += tx(W//2,hy+140,'\u5f20\u4e09',18,'600',T['text_primary'],'middle')+r(W//2-40,hy+148,80,18,T['success_light'],4)+tx(W//2,hy+162,'\u2713 \u5df2\u8ba4\u8bc1',10,'400',T['success'],'middle')
s += tx(W//2,hy+178,'\u534e\u5317\u7406\u5de5\u5927\u5b66 \u00b7 \u8ba1\u7b97\u673a\u5b66\u9662',13,'400',T['text_secondary'],'middle')
s += ln(W//2,hy+190,W//2,hy+220)
s += tx(W//4,hy+210,'12',20,'700',T['text_primary'],'middle')+tx(W//4,hy+226,'\u6211\u7684\u53d1\u5e03',11,'400',T['text_secondary'],'middle')
s += tx(3*W//4,hy+210,'5',20,'700',T['text_primary'],'middle')+tx(3*W//4,hy+226,'\u6536\u85cf',11,'400',T['text_secondary'],'middle')
ty = hy+230
s += r(0,ty,W,38,T['bg_surface'])+tx(W//4,ty+25,'\u6211\u7684\u53d1\u5e03',13,'600',T['primary'],'middle')+r(W//4-30,ty+36,60,2,T['primary'])
s += tx(3*W//4,ty+25,'\u6536\u85cf',13,'400',T['text_secondary'],'middle')+ln(0,ty+37,W,ty+37)
posts = [('\u6821\u62db','career','\u5b57\u8282\u8df3\u52a8\u540e\u7aef\u5185\u63a8','5\u5929\u524d \u00b7 \u5df2\u53d1\u5e03'),('\u4e8c\u624b','secondhand','\u6570\u636e\u7ed3\u6784\u6559\u6750','2\u5929\u524d \u00b7 \u5df2\u53d1\u5e03'),('\u7f8e\u98df','life','\u98df\u5802\u4e09\u697c\u91cd\u5e86\u5c0f\u9762','1\u5468\u524d \u00b7 \u5df2\u53d1\u5e03'),('\u79df\u623f','rental','\u7d2b\u91d1\u6e2f\u5355\u95f4\u8f6c\u79df','2\u5468\u524d \u00b7 \u5df2\u51fa\u79df')]
py = ty+38
for tg,md,ti,tm in posts:
    s += r(0,py,W,52,T['bg_surface'])+ln(0,py+52,W,py+52)
    s += mk_tag(16,py+14,tg,md)+tx(62,py+28,ti,15,'600')+tx(W-16,py+44,tm,11,'400',T['text_tertiary'],'end'); py+=53
s += mk_bn(h-BN,4)
open(os.path.join(out_dir,'13-profile.svg'),'w',encoding='utf-8').write(svg(h,s))
print('13-profile done')

# ====== S14: Rental List ======
h = SB+NB+54+300
s = mk_sb()+mk_nb('\u79df\u623f\u627e\u623f',ri='\u53d1\u5e03')
sy = SB+NB+8; s += r(16,sy,W-32,38,'#F0F0F0',8)+tx(40,sy+24,'\U0001f50d \u641c\u7d22\u533a\u57df/\u5c0f\u533a...',13,'400',T['text_tertiary'])
cards = [('\u7d2b\u91d1\u6e2f\u5468\u8fb9\u5355\u95f4','\uffe51200/\u6708','1\u5ba40\u5385 \u00b7 \u66f9\u5983\u7538'),('\u7389\u5170\u82d1\u4e24\u5ba4\u4e00\u5385\u6574\u79df','\uffe52200/\u6708','2\u5ba41\u5385 \u00b7 \u6b65\u884c5\u5206\u949f'),('\u7ff0\u6797\u82d1\u4e3b\u5367\u5e26\u72ec\u536b','\uffe51500/\u6708','3\u5ba42\u5385 \u00b7 \u4e3b\u5367'),('\u6821\u5185\u5bb6\u5c5e\u697c\u6b21\u5367','\uffe5900/\u6708','2\u5ba41\u5385 \u00b7 \u6821\u5185')]
cw = (W-36)//2; gy = sy+46
for i,(ti,pr,mt) in enumerate(cards):
    cx = 12+(i%2)*(cw+12); cy2 = gy+(i//2)*150
    s += r(cx,cy2,cw,138,T['bg_surface'],8)
    s += r(cx,cy2,cw,int(cw*0.75),T['success_light'])
    s += tx(cx+12,cy2+int(cw*0.75)+22,ti,13,'600')+tx(cx+12,cy2+int(cw*0.75)+44,pr,14,'700',T['danger'])+tx(cx+12,cy2+int(cw*0.75)+62,mt,11,'400',T['text_secondary'])
open(os.path.join(out_dir,'14-rental-list.svg'),'w',encoding='utf-8').write(svg(h,s))
print('14-rental-list done')

print(f'\nAll 14 screens in: {out_dir}')
