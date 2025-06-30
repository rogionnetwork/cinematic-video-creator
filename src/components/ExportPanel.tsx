import React, { useState } from 'react';
import { X, Download, Settings, Play, HardDrive } from 'lucide-react';

interface ExportPanelProps {
  onExport: () => void;
  onClose: () => void;
  isProcessing: boolean;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ onExport, onClose, isProcessing }) => {
  const [settings, setSettings] = useState({
    resolution: '1920x1080',
    frameRate: 30,
    quality: 'high',
    format: 'mp4',
    audio: 'aac'
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full mx-4 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
              <Download className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Export Video</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            disabled={isProcessing}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isProcessing ? (
          <>
            {/* Export Settings */}
            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Resolution
                  </label>
                  <select
                    value={settings.resolution}
                    onChange={(e) => setSettings(prev => ({ ...prev, resolution: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="high">High (Recommended)</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Format
                  </label>
                  <select
                    value={settings.format}
                    onChange={(e) => setSettings(prev => ({ ...prev, format: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="mp4">MP4 (Recommended)</option>
                    <option value="mov">MOV</option>
                    <option value="avi">AVI</option>
                  </select>
                </div>
              </div>

              {/* Estimated output info */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <HardDrive className="w-5 h-5 text-blue-400" />
                  <span>Estimated Output</span>
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">File Size:</p>
                    <p className="font-semibold">~250 MB</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Duration:</p>
                    <p className="font-semibold">~3.5 min</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Processing Time:</p>
                    <p className="font-semibold">~2-5 min</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onExport}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold flex items-center space-x-2 transition-all"
              >
                <Download className="w-5 h-5" />
                <span>Start Export</span>
              </button>
            </div>
          </>
        ) : (
          /* Processing State */
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Processing Video</h3>
              <p className="text-gray-400">This may take a few minutes...</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-full animate-pulse w-2/3 transition-all duration-1000" />
              </div>
              
              <div className="text-sm text-gray-400">
                <p>Combining images and audio...</p>
                <p>Applying effects and transitions...</p>
                <p>Encoding final video...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportPanel;