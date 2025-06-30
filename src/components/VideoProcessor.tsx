import React, { useState, useCallback } from 'react';
import { Play, Download, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { useElectron } from '../hooks/useElectron';

interface VideoProcessorProps {
  imageFolder: string | null;
  scriptFiles: string[];
  audioFile: string | null;
  scriptInstructions: any[];
}

const VideoProcessor: React.FC<VideoProcessorProps> = ({
  imageFolder,
  scriptFiles,
  audioFile,
  scriptInstructions
}) => {
  const { api } = useElectron();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [outputPath, setOutputPath] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    width: 1920,
    height: 1080,
    frameRate: 30,
    quality: 'high'
  });

  const processVideo = useCallback(async () => {
    if (!api || !imageFolder || !audioFile) return;

    try {
      setIsProcessing(true);
      setProgress(0);
      setCurrentStep('Preparing files...');

      // Get output path
      const savePath = await api.saveVideoDialog();
      if (!savePath) {
        setIsProcessing(false);
        return;
      }

      // Get image files from folder
      setCurrentStep('Loading images...');
      const files = await api.listDirectory(imageFolder);
      const imageFiles = files
        .filter(file => /\.(jpg|jpeg|png|gif|bmp)$/i.test(file.name))
        .sort((a, b) => {
          // Sort by filename (FOOTAGE 1.jpg, FOOTAGE 2.jpg, etc.)
          const aNum = parseInt(a.name.match(/\d+/)?.[0] || '0');
          const bNum = parseInt(b.name.match(/\d+/)?.[0] || '0');
          return aNum - bNum;
        })
        .map(file => file.path);

      if (imageFiles.length === 0) {
        throw new Error('No image files found in the selected folder');
      }

      setCurrentStep('Processing video...');

      // Set up progress listener
      api.onVideoProgress((data) => {
        setProgress(data.percent || 0);
        setCurrentStep(`Processing: ${data.currentTime || ''}`);
      });

      // Create video
      const result = await api.createVideo({
        images: imageFiles,
        scriptInstructions,
        audioPath: audioFile,
        outputPath: savePath,
        settings
      });

      if (result.success) {
        setOutputPath(result.outputPath);
        setCurrentStep('Video created successfully!');
        
        await api.showMessage({
          type: 'info',
          title: 'Video Created',
          message: `Your video has been saved to:\n${result.outputPath}`
        });
      }

    } catch (error) {
      console.error('Video processing error:', error);
      await api.showMessage({
        type: 'error',
        title: 'Processing Error',
        message: `Failed to create video: ${error.message}`
      });
    } finally {
      setIsProcessing(false);
      api.removeVideoProgressListener();
    }
  }, [api, imageFolder, audioFile, scriptInstructions, settings]);

  const canProcess = imageFolder && scriptFiles.length > 0 && audioFile && scriptInstructions.length > 0;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <Play className="w-6 h-6 text-green-400" />
        <h3 className="text-xl font-semibold">Video Processing</h3>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Resolution
          </label>
          <select
            value={`${settings.width}x${settings.height}`}
            onChange={(e) => {
              const [width, height] = e.target.value.split('x').map(Number);
              setSettings(prev => ({ ...prev, width, height }));
            }}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            disabled={isProcessing}
          >
            <option value="1920x1080">1920x1080 (Full HD)</option>
            <option value="2560x1440">2560x1440 (2K)</option>
            <option value="3840x2160">3840x2160 (4K)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Frame Rate
          </label>
          <select
            value={settings.frameRate}
            onChange={(e) => setSettings(prev => ({ ...prev, frameRate: parseInt(e.target.value) }))}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            disabled={isProcessing}
          >
            <option value={24}>24 FPS</option>
            <option value={30}>30 FPS</option>
            <option value={60}>60 FPS</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Quality
          </label>
          <select
            value={settings.quality}
            onChange={(e) => setSettings(prev => ({ ...prev, quality: e.target.value }))}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            disabled={isProcessing}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={processVideo}
            disabled={!canProcess || isProcessing}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 
                     disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                     text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Create Video</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status */}
      {!canProcess && (
        <div className="flex items-center space-x-2 text-yellow-400 mb-4">
          <AlertCircle className="w-5 h-5" />
          <span>Please select all required files before processing</span>
        </div>
      )}

      {/* Progress */}
      {isProcessing && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">{currentStep}</span>
            <span className="text-sm text-gray-300">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success */}
      {outputPath && (
        <div className="flex items-center space-x-2 text-green-400">
          <CheckCircle className="w-5 h-5" />
          <span>Video saved successfully!</span>
        </div>
      )}

      {/* Project Stats */}
      <div className="bg-gray-700/50 rounded-lg p-4 mt-6">
        <h4 className="font-semibold mb-3 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-blue-400" />
          <span>Project Summary</span>
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Images:</p>
            <p className="font-semibold">{imageFolder ? '✓ Selected' : 'Not selected'}</p>
          </div>
          <div>
            <p className="text-gray-400">Scripts:</p>
            <p className="font-semibold">{scriptFiles.length} files</p>
          </div>
          <div>
            <p className="text-gray-400">Audio:</p>
            <p className="font-semibold">{audioFile ? '✓ Selected' : 'Not selected'}</p>
          </div>
          <div>
            <p className="text-gray-400">Instructions:</p>
            <p className="font-semibold">{scriptInstructions.length} scenes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoProcessor;