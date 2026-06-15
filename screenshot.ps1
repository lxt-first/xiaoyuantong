Add-Type -AssemblyName System.Windows.Forms, System.Drawing
Add-Type @"
using System; using System.Runtime.InteropServices; using System.Text;
public class W4 {
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
    [DllImport("user32.dll")] public static extern IntPtr GetDC(IntPtr h);
    [DllImport("user32.dll")] public static extern int ReleaseDC(IntPtr h, IntPtr dc);
    [DllImport("gdi32.dll")] public static extern bool BitBlt(IntPtr d, int x, int y, int w, int h, IntPtr s, int sx, int sy, uint op);
    [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr h, StringBuilder t, int m);
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWP3 cb, IntPtr p);
    public delegate bool EnumWP3(IntPtr h, IntPtr p);
    [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L,R,T,B; }
}
"@

$w=@{}
[W4]::EnumWindows({param($h,$p)$sb=New-Object Text.StringBuilder(256);[W4]::GetWindowText($h,$sb,256)|Out-Null;$t=$sb.ToString();if($t-match'Untitled.*Figma'){$script:w[$h]=$t};return $true},[IntPtr]::Zero)
$hwnd=($w.Keys|Select -First 1)
if(!$hwnd){Write-Output "No Figma window found";exit 1}
Write-Output "Found: $($w[$hwnd])"

[W4]::SetForegroundWindow($hwnd)|Out-Null
Start-Sleep -Milliseconds 1000

$rect=New-Object W4+RECT
[W4]::GetWindowRect($hwnd,[ref]$rect)|Out-Null
$w=$rect.R-$rect.L; $h=$rect.B-$rect.T
Write-Output "Window: ${w}x${h} at ($($rect.L),$($rect.T))"

$bmp=New-Object System.Drawing.Bitmap($w,$h)
$g=[System.Drawing.Graphics]::FromImage($bmp)
$dc=$g.GetHdc()
[W4]::BitBlt($dc,0,0,$w,$h,[W4]::GetDC(0),$rect.L,$rect.T,0x00CC0020)|Out-Null
$g.ReleaseHdc($dc)
$g.Dispose()

$out = "figma-screenshot.png"
$bmp.Save($out)
$bmp.Dispose()
Write-Output "Screenshot saved: $out"
