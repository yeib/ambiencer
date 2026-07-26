// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, Manager};

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
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
