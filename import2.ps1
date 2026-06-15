Add-Type -AssemblyName System.Windows.Forms
Add-Type @"
using System; using System.Runtime.InteropServices; using System.Text;
public class W3 {
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int n);
    [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr h, StringBuilder t, int m);
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWP2 cb, IntPtr p);
    public delegate bool EnumWP2(IntPtr h, IntPtr p);
}
"@
$w = @{}
[W3]::EnumWindows({param($h,$p) $sb=New-Object Text.StringBuilder(256);[W3]::GetWindowText($h,$sb,256)|Out-Null;$t=$sb.ToString();if($t-match'Untitled.*Figma'){$script:w[$h]=$t};return $true},[IntPtr]::Zero)
$hwnd=($w.Keys|Select -First 1)
if(!$hwnd){
    Start-Process "figma://file/new"
    Start-Sleep -Seconds 8
    [W3]::EnumWindows({param($h,$p) $sb=New-Object Text.StringBuilder(256);[W3]::GetWindowText($h,$sb,256)|Out-Null;$t=$sb.ToString();if($t-match'Figma'){$script:w[$h]=$t};return $true},[IntPtr]::Zero)
    $hwnd=($w.Keys|Select -First 1)
}
if(!$hwnd){Write-Output "No Figma window";exit 1}
Write-Output "Found: $($w[$hwnd])"

[W3]::ShowWindow($hwnd,9)|Out-Null
Start-Sleep -Milliseconds 500
[W3]::SetForegroundWindow($hwnd)|Out-Null
Start-Sleep -Milliseconds 1000

# Strategy: Use Alt to activate menu bar, then RIGHT to navigate to Plugins
Write-Output "Activating menu bar..."
[System.Windows.Forms.SendKeys]::SendWait("%")  # Alt to activate menu bar
Start-Sleep -Milliseconds 1000

# Navigate right to "Plugins" (typically 7-8 right arrows)
Write-Output "Navigating to Plugins menu..."
1..8 | ForEach-Object { [System.Windows.Forms.SendKeys]::SendWait("{RIGHT}"); Start-Sleep -Milliseconds 200 }

# Open the menu
[System.Windows.Forms.SendKeys]::SendWait("{DOWN}")
Start-Sleep -Milliseconds 1000

# Now in the Plugins dropdown. Navigate down to "Development" submenu
# The menu has: Run Last Plugin, separator, [recent plugins], separator, Development
# For a fresh install with no recent plugins, Development is about 3-4 items down
1..3 | ForEach-Object { [System.Windows.Forms.SendKeys]::SendWait("{DOWN}"); Start-Sleep -Milliseconds 200 }

# Open Development submenu
[System.Windows.Forms.SendKeys]::SendWait("{RIGHT}")
Start-Sleep -Milliseconds 1000

# "Import plugin from manifest..." should be one of the first items
[System.Windows.Forms.SendKeys]::SendWait("{DOWN}")
Start-Sleep -Milliseconds 200
[System.Windows.Forms.SendKeys]::SendWait("{DOWN}")
Start-Sleep -Milliseconds 200
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
Start-Sleep -Milliseconds 2500

# File dialog open - paste the path
$manifest = (Resolve-Path "prototypes/figma-plugin/manifest.json").Path
Set-Clipboard -Value $manifest
Write-Output "Pasting: $manifest"
[System.Windows.Forms.SendKeys]::SendWait("^v")
Start-Sleep -Milliseconds 500
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
Start-Sleep -Milliseconds 3000
Write-Output "Plugin import complete!"

# Now run the plugin
Write-Output "Running plugin..."
[System.Windows.Forms.SendKeys]::SendWait("%")
Start-Sleep -Milliseconds 800
1..8 | ForEach-Object { [System.Windows.Forms.SendKeys]::SendWait("{RIGHT}"); Start-Sleep -Milliseconds 200 }
[System.Windows.Forms.SendKeys]::SendWait("{DOWN}")
Start-Sleep -Milliseconds 800
1..3 | ForEach-Object { [System.Windows.Forms.SendKeys]::SendWait("{DOWN}"); Start-Sleep -Milliseconds 200 }
[System.Windows.Forms.SendKeys]::SendWait("{RIGHT}")
Start-Sleep -Milliseconds 1000

# Find our plugin: 校园通 · 高保真原型生成器 - should be in the Development submenu
# It's usually first if it was just imported
[System.Windows.Forms.SendKeys]::SendWait("{DOWN}")
Start-Sleep -Milliseconds 200
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
Start-Sleep -Milliseconds 3000

Write-Output "All done! Figma should show the plugin panel."
Write-Output "If you see '校园通 · 原型生成器', click the button to generate all screens."
