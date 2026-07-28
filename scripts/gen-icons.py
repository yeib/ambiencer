#!/usr/bin/env python3
import os
import sys
from PIL import Image, ImageDraw, ImageFilter

def generate_icons():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    logo_path = os.path.join(root_dir, "store-assets", "logoA.png")
    
    if not os.path.exists(logo_path):
        logo_path = os.path.join(root_dir, "public", "logo.png")
        
    if not os.path.exists(logo_path):
        print(f"❌ No se encontró la imagen maestra en {logo_path}")
        sys.exit(1)
        
    print(f"🎨 Procesando logo maestro desde: {logo_path}")
    img = Image.open(logo_path).convert("RGBA")
    
    icons_dir = os.path.join(root_dir, "src-tauri", "icons")
    store_dir = os.path.join(root_dir, "store-assets")
    public_dir = os.path.join(root_dir, "public")
    
    os.makedirs(icons_dir, exist_ok=True)
    os.makedirs(store_dir, exist_ok=True)
    os.makedirs(public_dir, exist_ok=True)

    # Copiar logo a public/logo.png
    img.save(os.path.join(public_dir, "logo.png"), "PNG")
    img.save(os.path.join(store_dir, "logoA.png"), "PNG")

    sizes = {
        "Square44x44Logo.png": (44, 44),
        "Square71x71Logo.png": (71, 71),
        "Square150x150Logo.png": (150, 150),
        "Square310x310Logo.png": (310, 310),
        "StoreLogo.png": (50, 50),
        "32x32.png": (32, 32),
        "64x64.png": (64, 64),
        "128x128.png": (128, 128),
        "128x128@2x.png": (256, 256),
        "icon.png": (512, 512),
        # Microsoft Store Web Listing Assets
        "logo_44x44.png": (44, 44),
        "logo_71x71.png": (71, 71),
        "logo_150x150.png": (150, 150),
        "logo_300x300.png": (300, 300),
        "logo_512x512.png": (512, 512),
    }

    for name, (w, h) in sizes.items():
        resized = img.resize((w, h), Image.Resampling.LANCZOS)
        resized.save(os.path.join(icons_dir, name), "PNG")
        resized.save(os.path.join(store_dir, name), "PNG")
        print(f"  ✅ Generado: {name} ({w}x{h})")

    # Mosaico Ancho Wide310x150Logo.png (310x150)
    wide_img = Image.new("RGBA", (310, 150), (9, 11, 16, 255))
    icon_resized = img.resize((110, 110), Image.Resampling.LANCZOS)
    offset_x = (310 - 110) // 2
    offset_y = (150 - 110) // 2
    wide_img.paste(icon_resized, (offset_x, offset_y), icon_resized)
    
    wide_img.save(os.path.join(icons_dir, "Wide310x150Logo.png"), "PNG")
    wide_img.save(os.path.join(store_dir, "Wide310x150Logo.png"), "PNG")
    print("  ✅ Generado: Wide310x150Logo.png (310x150)")

    # Poster Art vertical para Microsoft Store (720x1080) - Estética Dark Glassmorphism Premium
    W, H = 720, 1080
    poster = Image.new("RGBA", (W, H))
    draw = ImageDraw.Draw(poster)
    
    # Gradient bicolor vertical (#090d16 -> #191228)
    for y in range(H):
        t = y / H
        r = int(9 + (25 - 9) * t)
        g = int(13 + (18 - 13) * t)
        b = int(22 + (40 - 22) * t)
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))
        
    # Esferas de luz neón ambiental (Emerald Cyan & Mystic Purple)
    orb_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    orb_draw = ImageDraw.Draw(orb_layer)
    orb_draw.ellipse([60, 180, 500, 620], fill=(16, 185, 129, 65))
    orb_draw.ellipse([220, 350, 660, 790], fill=(168, 85, 247, 75))
    orb_draw.ellipse([100, 620, 620, 1040], fill=(56, 189, 248, 50))
    
    # Desenfoque gaussiano profundo para resplandor cristalino
    orb_layer = orb_layer.filter(ImageFilter.GaussianBlur(85))
    poster = Image.alpha_composite(poster, orb_layer)
    
    # Anillos flotantes de vidrio (Glassmorphic Rings)
    ring_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ring_draw = ImageDraw.Draw(ring_layer)
    ring_draw.ellipse([50, 230, 670, 850], outline=(255, 255, 255, 25), width=2)
    ring_draw.ellipse([130, 310, 590, 770], outline=(56, 189, 248, 35), width=1)
    poster = Image.alpha_composite(poster, ring_layer)
    
    # Logo central con sombra y resplandor aura
    icon_size = 340
    poster_icon = img.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
    p_x = (W - icon_size) // 2
    p_y = (H - icon_size) // 2 - 20
    
    shadow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow_layer)
    shadow_draw.ellipse([p_x - 25, p_y - 25, p_x + icon_size + 25, p_y + icon_size + 25], fill=(168, 85, 247, 100))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(35))
    
    poster = Image.alpha_composite(poster, shadow_layer)
    poster.paste(poster_icon, (p_x, p_y), poster_icon)
    
    poster.save(os.path.join(store_dir, "poster_720x1080.png"), "PNG")
    print("  ✅ Generado: poster_720x1080.png (720x1080 Bicolor Glassmorphic)")

    # Guardar icon.ico
    ico_img = img.resize((32, 32), Image.Resampling.LANCZOS)
    ico_img.save(os.path.join(icons_dir, "icon.ico"), format="ICO")
    print("  ✅ Generado: icon.ico")

    print("\n🚀 ¡Todos los iconos y assets de la Microsoft Store generados con éxito!")

if __name__ == "__main__":
    generate_icons()
