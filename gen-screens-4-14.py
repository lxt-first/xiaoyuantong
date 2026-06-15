import os
out_dir = r'C:\Users\86153\Documents\Codex\2026-06-12\new-chat\xiaoyuantong\prototypes\svg-screens'
os.makedirs(out_dir, exist_ok=True)

T = {'primary':'#2563EB','primary_light':'#DBEAFE','success':'#16A34A','success_light':'#DCFCE7','danger':'#DC2626','danger_light':'#FEE2E2','warning':'#F59E0B','warning_light':'#FEF3C7','bg_page':'#F3F4F6','bg_surface':'#FFFFFF','text_primary':'#111827','text_secondary':'#6B7280','text_tertiary':'#9CA3AF','border':'#E5E7EB'}
W=390;SB=44;NB=48;BN=64

def svg(w,h,body):
    return '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"'+str(w)+'\" height=\"'+str(h)+'\" viewBox=\"0 0 '+str(w)+' '+str(h)+'\">\n  <defs><style>text{font-family: Inter,Noto Sans SC,sans-serif;}</style></defs>\n'+body+'\n</svg>'

def t(x,y,c,sz=13,wg='400',cl=None,an='start'):
    if cl is None: cl = T['text_primary']
    return '<text x=\"'+str(x)+'\" y=\"'+str(y)+'\" font-size=\"'+str(sz)+'\" font-weight=\"'+wg+'\" fill=\"'+cl+'\" text-anchor=\"'+an+'\">'+c+'</text>\n'

def r(x,y,w,h,f='#fff',rx=0,st='',sw=0):
    s=' stroke=\"'+st+'\" stroke-width=\"'+str(sw)+'\"' if st else ''
    return '<rect x=\"'+str(x)+'\" y=\"'+str(y)+'\" width=\"'+str(w)+'\" height=\"'+str(h)+'\" rx=\"'+str(rx)+'\" fill=\"'+f+'\"'+s+'/>\n'

def l(x1,y1,x2,y2,cl=None):
    if cl is None: cl = T['border']
    return '<line x1=\"'+str(x1)+'\" y1=\"'+str(y1)+'\" x2=\"'+str(x2)+'\" y2=\"'+str(y2)+'\" stroke=\"'+cl+'\" stroke-width=\"1\"/>\n'

def c(cx,cy,rr,fl=T['primary']):
    return '<circle cx=\"'+str(cx)+'\" cy=\"'+str(cy)+'\" r=\"'+str(rr)+'\" fill=\"'+fl+'\"/>\n'

def sb(): return r(0,0,W,SB,T['bg_surface'])+t(24,28,'9:41',14,'700')

def nb(title,left='\u2190 \u8fd4\u56de',right='',rc=None):
    if rc is None: rc = T['primary']
    s=r(0,SB,W,NB,T['bg_surface'])+l(0,SB+NB-0.5,W,SB+NB-0.5)
    if left: s+=t(16,SB+30,left,14,'400',rc)
    if title: s+=t(W//2,SB+30,title,16,'600',T['text_primary'],'middle')
    if right: s+=t(W-16,SB+30,right,14,'600',rc,'end')
    return s

def bn_bar(y,a=0):
    items=['\u9996\u9875','\u6c42\u804c','\u53d1\u5e03','\u6d88\u606f','\u6211\u7684']
    s=r(0,y,W,BN,T['bg_surface'])+l(0,y+0.5,W,y+0.5)
    for i,lb in enumerate(items):
        cx=(W//5)*i+W//10;cl=T['primary'] if i==a else T['text_tertiary']
        if i==2: s+=c(cx,y+18,22,T['primary'])+t(cx,y+24,'+',18,'700','#fff','middle')
        s+=t(cx,y+50,lb,10,'400',cl,'middle')
    return s

def auth_card(y,name,dept,school,badge,ab=T['primary_light'],ac=T['primary'],av='@'):
    s=r(16,y,W-32,60,'#F9FAFB',12)
    s+=c(44,y+30,22,ab)+t(44,y+36,av,18,'600',ac,'middle')
    s+=t(76,y+20,name,14,'600')+t(76,y+38,dept+' \u00b7 '+school,12,'400',T['text_secondary'])
    s+=r(76,y+44,80,16,T['success_light'],4)+t(116,y+55,badge,10,'400',T['success'],'middle')
    return s

def ba(y,left_l,right_l):
    s=r(0,y,W,68,T['bg_surface'])+l(0,y+0.5,W,y+0.5)
    s+=r(16,y+12,W//2-24,44,T['bg_surface'],6,T['border'],1.5)
    s+=t(W//4,y+38,left_l,14,'600',T['text_primary'],'middle')
    s+=r(W//2+8,y+12,W//2-24,44,T['primary'],6)
    s+=t(3*W//4,y+38,right_l,14,'600','#fff','middle')
    return s

def mt(x,y,label,mod):
    d={'career':(T['primary_light'],T['primary']),'rental':(T['success_light'],T['success']),'secondhand':(T['danger_light'],T['danger']),'life':(T['warning_light'],'#D97706')}
    bg,fg=d.get(mod,d['life'])
    tw=len(label)*12+4
    return r(x,y,tw,24,bg,12)+t(x+tw//2,y+16,label,10,'600',fg,'middle')

print('Generating screens 4-14...')