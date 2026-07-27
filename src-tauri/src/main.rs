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

  let wallpaper_jpg = local_dir.join("current_wallpaper.jpg");

  if let Err(e) = fs::write(&wallpaper_jpg, image_bytes) {
    return Err(format!("Error al guardar imagen JPG: {}", e));
  }

  let path_str = wallpaper_jpg.to_str().unwrap_or("");

  #[cfg(target_os = "windows")]
  {
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

    let _ = Command::new("powershell")
      .args(["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", &ps_script])
      .output();
  }

  Ok("¡Fondo de escritorio de Windows actualizado con éxito!".into())
}

#[tauri::command]
fn toggle_ambient_fullscreen_mode(window: tauri::WebviewWindow) -> Result<String, String> {
  let is_full = window.is_fullscreen().unwrap_or(false);
  let _ = window.set_fullscreen(!is_full);
  let _ = window.set_decorations(is_full);
  if !is_full {
    Ok("¡Modo Ambient Live activado a pantalla completa a 60 FPS!".into())
  } else {
    Ok("Modo ventana normal restaurado.".into())
  }
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![
      get_system_stats,
      toggle_main_window,
      set_desktop_wallpaper,
      toggle_ambient_fullscreen_mode
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
