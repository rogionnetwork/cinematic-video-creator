import React from 'react';
import { Play, Type, Volume2, Minus, Zap } from 'lucide-react';

interface ScriptInstruction {
  text: string;
  effects: string[];
  sceneNumber: number;
}

interface TimelineProps {
  images: File[];
  script: ScriptInstruction[];
  currentScene: number;
  onSceneChange: (scene: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ images, script, currentScene, onSceneChange }) => {
  const totalScenes = Math.max(images.length, script.length);
  
  const getSceneInstruction = (sceneIndex: number) => {
    return script.find(inst => inst.sceneNumber === sceneIndex + 1);
  };

  const getEffectIcon = (effect: string) => {
    if (effect === 'typing-text') return <Type className="w-3 h-3" />;
    if (effect === 'keyboard-sound') return <Volume2 className="w-3 h-3" />;
    if (effect === 'black-screen') return <Minus className="w-3 h-3" />;
    if (effect.startsWith('strikethrough:')) return <Zap className="w-3 h-3" />;
    return null;
  };

  if (totalScenes === 0) return null;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <Play className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-semibold">Timeline</h3>
        <span className="text-sm text-gray-400">
          {totalScenes} scene{totalScenes !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-4">
        {/* Timeline scrubber */}
        <div className="relative">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${((currentScene + 1) / totalScenes) * 100}%` }}
            />
          </div>
          <div
            className="absolute top-0 w-4 h-4 bg-white rounded-full border-2 border-blue-500 transform -translate-y-1 transition-all duration-300"
            style={{ left: `${(currentScene / (totalScenes - 1)) * 100}%` }}
          />
        </div>

        {/* Scene thumbnails */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
          {Array.from({ length: totalScenes }, (_, index) => {
            const instruction = getSceneInstruction(index);
            const hasBlackScreen = instruction?.effects.includes('black-screen');
            const isActive = currentScene === index;

            return (
              <div
                key={index}
                onClick={() => onSceneChange(index)}
                className={`aspect-video rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'border-blue-500 ring-2 ring-blue-500/50'
                    : 'border-gray-600 hover:border-gray-500'
                } ${hasBlackScreen ? 'bg-black' : 'bg-gray-700'}`}
              >
                <div className="w-full h-full flex flex-col justify-between p-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-300 font-mono">
                      {index + 1}
                    </span>
                    {instruction?.effects.length > 0 && (
                      <div className="flex space-x-1">
                        {instruction.effects.slice(0, 2).map((effect, effectIndex) => (
                          <div
                            key={effectIndex}
                            className="text-purple-300 opacity-75"
                          >
                            {getEffectIcon(effect)}
                          </div>
                        ))}
                        {instruction.effects.length > 2 && (
                          <span className="text-xs text-purple-300">+{instruction.effects.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {hasBlackScreen ? (
                    <div className="text-center">
                      <Minus className="w-4 h-4 text-white mx-auto" />
                    </div>
                  ) : (
                    <div className="text-center">
                      {images[index] ? (
                        <div className="w-full h-8 bg-gray-600 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-300">IMG</span>
                        </div>
                      ) : (
                        <div className="w-full h-8 bg-red-900/50 rounded flex items-center justify-center">
                          <span className="text-xs text-red-300">Missing</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Scene info */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-semibold">Scene {currentScene + 1}</h4>
            <span className="text-sm text-gray-400">
              {Math.round((currentScene + 1) * 3.5)}s
            </span>
          </div>
          
          {getSceneInstruction(currentScene) && (
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                {getSceneInstruction(currentScene)?.text}
              </p>
              
              {getSceneInstruction(currentScene)?.effects.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {getSceneInstruction(currentScene)?.effects.map((effect, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-1 bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs"
                    >
                      {getEffectIcon(effect)}
                      <span>
                        {effect === 'typing-text' && 'Typing Animation'}
                        {effect === 'keyboard-sound' && 'Keyboard Sound'}
                        {effect === 'black-screen' && 'Black Screen'}
                        {effect.startsWith('strikethrough:') && 
                          `Strike: ${effect.split(':')[1]} → ${effect.split(':')[2]}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;