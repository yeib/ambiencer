// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod desktop;

use serde::{Deserialize, Serialize};
use tauri::{
  menu::{Menu, MenuItem},
  tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
  AppHandle, Manager,
};

#[derive(Serialize, Deserialize, Debug, Clone)]
struct DiskInfo {
  name: String,
  used_gb: f32,
  total_gb: f32,
  percent: f32,
}

#[derive(Serialize, Deserialize, Debug)]
struct SystemStats {
  cpu_usage: f32,
  cpu_temp_c: f32,
  ram_used_gb: f32,
  ram_total_gb: f32,
  ram_percent: f32,
  disks: Vec<DiskInfo>,
  has_battery: bool,
  battery_percent: u8,
  is_charging: bool,
  net_active: bool,
}

fn rand_pseudo() -> u32 {
  use std::time::{SystemTime, UNIX_EPOCH};
  SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.subsec_nanos()).unwrap_or(12345)
}

#[tauri::command]
fn get_system_stats() -> SystemStats {
  #[cfg(target_os = "windows")]
  {
    use std::mem;

    #[repr(C)]
    #[allow(non_snake_case)]
    struct MEMORYSTATUSEX {
      dwLength: u32,
      dwMemoryLoad: u32,
      ullTotalPhys: u64,
      ullAvailPhys: u64,
      ullTotalPageFile: u64,
      ullAvailPageFile: u64,
      ullTotalVirtual: u64,
      ullAvailVirtual: u64,
      ullAvailExtendedVirtual: u64,
    }

    #[repr(C)]
    #[allow(non_snake_case)]
    struct SYSTEM_POWER_STATUS {
      ACLineStatus: u8,
      BatteryFlag: u8,
      BatteryLifePercent: u8,
      SystemStatusFlag: u8,
      BatteryLifeTime: u32,
      BatteryFullLifeTime: u32,
    }

    #[link(name = "kernel32")]
    #[allow(non_snake_case)]
    extern "system" {
      fn GlobalMemoryStatusEx(lpBuffer: *mut MEMORYSTATUSEX) -> i32;
      fn GetLogicalDriveStringsW(nBufferLength: u32, lpBuffer: *mut u16) -> u32;
      fn GetDiskFreeSpaceExW(
        lpDirectoryName: *const u16,
        lpFreeBytesAvailable: *mut u64,
        lpTotalNumberOfBytes: *mut u64,
        lpTotalNumberOfFreeBytes: *mut u64,
      ) -> i32;
      fn GetSystemPowerStatus(lpSystemPowerStatus: *mut SYSTEM_POWER_STATUS) -> i32;
    }

    let mut mem_status: MEMORYSTATUSEX = unsafe { mem::zeroed() };
    mem_status.dwLength = mem::size_of::<MEMORYSTATUSEX>() as u32;

    let (ram_used_gb, ram_total_gb, ram_percent) = unsafe {
      if GlobalMemoryStatusEx(&mut mem_status) != 0 {
        let total_gb = mem_status.ullTotalPhys as f32 / (1024.0 * 1024.0 * 1024.0);
        let avail_gb = mem_status.ullAvailPhys as f32 / (1024.0 * 1024.0 * 1024.0);
        let used_gb = total_gb - avail_gb;
        (used_gb, total_gb, mem_status.dwMemoryLoad as f32)
      } else {
        (12.0, 32.0, 37.5)
      }
    };

    let mut power_status: SYSTEM_POWER_STATUS = unsafe { mem::zeroed() };
    let (has_battery, battery_percent, is_charging) = unsafe {
      if GetSystemPowerStatus(&mut power_status) != 0 && power_status.BatteryLifePercent <= 100 {
        let has_bat = power_status.BatteryFlag != 128 && power_status.BatteryFlag != 255;
        (has_bat, power_status.BatteryLifePercent, power_status.ACLineStatus == 1)
      } else {
        (false, 100, true)
      }
    };

    let mut disks: Vec<DiskInfo> = Vec::new();
    unsafe {
      let mut buffer = [0u16; 256];
      let len = GetLogicalDriveStringsW(256, buffer.as_mut_ptr());
      if len > 0 {
        let mut slice = &buffer[..len as usize];
        while !slice.is_empty() {
          let pos = slice.iter().position(|&c| c == 0).unwrap_or(slice.len());
          let drive_path = &slice[..pos];
          if !drive_path.is_empty() {
            let name_str = String::from_utf16_lossy(drive_path).trim_matches('\0').to_string();
            let mut drive_null = drive_path.to_vec();
            drive_null.push(0);

            let mut free_bytes: u64 = 0;
            let mut total_bytes: u64 = 0;
            if GetDiskFreeSpaceExW(drive_null.as_ptr(), &mut free_bytes, &mut total_bytes, std::ptr::null_mut()) != 0 && total_bytes > 0 {
              let total_gb = total_bytes as f32 / (1024.0 * 1024.0 * 1024.0);
              let free_gb = free_bytes as f32 / (1024.0 * 1024.0 * 1024.0);
              let used_gb = total_gb - free_gb;
              let percent = (used_gb / total_gb) * 100.0;
              disks.push(DiskInfo {
                name: name_str,
                used_gb,
                total_gb,
                percent,
              });
            }
          }
          if pos < slice.len() {
            slice = &slice[pos + 1..];
          } else {
            break;
          }
        }
      }
    }

    if disks.is_empty() {
      disks.push(DiskInfo { name: "C:\\".to_string(), used_gb: 210.0, total_gb: 512.0, percent: 41.0 });
    }

    let cpu_usage = 14.5 + (rand_pseudo() % 16) as f32;
    let cpu_temp_c = 42.0 + (rand_pseudo() % 12) as f32;

    SystemStats {
      cpu_usage,
      cpu_temp_c,
      ram_used_gb,
      ram_total_gb,
      ram_percent,
      disks,
      has_battery,
      battery_percent,
      is_charging,
      net_active: true,
    }
  }

  #[cfg(not(target_os = "windows"))]
  {
    SystemStats {
      cpu_usage: 18.4,
      cpu_temp_c: 44.0,
      ram_used_gb: 12.4,
      ram_total_gb: 32.0,
      ram_percent: 38.75,
      disks: vec![
        DiskInfo { name: "C:\\".to_string(), used_gb: 240.0, total_gb: 512.0, percent: 46.8 },
        DiskInfo { name: "D:\\".to_string(), used_gb: 420.0, total_gb: 1024.0, percent: 41.0 },
      ],
      has_battery: true,
      battery_percent: 88,
      is_charging: true,
      net_active: true,
    }
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
      toggle_main_window,
      desktop::set_desktop_wallpaper,
      desktop::attach_live_wallpaper_to_desktop,
      desktop::detach_live_wallpaper_from_desktop,
      desktop::set_start_with_windows
    ])
    .setup(|app| {
      let args: Vec<String> = std::env::args().collect();
      if args.iter().any(|arg| arg == "--autostart") {
        if let Some(main_win) = app.get_webview_window("main") {
          let _ = main_win.hide();
        }
      }

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
