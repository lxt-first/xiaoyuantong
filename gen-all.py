import os
out_dir = r'C:\Users\86153\Documents\Codex\2026-06-12\new-chat\xiaoyuantong\prototypes\svg-screens'
os.makedirs(out_dir, exist_ok=True)

T = {'primary':'#2563EB','primary_light':'#DBEAFE','success':'#16A34A','success_light':'#DCFCE7','danger':'#DC2626','danger_light':'#FEE2E2','warning':'#F59E0B','warning_light':'#FEF3C7','bg_page':'#F3F4F6','bg_surface':'#FFFFFF','text_primary':'#111827','text_secondary':'#6B7280','text_tertiary':'#9CA3AF','border':'#E5E7EB'}
W=390;SB=44;NB=48;BN=64

def svg(h,body):
    return '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"'+str(W)+'\" height=\"'+str(h)+'\" viewBox=\"0 0 '+str(W)+' '+str(h)+'\">\n  <defs><style>text{font-family:Inter,Noto Sans SC,sans-serif;}</style></defs>\n'+body+'\n</svg>'

def r(x,y,w,h,f='#fff',rx=0): return f'<rect x=\"{x}\" y=\"{y}\" width=\"{w}\" height=\"{h}\" rx=\"{rx}\" fill=\"{f}\"/>\n'
def rb(x,y,w,h,f='#fff',rx=0,st='',sw=0): return f'<rect x=\"{x}\" y=\"{y}\" width=\"{w}\" height=\"{h}\" rx=\"{rx}\" fill=\"{f}\" stroke=\"{st}\" stroke-width=\"{sw}\"/>\n'
def tx(x,y,c,sz=13,wg='400',cl=None,an='start'):
    if cl is None: cl=T['text_primary']
    return f'<text x=\"{x}\" y=\"{y}\" font-size=\"{sz}\" font-weight=\"{wg}\" fill=\"{cl}\" text-anchor=\"{an}\">{c}</text>\n'
def ln(x1,y1,x2,y2): return f'<line x1=\"{x1}\" y1=\"{y1}\" x2=\"{x2}\" y2=\"{y2}\" stroke=\"{T['border']}\" stroke-width=\"1\"/>\n'
def cc(cx,cy,rr,fl=T['primary']): return f'<circle cx=\"{cx}\" cy=\"{cy}\" r=\"{rr}\" fill=\"{fl}\"/>\n'

def sb(): return r(0,0,W,SB,T['bg_surface'])+tx(24,28,'9:41',14,'700')

def nb(ti,le='',ri='',rc=None):
    rc=rc or T['primary']; s=r(0,SB,W,NB,T['bg_surface'])+ln(0,SB+NB,W,SB+NB)
    if le: s+=tx(16,SB+30,le,14,'400',rc)
    if ti: s+=tx(W//2,SB+30,ti,16,'600',T['text_primary'],'middle')
    if ri: s+=tx(W-16,SB+30,ri,14,'600',rc,'end')
    return s

def tag(x,y,lb,md):
    dd={'career':(T['primary_light'],T['primary']),'rental':(T['success_light'],T['success']),'secondhand':(T['danger_light'],T['danger']),'life':(T['warning_light'],'#D97706')}
    bg,fg=dd.get(md,dd['life']); tw=len(lb)*12+4
    return r(x,y,tw,24,bg,12)+tx(x+tw//2,y+16,lb,10,'600',fg,'middle')

def ac(y,nm,dp,sc,bdg,ab=T['primary_light'],ac=T['primary']):
    s=r(16,y,W-32,60,'#F9FAFB',12)+cc(44,y+30,22,ab)+tx(44,y+36,nm[0],18,'600',ac,'middle')
    s+=tx(76,y+20,nm,14,'600')+tx(76,y+38,dp+' / '+sc,12,'400',T['text_secondary'])
    s+=r(76,y+44,80,16,T['success_light'],4)+tx(116,y+55,bdg,10,'400',T['success'],'middle')
    return s

def ba(y,ll,rl):
    s=r(0,y,W,68,T['bg_surface'])+ln(0,y,W,y); hw=W//2-24
    s+=rb(16,y+12,hw,44,T['bg_surface'],6,T['border'],2)+tx(W//4,y+38,ll,14,'600',T['text_primary'],'middle')
    s+=rb(W//2+8,y+12,hw,44,T['primary'],6)+tx(3*W//4,y+38,rl,14,'600','#fff','middle')
    return s

def bn(y,a=0):
    items=[u'\u9996\u9875',u'\u6c42\u804c',u'\u53d1\u5e03',u'\u6d88\u606f',u'\u6211\u7684']
    s=r(0,y,W,BN,T['bg_surface'])+ln(0,y,W,y)
    for i,lb in enumerate(items):
        cx=(W//5)*i+W//10;cl=T['primary'] if i==a else T['text_tertiary']
        if i==2: s+=cc(cx,y+18,22,T['primary'])+tx(cx,y+24,'+',18,'700','#fff','middle')
        s+=tx(cx,y+50,lb,10,'400',cl,'middle')
    return s

print('Functions defined. Ready to generate screens.')