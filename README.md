# 🌊 Ambiencer Pro — Ambient Soundscapes & Aesthetic Desktop Widgets

> **Ecosistema Yeib — Aplicación Nativa para Windows 10 / 11**

---

## 🔒 Nombre Reservado en Microsoft Partner Center
- **Nombre Oficial:** `Ambiencer` / `Ambiencer Pro`
- **Estado:** 🚧 **En Desarrollo (Próximamente en Microsoft Store)**

---

## 🌟 Concepto de la Aplicación

**Ambiencer Pro** transforma el escritorio de Windows 10/11 en un **espacio visual y sonoro minimalista**, enfocado en la concentración, estudio y relajación:
1. **Estudio de Sonido Ambiental & Enfoque (100% Offline):** Mezclador multicanal de paisajes sonoros (lluvia, tormenta, fogata, café, olas, teclado ASMR, ruido rosa/blanco procedimental).
2. **Widgets de Escritorio Glassmorphic:** Elementos flotantes sobre el fondo de pantalla (Relojes, Pomodoro, Monitor de Hardware, Notas traslúcidas).

---

## 🛠️ Stack Tecnológico & Arquitectura Yeib

* **Backend Nativo:** Rust + Tauri v2 (Consumo de RAM ~25 MB, binario ultraliviano ~20 MB).
* **Frontend UI:** Vanilla ES6 JS o React + Vite con **Dark Glassmorphism**.
* **Audio Engine:** Sintetizador web nativo (Web Audio API) + reproductores multihilo de bucles de audio offline libres de derechos (CC0 / Dominio público).
* **Cumplimiento Store:** 
  - Tiles PNG completos (`Square44x44`, `Square71x71`, `Square150x150`, `Wide310x150`, `Square310x310`, `StoreLogo`) según Política 10.1.1.11.
  - i18n Obligatorio (Español e Inglés sin recargar).
  - Modal de `SettingsModal` estándar del ecosistema.

---

## 🎨 Funcionalidades Clave para el V1

### 1. 🎛️ Mezclador de Sonidos Ambientales (100% Offline)
- **Canales mezclables con sliders individuales:**
  - 🌧️ Lluvia suave / Tormenta con truenos
  - ☕ Ambiente de Cafetería / Personas al fondo
  - 🪵 Fogata crujiente
  - 🌊 Olas del mar / Viento en bosque
  - ⌨️ Teclado mecánico ASMR
  - 🎧 Generador procedimental de Ruido Rosa / Ruido Blanco / Ondas Alfa (vía Web Audio API)
- **Presets de Enfoque:** Botones rápidos tipo *"Modo Lluvia Nocturna"*, *"Modo Café & Código"*, *"Modo Calma Total"*.

### 2. 🪟 Widgets Flotantes de Escritorio (Glassmorphism)
- **Reloj & Fecha Digital/Analógico:** Con tipografías limpias.
- **Temporizador Pomodoro:** 25min trabajo / 5min descanso con notificación nativa de Windows.
- **System Monitor Lite:** Barra discreta de uso de CPU, RAM y almacenamiento.
- **Post-It Glass:** Notas rápidas traslúcidas en pantalla con soporte de listas de tareas (Checklist).

---

## 🛠️ Comandos de Desarrollo

```powershell
# Instalar dependencias frontend (primera vez)
npm install

# Iniciar aplicación en modo desarrollo
npm run tauri dev

# Compilar para producción (MSIX / Windows App SDK)
npm run tauri build
```

---

© 2026 **Yeib Ecosystem** — Native Windows Desktop Apps.
