$apiPath = "C:\Users\Windy\Desktop\us-chinese-community\app\api"

Get-ChildItem -Path $apiPath -Filter "*.ts" -Recurse | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw

    if ($content -match "export const runtime = 'edge'") {
        $newContent = $content -replace "export const runtime = 'edge'", "export const runtime = 'nodejs'"
        Set-Content -Path $file -Value $newContent -Encoding UTF8
        Write-Host "✓ 已修改: $file"
    }
}

Write-Host "`n完成！所有 edge runtime 已改为 nodejs。"
