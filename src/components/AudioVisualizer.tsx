import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, RotateCcw } from 'lucide-react';

interface AudioVisualizerProps {
  audioFile: File;
  currentScene: number;
  totalScenes: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  audioFile, 
  currentScene, 
  totalScenes 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      setAudioUrl(url);
      
      return () => URL.revokeObjectURL(url);
    }
  }, [audioFile]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const resetAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
    audio.pause();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate scene timing
  const sceneStartTime = (currentScene / totalScenes) * duration;
  const sceneEndTime = ((currentScene + 1) / totalScenes) * duration;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex items-center space-x-3 mb-4">
        <Volume2 className="w-6 h-6 text-green-400" />
        <h3 className="text-xl font-semibold">Audio Sync</h3>
      </div>

      {audioUrl && (
        <>
          <audio ref={audioRef} src={audioUrl} preload="metadata" />
          
          {/* Audio Controls */}
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={togglePlayback}
              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            <button
              onClick={resetAudio}
              className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <div className="text-sm text-gray-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Waveform Visualization */}
          <div className="mb-6">
            <div 
              className="h-16 bg-gray-700 rounded-lg cursor-pointer relative overflow-hidden"
              onClick={handleSeek}
            >
              {/* Waveform bars */}
              <div className="flex items-center h-full px-2">
                {Array.from({ length: 100 }, (_, i) => (
                  <div
                    key={i}
                    className="flex-1 mx-px bg-gray-600 rounded-full"
                    style={{
                      height: `${20 + Math.random() * 60}%`,
                      opacity: (currentTime / duration) * 100 > i ? 1 : 0.5
                    }}
                  />
                ))}
              </div>
              
              {/* Progress indicator */}
              <div
                className="absolute top-0 bottom-0 bg-green-500/30 pointer-events-none"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              
              {/* Current scene indicator */}
              <div
                className="absolute top-0 bottom-0 bg-blue-500/40 pointer-events-none border-l-2 border-r-2 border-blue-500"
                style={{
                  left: `${(sceneStartTime / duration) * 100}%`,
                  width: `${((sceneEndTime - sceneStartTime) / duration) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Scene Audio Info */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Scene {currentScene + 1} Audio</h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Start Time:</p>
                <p className="font-mono text-green-400">{formatTime(sceneStartTime)}</p>
              </div>
              <div>
                <p className="text-gray-400">End Time:</p>
                <p className="font-mono text-green-400">{formatTime(sceneEndTime)}</p>
              </div>
              <div>
                <p className="text-gray-400">Duration:</p>
                <p className="font-mono text-blue-400">{formatTime(sceneEndTime - sceneStartTime)}</p>
              </div>
              <div>
                <p className="text-gray-400">File Size:</p>
                <p className="font-mono text-blue-400">{(audioFile.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AudioVisualizer;