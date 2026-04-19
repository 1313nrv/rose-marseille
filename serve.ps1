# Mini static HTTP server for ROSE - no dependencies.
# Run:  powershell -ExecutionPolicy Bypass -File .\serve.ps1
# Or right-click the file and pick "Run with PowerShell".

$port = 8080
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$url  = "http://localhost:$port/"

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".htm"  = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".mjs"  = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".xml"  = "application/xml; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".gif"  = "image/gif"
  ".ico"  = "image/x-icon"
  ".woff" = "font/woff"
  ".woff2"= "font/woff2"
  ".ttf"  = "font/ttf"
  ".otf"  = "font/otf"
  ".txt"  = "text/plain; charset=utf-8"
  ".webmanifest" = "application/manifest+json"
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($url)

try {
  $listener.Start()
} catch {
  Write-Host "ERROR: Cannot bind $url - port busy or insufficient rights." -ForegroundColor Red
  Write-Host "  $_"
  exit 1
}

Write-Host ""
Write-Host "  ROSE - local server" -ForegroundColor Magenta
Write-Host "  -------------------"
Write-Host "  Root : $root"
Write-Host "  URL  : $url"
Write-Host ""
Write-Host "  Open $url in your browser" -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

Start-Process $url | Out-Null

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
  } catch {
    break
  }

  $req = $ctx.Request
  $res = $ctx.Response

  $path = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)
  if ($path.EndsWith("/")) {
    $path += "index.html"
  }
  $full = Join-Path $root $path.TrimStart("/")

  if (Test-Path $full -PathType Container) {
    $full = Join-Path $full "index.html"
  }

  if (Test-Path $full -PathType Leaf) {
    $ext = [System.IO.Path]::GetExtension($full).ToLower()
    if ($mime.ContainsKey($ext)) {
      $ct = $mime[$ext]
    } else {
      $ct = "application/octet-stream"
    }
    $bytes = [System.IO.File]::ReadAllBytes($full)
    $res.ContentType = $ct
    $res.ContentLength64 = $bytes.Length
    $res.StatusCode = 200
    try { $res.OutputStream.Write($bytes, 0, $bytes.Length) } catch {}
    Write-Host ("  200  {0,-6}  {1}" -f $req.HttpMethod, $path) -ForegroundColor DarkGray
  } else {
    $body = "404 Not Found: $path"
    $msg = [System.Text.Encoding]::UTF8.GetBytes($body)
    $res.StatusCode = 404
    $res.ContentType = "text/plain; charset=utf-8"
    $res.ContentLength64 = $msg.Length
    try { $res.OutputStream.Write($msg, 0, $msg.Length) } catch {}
    Write-Host ("  404  {0,-6}  {1}" -f $req.HttpMethod, $path) -ForegroundColor Yellow
  }

  try { $res.Close() } catch {}
}

$listener.Stop()
Write-Host ""
Write-Host "  Server stopped." -ForegroundColor Gray
