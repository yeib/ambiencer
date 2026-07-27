// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use tauri::{
  menu::{Menu, MenuItem},
  tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
  AppHandle, Manager,
};

#[derive(Serialize, Deserialize, Debug)]
struct SystemStats {
  cpu_usage: f32,
  ram_used_gb: f32,
  ram_total_gb: f32,
}

#[tauri::command]
fn get_system_stats() -> SystemStats {
  SystemStats {
    cpu_usage: 14.5,
    ram_used_gb: 6.2,
    ram_total_gb: 16.0,
  }
}

#[tauri::command]
fn toggle_main_window(app: AppHandle) {
  if let Some(window) = app.get_webview_window("main") {
    if window.is_visible().unwrap_or(false) {
      let _ = window.hide();
    } else {
      let _ = window.show();
      let _ = window.unminimize();
      let _ = window.set_focus();
    }
  }
}

#[tauri::command]
fn set_desktop_wallpaper(image_data_base64: String) -> Result<String, String> {
  use base64::Engine;
  use std::fs;
  use std::process::Command;

  let clean_base64 = image_data_base64
    .trim_start_matches("data:image/png;base64,")
    .trim_start_matches("data:image/jpeg;base64,");

  let image_bytes = match base64::engine::general_purpose::STANDARD.decode(clean_base64) {
    Ok(bytes) => bytes,
    Err(e) => return Err(format!("Error al decodificar imagen: {}", e)),
  };

  let local_dir = std::env::temp_dir().join("ambiencer_wallpapers");
  let _ = fs::create_dir_all(&local_dir);

  let wallpaper_path = local_dir.join("current_wallpaper.png");

  if let Err(e) = fs::write(&wallpaper_path, image_bytes) {
    return Err(format!("Error al guardar imagen: {}", e));
  }

  let path_str = wallpaper_path.to_str().unwrap_or("");

  let ps_script = format!(
    r#"
    $path = "{}"
    Set-ItemProperty -Path 'HKCU:\Control Panel\Desktop' -Name Wallpaper -Value $path
    Set-ItemProperty -Path 'HKCU:\Control Panel\Desktop' -Name WallpaperStyle -Value '2'
    Set-ItemProperty -Path 'HKCU:\Control Panel\Desktop' -Name TileWallpaper -Value '0'
    $code = @'
    using System.Runtime.InteropServices;
    public class Wallpaper {{
        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        public static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
    }}
'@
    Add-Type -TypeDefinition $code
    [Wallpaper]::SystemParametersInfo(20, 0, $path, 3)
    RUNDLL32.EXE user32.dll,UpdatePerUserSystemParameters
    "#,
    path_str.replace('\\', "\\\\")
  );

  let output = Command::new("powershell")
    .args(["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", &ps_script])
    .output();

  match output {
    Ok(out) => {
      if out.status.success() {
        Ok("¡Fondo estático de Windows actualizado con éxito!".into())
      } else {
        let err_str = String::from_utf8_lossy(&out.stderr);
        Err(format!("Error en PowerShell: {}", err_str))
      }
    }
    Err(e) => Err(format!("Error al ejecutar script: {}", e)),
  }
}

#[tauri::command]
fn attach_live_wallpaper_to_desktop(window: tauri::WebviewWindow) -> Result<String, String> {
  #[cfg(target_os = "windows")]
  {
    use std::process::Command;

    let hwnd_raw = match window.hwnd() {
      Ok(h) => h.0 as usize,
      Err(e) => return Err(format!("No se obtuvo HWND: {}", e)),
    };

    let ps_script = format!(
      r#"
      $childHwnd = [IntPtr]{}
      $code = @'
      using System;
      using System.Runtime.InteropServices;

      public class DesktopWorker {{
          [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
          public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);

          [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
          public static extern IntPtr SendMessageTimeout(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam, uint fuFlags, uint uTimeout, out IntPtr lpdwResult);

          [DllImport("user32.dll", SetLastError = true)]
          public static extern IntPtr SetParent(IntPtr hWndChild, IntPtr hWndNewParent);

          [DllImport("user32.dll")]
          public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
          public delegate bool EnumWindowsProc(IntPtr hwnd, IntPtr lParam);

          [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
          public static extern IntPtr FindWindowEx(IntPtr hwndParent, IntPtr hwndChildAfter, string lpszClass, string lpszWindow);

          public static void Attach(IntPtr childHwnd) {{
              IntPtr progman = FindWindow("Progman", null);
              IntPtr result = IntPtr.Zero;
              SendMessageTimeout(progman, 0x052C, IntPtr.Zero, IntPtr.Zero, 0, 1000, out result);

              IntPtr workerw = IntPtr.Zero;
              EnumWindows((topHandle, topParam) => {{
                  IntPtr p = FindWindowEx(topHandle, IntPtr.Zero, "SHELLDLL_DefView", null);
                  if (p != IntPtr.Zero) {{
                      workerw = FindWindowEx(IntPtr.Zero, topHandle, "WorkerW", null);
                  }}
                  return true;
              }}, IntPtr.Zero);

              if (workerw == IntPtr.Zero) workerw = progman;
              SetParent(childHwnd, workerw);
          }}
      }}
'@
      Add-Type -TypeDefinition $code
      [DesktopWorker]::Attach($childHwnd)
      "#,
      hwnd_raw
    );

    let output = Command::new("powershell")
      .args(["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", &ps_script])
      .output();

    match output {
      Ok(out) => {
        if out.status.success() {
          let _ = window.set_fullscreen(true);
          Ok("¡Live Wallpaper fijado en tiempo real al escritorio de Windows! 🎬✨".into())
        } else {
          let err_str = String::from_utf8_lossy(&out.stderr);
          Err(format!("Error al acoplar a escritorio: {}", err_str))
        }
      }
      Err(e) => Err(format!("Error de comando: {}", e)),
    }
  }

  #[cfg(not(target_os = "windows"))]
  {
    Ok("Live Wallpaper simulado para SO no-Windows".into())
  }
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![
      get_system_stats,
      toggle_main_window,
      set_desktop_wallpaper,
      attach_live_wallpaper_to_desktop
    ])
    .setup(|app| {
      let quit_i = MenuItem::with_id(app, "quit", "Salir de Ambiencer", true, None::<&str>)?;
      let show_i = MenuItem::with_id(app, "show", "Mostrar / Ocultar Ambiencer", true, None::<&str>)?;
      let menu = Menu::with_items(app, &[&show_i, &quit_i])?;

      let _tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .on_menu_event(|app, event| match event.id.as_ref() {
          "show" => {
            if let Some(window) = app.get_webview_window("main") {
              if window.is_visible().unwrap_or(false) {
                let _ = window.hide();
              } else {
                let _ = window.show();
                let _ = window.unminimize();
                let _ = window.set_focus();
              }
            }
          }
          "quit" => {
            app.exit(0);
          }
          _ => {}
        })
        .on_tray_icon_event(|tray, event| {
          if let TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
          } = event
          {
            let app = tray.app_handle();
            if let Some(window) = app.get_webview_window("main") {
              if window.is_visible().unwrap_or(false) {
                let _ = window.hide();
              } else {
                let _ = window.show();
                let _ = window.unminimize();
                let _ = window.set_focus();
              }
            }
          }
        })
        .build(app)?;

      Ok(())
    })
    .on_window_event(|window, event| match event {
      tauri::WindowEvent::CloseRequested { api, .. } => {
        let _ = window.hide();
        api.prevent_close();
      }
      _ => {}
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
