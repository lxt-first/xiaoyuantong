import ctypes
from ctypes import wintypes
import time
import os

# Windows API
user32 = ctypes.windll.user32
kernel32 = ctypes.windll.kernel32

# Constants
INPUT_KEYBOARD = 1
KEYEVENTF_KEYUP = 0x0002
KEYEVENTF_UNICODE = 0x0004
VK_RETURN = 0x0D
VK_DOWN = 0x28
VK_UP = 0x26
VK_RIGHT = 0x27
VK_LEFT = 0x25
VK_MENU = 0x12  # Alt
VK_CONTROL = 0x11
VK_V = 0x56
VK_P = 0x50

SW_RESTORE = 9

class KEYBDINPUT(ctypes.Structure):
    _fields_ = [("wVk", wintypes.WORD), ("wScan", wintypes.WORD),
                ("dwFlags", wintypes.DWORD), ("time", wintypes.DWORD),
                ("dwExtraInfo", ctypes.POINTER(ctypes.c_ulong))]

class INPUT(ctypes.Structure):
    _fields_ = [("type", wintypes.DWORD), ("ki", KEYBDINPUT)]

def press_key(vk):
    inp = INPUT(INPUT_KEYBOARD, KEYBDINPUT(vk, 0, 0, 0, None))
    user32.SendInput(1, ctypes.byref(inp), ctypes.sizeof(INPUT))

def release_key(vk):
    inp = INPUT(INPUT_KEYBOARD, KEYBDINPUT(vk, 0, KEYEVENTF_KEYUP, 0, None))
    user32.SendInput(1, ctypes.byref(inp), ctypes.sizeof(INPUT))

def tap_key(vk, delay=0.1):
    press_key(vk)
    time.sleep(0.05)
    release_key(vk)
    time.sleep(delay)

def alt_key(vk):
    press_key(VK_MENU)
    time.sleep(0.05)
    tap_key(vk, 0.3)

def ctrl_key(vk):
    press_key(VK_CONTROL)
    time.sleep(0.05)
    tap_key(vk, 0.3)

# Find Figma window
def find_figma():
    result = []
    def enum_cb(hwnd, _):
        buf = ctypes.create_unicode_buffer(256)
        user32.GetWindowTextW(hwnd, buf, 256)
        title = buf.value
        if 'Figma' in title and '资源管理器' not in title and '联想' not in title:
            result.append((hwnd, title))
        return True
    
    EnumWindowsProc = ctypes.WINFUNCTYPE(ctypes.c_bool, wintypes.HWND, wintypes.LPARAM)
    user32.EnumWindows(EnumWindowsProc(enum_cb), 0)
    return result

# Activate window
def activate(hwnd):
    user32.ShowWindow(hwnd, SW_RESTORE)
    time.sleep(0.3)
    user32.SetForegroundWindow(hwnd)
    time.sleep(0.5)
    # Wait for window to be ready
    for _ in range(10):
        fg = user32.GetForegroundWindow()
        if fg == hwnd:
            break
        user32.SetForegroundWindow(hwnd)
        time.sleep(0.3)

def main():
    print("Finding Figma window...")
    windows = find_figma()
    if not windows:
        print("Figma not found, launching...")
        os.startfile(r"C:\Users\86153\AppData\Local\Figma\Figma.exe")
        time.sleep(10)
        windows = find_figma()
    
    if not windows:
        print("Still no Figma window")
        return False
    
    hwnd, title = windows[0]
    print(f"Found: {title}")
    activate(hwnd)
    time.sleep(1)
    
    # Open new file via URL protocol
    print("Opening new file...")
    os.system('start figma://file/new')
    time.sleep(5)
    
    # Find the new untitled window
    windows = find_figma()
    for hwnd, title in windows:
        if 'Untitled' in title:
            activate(hwnd)
            time.sleep(1)
            break
    
    print("Navigating to Plugins -> Development -> Import plugin from manifest...")
    
    # Alt to activate menu bar
    press_key(VK_MENU)
    time.sleep(0.1)
    release_key(VK_MENU)
    time.sleep(0.8)
    
    # Navigate right to Plugins menu (typically 7-8 items)
    for i in range(8):
        tap_key(VK_RIGHT, 0.25)
    
    # Open the menu
    tap_key(VK_DOWN, 0.8)
    
    # Navigate down to Development submenu
    for i in range(3):
        tap_key(VK_DOWN, 0.2)
    
    # Open Development submenu
    tap_key(VK_RIGHT, 0.8)
    
    # "Import plugin from manifest..." - navigate down
    for i in range(2):
        tap_key(VK_DOWN, 0.2)
    
    tap_key(VK_RETURN, 2.0)
    
    # File dialog should be open - paste the manifest path
    manifest_path = r"C:\Users\86153\Documents\Codex\2026-06-12\new-chat\xiaoyuantong\prototypes\figma-plugin\manifest.json"
    print(f"Pasting: {manifest_path}")
    
    # Set clipboard
    import subprocess
    subprocess.run(['powershell', '-Command', f'Set-Clipboard -Value "{manifest_path}"'], capture_output=True)
    time.sleep(0.5)
    
    # Ctrl+V to paste
    ctrl_key(VK_V)
    time.sleep(0.5)
    
    # Enter to confirm
    tap_key(VK_RETURN, 2.5)
    
    print("Import done! Now running the plugin...")
    
    # Alt to activate menu bar
    press_key(VK_MENU)
    time.sleep(0.1)
    release_key(VK_MENU)
    time.sleep(0.8)
    
    # Navigate right to Plugins
    for i in range(8):
        tap_key(VK_RIGHT, 0.25)
    
    # Open menu
    tap_key(VK_DOWN, 0.8)
    
    # Down to Development
    for i in range(3):
        tap_key(VK_DOWN, 0.2)
    
    # Open Development submenu
    tap_key(VK_RIGHT, 0.8)
    
    # Our plugin should be the last imported, at the top
    tap_key(VK_DOWN, 0.2)
    tap_key(VK_RETURN, 2.5)
    
    print("Done! The plugin panel should be visible in Figma now.")
    print("If you see '校园通 · 原型生成器', click the generate button.")
    return True

if __name__ == '__main__':
    main()
