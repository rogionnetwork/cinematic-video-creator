# Cinematic Video Creator

A professional desktop application for creating cinematic story videos from images, scripts, and audio narration.

## 🚀 Download Aplikasi

### Cara Download:
1. **Otomatis via GitHub Actions**: Klik tombol "Actions" di repository ini
2. **Manual Build**: Jalankan workflow "Manual Build" 
3. **Release**: Download dari halaman "Releases"

### Platform yang Didukung:
- **Windows 10/11** - Download file `.exe`
- **macOS 10.14+** - Download file `.dmg` 
- **Linux** - Download file `.AppImage`

## ✨ Features

- **Desktop Application**: Native GUI built with Electron
- **File Management**: Easy drag-and-drop or folder selection
- **Script Processing**: Automatic parsing of script instructions and effects
- **Video Generation**: High-quality MP4 output using FFmpeg
- **Real-time Preview**: See your project before rendering
- **Professional Output**: 1080p, 2K, or 4K video export

## 📥 Installation

### Download dari GitHub:

1. **Pergi ke halaman [Actions](../../actions)**
2. **Klik workflow "Manual Build"**
3. **Klik "Run workflow" → "Run workflow"**
4. **Tunggu build selesai (±10-15 menit)**
5. **Download installer sesuai OS Anda dari "Artifacts"**

### Build Manual (Advanced):

```bash
# Clone repository
git clone <repository-url>
cd cinematic-video-creator

# Install dependencies
npm install

# Build untuk platform saat ini
npm run dist

# Build untuk semua platform
npm run dist-all
```

## 🎯 Usage

1. **Launch the application**
2. **Select your project files:**
   - **Image Folder**: Folder containing FOOTAGE 1.jpg, FOOTAGE 2.jpg, etc.
   - **Script Files**: One or multiple .txt files with narration and effects
   - **Audio File**: TTS narration audio file
3. **Configure export settings** (resolution, frame rate, quality)
4. **Click "Create Video"** to start processing
5. **Save your video** when processing is complete

## 📝 Script Format

The application supports these script instructions:

- `TAMBAH TEKS DIATAS` - Show typing animation at the top
- `TAMBAH SUARA KEYBOARD` - Add keyboard typing sound effect
- `PAKAI FOOTAGE HITAM` - Use black screen instead of image
- `CORET [word] JADI [word]` - Show strikethrough text replacement

## 🔧 System Requirements

- **Operating System**: Windows 10/11, macOS 10.14+, or Linux
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 2GB free space
- **FFmpeg**: Included in the application

## 🛠️ Development

### Run in Development Mode

```bash
# Start development server
npm run electron-dev
```

### Build for Distribution

```bash
# Build for current platform
npm run dist

# Build for specific platform
npm run dist -- --win
npm run dist -- --mac
npm run dist -- --linux
```

## 🐛 Troubleshooting

### Download Issues
- Pastikan koneksi internet stabil
- Coba download ulang jika gagal
- Gunakan browser yang berbeda

### Installation Issues
- **Windows**: Klik kanan installer → "Run as administrator"
- **macOS**: Buka System Preferences → Security → Allow app
- **Linux**: Buat file executable: `chmod +x *.AppImage`

### Runtime Issues
- Pastikan sistem memenuhi requirements minimum
- Restart aplikasi jika mengalami masalah
- Check log error di console aplikasi

## 📞 Support

Jika mengalami masalah:
1. Check [Issues](../../issues) untuk masalah yang sudah diketahui
2. Buat [Issue baru](../../issues/new) dengan detail masalah
3. Sertakan informasi OS dan versi aplikasi

## 📄 License

This project is licensed under the MIT License.

---

## 🚀 Quick Start Guide

### Untuk Pengguna Baru:

1. **Download**: Klik [Actions](../../actions) → "Manual Build" → "Run workflow"
2. **Install**: Download dan jalankan installer sesuai OS
3. **Siapkan File**: 
   - Folder gambar (FOOTAGE 1.jpg, 2.jpg, dst)
   - File script (.txt)
   - File audio narasi
4. **Buat Video**: Buka aplikasi → Select files → Create Video
5. **Selesai**: Video akan tersimpan di lokasi yang dipilih

### Tips:
- Gunakan gambar dengan resolusi tinggi untuk hasil terbaik
- Pastikan nama file gambar berurutan (FOOTAGE 1, 2, 3, dst)
- Format audio yang didukung: MP3, WAV, M4A, AAC
- Proses video membutuhkan waktu 2-5 menit tergantung panjang video