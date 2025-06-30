import React, { useState, useCallback } from 'react';
import { Film, Monitor } from 'lucide-react';
import DesktopFileUpload from './components/DesktopFileUpload';
import ScriptParser from './components/ScriptParser';
import VideoProcessor from './components/VideoProcessor';
import { useElectron } from './hooks/useElectron';

interface ScriptInstruction {
  text: string;
  effects: string[];
  sceneNumber: number;
}

function App() {
  const { isElectron } = useElectron();
  const [selectedFiles, setSelectedFiles] = useState({
    imageFolder: null as string | null,
    scriptFiles: [] as string[],
    audioFile: null as string | null
  });
  const [parsedScript, setParsedScript] = useState<ScriptInstruction[]>([]);

  const handleFilesSelected = useCallback((files: typeof selectedFiles) => {
    setSelectedFiles(files);
  }, []);

  const handleScriptParsed = useCallback((instructions: ScriptInstruction[]) => {
    setParsedScript(instructions);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                <Film className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Cinematic Video Creator
                </h1>
                <p className="text-gray-400">
                  {isElectron ? 'Desktop Application' : 'Professional video generation from images, scripts & audio'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Monitor className="w-4 h-4" />
                <span className={isElectron ? 'text-green-400' : 'text-yellow-400'}>
                  {isElectron ? 'Desktop Mode' : 'Web Mode'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* File Selection */}
          <DesktopFileUpload onFilesSelected={handleFilesSelected} />

          {/* Script Processing */}
          {selectedFiles.scriptFiles.length > 0 && (
            <ScriptParser
              scriptFiles={selectedFiles.scriptFiles}
              onScriptParsed={handleScriptParsed}
              isDesktop={true}
            />
          )}

          {/* Video Processing */}
          {(selectedFiles.imageFolder || selectedFiles.scriptFiles.length > 0 || selectedFiles.audioFile) && (
            <VideoProcessor
              imageFolder={selectedFiles.imageFolder}
              scriptFiles={selectedFiles.scriptFiles}
              audioFile={selectedFiles.audioFile}
              scriptInstructions={parsedScript}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;