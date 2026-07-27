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

#[cfg(target_os = "windows")]
mod win32 {
  use std::ffi::OsStr;
  use std::os::windows::ffi::OsStrExt;

  #[link(name = "user32")]
  extern "system" {
    pub fn SystemParametersInfoW(
      uiAction: u32,
      uiParam: u32,
      pvParam: *const u16,
      fWinIni: u32,
    ) -> i32;

    pub fn FindWindowW(lpClassName: *const u16, lpWindowName: *const u16) -> isize;
    pub fn SendMessageTimeoutW(
      hWnd: isize,
      Msg: u32,
      wParam: usize,
      lParam: isize,
      fuFlags: u32,
      uTimeout: u32,
      lpdwResult: *mut usize,
    ) -> isize;
    pub fn EnumWindows(
      lpEnumFunc: extern "system" fn(hwnd: isize, lParam: isize) -> i32,
      lParam: isize,
    ) -> i32;
    pub fn FindWindowExW(
      hwndParent: isize,
      hwndChildAfter: isize,
      lpszClass: *const u16,
      lpszWindow: *const u16,
    ) -> isize;
    pub fn SetParent(hWndChild: isize, hWndNewParent: isize) -> isize;
    pub fn GetWindowLongPtrW(hWnd: isize, nIndex: i32) -> isize;
    pub fn SetWindowLongPtrW(hWnd: isize, nIndex: i32, dwNewLong: isize) -> isize;
    pub fn SetWindowPos(
      hWnd: isize,
      hWndInsertAfter: isize,
      X: i32,
      Y: i32,
      cx: i32,
      cy: i32,
      uFlags: u32,
    ) -> i32;
    pub fn GetSystemMetrics(nIndex: i32) -> i32;
  }

  pub fn to_wstring(str: &str) -> Vec<u16> {
    OsStr::new(str).encode_wide().chain(std::iter::once(0)).collect()
  }
}

#[cfg(target_os = "windows")]
struct EnumData {
  workerw: isize,
}

#[cfg(target_os = "windows")]
extern "system" fn enum_windows_callback(tophandle: isize, lparam: isize) -> i32 {
  unsafe {
    let p = win32::FindWindowExW(
      tophandle,
      0,
      win32::to_wstring("SHELLDLL_DefView").as_ptr(),
      std::ptr::null(),
    );
    if p != 0 {
      let worker = win32::FindWindowExW(
        0,
        tophandle,
        win32::to_wstring("WorkerW").as_ptr(),
        std::ptr::null(),
      );
      if worker != 0 {
        let data = &mut *(lparam as *mut EnumData);
        data.workerw = worker;
        return 0;
      }
    }
    1
  }
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

  let clean_base64 = image_data_base64
    .trim_start_matches("data:image/png;base64,")
    .trim_start_matches("data:image/jpeg;base64,");

  let image_bytes = match base64::engine::general_purpose::STANDARD.decode(clean_base64) {
    Ok(bytes) => bytes,
    Err(e) => return Err(format!("Error al decodificar imagen: {}", e)),
  };

  let pictures_dir = match std::env::var("USERPROFILE") {
    Ok(profile) => std::path::PathBuf::from(profile).join("Pictures"),
    Err(_) => std::env::temp_dir(),
  };
  let _ = fs::create_dir_all(&pictures_dir);
  let wallpaper_jpg = pictures_dir.join("Ambiencer_Wallpaper.jpg");

  if let Err(e) = fs::write(&wallpaper_jpg, image_bytes) {
    return Err(format!("Error al guardar imagen JPG: {}", e));
  }

  let path_str = wallpaper_jpg.to_str().unwrap_or("");

  #[cfg(target_os = "windows")]
  {
    use std::process::Command;

    // Actualizar registro de Windows de forma directa para persistencia
    let _ = Command::new("reg")
      .args(["add", "HKCU\\Control Panel\\Desktop", "/v", "Wallpaper", "/t", "REG_SZ", "/d", path_str, "/f"])
      .output();
    let _ = Command::new("reg")
      .args(["add", "HKCU\\Control Panel\\Desktop", "/v", "WallpaperStyle", "/t", "REG_SZ", "/d", "2", "/f"])
      .output();
    let _ = Command::new("reg")
      .args(["add", "HKCU\\Control Panel\\Desktop", "/v", "TileWallpaper", "/t", "REG_SZ", "/d", "0", "/f"])
      .output();

    // Invocar SystemParametersInfoW directamente desde Rust (20 = SPI_SETDESKWALLPAPER, 3 = SPIF_UPDATEINIFILE | SPIF_SENDCHANGE)
    let wide_path = win32::to_wstring(path_str);
    unsafe {
      win32::SystemParametersInfoW(20, 0, wide_path.as_ptr(), 1 | 2);
    }
  }

  Ok("¡Fondo de escritorio de Windows actualizado con éxito!".into())
}

