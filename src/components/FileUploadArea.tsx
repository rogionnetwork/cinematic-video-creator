import React, { useCallback, useState } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';

interface FileUploadAreaProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  acceptedTypes: string;
  multiple: boolean;
  onFilesUpload: (files: File[]) => void;
  uploadedFiles: File[];
  color: 'blue' | 'purple' | 'green';
}

const colorClasses = {
  blue: {
    border: 'border-blue-500',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    hover: 'hover:bg-blue-500/20'
  },
  purple: {
    border: 'border-purple-500',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    hover: 'hover:bg-purple-500/20'
  },
  green: {
    border: 'border-green-500',
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    hover: 'hover:bg-green-500/20'
  }
};

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  icon,
  title,
  description,
  acceptedTypes,
  multiple,
  onFilesUpload,
  uploadedFiles,
  color
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const colors = colorClasses[color];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesUpload(files);
    }
  }, [onFilesUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesUpload(files);
    }
  }, [onFilesUpload]);

  const removeFile = useCallback((index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    onFilesUpload(newFiles);
  }, [uploadedFiles, onFilesUpload]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`${colors.text}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? `${colors.border} ${colors.bg}`
            : 'border-gray-600 hover:border-gray-500'
        } ${colors.hover}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={acceptedTypes}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          id={`file-input-${title.replace(/\s+/g, '-').toLowerCase()}`}
        />
        <label
          htmlFor={`file-input-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="cursor-pointer"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Drop files here or click to browse</p>
          <p className="text-sm text-gray-400">
            Supports {acceptedTypes === 'image/*' ? 'JPG, PNG, GIF' : acceptedTypes === '.txt' ? 'TXT files' : 'MP3, WAV, M4A'}
          </p>
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2 text-sm font-semibold">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>{uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded</span>
          </div>
          <div className="max-h-32 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadArea;