# 🚀 Setup GitHub Repository via Command Line

## Persiapan Awal

### 1. Install Git (jika belum ada)
```bash
# Download dari: https://git-scm.com/download/win
# Atau via Chocolatey:
choco install git

# Atau via Winget:
winget install Git.Git
```

### 2. Konfigurasi Git (sekali saja)
```bash
git config --global user.name "Nama Anda"
git config --global user.email "email@anda.com"
```

## Langkah-langkah Upload

### 1. Buat Repository di GitHub (via Browser)
- Buka https://github.com/new
- Nama: `cinematic-video-creator`
- Set **Public**
- **JANGAN** centang "Add README" (karena kita sudah punya)
- Klik "Create repository"

### 2. Inisialisasi Git di Project Folder
```bash
# Masuk ke folder project
cd /path/to/your/project

# Inisialisasi git
git init

# Tambah semua file
git add .

# Commit pertama
git commit -m "Initial commit: Cinematic Video Creator desktop app"
```

### 3. Connect ke GitHub Repository
```bash
# Ganti USERNAME dengan username GitHub Anda
git remote add origin https://github.com/USERNAME/cinematic-video-creator.git

# Set branch utama
git branch -M main

# Push ke GitHub
git push -u origin main
```

### 4. Verifikasi Upload
```bash
# Check status
git status

# Check remote
git remote -v
```

## Jika Ada Error

### Error: "Repository not found"
```bash
# Pastikan URL benar, ganti USERNAME
git remote set-url origin https://github.com/USERNAME/cinematic-video-creator.git
```

### Error: "Permission denied"
```bash
# Login ke GitHub via browser dulu, lalu:
git push --set-upstream origin main
```

### Error: "Updates were rejected"
```bash
# Force push (hati-hati!)
git push --force origin main
```

## Setelah Upload Berhasil

### 1. Trigger Build Otomatis
```bash
# GitHub Actions akan otomatis jalan setelah push
# Atau manual trigger via browser:
# https://github.com/USERNAME/cinematic-video-creator/actions
```

### 2. Monitor Build Progress
```bash
# Buka di browser:
# https://github.com/USERNAME/cinematic-video-creator/actions
```

### 3. Download Installer
Setelah build selesai (±15 menit):
1. Buka Actions tab
2. Klik workflow yang selesai
3. Download dari "Artifacts"

## Commands Lengkap (Copy-Paste)

```bash
# 1. Masuk ke folder project
cd "C:\path\to\your\project"

# 2. Git setup (sekali saja)
git config --global user.name "Nama Anda"
git config --global user.email "email@anda.com"

# 3. Inisialisasi dan upload
git init
git add .
git commit -m "Initial commit: Cinematic Video Creator"
git branch -M main
git remote add origin https://github.com/USERNAME/cinematic-video-creator.git
git push -u origin main
```

**Ganti `USERNAME` dengan username GitHub Anda!**

## Troubleshooting

### Jika Git tidak dikenali:
```bash
# Restart Command Prompt/PowerShell setelah install Git
# Atau tambah Git ke PATH manually
```

### Jika push lambat:
```bash
# Gunakan SSH instead of HTTPS (advanced)
git remote set-url origin git@github.com:USERNAME/cinematic-video-creator.git
```

### Jika ada conflict:
```bash
# Pull dulu, lalu push
git pull origin main --allow-unrelated-histories
git push origin main
```

## Setelah Berhasil

Repository Anda akan tersedia di:
- **Repository**: `https://github.com/USERNAME/cinematic-video-creator`
- **Actions**: `https://github.com/USERNAME/cinematic-video-creator/actions`
- **Releases**: `https://github.com/USERNAME/cinematic-video-creator/releases`

Build otomatis akan menghasilkan installer Windows yang bisa didownload!