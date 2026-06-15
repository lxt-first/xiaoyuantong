import ctypes, time, subprocess, sys
from ctypes import wintypes, POINTER, byref, sizeof, create_unicode_buffer

u32 = ctypes.windll.user32

# -------- Proper INPUT struct --------
class KEYBDINPUT(ctypes.Structure):
    _fields_ = [
        ("wVk", wintypes.WORD),
        ("wScan", wintypes.WORD),
        ("dwFlags", wintypes.DWORD),
        ("time", wintypes.DWORD),
        ("dwExtraInfo", POINTER(ctypes.c_ulong)),
    ]

class INPUT_union(ctypes.Union):
    _fields_ = [("ki", KEYBDINPUT)]

class INPUT(ctypes.Structure):
    _fields_ = [
        ("type", wintypes.DWORD),
        ("u", INPUT_union),
    ]

INPUT_KEYBOARD = 1
KEYEVENTF_KEYUP = 0x0002

def send_key(vk, flags=0):
    inp = INPUT()
    inp.type = INPUT_KEYBOARD
    inp.u.ki.wVk = vk
    inp.u.ki.wScan = 0
    inp.u.ki.dwFlags = flags
    inp.u.ki.time = 0
    inp.u.ki.dwExtraInfo = None
    u32.SendInput(1, byref(inp), sizeof(INPUT))

def tap(vk, delay=0.12):
    send_key(vk, 0)
    time.sleep(0.03)
    send_key(vk, KEYEVENTF_KEYUP)
    time.sleep(delay)

def alt_seq(vk, delay=0.3):
    # Alt down
    send_key(0x12, 0)
    time.sleep(0.04)
    # Key down+up
    send_key(vk, 0)
    time.sleep(0.03)
    send_key(vk, KEYEVENTF_KEYUP)
    # Alt up
    send_key(0x12, KEYEVENTF_KEYUP)
    time.sleep(delay)

def ctrl_tap(vk, delay=0.3):
    send_key(0x11, 0)
    time.sleep(0.04)
    send_key(vk, 0)
    time.sleep(0.03)
    send_key(vk, KEYEVENTF_KEYUP)
    send_key(0x11, KEYEVENTF_KEYUP)
    time.sleep(delay)

def menu_rights(n, delay=0.18):
    for _ in range(n):
        tap(0x27, delay)

def menu_downs(n, delay=0.18):
    for _ in range(n):
        tap(0x28, delay)

# -------- Find Figma window --------
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

# -------- MAIN --------
print("Finding Figma...")
wins = find_figma()
if not wins:
    print("Not running, launching...")
    subprocess.Popen([r"C:\Users\86153\AppData\Local\Figma\Figma.exe"])
    time.sleep(12)
    wins = find_figma()

if not wins:
    print("FAIL: No Figma window")
    sys.exit(1)

hw, title = wins[0]
print(f"Activating: {title}")
u32.SetForegroundWindow(hw)
time.sleep(1)

# Check if we need to open a new file
if 'Recents' in title or 'Feed' in title:
    print("Opening new file...")
    subprocess.run(['cmd', '/c', 'start', 'figma://file/new'], shell=True)
    time.sleep(6)
    wins = find_figma()
    for h, t in wins:
        if 'Untitled' in t:
            hw, title = h, t
            u32.SetForegroundWindow(hw)
            time.sleep(1)
            break

print(f"Working with: {title}")

# -------- Import plugin --------
print("Step 1: Import plugin from manifest...")

# Alt to activate menu
send_key(0x12, 0)
time.sleep(0.5)

# Right arrows to "Plugins"
menu_rights(7, 0.15)

# Down to open menu
tap(0x28, 0.5)

# Down to "Development"
menu_downs(3, 0.12)

# Right to open submenu
tap(0x27, 0.5)

# Down to "Import plugin from manifest..."
menu_downs(2, 0.12)

# Enter
tap(0x0D, 2.0)

# Release Alt
send_key(0x12, KEYEVENTF_KEYUP)

# File dialog - paste path
path = r"C:\Users\86153\Documents\Codex\2026-06-12\new-chat\xiaoyuantong\prototypes\figma-plugin\manifest.json"
print(f"Pasting: {path}")
subprocess.run(['powershell', '-Command', f'Set-Clipboard -Value "{path}"'], capture_output=True)
time.sleep(0.4)
ctrl_tap(0x56, 0.3)  # Ctrl+V
tap(0x0D, 2.5)

print("Plugin imported!")

# -------- Run plugin --------
print("Step 2: Running plugin...")

send_key(0x12, 0)
time.sleep(0.5)
menu_rights(7, 0.15)
tap(0x28, 0.5)
menu_downs(3, 0.12)
tap(0x27, 0.5)
menu_downs(1, 0.12)
tap(0x0D, 2.5)
send_key(0x12, KEYEVENTF_KEYUP)

print("DONE! Plugin should be open in Figma.")