#[tauri::command]
fn attach_live_wallpaper_to_desktop(window: tauri::WebviewWindow) -> Result<String, String> {
  #[cfg(target_os = "windows")]
  {
    unsafe {
      let hwnd = match window.hwnd() {
        Ok(h) => h.0 as isize,
        Err(e) => return Err(format!("No se obtuvo HWND: {}", e)),
      };

      // 1. Enviar WM_SPAWN_WORKER (0x052C) a Progman para iniciar WorkerW en Windows
      let progman = win32::FindWindowW(win32::to_wstring("Progman").as_ptr(), std::ptr::null());
      let mut result = 0usize;
      win32::SendMessageTimeoutW(progman, 0x052C, 0, 0, 0, 1000, &mut result);

      // 2. Localizar WorkerW
      let mut data = EnumData { workerw: 0 };
      win32::EnumWindows(enum_windows_callback, &mut data as *mut EnumData as isize);

      let mut workerw = data.workerw;
      if workerw == 0 {
        workerw = win32::FindWindowExW(progman, 0, win32::to_wstring("WorkerW").as_ptr(), std::ptr::null());
      }
      if workerw == 0 {
        workerw = progman;
      }

      // 3. Quitar estilos WS_POPUP, WS_CAPTION y agregar WS_CHILD para no congelar Webview2
      let mut style = win32::GetWindowLongPtrW(hwnd, -16);
      style &= !(0x80000000u32 as isize); // quitar WS_POPUP
      style &= !0x00C00000isize;          // quitar WS_CAPTION
      style &= !0x00040000isize;          // quitar WS_THICKFRAME
      style |= 0x40000000isize;           // agregar WS_CHILD
      style |= 0x10000000isize;           // agregar WS_VISIBLE
      win32::SetWindowLongPtrW(hwnd, -16, style);

      // 4. Anclar como hijo de WorkerW detrás de los iconos
      win32::SetParent(hwnd, workerw);

      // 5. Expandir al tamaño completo de la pantalla
      let width = win32::GetSystemMetrics(0);
      let height = win32::GetSystemMetrics(1);
      win32::SetWindowPos(hwnd, 0, 0, 0, width, height, 0x0040);

      Ok("¡Live Wallpaper fijado detrás de los iconos del escritorio con éxito! 🎬✨".into())
    }
  }

  #[cfg(not(target_os = "windows"))]
  {
    Ok("Modo Live no disponible en SO no-Windows".into())
  }
}

#[tauri::command]
fn detach_live_wallpaper_from_desktop(window: tauri::WebviewWindow) -> Result<String, String> {
  #[cfg(target_os = "windows")]
  {
    unsafe {
      let hwnd = match window.hwnd() {
        Ok(h) => h.0 as isize,
        Err(e) => return Err(format!("No se obtuvo HWND: {}", e)),
      };

      // 1. Restaurar padre al escritorio principal (parent = 0)
      win32::SetParent(hwnd, 0);

      // 2. Restaurar estilos normales de ventana
      let mut style = win32::GetWindowLongPtrW(hwnd, -16);
      style &= !0x40000000isize;            // quitar WS_CHILD
      style |= 0x80000000u32 as isize;      // restaurar WS_POPUP
      style |= 0x00C00000isize;             // restaurar WS_CAPTION
      style |= 0x00040000isize;             // restaurar WS_THICKFRAME
      style |= 0x00020000isize;             // restaurar WS_MINIMIZEBOX
      style |= 0x00010000isize;             // restaurar WS_MAXIMIZEBOX
      style |= 0x10000000isize;             // mantener WS_VISIBLE
      win32::SetWindowLongPtrW(hwnd, -16, style);

      // 3. Restaurar tamaño de Ambiencer y centrar
      let width = 1150;
      let height = 780;
      let screen_w = win32::GetSystemMetrics(0);
      let screen_h = win32::GetSystemMetrics(1);
      let x = (screen_w - width) / 2;
      let y = (screen_h - height) / 2;
      win32::SetWindowPos(hwnd, 0, x, y, width, height, 0x0040);

      Ok("¡Ventana normal de Ambiencer restaurada al escritorio! 🖥️".into())
    }
  }

  #[cfg(not(target_os = "windows"))]
  {
    Ok("Restaurado en SO no-Windows".into())
  }
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![
      get_system_stats,
      toggle_main_window,
      set_desktop_wallpaper,
      attach_live_wallpaper_to_desktop,
      detach_live_wallpaper_from_desktop
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
