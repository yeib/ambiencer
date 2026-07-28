# 📱 Hoja de Ruta: Adaptación de Ambiencer Pro a Android (Google Play Store)

> **Objetivo:** Llevar el mezclador de sonidos ambientales, frecuencias binaurales y fondos animados (Live Wallpapers) 100% offline de Ambiencer Pro a celulares Android reutilizando el motor Web Audio + Canvas React actual, manteniendo cero consumo de internet y consumo mínimo de batería.

---

## 🏗️ 1. Arquitectura Técnica Recomendada

```mermaid
graph TD
    A["🎨 Frontend React + Web Audio + Canvas (Código Actual)"] --> B["⚡ Tauri v2 Mobile / Capacitor"]
    B --> C["📱 WebView Nativa Android (60 FPS)"]
    C --> D["🎧 MediaSession API + Foreground Service"]
    C --> F["🖼️ Android Live Wallpaper Service"]
    D --> E["🔒 Reproducción Continua con Pantalla Apagada"]
    F --> G["📱 Fondos Animados Nativos en Pantalla de Inicio Android"]
```

| Capa | Tecnología Seleccionada | Justificación |
| :--- | :--- | :--- |
| **Frontend UI & Audio** | **React + Web Audio API + HTML5 Canvas** | Cero reescritura. Los fondos procedimentales en Canvas 2D/Shaders y la mezcla de audio funcionan 100% en WebView Android. |
| **Wrapper Nativo** | **Tauri v2 Mobile** *(o Capacitor)* | Utiliza la infraestructura de Tauri v2 ya instalada para empaquetar en `.aab` / `.apk`. |
| **Audio Segundo Plano** | **Android Foreground Media Service** | Garantiza que Android no corte el audio cuando la pantalla se apaga o se bloquea. |
| **Fondos Animados** | **Android `WallpaperService`** | Servicio nativo de Android que renderiza los fondos animados directamente en la pantalla de inicio del teléfono. |

---

## 🛠️ 2. Fases de Desarrollo Paso a Paso

### 📍 Fase 1: Adaptación de la Interfaz (Layout Móvil Vertical)
1. **Layout Responsive (9:16):**
   - Adaptar las tarjetas del mezclador de sonidos y frecuencias binaurales para pantallas verticales de smartphones.
   - Ocultar los widgets de escritorio exclusivos de Windows y priorizar la vista de Mezclador + Fondos Animados + Temporizador de Apagado (Sleep Timer).
2. **Controles Táctiles (Touch-Friendly):**
   - Optimizar los faders y perillas de volumen para gestos táctiles fluidos.

---

### 📍 Fase 2: Configuración del Entorno Móvil (Tauri Mobile)
1. **Inicialización de Android:**
   ```bash
   # Inicializar soporte de Android en el proyecto Tauri v2
   npx tauri android init
   ```
2. **Generación del Proyecto Android Studio:**
   - Tauri creará la carpeta nativa en `src-tauri/gen/android`.

---

### 📍 Fase 3: Integración de Audio en Segundo Plano (Screen Off Audio)
Para evitar que Android suspenda el proceso al apagar la pantalla:

1. **Habilitar `MediaSession API` en JS:**
   - Permite que el sistema Android muestre el reproductor en la pantalla de bloqueo y en la barra de notificaciones.
2. **Wakelock de Audio & Permisos Android:**
   - Declarar permisos en `AndroidManifest.xml`:
     - `<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />`
     - `<uses-permission android:name="android.permission.WAKE_LOCK" />`

---

### 📍 Fase 4: Fondos Animados Nativos en Android (`WallpaperService`)
Android cuenta con soporte nativo para **Live Wallpapers** mediante la API `WallpaperService`:

1. **Cómo funciona en Android:**
   - Se registra un servicio nativo de fondos animados en `AndroidManifest.xml`:
     ```xml
     <service
         android:name=".AmbiencerLiveWallpaperService"
         android:label="Ambiencer Live Wallpaper"
         android:permission="android.permission.BIND_WALLPAPER">
         <intent-filter>
             <action android:name="android.service.wallpaper.WallpaperService" />
         </intent-filter>
         <meta-data
             android:name="android.service.wallpaper"
             android:resource="@xml/wallpaper" />
     </service>
     ```
2. **Renderizado del Canvas actual:**
   - El servicio nativo renderiza el Canvas HTML5/CSS3 de nuestros fondos animaciones (Neon Wave, Aurora, Lluvia, etc.) directamente en la capa de fondo de pantalla del smartphone a 60 FPS con aceleración por GPU.
3. **Selector de Fondos Nativo de Android:**
   - El usuario podrá abrir el menú nativo de su teléfono (*Ajustes ➔ Fondo de pantalla ➔ Fondos animados ➔ Ambiencer*) o seleccionarlo con 1 clic dentro de nuestra app.

---

### 📍 Fase 5: Optimización de Peso de Assets & Batería
1. **Compresión de Archivos de Sonido:**
   - Convertir los assets de sonido a formato `.ogg` / `.webm` (64-96 kbps). Esto reduce el tamaño total de la app a menos de ~25 MB.
2. **Optimización de Batería (GPU Scaling):**
   - Pausar el renderizado del fondo animado automáticamente cuando el usuario abre otra app a pantalla completa o apaga la pantalla del celular.

---

### 📍 Fase 6: Compilación & Publicación en Google Play
1. **Generación del Bundle de Producción:**
   ```bash
   # Generar archivo AAB para Google Play Console
   npx tauri android build --bundle aab
   ```
2. **Firma de la App (Keystore):**
   - Generar clave digital `.keystore` para firmar el paquete para Google Play Store.
3. **Publicación en Google Play Console:**
   - Subida del `.aab`, capturas de pantalla de móvil y ficha de tienda.

---

## 💡 Ventajas de este Enfoque
- **100% de la App Portada:** Tanto la suite de audio como los fondos animados funcionan en Android.
- **Rendimiento Ultraliviano:** Renderizado directo en GPU con mínimo consumo de batería.
- **Doble Monetización:** Excelente oportunidad para lanzar Ambiencer Pro Mobile en Google Play Store.

---

© 2026 **Yeib Ecosystem** — High-Performance Mobile Ambient Soundscapes & Live Wallpapers.
