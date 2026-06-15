import ctypes, time
from ctypes import wintypes

u32 = ctypes.windll.user32

# Simple tap
def tap(vk, delay=0.15):
    inp = (1, (vk, 0, 0, 0, None))
    class I(ctypes.Structure): _fields_ = [("t",wintypes.DWORD),("ki",(wintypes.WORD,wintypes.WORD,wintypes.DWORD,wintypes.DWORD,ctypes.c_void_p))]
    ii = I(1, (vk, 0, 0, 0, None))
    u32.SendInput(1, ctypes.byref(ii), ctypes.sizeof(I))
    time.sleep(0.04)
    ii.ki[2] = 2  # KEYEVENTF_KEYUP
    u32.SendInput(1, ctypes.byref(ii), ctypes.sizeof(I))
    time.sleep(delay)

def alt_tap(vk, delay=0.3):
    # Press Alt
    ii_alt = (1, (0x12, 0, 0, 0, None))
    class I(ctypes.Structure): _fields_ = [("t",wintypes.DWORD),("ki",(wintypes.WORD,wintypes.WORD,wintypes.DWORD,wintypes.DWORD,ctypes.c_void_p))]
    ia = I(1, (0x12, 0, 0, 0, None))
    u32.SendInput(1, ctypes.byref(ia), ctypes.sizeof(I))
    time.sleep(0.04)
    # Tap the key
    ik = I(1, (vk, 0, 0, 0, None))
    u32.SendInput(1, ctypes.byref(ik), ctypes.sizeof(I))
    time.sleep(0.04)
    ik.ki[2] = 2
    u32.SendInput(1, ctypes.byref(ik), ctypes.sizeof(I))
    # Release Alt
    ia.ki[2] = 2
    u32.SendInput(1, ctypes.byref(ia), ctypes.sizeof(I))
    time.sleep(delay)

def ctrl_tap(vk, delay=0.3):
    ic = I(1, (0x11, 0, 0, 0, None))
    class I(ctypes.Structure): _fields_ = [("t",wintypes.DWORD),("ki",(wintypes.WORD,wintypes.WORD,wintypes.DWORD,wintypes.DWORD,ctypes.c_void_p))]
    u32.SendInput(1, ctypes.byref(ic), ctypes.sizeof(I))
    time.sleep(0.04)
    ik = I(1, (vk, 0, 0, 0, None))
    u32.SendInput(1, ctypes.byref(ik), ctypes.sizeof(I))
    time.sleep(0.04)
    ik.ki[2] = 2
    u32.SendInput(1, ctypes.byref(ik), ctypes.sizeof(I))
    ic.ki[2] = 2
    u32.SendInput(1, ctypes.byref(ic), ctypes.sizeof(I))
    time.sleep(delay)

# Find window
buf = ctypes.create_unicode_buffer(256)
hw = None
def cb(h, _):
    global hw
    u32.GetWindowTextW(h, buf, 256)
    if 'Figma' in buf.value and '联想' not in buf.value and 'Explorer' not in buf.value:
        hw = h
        return False
    return True

CBP = ctypes.WINFUNCTYPE(ctypes.c_bool, wintypes.HWND, wintypes.LPARAM)
u32.EnumWindows(CBP(cb), 0)

if hw:
    print(f"Found Figma window: {buf.value[:60]}")
    u32.SetForegroundWindow(hw)
    time.sleep(0.8)
    
    # Sequence: Alt -> RIGHT x7 -> DOWN -> DOWN x3 -> RIGHT -> DOWN x2 -> ENTER
    print("Opening Plugins menu...")
    
    # Alt
    class I(ctypes.Structure): _fields_ = [("t",wintypes.DWORD),("ki",(wintypes.WORD,wintypes.WORD,wintypes.DWORD,wintypes.DWORD,ctypes.c_void_p))]
    ia = I(1, (0x12, 0, 0, 0, None))
    u32.SendInput(1, ctypes.byref(ia), ctypes.sizeof(I))
    time.sleep(0.5)
    
    # Right x7 to reach Plugins
    for i in range(7):
        tap(0x27, 0.2)
    
    # Down to open
    tap(0x28, 0.6)
    
    # Down x3 to reach Development
    for i in range(3):
        tap(0x28, 0.15)
    
    # Right to open submenu
    tap(0x27, 0.6)
    
    # Down x2 to "Import plugin from manifest..."
    tap(0x28, 0.15)
    tap(0x28, 0.15)
    tap(0x0D, 1.5)  # Enter
    
    # Release Alt
    ia.ki[2] = 2
    u32.SendInput(1, ctypes.byref(ia), ctypes.sizeof(I))
    
    # File dialog - paste path
    import subprocess
    path = r"C:\\Users\\86153\\Documents\\Codex\\2026-06-12\\new-chat\\xiaoyuantong\\prototypes\\figma-plugin\\manifest.json"
    subprocess.run(['powershell', '-Command', f'Set-Clipboard -Value "{path}"'], capture_output=True)
    time.sleep(0.5)
    ctrl_tap(0x56, 0.5)  # Ctrl+V
    tap(0x0D, 2.0)  # Enter
    
    print("Imported! Now running...")
    
    # Alt -> RIGHT x7 -> DOWN -> DOWN x3 -> RIGHT -> DOWN -> ENTER
    ia2 = I(1, (0x12, 0, 0, 0, None))
    u32.SendInput(1, ctypes.byref(ia2), ctypes.sizeof(I))
    time.sleep(0.5)
    for i in range(7):
        tap(0x27, 0.2)
    tap(0x28, 0.6)
    for i in range(3):
        tap(0x28, 0.15)
    tap(0x27, 0.6)
    tap(0x28, 0.15)
    tap(0x0D, 2.0)
    ia2.ki[2] = 2
    u32.SendInput(1, ctypes.byref(ia2), ctypes.sizeof(I))
    
    print("Done! Plugin should be running now.")
else:
    print("No Figma window found")
