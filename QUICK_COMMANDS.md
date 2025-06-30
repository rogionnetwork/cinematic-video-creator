# ⚡ Quick Commands untuk Upload GitHub

## Copy-Paste Commands (Ganti USERNAME!)

### 1. Setup Git (sekali saja)
```bash
git config --global user.name "Nama Anda"
git config --global user.email "email@anda.com"
```

### 2. Upload Project
```bash
# Masuk ke folder project
cd "C:\Users\ASUS UX32VD\Downloads\project-bolt-sb1-wganwnhr (1)\project"

# Inisialisasi Git
git init
git add .
git commit -m "Initial commit: Cinematic Video Creator desktop app"

# Connect ke GitHub (GANTI USERNAME!)
git remote add origin https://github.com/USERNAME/cinematic-video-creator.git
git branch -M main
git push -u origin main
```

### 3. Jika Ada Error
```bash
# Jika repository not found:
git remote set-url origin https://github.com/USERNAME/cinematic-video-creator.git

# Jika permission denied:
git push --set-upstream origin main

# Jika updates rejected:
git push --force origin main
```

## Langkah Mudah:

1. **Buat repository** di GitHub.com dengan nama `cinematic-video-creator`
2. **Buka Command Prompt** di folder project
3. **Copy-paste commands** di atas (ganti USERNAME)
4. **Tunggu upload** selesai
5. **Buka Actions tab** di GitHub untuk build otomatis
6. **Download installer** dari Artifacts setelah build selesai

## Folder Project Anda:
```
C:\Users\ASUS UX32VD\Downloads\project-bolt-sb1-wganwnhr (1)\project
```

Pastikan Anda di folder ini saat menjalankan commands!