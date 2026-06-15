import ctypes, time
from ctypes import wintypes, POINTER, byref, sizeof, create_unicode_buffer

u32 = ctypes.windll.user32

def find_figma():
    result = []
    def cb(h, _):
        buf = create_unicode_buffer(256)
        u32.GetWindowTextW(h, buf, 256)
        t = buf.value
        if 'Figma' in t and '联想' not in t and 'Explorer' not in t and 'IME' not in t and 'Default' not in t:
            result.append((h, t))
        return True
    CBP = ctypes.WINFUNCTYPE(ctypes.c_bool, wintypes.HWND, wintypes.LPARAM)
    u32.EnumWindows(CBP(cb), 0)
    return result

wins = find_figma()
for h, t in wins:
    print(f"{t[:80]} -> {h}")

# Take screenshot of the first one
if wins:
    from PIL import ImageGrab
    hw, title = wins[0]
    u32.SetForegroundWindow(hw)
    time.sleep(0.5)
    
    class R(ctypes.Structure):
        _fields_ = [("L", ctypes.c_int),("T", ctypes.c_int),("R", ctypes.c_int),("B", ctypes.c_int)]
    r = R()
    u32.GetWindowRect(hw, byref(r))
    
    img = ImageGrab.grab(bbox=(r.L, r.T, r.R, r.B))
    out = r"C:\Users\86153\Documents\Codex\2026-06-12\new-chat\xiaoyuantong\figma-shot.png"
    img.save(out)
    print(f"Screenshot saved: {out} ({r.R-r.L}x{r.B-r.T})")
