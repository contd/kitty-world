# iOS Setup and Platform Guide — Tauri v2

This guide documents the setup, architecture, and compilation workflow for deploying **Whiskers & Wonders** to Apple iOS (iPhone and iPad) using **Tauri v2**.

---

## 1. Prerequisites (Apple macOS Host)

To compile and package the native iOS application shell, the following tools must be installed on your macOS development workstation:

1. **Xcode 15+** with iOS 17+ SDK and command-line tools:
   ```bash
   xcode-select --install
   ```
2. **Rust & Cargo** (v1.77+):
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```
3. **Rust iOS compilation targets**:
   ```bash
   rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim
   ```
4. **Tauri CLI v2**:
   ```bash
   cargo install tauri-cli --version "^2.0.0"
   ```

---

## 2. iOS Project Initialization

To scaffold the native Xcode project in `src-tauri/gen/apple`:

```bash
# From workspace root:
npm install
npm run build
cargo tauri ios init
```

This generates:
- `src-tauri/gen/apple/WhiskersAdventure.xcodeproj`
- iOS app delegate and entitlements
- Info.plist with orientation lock (Landscape Left & Landscape Right preferred)

---

## 3. Platform Optimizations & Compatibility

### Safe-Area Insets (Notch & Dynamic Island)
The frontend HTML and UI incorporate `viewport-fit=cover` and CSS env variables:
```css
padding-bottom: env(safe-area-inset-bottom, 0px);
padding-left: env(safe-area-inset-left, 0px);
padding-right: env(safe-area-inset-right, 0px);
```
This guarantees touch controls never collide with the iOS home indicator or camera cutout.

### Audio Unlocking on iOS
iOS Safari WebKit restricts audio playback until a user gesture occurs. `AudioSynthesizer.ts` automatically hooks into the first touch interaction, calling `audioCtx.resume()` seamlessly without latency or muted glitches.

### Local-First Persistence on iOS
- Desktop uses `tauri-plugin-sql` (SQLite).
- On iOS, `TauriSqliteAdapter` integrates with native SQLite or falls back to iOS WebKit IndexedDB (`BrowserIndexedDBAdapter`), ensuring save progress persists permanently across app launches in 100% offline airplane mode.

---

## 4. Running and Building for iOS

### Run in iOS Simulator
```bash
cargo tauri ios dev
```

### Build Production Signed IPA
```bash
cargo tauri ios build
```
The output archive is located at:
`src-tauri/gen/apple/build/Build/Products/Release-iphoneos/WhiskersAdventure.ipa`
