import React, { useEffect, useState, useCallback } from 'react';
import { FileText, Zap, Type, Volume2, Minus } from 'lucide-react';
import { useElectron } from '../hooks/useElectron';

interface ScriptInstruction {
  text: string;
  effects: string[];
  sceneNumber: number;
}

interface ScriptParserProps {
  scriptFiles: string[];
  onScriptParsed: (instructions: ScriptInstruction[]) => void;
  isDesktop?: boolean;
}

const ScriptParser: React.FC<ScriptParserProps> = ({ scriptFiles, onScriptParsed, isDesktop = false }) => {
  const { api } = useElectron();
  const [isLoading, setIsLoading] = useState(false);
  const [parsedInstructions, setParsedInstructions] = useState<ScriptInstruction[]>([]);

  const parseScriptContent = useCallback((content: string): ScriptInstruction[] => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const instructions: ScriptInstruction[] = [];
    
    lines.forEach((line, index) => {
      const effects: string[] = [];
      let text = line.trim();
      
      // Parse special instructions
      if (text.includes('TAMBAH TEKS DIATAS')) {
        effects.push('typing-text');
        text = text.replace('TAMBAH TEKS DIATAS', '').trim();
      }
      
      if (text.includes('TAMBAH SUARA KEYBOARD')) {
        effects.push('keyboard-sound');
        text = text.replace('TAMBAH SUARA KEYBOARD', '').trim();
      }
      
      if (text.includes('PAKAI FOOTAGE HITAM')) {
        effects.push('black-screen');
        text = text.replace('PAKAI FOOTAGE HITAM', '').trim();
      }
      
      // Parse strikethrough replacements
      const coretMatch = text.match(/CORET\s+(\w+)\s+JADI\s+(\w+)/);
      if (coretMatch) {
        effects.push(`strikethrough:${coretMatch[1]}:${coretMatch[2]}`);
        text = text.replace(/CORET\s+\w+\s+JADI\s+\w+/, '').trim();
      }
      
      if (text) {
        instructions.push({
          text,
          effects,
          sceneNumber: index + 1
        });
      }
    });
    
    return instructions;
  }, []);

  const processScriptFiles = useCallback(async () => {
    if (scriptFiles.length === 0) return;
    
    setIsLoading(true);
    
    try {
      let combinedContent = '';
      
      if (isDesktop && api) {
        // Desktop mode: read files using Electron API
        const sortedFiles = [...scriptFiles].sort((a, b) => a.localeCompare(b));
        
        for (const filePath of sortedFiles) {
          const content = await api.readFile(filePath);
          combinedContent += content + '\n';
        }
      } else {
        // Web mode: use File objects (fallback)
        const fileObjects = scriptFiles as unknown as File[];
        const sortedFiles = [...fileObjects].sort((a, b) => a.name.localeCompare(b.name));
        
        for (const file of sortedFiles) {
          const content = await file.text();
          combinedContent += content + '\n';
        }
      }
      
      const instructions = parseScriptContent(combinedContent);
      setParsedInstructions(instructions);
      onScriptParsed(instructions);
    } catch (error) {
      console.error('Error processing script files:', error);
      if (api) {
        await api.showMessage({
          type: 'error',
          title: 'Script Processing Error',
          message: `Failed to process script files: ${error.message}`
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [scriptFiles, parseScriptContent, onScriptParsed, isDesktop, api]);

  useEffect(() => {
    processScriptFiles();
  }, [processScriptFiles]);

  const getEffectIcon = (effect: string) => {
    if (effect === 'typing-text') return <Type className="w-4 h-4" />;
    if (effect === 'keyboard-sound') return <Volume2 className="w-4 h-4" />;
    if (effect === 'black-screen') return <Minus className="w-4 h-4" />;
    if (effect.startsWith('strikethrough:')) return <Zap className="w-4 h-4" />;
    return null;
  };

  const getEffectLabel = (effect: string) => {
    if (effect === 'typing-text') return 'Typing Text';
    if (effect === 'keyboard-sound') return 'Keyboard Sound';
    if (effect === 'black-screen') return 'Black Screen';
    if (effect.startsWith('strikethrough:')) {
      const [, from, to] = effect.split(':');
      return `Strike: ${from} → ${to}`;
    }
    return effect;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex items-center space-x-3 mb-4">
        <FileText className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-semibold">Script Analysis</h3>
        {isLoading && (
          <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {parsedInstructions.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Parsed Instructions</h4>
              <p className="text-gray-300">Total scenes: {parsedInstructions.length}</p>
              <p className="text-gray-300">
                Effects found: {parsedInstructions.reduce((acc, inst) => acc + inst.effects.length, 0)}
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Script Files</h4>
              {scriptFiles.map((file, index) => (
                <p key={index} className="text-gray-300 text-sm truncate">
                  {isDesktop ? file.split('/').pop() || file.split('\\').pop() : (file as unknown as File).name}
                </p>
              ))}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {parsedInstructions.map((instruction, index) => (
                <div key={index} className="bg-gray-700/30 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-gray-400 font-mono">
                      Scene {instruction.sceneNumber}
                    </span>
                    {instruction.effects.length > 0 && (
                      <div className="flex space-x-1">
                        {instruction.effects.map((effect, effectIndex) => (
                          <div
                            key={effectIndex}
                            className="flex items-center space-x-1 bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs"
                          >
                            {getEffectIcon(effect)}
                            <span>{getEffectLabel(effect)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-200">{instruction.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptParser;