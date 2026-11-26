use std::{
    env, fs,
    path::{Path, PathBuf},
    sync::Mutex,
};

use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use tauri::{Manager, State};

struct Database(Mutex<Connection>);

const DATABASE_FILE_NAME: &str = "pass-man.sqlite3";
const PORTABLE_DATA_DIRECTORY: &str = "PassMan.data";

#[derive(Deserialize)]
struct NewPasswordItem {
    encrypted_data: String,
    iv: String,
    salt: String,
}

#[derive(Deserialize)]
struct UpdatedPasswordItem {
    id: i64,
    encrypted_data: String,
    iv: String,
    salt: String,
}

#[derive(Deserialize, Serialize)]
struct PasswordItem {
    id: i64,
    encrypted_data: String,
    iv: String,
    salt: String,
    created_at: String,
}

#[derive(Deserialize, Serialize)]
struct PasswordBackup {
    version: u32,
    items: Vec<PasswordItem>,
}

fn with_connection<T>(
    database: State<'_, Database>,
    operation: impl FnOnce(&mut Connection) -> rusqlite::Result<T>,
) -> Result<T, String> {
    let mut connection = database
        .0
        .lock()
        .map_err(|_| "The password database lock is poisoned".to_string())?;

    operation(&mut connection).map_err(|error| error.to_string())
}

fn portable_data_directory() -> Option<PathBuf> {
    if let Some(directory) = env::var_os("PASSMAN_DATA_DIR") {
        return Some(PathBuf::from(directory));
    }

    if let Some(app_image) = env::var_os("APPIMAGE") {
        return Path::new(&app_image)
            .parent()
            .map(|directory| directory.join(PORTABLE_DATA_DIRECTORY));
    }

    env::var_os("APPDIR")
        .map(PathBuf::from)
        .map(|directory| directory.join(PORTABLE_DATA_DIRECTORY))
}

fn database_path(app: &tauri::App) -> Result<PathBuf, Box<dyn std::error::Error>> {
    let standard_data_directory = app.path().app_data_dir()?;
    let data_directory =
        portable_data_directory().unwrap_or_else(|| standard_data_directory.clone());
    let database_path = data_directory.join(DATABASE_FILE_NAME);

    fs::create_dir_all(&data_directory)?;

    let legacy_database_path = standard_data_directory.join(DATABASE_FILE_NAME);

    if database_path != legacy_database_path
        && !database_path.exists()
        && legacy_database_path.exists()
    {
        fs::copy(legacy_database_path, &database_path)?;
    }

    Ok(database_path)
}

#[tauri::command]
fn list_password_items(database: State<'_, Database>) -> Result<Vec<PasswordItem>, String> {
    with_connection(database, |connection| {
        let mut statement = connection.prepare(
            "SELECT id, encrypted_data, iv, salt, created_at
             FROM password_items
             ORDER BY id",
        )?;

        let items = statement.query_map([], |row| {
            Ok(PasswordItem {
                id: row.get(0)?,
                encrypted_data: row.get(1)?,
                iv: row.get(2)?,
                salt: row.get(3)?,
                created_at: row.get(4)?,
            })
        })?;

        items.collect()
    })
}

#[tauri::command]
fn create_password_item(
    database: State<'_, Database>,
    item: NewPasswordItem,
) -> Result<(), String> {
    with_connection(database, |connection| {
        connection.execute(
            "INSERT INTO password_items (encrypted_data, iv, salt)
             VALUES (?1, ?2, ?3)",
            params![item.encrypted_data, item.iv, item.salt],
        )?;

        Ok(())
    })
}

#[tauri::command]
fn update_password_item(
    database: State<'_, Database>,
    item: UpdatedPasswordItem,
) -> Result<(), String> {
    with_connection(database, |connection| {
        let updated = connection.execute(
            "UPDATE password_items
             SET encrypted_data = ?1,
                 iv = ?2,
                 salt = ?3,
                 created_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
             WHERE id = ?4",
            params![item.encrypted_data, item.iv, item.salt, item.id],
        )?;

        if updated == 0 {
            return Err(rusqlite::Error::QueryReturnedNoRows);
        }

        Ok(())
    })
}

#[tauri::command]
fn delete_password_item(database: State<'_, Database>, id: i64) -> Result<(), String> {
    with_connection(database, |connection| {
        let deleted = connection.execute("DELETE FROM password_items WHERE id = ?1", [id])?;

        if deleted == 0 {
            return Err(rusqlite::Error::QueryReturnedNoRows);
        }

        Ok(())
    })
}

#[tauri::command]
fn export_password_items(database: State<'_, Database>) -> Result<String, String> {
    let items = list_password_items(database)?;
    serde_json::to_string_pretty(&PasswordBackup { version: 1, items })
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn import_password_items(database: State<'_, Database>, contents: String) -> Result<usize, String> {
    let backup: PasswordBackup =
        serde_json::from_str(&contents).map_err(|error| error.to_string())?;

    if backup.version != 1 {
        return Err(format!(
            "Unsupported PassMan backup version: {}",
            backup.version
        ));
    }

    if backup
        .items
        .iter()
        .any(|item| item.encrypted_data.is_empty() || item.iv.is_empty() || item.salt.is_empty())
    {
        return Err("The backup contains an invalid password record".to_string());
    }

    let count = backup.items.len();
    with_connection(database, |connection| {
        let transaction = connection.transaction()?;
        transaction.execute("DELETE FROM password_items", [])?;

        for item in backup.items {
            transaction.execute(
                "INSERT INTO password_items (id, encrypted_data, iv, salt, created_at)
                 VALUES (?1, ?2, ?3, ?4, ?5)",
                params![
                    item.id,
                    item.encrypted_data,
                    item.iv,
                    item.salt,
                    item.created_at
                ],
            )?;
        }

        transaction.commit()
    })?;

    Ok(count)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            let connection = Connection::open(database_path(app)?)?;
            connection.execute_batch(
                "CREATE TABLE IF NOT EXISTS password_items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    encrypted_data TEXT NOT NULL,
                    iv TEXT NOT NULL,
                    salt TEXT NOT NULL,
                    created_at TEXT NOT NULL
                        DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
                );",
            )?;

            app.manage(Database(Mutex::new(connection)));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_password_items,
            create_password_item,
            update_password_item,
            delete_password_item,
            export_password_items,
            import_password_items,
        ])
        .run(tauri::generate_context!())
        .expect("error while running PassMan desktop");
}
