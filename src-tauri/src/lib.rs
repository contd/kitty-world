// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
fn get_platform_info() -> serde_json::Value {
    serde_json::json!({
        "platform": std::env::consts::OS,
        "arch": std::env::consts::ARCH,
        "tauri_version": "2.0",
        "offline_ready": true
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![get_platform_info])
        .run(tauri::generate_context!())
        .expect("error while running Whiskers Adventure Tauri application");
}
