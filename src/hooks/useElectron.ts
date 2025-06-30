import { useState, useEffect } from 'react';

interface ElectronAPI {
  selectFolder: () => Promise<string | null>;
  selectFiles: (options: any) => Promise<string[]>;
  readFile: (filePath: string) => Promise<string>;
  listDirectory: (dirPath: string) => Promise<any[]>;
  createVideo: (options: any) => Promise<any>;
  saveVideoDialog: () => Promise<string | null>;
  showMessage: (options: any) => Promise<any>;
  onVideoProgress: (callback: (data: any) => void) => void;
  removeVideoProgressListener: () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export const useElectron = () => {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(!!window.electronAPI);
  }, []);

  return {
    isElectron,
    api: window.electronAPI
  };
};

export default useElectron;