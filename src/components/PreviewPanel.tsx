import React, { useState, useEffect } from 'react';
import { Monitor, Type, Volume2 } from 'lucide-react';

interface ScriptInstruction {
  text: string;
  effects: string[];
  sceneNumber: number;
}

interface PreviewPanelProps {
  images: File[];
  script: ScriptInstruction[];
  currentScene: number;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ images, script, currentScene }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');

  const currentInstruction = script.find(inst => inst.sceneNumber === currentScene + 1);
  const hasBlackScreen = currentInstruction?.effects.includes('black-screen');
  const hasTypingText = currentInstruction?.effects.includes('typing-text');
  const hasKeyboardSound = currentInstruction?.effects.includes('keyboard-sound');

  useEffect(() => {
    if (images[currentScene] && !hasBlackScreen) {
      const url = URL.createObjectURL(images[currentScene]);
      setImageUrl(url);
      
      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl(null);
    }
  }, [images, currentScene, hasBlackScreen]);

  useEffect(() => {
    if (hasTypingText && currentInstruction?.text) {
      setIsTyping(true);
      setTypedText('');
      
      const text = currentInstruction.text;
      const words = text.split(' ');
      let currentWordIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (currentWordIndex < words.length) {
          setTypedText(words.slice(0, currentWordIndex + 1).join(' '));
          currentWordIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, 200);
      
      return () => clearInterval(typeInterval);
    } else {
      setTypedText('');
      setIsTyping(false);
    }
  }, [hasTypingText, currentInstruction]);

  const getStrikethroughEffect = () => {
    const strikeEffect = currentInstruction?.effects.find(effect => 
      effect.startsWith('strikethrough:')
    );
    
    if (strikeEffect) {
      const [, from, to] = strikeEffect.split(':');
      return { from, to };
    }
    
    return null;
  };

  const renderTextWithStrikethrough = (text: string) => {
    const strikethrough = getStrikethroughEffect();
    
    if (strikethrough) {
      const parts = text.split(strikethrough.from);
      return (
        <span>
          {parts[0]}
          <span className="line-through text-red-400">{strikethrough.from}</span>
          <span className="text-green-400 ml-2">{strikethrough.to}</span>
          {parts[1]}
        </span>
      );
    }
    
    return text;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Monitor className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-semibold">Preview</h3>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-400">1920x1080</span>
          <span className="text-gray-400">16:9</span>
          <span className="text-gray-400">30fps</span>
        </div>
      </div>

      {/* Video Preview */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 relative">
        {hasBlackScreen ? (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="text-white text-2xl font-mono mb-4">
                {hasTypingText ? renderTextWithStrikethrough(typedText) : currentInstruction?.text}
              </div>
              {isTyping && (
                <div className="inline-block w-1 h-6 bg-white animate-pulse ml-1" />
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`Scene ${currentScene + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <div className="text-center text-gray-400">
                  <Monitor className="w-16 h-16 mx-auto mb-4" />
                  <p>No image for scene {currentScene + 1}</p>
                </div>
              </div>
            )}
            
            {/* Overlay text */}
            {hasTypingText && (
              <div className="absolute top-4 left-4 right-4">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-white text-lg font-mono">
                    {renderTextWithStrikethrough(typedText)}
                    {isTyping && (
                      <span className="inline-block w-0.5 h-5 bg-white animate-pulse ml-1" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Effects indicators */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {hasTypingText && (
            <div className="bg-purple-500/80 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
              <Type className="w-3 h-3" />
              <span>Typing</span>
            </div>
          )}
          {hasKeyboardSound && (
            <div className="bg-blue-500/80 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
              <Volume2 className="w-3 h-3" />
              <span>Keyboard</span>
            </div>
          )}
        </div>
      </div>

      {/* Scene Information */}
      <div className="bg-gray-700/50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Scene Info</h4>
            <p className="text-gray-400">Scene: {currentScene + 1}</p>
            <p className="text-gray-400">
              Image: {images[currentScene] ? images[currentScene].name : 'Missing'}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Effects</h4>
            <p className="text-gray-400">
              {currentInstruction?.effects.length || 0} active
            </p>
            <p className="text-gray-400">
              Duration: ~3.5s
            </p>
          </div>
        </div>
        
        {currentInstruction?.text && (
          <div className="mt-4 pt-4 border-t border-gray-600">
            <h4 className="font-medium text-gray-300 mb-2">Narration</h4>
            <p className="text-gray-200 text-sm">{currentInstruction.text}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;