
import React, { useState } from 'react';
import { Upload, Plus } from 'lucide-react';
import { CollageImage } from '../types';

interface ImageUploaderProps {
  onUpload: (images: CollageImage[]) => void;
  compact?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, compact = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages: CollageImage[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file: file,
    }));
    onUpload(newImages);
  };

  if (compact) {
    return (
      <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group">
        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
          <Plus className="text-gray-400 group-hover:text-indigo-600" size={20} />
        </div>
        <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => processFiles(e.target.files)} />
      </label>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); }}
      className={`relative border-2 border-dashed rounded-[3rem] p-16 transition-all cursor-pointer group
        ${isDragging ? 'border-indigo-500 bg-indigo-50 ring-8 ring-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-100'}`}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => processFiles(e.target.files)}
      />
      <div className="flex flex-col items-center pointer-events-none">
        <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-indigo-100">
          <Upload size={32} />
        </div>
        <p className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Drop photos or Click to Upload</p>
        <p className="text-gray-400 font-medium">PNG, JPG, HEIC up to 20 images</p>
      </div>
    </div>
  );
};

export default ImageUploader;
