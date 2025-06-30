const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;

// Set FFmpeg path
const isDev = process.env.NODE_ENV === 'development';
let ffmpeg;

// Lazy load FFmpeg to avoid module issues
const loadFFmpeg = () => {
  if (!ffmpeg) {
    try {
      ffmpeg = require('fluent-ffmpeg');
      const ffmpegPath = isDev 
        ? require('ffmpeg-static')
        : path.join(process.resourcesPath, 'ffmpeg', 'ffmpeg.exe');

      if (ffmpegPath) {
        ffmpeg.setFfmpegPath(ffmpegPath);
      }
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
    }
  }
  return ffmpeg;
};

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      allowRunningInsecureContent: true,
      experimentalFeatures: true
    },
    titleBarStyle: 'default',
    show: false,
    icon: path.join(__dirname, '../assets/icon.png'),
    autoHideMenuBar: true
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Don't open DevTools automatically to avoid module conflicts
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle navigation safely
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    try {
      const parsedUrl = new URL(navigationUrl);
      
      if (parsedUrl.origin !== 'http://localhost:5173' && !navigationUrl.startsWith('file://')) {
        event.preventDefault();
      }
    } catch (error) {
      event.preventDefault();
    }
  });

  // Handle console messages
  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log('Renderer:', message);
  });
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});

// IPC Handlers with error handling
ipcMain.handle('select-folder', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  } catch (error) {
    console.error('Error selecting folder:', error);
    return null;
  }
});

ipcMain.handle('select-files', async (event, options) => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'multiSelections'],
      filters: options?.filters || []
    });
    
    if (!result.canceled) {
      return result.filePaths;
    }
    return [];
  } catch (error) {
    console.error('Error selecting files:', error);
    return [];
  }
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error(`Failed to read file: ${error.message}`);
  }
});

ipcMain.handle('list-directory', async (event, dirPath) => {
  try {
    const files = await fs.readdir(dirPath);
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dirPath, file);
        try {
          const stats = await fs.stat(filePath);
          return {
            name: file,
            path: filePath,
            isFile: stats.isFile(),
            size: stats.size
          };
        } catch (error) {
          return null;
        }
      })
    );
    return fileStats.filter(file => file && file.isFile);
  } catch (error) {
    console.error('Error listing directory:', error);
    throw new Error(`Failed to list directory: ${error.message}`);
  }
});

ipcMain.handle('create-video', async (event, options) => {
  const { images, scriptInstructions, audioPath, outputPath, settings } = options;
  
  return new Promise((resolve, reject) => {
    try {
      const ffmpegInstance = loadFFmpeg();
      if (!ffmpegInstance) {
        throw new Error('FFmpeg not available');
      }

      // Create FFmpeg command for slideshow with audio
      const command = ffmpegInstance();
      
      // Create image list file for FFmpeg
      const tempDir = path.join(__dirname, '../temp');
      const imageListPath = path.join(tempDir, 'images.txt');
      
      // Ensure temp directory exists
      require('fs').mkdirSync(tempDir, { recursive: true });
      
      const imageList = images.map(img => `file '${img.replace(/\\/g, '/')}'`).join('\n');
      
      require('fs').writeFileSync(imageListPath, imageList);
      
      // Add image sequence input
      command
        .input(imageListPath)
        .inputOptions(['-f', 'concat', '-safe', '0'])
        .inputOptions(['-r', '1/3.5']) // 3.5 seconds per image
        
      // Add audio input
      if (audioPath) {
        command.input(audioPath);
      }
      
      // Set output options
      command
        .outputOptions([
          '-c:v libx264',
          '-pix_fmt yuv420p',
          `-r ${settings.frameRate || 30}`,
          '-c:a aac',
          '-b:a 128k',
          '-shortest' // End when shortest input ends
        ])
        .size(`${settings.width || 1920}x${settings.height || 1080}`)
        .output(outputPath);
      
      // Progress tracking
      command.on('progress', (progress) => {
        try {
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('video-progress', {
              percent: progress.percent || 0,
              currentTime: progress.timemark
            });
          }
        } catch (error) {
          console.error('Error sending progress:', error);
        }
      });
      
      // Handle completion
      command.on('end', () => {
        // Clean up temp file
        try {
          require('fs').unlinkSync(imageListPath);
        } catch (e) {
          console.error('Error cleaning up temp file:', e);
        }
        resolve({ success: true, outputPath });
      });
      
      // Handle errors
      command.on('error', (error) => {
        // Clean up temp file
        try {
          require('fs').unlinkSync(imageListPath);
        } catch (e) {
          console.error('Error cleaning up temp file:', e);
        }
        reject(new Error(`FFmpeg error: ${error.message}`));
      });
      
      // Start processing
      command.run();
      
    } catch (error) {
      reject(error);
    }
  });
});

ipcMain.handle('save-video-dialog', async () => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: 'cinematic-video.mp4',
      filters: [
        { name: 'MP4 Videos', extensions: ['mp4'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    
    if (!result.canceled) {
      return result.filePath;
    }
    return null;
  } catch (error) {
    console.error('Error showing save dialog:', error);
    return null;
  }
});

// Handle app updates and notifications
ipcMain.handle('show-message', async (event, options) => {
  try {
    const result = await dialog.showMessageBox(mainWindow, options);
    return result;
  } catch (error) {
    console.error('Error showing message:', error);
    return { response: 0 };
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});