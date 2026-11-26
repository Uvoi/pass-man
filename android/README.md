# PassMan Android

The Android shell reuses the React application from `../frontend` and stores its SQLite database in Android's private application storage.

## Prerequisites

- Android Studio with Android SDK, Platform Tools, Build Tools, Command-line Tools and NDK installed
- JDK 17 or newer
- Rustup with the Android Rust targets installed
- `JAVA_HOME`, `ANDROID_HOME` and `NDK_HOME` configured, or the standard Linux locations used by `scripts/tauri.mjs`

## First setup

```bash
cd android
pnpm install
pnpm run init
```

## Run on an emulator or USB-connected device

```bash
pnpm run dev
```

Use `pnpm run dev:open` to open the generated project in Android Studio.

## Build

```bash
pnpm run build:debug-apk
pnpm run build:apk
pnpm run build:aab
```

`build:debug-apk` creates an installable ARM64 development APK using Android's debug key (suitable for almost all current phones). Release APK/AAB output must be signed with your private release key before distribution or Google Play upload.

The installable debug file is copied to `android/artifacts/PassMan-Android-debug.apk`.

PassMan backups can be exported and imported from the PassMan screen. Import replaces all current records transactionally. Backups contain encrypted records, but they should still be treated as sensitive data.
