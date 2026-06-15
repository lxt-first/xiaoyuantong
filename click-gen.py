# Quick script to click the generate button
import ctypes, time
from ctypes import wintypes, POINTER, byref, sizeof, create_unicode_buffer

u32 = ctypes.windll.user32

class KEYBDINPUT(ctypes.Structure):
    _fields_ = [
        ("wVk", wintypes.WORD), ("wScan", wintypes.WORD),
        ("dwFlags", wintypes.DWORD), ("time", wintypes.DWORD),
        ("dwExtraInfo", POINTER(ctypes.c_ulong)),
    ]

class INPUT_union(ctypes.Union):
    _fields_ = [("ki", KEYBDINPUT)]

class INPUT(ctypes.Structure):
    _fields_ = [("type", wintypes.DWORD), ("u", INPUT_union)]

def send_key(vk, flags=0):
    inp = INPUT()
    inp.type = 1
    inp.u.ki.wVk = vk
    inp.u.ki.wScan = 0
    inp.u.ki.dwFlags = flags
    inp.u.ki.time = 0
    inp.u.ki.dwExtraInfo = None
    u32.SendInput(1, byref(inp), sizeof(INPUT))

def tap(vk, delay=0.1):
    send_key(vk, 0)
    time.sleep(0.03)
    send_key(vk, 0x0002)
    time.sleep(delay)

# Find Figma
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
if not wins:
    print("No Figma")
    exit(1)

hw, title = wins[0]
print(f"Activating: {title}")
u32.SetForegroundWindow(hw)
time.sleep(0.5)

# The plugin panel is open. The "generate" button should be focusable via Tab.
# Try Tab to focus the button, then Enter to click it.
print("Clicking generate button via Tab+Enter...")
for _ in range(5):
    tap(0x09, 0.3)  # Tab
time.sleep(0.3)
tap(0x0D, 1.0)  # Enter

print("Generate click sent! The plugin should now create all 14 screens.")
