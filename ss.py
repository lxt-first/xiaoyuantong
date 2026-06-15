import ctypes, time, subprocess
from ctypes import wintypes, POINTER, byref, sizeof, create_unicode_buffer
from PIL import ImageGrab

u32 = ctypes.windll.user32

# Find Untitled-Figma
def find_untitled():
    result = []
    def cb(h, _):
        buf = create_unicode_buffer(256)
        u32.GetWindowTextW(h, buf, 256)
        t = buf.value
        if 'Untitled' in t and 'Figma' in t:
            result.append((h, t))
        return True
    CBP = ctypes.WINFUNCTYPE(ctypes.c_bool, wintypes.HWND, wintypes.LPARAM)
    u32.EnumWindows(CBP(cb), 0)
    return result

wins = find_untitled()
if not wins:
    # Fallback to any figma window
    def cb2(h, _):
        buf = create_unicode_buffer(256)
        u32.GetWindowTextW(h, buf, 256)
        t = buf.value
        if 'Figma' in t and '联想' not in t and 'Explorer' not in t:
            result.append((h, t))
        return True
    wins = []
    u32.EnumWindows(CBP(cb2), 0)

if not wins:
    print("No Figma")
    exit(1)

hw, title = wins[0]
print(f"Screenshot of: {title}")

# Activate
u32.SetForegroundWindow(hw)
time.sleep(0.5)

# Get rect
class R(ctypes.Structure):
    _fields_ = [("L", ctypes.c_int),("T", ctypes.c_int),("R", ctypes.c_int),("B", ctypes.c_int)]
r = R()
u32.GetWindowRect(hw, byref(r))

# Screenshot
img = ImageGrab.grab(bbox=(r.L, r.T, r.R, r.B))
out = r"C:\Users\86153\Documents\Codex\2026-06-12\new-chat\xiaoyuantong\figma-editor.png"
img.save(out)
print(f"Saved: {out} ({r.R-r.L}x{r.B-r.T})")
