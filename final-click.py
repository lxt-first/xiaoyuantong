import ctypes, time
from ctypes import wintypes, POINTER, byref, sizeof, create_unicode_buffer

u32 = ctypes.windll.user32

# Find ALL Figma windows, show titles
def enum_figma():
    result = []
    def cb(h, _):
        buf = create_unicode_buffer(256)
        u32.GetWindowTextW(h, buf, 256)
        t = buf.value
        if 'Figma' in t:
            result.append((h, t))
        return True
    CBP = ctypes.WINFUNCTYPE(ctypes.c_bool, wintypes.HWND, wintypes.LPARAM)
    u32.EnumWindows(CBP(cb), 0)
    return result

wins = enum_figma()
print("All Figma windows:")
for h, t in wins:
    # Get rect
    class R(ctypes.Structure):
        _fields_ = [("L", ctypes.c_int),("T", ctypes.c_int),("R", ctypes.c_int),("B", ctypes.c_int)]
    r = R()
    u32.GetWindowRect(h, byref(r))
    print(f"  '{t}' ({r.L},{r.T})-({r.R},{r.B})")

# Find the Untitled file window
untitled = None
for h, t in wins:
    if 'Untitled' in t:
        untitled = (h, t)
        break

if not untitled:
    # The file might be in a tab. Try the main Figma window
    for h, t in wins:
        if '联想' not in t and '资源管理器' not in t:
            untitled = (h, t)
            break

if untitled:
    hw, title = untitled
    print(f"\nActivating: {title}")
    u32.SetForegroundWindow(hw)
    time.sleep(0.5)
    
    # Try pressing Ctrl+Alt+P (sometimes opens the last-run plugin)
    # Or try clicking directly in the center-right of the window
    class R(ctypes.Structure):
        _fields_ = [("L", ctypes.c_int),("T", ctypes.c_int),("R", ctypes.c_int),("B", ctypes.c_int)]
    r = R()
    u32.GetWindowRect(hw, byref(r))
    cx = r.L + (r.R - r.L) * 3 // 4  # 75% to the right
    cy = r.T + (r.B - r.T) // 3     # 33% down
    print(f"Clicking at ({cx}, {cy})...")
    u32.SetCursorPos(cx, cy)
    time.sleep(0.2)
    u32.mouse_event(0x0002, 0, 0, 0, 0)  # down
    time.sleep(0.05)
    u32.mouse_event(0x0004, 0, 0, 0, 0)  # up
    time.sleep(0.5)
    
    # Now try Tab+Enter
    print("Tab to focus button, then Enter...")
    for _ in range(4):
        u32.keybd_event(0x09, 0, 0, 0)
        time.sleep(0.05)
        u32.keybd_event(0x09, 0, 0x0002, 0)
        time.sleep(0.2)
    u32.keybd_event(0x0D, 0, 0, 0)
    time.sleep(0.05)
    u32.keybd_event(0x0D, 0, 0x0002, 0)
    
    print("Done!")
else:
    print("No Figma window at all")
