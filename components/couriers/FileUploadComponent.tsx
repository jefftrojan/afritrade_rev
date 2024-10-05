import React, { useState, useRef } from 'react';
import { FiUpload } from 'react-icons/fi';

interface FileUploadComponentProps {
  onFileUpload: (file: File) => Promise<void>;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-indigo-600');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-indigo-600');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-indigo-600');
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      await onFileUpload(selectedFile);
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      className="w-full max-w-md mx-auto border-2 border-dashed border-gray-300 rounded-lg p-6"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
      />
      <div className="text-center">
        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-1 text-sm text-gray-600">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Upload a file
          </button>
          {' '}or drag and drop
        </p>
        <p className="mt-1 text-xs text-gray-500">PDF, PNG, JPG, GIF up to 10MB</p>
      </div>

      {selectedFile && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">{selectedFile.name}</p>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;