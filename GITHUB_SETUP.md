# 🚀 Panduan Setup GitHub Repository

## Langkah 1: Buat Repository GitHub Baru

1. **Buka GitHub.com** dan login ke akun Anda
2. **Klik tombol "New"** atau **"+"** di pojok kanan atas
3. **Isi detail repository:**
   - Repository name: `cinematic-video-creator`
   - Description: `Desktop application for creating cinematic videos`
   - Set ke **Public** (agar bisa diakses semua orang)
   - ✅ Centang "Add a README file"
   - ✅ Centang "Add .gitignore" → pilih "Node"
   - License: MIT License (opsional)
4. **Klik "Create repository"**

## Langkah 2: Upload Project ke GitHub

### Opsi A: Upload via Web Interface (Mudah)

1. **Download semua file project** dari Bolt sebagai ZIP
2. **Extract file ZIP** ke folder di komputer
3. **Buka repository GitHub** yang baru dibuat
4. **Klik "uploading an existing file"** atau drag & drop semua file
5. **Commit changes** dengan pesan "Initial commit"

### Opsi B: Via Git Command Line (Advanced)

```bash
# Di folder project Anda
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/cinematic-video-creator.git
git push -u origin main
```

## Langkah 3: Setup GitHub Actions untuk Build Otomatis

Setelah upload, GitHub Actions akan otomatis:
1. **Detect workflow files** di folder `.github/workflows/`
2. **Setup build environment** dengan Node.js 18
3. **Build aplikasi** untuk Windows, macOS, dan Linux
4. **Upload installer** sebagai artifacts

## Langkah 4: Download Aplikasi

### Cara 1: Via GitHub Actions (Recommended)

1. **Buka tab "Actions"** di repository GitHub
2. **Klik "Windows Build Only"** (untuk Windows saja)
3. **Klik "Run workflow"** → **"Run workflow"**
4. **Tunggu build selesai** (±10-15 menit)
5. **Download installer** dari section "Artifacts"

### Cara 2: Via Releases (Jika sudah ada)

1. **Buka tab "Releases"** di repository
2. **Download file** sesuai OS:
   - Windows: `.exe` file
   - macOS: `.dmg` file  
   - Linux: `.AppImage` file

## Langkah 5: Install Aplikasi

### Windows:
1. **Download** file `Cinematic Video Creator Setup.exe`
2. **Klik kanan** → **"Run as administrator"**
3. **Ikuti** wizard instalasi
4. **Selesai!**

### Troubleshooting Windows:
- Jika Windows Defender memblokir: Klik "More info" → "Run anyway"
- Jika error saat install: Pastikan run as administrator
- Jika aplikasi tidak buka: Restart komputer setelah install

## 🎯 Quick Start untuk Anda:

1. **Buat repository GitHub** dengan nama `cinematic-video-creator`
2. **Upload semua file** dari project ini ke repository
3. **Tunggu GitHub Actions** build otomatis
4. **Download installer** dari Actions → Artifacts
5. **Install dan jalankan** aplikasi

## 📞 Jika Masih Bermasalah:

1. **Pastikan repository sudah public**
2. **Check GitHub Actions** sudah berjalan
3. **Tunggu build selesai** sebelum download
4. **Download dari Artifacts**, bukan dari code

---

**Repository URL akan menjadi:**
`https://github.com/USERNAME/cinematic-video-creator`

Ganti `USERNAME` dengan username GitHub Anda.