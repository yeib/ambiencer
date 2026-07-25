# Script de Generación Automática de Iconos y Tiles para Ambiencer Pro (Microsoft Store)
Add-Type -AssemblyName System.Drawing

$baseDir = Get-Location
$masterLogoPath = Join-Path $baseDir "public/logo.png"
$iconsDir = Join-Path $baseDir "src-tauri/icons"
$storeDir = Join-Path $baseDir "store-assets"

if (-not (Test-Path $masterLogoPath)) {
    Write-Host "⚠️ No se encontró el logo maestro en 'public/logo.png'. Por favor coloca la imagen del logo en esa ruta." -ForegroundColor Yellow
    Exit 1
}

if (-not (Test-Path $iconsDir)) { New-Item -ItemType Directory -Path $iconsDir | Out-Null }
if (-not (Test-Path $storeDir)) { New-Item -ItemType Directory -Path $storeDir | Out-Null }

$sizes = @{
    "Square44x44Logo.png"   = @(44, 44)
    "Square71x71Logo.png"   = @(71, 71)
    "Square150x150Logo.png" = @(150, 150)
    "Square310x310Logo.png" = @(310, 310)
    "StoreLogo.png"         = @(50, 50)
    "32x32.png"             = @(32, 32)
    "128x128.png"           = @(128, 128)
    "128x128@2x.png"        = @(256, 256)
    "icon.png"              = @(512, 512)
}

$srcImg = [System.Drawing.Image]::FromFile($masterLogoPath)

foreach ($key in $sizes.Keys) {
    $w = $sizes[$key][0]
    $h = $sizes[$key][1]

    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($srcImg, 0, 0, $w, $h)
    $g.Dispose()

    $targetPath = Join-Path $iconsDir $key
    $bmp.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "✅ Icono generado: $key ($w x $h)" -ForegroundColor Green
}

# Generar Mosaico Ancho Wide310x150Logo.png (310x150) con fondo de color del tema
$wideBmp = New-Object System.Drawing.Bitmap(310, 150)
$wg = [System.Drawing.Graphics]::FromImage($wideBmp)
$wg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$wg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

$bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#090b10"))
$wg.FillRectangle($bgBrush, 0, 0, 310, 150)

$iconSize = 110
$x = [int]((310 - $iconSize) / 2)
$y = [int]((150 - $iconSize) / 2)
$wg.DrawImage($srcImg, $x, $y, $iconSize, $iconSize)
$wg.Dispose()

$widePath = Join-Path $iconsDir "Wide310x150Logo.png"
$wideBmp.Save($widePath, [System.Drawing.Imaging.ImageFormat]::Png)
$wideBmp.Dispose()
Write-Host "✅ Mosaico Ancho generado: Wide310x150Logo.png (310x150)" -ForegroundColor Green

$srcImg.Dispose()
Write-Host "🚀 Todos los iconos y tiles de Microsoft Store se generaron con éxito desde public/logo.png" -ForegroundColor Cyan
