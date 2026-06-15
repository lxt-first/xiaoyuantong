[System.Reflection.Assembly]::LoadWithPartialName("UIAutomationClient") | Out-Null
[System.Reflection.Assembly]::LoadWithPartialName("UIAutomationTypes") | Out-Null
[System.Reflection.Assembly]::LoadWithPartialName("UIAutomationClientsideProviders") | Out-Null

$automation = [System.Windows.Automation.AutomationElement]
$root = $automation::RootElement

# Find Figma window
$cond = New-Object System.Windows.Automation.PropertyCondition(
    [System.Windows.Automation.AutomationElement]::NameProperty, "Untitled - Figma")
$elm = $root.FindFirst([System.Windows.Automation.TreeScope]::Descendants, $cond)

if (-not $elm) {
    # Try partial match
    $elm = $root.FindFirst([System.Windows.Automation.TreeScope]::Descendants,
        New-Object System.Windows.Automation.PropertyCondition(
            [System.Windows.Automation.AutomationElement]::NameProperty, "*Figma*"))
}

if (-not $elm) {
    Write-Output "Figma window not found via UIA"
    # Try enumeration
    $all = @{}
    $walker = [System.Windows.Automation.TreeWalker]::RawViewWalker
    $current = $root
    $stack = New-Object System.Collections.Stack
    $stack.Push($current)
    $count = 0
    while ($stack.Count -gt 0 -and $count -lt 500) {
        $current = $stack.Pop()
        $name = $current.Current.Name
        if ($name -and $name -match "Figma") {
            $type = $current.Current.ControlType.ProgrammaticName
            Write-Output "Figma element: '$name' [$type] Handle: $($current.Current.NativeWindowHandle)"
        }
        $child = $walker.GetFirstChild($current)
        while ($child) {
            $stack.Push($child)
            $child = $walker.GetNextSibling($child)
        }
        $count++
    }
    exit 1
}

Write-Output "Found Figma: $($elm.Current.Name)"
Write-Output "ControlType: $($elm.Current.ControlType.ProgrammaticName)"
Write-Output "Handle: $($elm.Current.NativeWindowHandle)"

# Set focus
$elm.SetFocus() | Out-Null
Start-Sleep -Milliseconds 500

# Now find the "Plugins" menu item
# The menu bar is typically a child of the window
$menuCond = New-Object System.Windows.Automation.PropertyCondition(
    [System.Windows.Automation.AutomationElement]::NameProperty, "Plugins")
$menuCond2 = New-Object System.Windows.Automation.PropertyCondition(
    [System.Windows.Automation.AutomationElement]::ControlTypeProperty,
    [System.Windows.Automation.ControlType]::MenuItem)

$andCond = New-Object System.Windows.Automation.AndCondition($menuCond, $menuCond2)
$pluginMenu = $elm.FindFirst([System.Windows.Automation.TreeScope]::Descendants, $andCond)

if ($pluginMenu) {
    Write-Output "Found Plugins menu: $($pluginMenu.Current.Name)"
    
    # Try to expand/invoke it
    $expand = $pluginMenu.GetCurrentPattern([System.Windows.Automation.ExpandCollapsePattern]::Pattern)
    if ($expand) {
        Write-Output "Expanding Plugins menu..."
        $expand.Expand()
        Start-Sleep -Milliseconds 1000
    } else {
        $invoke = $pluginMenu.GetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern)
        if ($invoke) {
            Write-Output "Invoking Plugins menu..."
            $invoke.Invoke()
            Start-Sleep -Milliseconds 1000
        }
    }
    
    # Now find "Development" submenu
    Start-Sleep -Milliseconds 500
    $devCond = New-Object System.Windows.Automation.PropertyCondition(
        [System.Windows.Automation.AutomationElement]::NameProperty, "Development")
    $devMenu = $elm.FindFirst([System.Windows.Automation.TreeScope]::Descendants,
        New-Object System.Windows.Automation.AndCondition($devCond,
            New-Object System.Windows.Automation.PropertyCondition(
                [System.Windows.Automation.AutomationElement]::ControlTypeProperty,
                [System.Windows.Automation.ControlType]::MenuItem)))
    
    if ($devMenu) {
        Write-Output "Found Development submenu"
        $devExpand = $devMenu.GetCurrentPattern([System.Windows.Automation.ExpandCollapsePattern]::Pattern)
        if ($devExpand) { $devExpand.Expand() }
    } else {
        Write-Output "Development submenu not found yet"
    }
} else {
    Write-Output "Plugins menu not found directly. Trying to enumerate menu items..."
    
    # Try to find all menu items
    $walker = [System.Windows.Automation.TreeWalker]::ControlViewWalker
    $child = $walker.GetFirstChild($elm)
    $count = 0
    while ($child -and $count -lt 100) {
        $n = $child.Current.Name
        $t = $child.Current.ControlType.ProgrammaticName
        if ($n) { Write-Output "  Child: '$n' [$t]" }
        $child = $walker.GetNextSibling($child)
        $count++
    }
}

Write-Output "UIA scan complete"
