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

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![
      get_system_stats,
      toggle_main_window
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
