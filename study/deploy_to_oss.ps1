<#
.SYNOPSIS
  将当前项目的 `dist` 目录上传到阿里云 OSS 并开启静态网站支持。

USAGE
  在 PowerShell 中运行（示例）：
    powershell -ExecutionPolicy Bypass -File .\deploy_to_oss.ps1 -BucketName study -EndpointHost oss-cn-beijing.aliyuncs.com -DistPath .\dist -MakeBucket -PublicAcl

NOTES
  - 脚本依赖 `ossutil64.exe`（建议放在 PATH 或指定 -OssutilPath）。
  - 请先通过 `ossutil64.exe config` 完成 AccessKey 的配置，或确保环境已配置好。
  - 脚本不会在聊天中请求或打印你的 AccessKey/Secret。
#>

param(
  [string]$BucketName = "study",
  [string]$EndpointHost = "oss-cn-beijing.aliyuncs.com",
  [string]$OssutilPath = "ossutil64.exe",
  [string]$DistPath = "./dist",
  [switch]$MakeBucket,
  [switch]$PublicAcl
)

function Abort($msg){ Write-Host "ERROR: $msg" -ForegroundColor Red; exit 1 }

# 检查 dist 存在
$fullDist = Resolve-Path -LiteralPath $DistPath -ErrorAction SilentlyContinue
if (-not $fullDist) { Abort "未找到构建目录 '$DistPath'。请先在项目目录运行 'npm run build' 并确认生成 dist 文件夹。" }

# 检查 ossutil
$ossutil = Get-Command $OssutilPath -ErrorAction SilentlyContinue
if (-not $ossutil) {
  Write-Host "未在 PATH 中找到 '$OssutilPath'。请下载 ossutil64.exe 并放入 PATH，或使用 -OssutilPath 指定其完整路径。" -ForegroundColor Yellow
  Write-Host "下载地址参考：https://help.aliyun.com/document_detail/50452.html" -ForegroundColor Yellow
  Abort "找不到 ossutil，无法继续上传。"
}

Write-Host "使用 ossutil: $($ossutil.Source)" -ForegroundColor Green

# 可选创建 bucket
if ($MakeBucket) {
  Write-Host "尝试创建 Bucket: $BucketName (region 根据 EndpointHost 推断) ..."
  & $OssutilPath mb "oss://$BucketName" --location=$(if ($EndpointHost -match "oss-(.+)\.aliyuncs\.com") { $Matches[1] } else { $EndpointHost })
  if ($LASTEXITCODE -ne 0) { Write-Host "创建 Bucket 可能失败或已存在（忽略错误）。" -ForegroundColor Yellow }
}

# 设置 ACL 为 public-read（如果用户要求）
if ($PublicAcl) {
  Write-Host "设置 Bucket ACL 为 public-read ..."
  & $OssutilPath setacl "oss://$BucketName" --acl public-read
  if ($LASTEXITCODE -ne 0) { Write-Host "设置 ACL 失败，请手动检查权限。" -ForegroundColor Yellow }
}

# 上传文件
Write-Host "开始上传 '$DistPath' 到 oss://$BucketName/ （递归）..."
& $OssutilPath cp -r "$($fullDist.Path)\*" "oss://$BucketName/" --acl $(if ($PublicAcl) { 'public-read' } else { 'default' })
if ($LASTEXITCODE -ne 0) { Abort "文件上传失败（ossutil 返回非零）。请检查网络和权限。" }

# 开启静态网站托管（Index + Error 指向 index.html）
Write-Host "设置静态网站（index/error -> index.html）..."
& $OssutilPath website set "oss://$BucketName" --index-document index.html --error-document index.html
if ($LASTEXITCODE -ne 0) { Write-Host "设置静态网站可能失败，请在控制台手动检查。" -ForegroundColor Yellow }

# 输出可访问地址
$endpointUrl = "https://$BucketName.$EndpointHost/"
Write-Host "上传完成。静态网站可能需要几分钟生效。访问地址：" -ForegroundColor Green
Write-Host $endpointUrl -ForegroundColor Cyan

Write-Host "如果页面无法访问，请检查：Bucket 是否为公共读、CDN 是否生效，或在 OSS 控制台确认静态网站配置。" -ForegroundColor Yellow
