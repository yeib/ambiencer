#[cfg(target_os = "windows")]
pub mod win32 {
  #![allow(non_snake_case)]
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
      lpEnumFunc: extern "system" fn(hwnd: isize, l_param: isize) -> i32,
      l_param: isize,
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
pub fn set_desktop_wallpaper(image_data_base64: String) -> Result<String, String> {
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

    // Invocar SystemParametersInfoW directamente desde Rust
    let wide_path = win32::to_wstring(path_str);
    unsafe {
      win32::SystemParametersInfoW(20, 0, wide_path.as_ptr(), 1 | 2);
    }
  }

  Ok("¡Fondo de escritorio de Windows actualizado con éxito!".into())
}

#[tauri::command]
pub fn attach_live_wallpaper_to_desktop(app: tauri::AppHandle) -> Result<String, String> {
  #[cfg(target_os = "windows")]
  {
    use tauri::Manager;
    unsafe {
      let live_win = match app.get_webview_window("live_wallpaper") {
        Some(w) => w,
        None => return Err("Ventana live_wallpaper no encontrada en tauri.conf.json".into()),
      };

      let hwnd = match live_win.hwnd() {
        Ok(h) => h.0 as isize,
        Err(e) => return Err(format!("No se obtuvo HWND: {}", e)),
      };

      let progman = win32::FindWindowW(win32::to_wstring("Progman").as_ptr(), std::ptr::null());
      let mut result = 0usize;
      win32::SendMessageTimeoutW(progman, 0x052C, 0, 0, 0, 1000, &mut result);

      let mut data = EnumData { workerw: 0 };
      win32::EnumWindows(enum_windows_callback, &mut data as *mut EnumData as isize);

      let mut workerw = data.workerw;
      if workerw == 0 {
        workerw = win32::FindWindowExW(progman, 0, win32::to_wstring("WorkerW").as_ptr(), std::ptr::null());
      }
      if workerw == 0 {
        workerw = progman;
      }

      let mut style = win32::GetWindowLongPtrW(hwnd, -16);
      style &= !(0x80000000u32 as isize); // WS_POPUP
      style &= !0x00C00000isize;          // WS_CAPTION
      style &= !0x00040000isize;          // WS_THICKFRAME
      style |= 0x40000000isize;           // WS_CHILD
      style |= 0x10000000isize;           // WS_VISIBLE
      win32::SetWindowLongPtrW(hwnd, -16, style);

      win32::SetParent(hwnd, workerw);

      let width = win32::GetSystemMetrics(0);
      let height = win32::GetSystemMetrics(1);
      win32::SetWindowPos(hwnd, 0, 0, 0, width, height, 0x0040);

      let _ = live_win.show();

      Ok("¡Live Wallpaper fijado detrás de los iconos del escritorio con éxito! 🎬✨".into())
    }
  }

  #[cfg(not(target_os = "windows"))]
  {
    Ok("Modo Live no disponible en SO no-Windows".into())
  }
}

#[tauri::command]
pub fn detach_live_wallpaper_from_desktop(app: tauri::AppHandle) -> Result<String, String> {
  #[cfg(target_os = "windows")]
  {
    use tauri::Manager;
    unsafe {
      if let Some(window) = app.get_webview_window("live_wallpaper") {
        if let Ok(hwnd) = window.hwnd() {
          win32::SetParent(hwnd.0 as isize, 0);
        }
        let _ = window.hide();
      }
    }
  }
  Ok("¡Live Wallpaper detenido y escritorio normal restaurado! 🖥️".into())
}

#[tauri::command]
pub fn set_start_with_windows(enabled: bool) -> Result<String, String> {
  #[cfg(target_os = "windows")]
  {
    use std::process::Command;
    let exe_path = match std::env::current_exe() {
      Ok(p) => p.to_string_lossy().to_string(),
      Err(e) => return Err(format!("Error obteniendo ruta: {}", e)),
    };

    if enabled {
      let _ = Command::new("reg")
        .args([
          "add",
          "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
          "/v",
          "Ambiencer",
          "/t",
          "REG_SZ",
          "/d",
          &format!("\"{}\" --autostart", exe_path),
          "/f",
        ])
        .output();
    } else {
      let _ = Command::new("reg")
        .args([
          "delete",
          "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
          "/v",
          "Ambiencer",
          "/f",
        ])
        .output();
    }
  }
  Ok("Inicio con Windows actualizado con éxito".into())
}
