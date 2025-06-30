import React, { useState, useCallback } from 'react';
import { Folder, FileText, Headphones, CheckCircle, AlertCircle } from 'lucide-react';
import { useElectron } from '../hooks/useElectron';

interface DesktopFileUploadProps {
  onFilesSelected: (files: {
    imageFolder: string | null;
    scriptFiles: string[];
    audioFile: string | null;
  }) => void;
}

const DesktopFileUpload: React.FC<DesktopFileUploadProps> = ({ onFilesSelected }) => {
  const { isElectron, api } = useElectron();
  const [selectedFiles, setSelectedFiles] = useState({
    imageFolder: null as string | null,
    scriptFiles: [] as string[],
    audioFile: null as string | null
  });

  const selectImageFolder = useCallback(async () => {
    if (!api) return;
    
    try {
      const folderPath = await api.selectFolder();
      if (folderPath) {
        // Verify it contains image files
        const files = await api.listDirectory(folderPath);
        const imageFiles = files.filter(file => 
          /\.(jpg|jpeg|png|gif|bmp)$/i.test(file.name)
        );
        
        if (imageFiles.length === 0) {
          await api.showMessage({
            type: 'warning',
            title: 'No Images Found',
            message: 'The selected folder does not contain any image files.'
          });
          return;
        }
        
        setSelectedFiles(prev => ({ ...prev, imageFolder: folderPath }));
        onFilesSelected({ ...selectedFiles, imageFolder: folderPath });
      }
    } catch (error) {
      console.error('Error selecting image folder:', error);
    }
  }, [api, selectedFiles, onFilesSelected]);

  const selectScriptFiles = useCallback(async () => {
    if (!api) return;
    
    try {
      const filePaths = await api.selectFiles({
        filters: [
          { name: 'Text Files', extensions: ['txt'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });
      
      if (filePaths.length > 0) {
        setSelectedFiles(prev => ({ ...prev, scriptFiles: filePaths }));
        onFilesSelected({ ...selectedFiles, scriptFiles: filePaths });
      }
    } catch (error) {
      console.error('Error selecting script files:', error);
    }
  }, [api, selectedFiles, onFilesSelected]);

  const selectAudioFile = useCallback(async () => {
    if (!api) return;
    
    try {
      const filePaths = await api.selectFiles({
        filters: [
          { name: 'Audio Files', extensions: ['mp3', 'wav', 'm4a', 'aac'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });
      
      if (filePaths.length > 0) {
        const audioFile = filePaths[0];
        setSelectedFiles(prev => ({ ...prev, audioFile }));
        onFilesSelected({ ...selectedFiles, audioFile });
      }
    } catch (error) {
      console.error('Error selecting audio file:', error);
    }
  }, [api, selectedFiles, onFilesSelected]);

  if (!isElectron) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-300 mb-2">Desktop Mode Required</h3>
        <p className="text-red-200">
          This application needs to run as a desktop app to access your file system and create videos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Select Your Project Files</h2>
        <p className="text-gray-400">Choose your image folder, script files, and audio narration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Image Folder Selection */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Folder className="w-8 h-8 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold">Image Folder</h3>
              <p className="text-sm text-gray-400">FOOTAGE folder with sequential images</p>
            </div>
          </div>
          
          <button
            onClick={selectImageFolder}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors mb-4"
          >
            Select Folder
          </button>
          
          {selectedFiles.imageFolder && (
            <div className="flex items-center space-x-2 text-sm text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="truncate">{selectedFiles.imageFolder.split('/').pop()}</span>
            </div>
          )}
        </div>

        {/* Script Files Selection */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-8 h-8 text-purple-400" />
            <div>
              <h3 className="text-lg font-semibold">Script Files</h3>
              <p className="text-sm text-gray-400">One or multiple .txt script files</p>
            </div>
          </div>
          
          <button
            onClick={selectScriptFiles}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors mb-4"
          >
            Select Files
          </button>
          
          {selectedFiles.scriptFiles.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span>{selectedFiles.scriptFiles.length} file(s) selected</span>
            </div>
          )}
        </div>

        {/* Audio File Selection */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Headphones className="w-8 h-8 text-green-400" />
            <div>
              <h3 className="text-lg font-semibold">Audio File</h3>
              <p className="text-sm text-gray-400">TTS narration audio file</p>
            </div>
          </div>
          
          <button
            onClick={selectAudioFile}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors mb-4"
          >
            Select File
          </button>
          
          {selectedFiles.audioFile && (
            <div className="flex items-center space-x-2 text-sm text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="truncate">{selectedFiles.audioFile.split('/').pop()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopFileUpload;