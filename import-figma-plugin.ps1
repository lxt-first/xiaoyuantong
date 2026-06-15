Add-Type -AssemblyName System.Windows.Forms
Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;
public class Win {
    [DllImport("user32.dll")] public static extern IntPtr FindWindow(string c, string w);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int n);
    [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr h, StringBuilder t, int max);
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
}
"@

# Find Figma window - try exact and partial match
$hwnd = [IntPtr]::Zero
$windows = @()
$callback = {
    param($h, $p)
    $sb = New-Object System.Text.StringBuilder(256)
    [Win]::GetWindowText($h, $sb, 256) | Out-Null
    $title = $sb.ToString()
    if ($title -match "Figma" -and $title -notmatch "popup|tooltip") {
        $script:windows += [PSCustomObject]@{Handle=$h; Title=$title}
    }
    return $true
}
$delegate = [Win+EnumWindowsProc]$callback
[Win]::EnumWindows($delegate, [IntPtr]::Zero) | Out-Null

foreach ($w in $windows) {
    Write-Output "Found: $($w.Title) (Handle: $($w.Handle))"
    $hwnd = $w.Handle
    break
}

if ($hwnd -eq [IntPtr]::Zero) {
    Write-Output "ERROR: No Figma window found"
    exit 1
}

Write-Output "Activating Figma window..."
[Win]::ShowWindow($hwnd, 9)
Start-Sleep -Milliseconds 600
[Win]::SetForegroundWindow($hwnd)
Start-Sleep -Milliseconds 1000

# Alt+P to open Plugins menu
Write-Output "Opening Plugins menu (Alt+P)..."
[System.Windows.Forms.SendKeys]::SendWait("%p")
Start-Sleep -Milliseconds 2000

# Navigate down to "Development" (try going down many times)
Write-Output "Navigating to Development..."
1..10 | ForEach-Object { 
    [System.Windows.Forms.SendKeys]::SendWait("{DOWN}") 
    Start-Sleep -Milliseconds 200 
}
# Up a couple to find Development
[System.Windows.Forms.SendKeys]::SendWait("{UP}")
Start-Sleep -Milliseconds 200
[System.Windows.Forms.SendKeys]::SendWait("{UP}")
Start-Sleep -Milliseconds 200

# Right arrow to open submenu
[System.Windows.Forms.SendKeys]::SendWait("{RIGHT}")
Start-Sleep -Milliseconds 1000

# "Import plugin from manifest..." is usually first
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
Start-Sleep -Milliseconds 2000

# File dialog - type the manifest path
$manifestPath = (Resolve-Path "prototypes/figma-plugin/manifest.json").Path
Write-Output "Typing path: $manifestPath"
[System.Windows.Forms.SendKeys]::SendWait($manifestPath)
Start-Sleep -Milliseconds 800
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
Start-Sleep -Milliseconds 2000

Write-Output "Plugin import sequence complete!"
Write-Output "Now running plugin..."

# Alt+P → Development → plugin name
[System.Windows.Forms.SendKeys]::SendWait("%p")
Start-Sleep -Milliseconds 2000
1..10 | ForEach-Object { [System.Windows.Forms.SendKeys]::SendWait("{DOWN}"); Start-Sleep -Milliseconds 200 }
[System.Windows.Forms.SendKeys]::SendWait("{UP}")
Start-Sleep -Milliseconds 200
[System.Windows.Forms.SendKeys]::SendWait("{UP}")
Start-Sleep -Milliseconds 200
[System.Windows.Forms.SendKeys]::SendWait("{RIGHT}")
Start-Sleep -Milliseconds 1000

# The imported plugin should appear in the list
[System.Windows.Forms.SendKeys]::SendWait("{DOWN}")
Start-Sleep -Milliseconds 200
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
Start-Sleep -Milliseconds 2000

Write-Output "Done! Check Figma for the plugin UI panel."
