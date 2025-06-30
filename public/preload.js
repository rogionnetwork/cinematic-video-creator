const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // File system operations
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectFiles: (options) => ipcRenderer.invoke('select-files', options),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  listDirectory: (dirPath) => ipcRenderer.invoke('list-directory', dirPath),
  
  // Video processing
  createVideo: (options) => ipcRenderer.invoke('create-video', options),
  saveVideoDialog: () => ipcRenderer.invoke('save-video-dialog'),
  
  // UI interactions
  showMessage: (options) => ipcRenderer.invoke('show-message', options),
  
  // Event listeners
  onVideoProgress: (callback) => {
    ipcRenderer.on('video-progress', (event, data) => callback(data));
  },
  
  removeVideoProgressListener: () => {
    ipcRenderer.removeAllListeners('video-progress');
  }
});