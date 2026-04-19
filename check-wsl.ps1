# 检查 WSL 状态并安装 Ubuntu 的脚本
$wslOutput = wsl.exe --list -v 2>&1
Write-Host "当前 WSL 发行版:" -ForegroundColor Cyan
$wslOutput

if ($wslOutput -notmatch "Ubuntu") {
    Write-Host "`n未检测到 Ubuntu，正在安装..." -ForegroundColor Yellow
    # 启用必要的 Windows 功能
    dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
    dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

    Write-Host "`n请重启电脑后再次运行此脚本！" -ForegroundColor Green
} else {
    Write-Host "`n✅ Ubuntu 已安装，可以直接使用 WSL" -ForegroundColor Green
}
