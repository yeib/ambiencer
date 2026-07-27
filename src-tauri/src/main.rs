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

  // Dedicated AppData folder for wallpaper persistence
  let local_dir = std::env::temp_dir().join("ambiencer_wallpapers");
  let _ = fs::create_dir_all(&local_dir);

  let wallpaper_path = local_dir.join("current_wallpaper.png");

  if let Err(e) = fs::write(&wallpaper_path, image_bytes) {
    return Err(format!("Error al guardar imagen: {}", e));
  }

  let path_str = wallpaper_path.to_str().unwrap_or("");

  // Windows 10/11 Registry & SystemParametersInfo PowerShell update
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
        Ok("¡Fondo de pantalla de Windows actualizado con éxito! 🖥️✨".into())
      } else {
        let err_str = String::from_utf8_lossy(&out.stderr);
        Err(format!("Error en PowerShell: {}", err_str))
      }
    }
    Err(e) => Err(format!("Error al ejecutar script de fondo: {}", e)),
  }
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![
      get_system_stats,
      toggle_main_window,
      set_desktop_wallpaper
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
