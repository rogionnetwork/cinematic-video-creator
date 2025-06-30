# ⚡ Quick Deploy ke GitHub

## Cara Tercepat Upload ke GitHub:

### 1. Buat Repository Baru
- Buka https://github.com/new
- Nama: `cinematic-video-creator`
- Public ✅
- Add README ✅
- Add .gitignore: Node ✅
- Create repository

### 2. Upload Files
**Cara Mudah (Drag & Drop):**
1. Download project sebagai ZIP dari Bolt
2. Extract semua file
3. Buka repository GitHub di browser
4. Drag & drop semua file ke halaman repository
5. Scroll ke bawah → "Commit changes"

### 3. Build Aplikasi
1. Buka tab **"Actions"** di repository
2. Klik **"Windows Build Only"**
3. Klik **"Run workflow"** → **"Run workflow"**
4. Tunggu ±15 menit

### 4. Download Installer
1. Refresh halaman Actions
2. Klik workflow yang sudah selesai (hijau ✅)
3. Scroll ke bawah → **"Artifacts"**
4. Download **"windows-installer-XXX"**
5. Extract ZIP → jalankan file .exe

## 🚨 Penting:
- Pastikan repository **PUBLIC** agar Actions bisa jalan
- Tunggu sampai build **selesai** (hijau ✅) sebelum download
- Download dari **Artifacts**, bukan dari code repository

## 🎯 Link yang Akan Anda Dapatkan:
```
Repository: https://github.com/USERNAME/cinematic-video-creator
Actions: https://github.com/USERNAME/cinematic-video-creator/actions
Releases: https://github.com/USERNAME/cinematic-video-creator/releases
```

Ganti `USERNAME` dengan username GitHub Anda.