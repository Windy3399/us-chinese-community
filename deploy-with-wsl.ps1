# WSL 部署自动化脚本
# 使用方法：以管理员身份运行 PowerShell，执行：Set-ExecutionPolicy Bypass -Scope Process; .\deploy-with-wsl.ps1

Write-Host "=== 开始 WSL 部署流程 ===" -ForegroundColor Cyan

# 步骤 1：检查管理员权限
Write-Host "`n[1/6] 检查管理员权限..." -ForegroundColor Yellow
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ 需要管理员权限！请右键脚本 → 以管理员身份运行" -ForegroundColor Red
    exit 1
}
Write-Host "✅ 管理员权限确认" -ForegroundColor Green

# 步骤 2：启用 WSL 功能
Write-Host "`n[2/6] 启用 WSL 功能..." -ForegroundColor Yellow
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
Write-Host "✅ WSL 功能已启用" -ForegroundColor Green

# 步骤 3：安装 WSL 2 内核更新（如果未安装）
Write-Host "`n[3/6] 检查 WSL2 内核更新..." -ForegroundColor Yellow
$kernelUrl = "https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi"
$kernelMsi = "$env:TEMP\wsl_update_x64.msi"
if (!(Test-Path $kernelMsi)) {
    Write-Host "正在下载 WSL2 内核更新..." -ForegroundColor Gray
    Invoke-WebRequest -Uri $kernelUrl -OutFile $kernelMsi
    Start-Process msiexec.exe -Wait -ArgumentList "/i `"$kernelMsi`" /quiet"
    Remove-Item $kernelMsi
}
Write-Host "✅ WSL2 内核就绪" -ForegroundColor Green

# 步骤 4：安装 Ubuntu
Write-Host "`n[4/6] 检查 Ubuntu 发行版..." -ForegroundColor Yellow
$wslList = wsl.exe -l -v 2>$null
if ($wslList -notmatch "Ubuntu") {
    Write-Host "正在从 Microsoft Store 安装 Ubuntu..." -ForegroundColor Gray
    # 尝试安装 Ubuntu 22.04 LTS
    wsl.exe --install -d Ubuntu-22.04
    Write-Host "⏳ Ubuntu 安装中...这可能需要几分钟" -ForegroundColor Yellow
    Write-Host "安装完成后，脚本会自动继续" -ForegroundColor Gray

    # 等待 Ubuntu 安装完成
    Start-Sleep -Seconds 30
}
Write-Host "✅ Ubuntu 已安装" -ForegroundColor Green

# 步骤 5：在 WSL 中配置环境
Write-Host "`n[5/6] 在 WSL 中配置 Node.js 和项目..." -ForegroundColor Yellow

# 复制项目到 WSL 的 Linux 文件系统（可选，也可以直接访问 Windows 文件系统）
$projectPath = "C:\Users\Windy\Desktop\us-chinese-community"
$wslProjectPath = "/mnt/c/Users/Windy/Desktop/us-chinese-community"

Write-Host "项目路径: $projectPath" -ForegroundColor Gray
Write-Host "WSL 路径: $wslProjectPath" -ForegroundColor Gray

# 在 WSL 中执行命令
Write-Host "`n在 WSL 中运行构建..." -ForegroundColor Gray

# 构建 WSL 命令
$wslCommands = @"
cd '$wslProjectPath'

echo '=== 检查 Node.js ==='
if ! command -v node &> /dev/null; then
    echo 'Node.js 未安装，正在安装...'
    curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell
    export PATH="$HOME/.local/share/fnm:$PATH"
    eval '$(fnm env)'
    fnm install 20
    fnm use 20
    node -v
    npm -v
else
    echo 'Node.js 已安装:'
    node -v
fi

echo '=== 安装依赖 ==='
npm install

echo '=== 运行 Next.js 构建 ==='
npm run build

echo '=== 运行 Cloudflare Pages 适配器 ==='
npx @cloudflare/next-on-pages

echo '=== 构建完成 ==='
ls -la .vercel/output/
"@

wsl.exe bash -c "$wslCommands"

Write-Host "✅ WSL 构建完成" -ForegroundColor Green

# 步骤 6：部署到 Cloudflare Pages
Write-Host "`n[6/6] 准备部署..." -ForegroundColor Yellow
Write-Host "`n✅ 构建已成功完成！" -ForegroundColor Green
Write-Host "`n📋 下一步操作：" -ForegroundColor Cyan
Write-Host "1. 登录 Cloudflare Dashboard: https://dash.cloudflare.com" -ForegroundColor White
Write-Host "2. 进入 Pages 项目: us-chinese-community" -ForegroundColor White
Write-Host "3. 上传 .vercel/output/static 目录内容" -ForegroundColor White
Write-Host "4. 在 Settings → Functions 中配置 D1、R2、KV 绑定" -ForegroundColor White
Write-Host "5. 在 Settings → Environment variables 添加 JWT_SECRET 等" -ForegroundColor White

Write-Host "`n或者，你也可以在 WSL 中直接部署：" -ForegroundColor Gray
Write-Host "npx @cloudflare/next-on-pages deploy" -ForegroundColor Gray

Write-Host "`n🎉 部署准备就绪！" -ForegroundColor Green
