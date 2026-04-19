@echo off
echo ==== WSL Ubuntu 安装脚本 ====
echo.

echo [1/3] 下载 Ubuntu 22.04 LTS...
powershell -Command "Invoke-WebRequest -Uri 'https://aka.ms/wslubuntu2204' -OutFile '$env:TEMP\Ubuntu-22.04.appx'"

echo [2/3] 安装 Ubuntu...
powershell -Command "Add-AppxPackage -Path '$env:TEMP\Ubuntu-22.04.appx'"

echo [3/3] 初始化 Ubuntu...
wsl.exe -d Ubuntu-22.04

echo.
echo ✅ 安装完成！请在新打开的 Linux 终端中设置用户名和密码。
pause
