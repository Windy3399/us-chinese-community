Get-ChildItem -Path "C:\Users\Windy\Desktop\us-chinese-community\app\api" -Filter "*.ts" -Recurse | ForEach-Object {
    (Get-Content $_.FullName) -replace "export const runtime = 'edge'", "export const runtime = 'nodejs'" | Set-Content $_.FullName
    Write-Host "Updated: $($_.FullName)"
}