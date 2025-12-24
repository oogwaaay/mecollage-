
import React, { useState } from 'react';
import { Trash2, GripVertical, Move } from 'lucide-react';
import { CollageImage, CollageSettings, TextLayer, StickerLayer } from '../types';
import ImageUploader from './ImageUploader';

interface CollageEditorProps {
  images: CollageImage[];
  settings: CollageSettings;
  texts: TextLayer[];
  stickers: StickerLayer[];
  onReorder: (draggedId: string, targetId: string) => void;
  onRemoveImage: (id: string) => void;
  onUploadMore: (images: CollageImage[]) => void;
  onUpdateText: (id: string, updates: Partial<TextLayer>) => void;
  onUpdateSticker: (id: string, updates: Partial<StickerLayer>) => void;
}

const CollageEditor: React.FC<CollageEditorProps> = ({ 
  images, settings, texts, stickers, onReorder, onRemoveImage, onUploadMore, onUpdateText, onUpdateSticker 
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const getGridCols = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 9) return 'grid-cols-3';
    if (count <= 16) return 'grid-cols-4';
    return 'grid-cols-5';
  };

  const containerStyle = {
    '--spacing': `${settings.spacing}px`,
    '--radius': `${settings.borderRadius}px`,
    '--bg-color': settings.backgroundColor,
    '--aspect': settings.aspectRatio.replace(':', '/'),
  } as React.CSSProperties;

  return (
    <div className="relative w-full max-w-4xl flex flex-col items-center group/editor">
      <div 
        className="collage-container w-full shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] bg-white p-4 rounded-[2rem] relative overflow-hidden transition-all duration-500"
        style={containerStyle}
      >
        <div className={`canvas-grid h-full ${getGridCols(images.length)}`}>
          {images.map((img) => (
            <div 
              key={img.id}
              draggable
              onDragStart={(e) => {
                setDraggedId(img.id);
                // 解决模糊小技巧：在拖拽开始瞬间延迟改变样式，让浏览器拍下清晰的快照
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragEnd={() => setDraggedId(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedId && draggedId !== img.id) {
                  onReorder(draggedId, img.id);
                }
              }}
              className={`relative group overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-200 
                ${draggedId === img.id ? 'opacity-40 ring-4 ring-indigo-500 ring-inset' : 'opacity-100'}
                hover:shadow-inner`}
              style={{ borderRadius: `${settings.borderRadius}px` }}
            >
              <img 
                src={img.url} 
                className="w-full h-full object-cover select-none pointer-events-none"
                style={{ 
                  filter: img.filter || 'none',
                  transform: draggedId === img.id ? 'scale(1.05)' : 'scale(1)' 
                }}
              />
              
              {/* 优化后的抓手区域 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                 <div className="bg-white/90 p-2 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <GripVertical className="text-indigo-600 w-5 h-5" />
                 </div>
              </div>

              {/* 删除按钮 */}
              <button
                onClick={(e) => { e.stopPropagation(); onRemoveImage(img.id); }}
                className="absolute top-3 right-3 p-2 bg-white text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-lg transform translate-x-2 group-hover:translate-x-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {images.length < 20 && (
            <div className="flex items-center justify-center min-h-[140px]">
              <ImageUploader onUpload={onUploadMore} compact />
            </div>
          )}
        </div>

        {/* Text & Stickers layers remain the same... */}
        {texts.map(text => (
          <div key={text.id} contentEditable suppressContentEditableWarning onBlur={(e) => onUpdateText(text.id, { text: e.currentTarget.innerText })} className="absolute cursor-move p-2 rounded-lg bg-white/20 backdrop-blur-md" style={{ left: `${text.x}%`, top: `${text.y}%`, color: text.color, fontSize: `${text.fontSize}px`, fontWeight: 800 }}>{text.text}</div>
        ))}
        {stickers.map(sticker => (
          <div key={sticker.id} className="absolute cursor-move text-5xl drop-shadow-2xl" style={{ left: `${sticker.x}%`, top: `${sticker.y}%` }}>{sticker.emoji}</div>
        ))}
      </div>
      
      <div className="mt-8 px-6 py-2.5 bg-indigo-950 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
        {images.length} / 20 PHOTOS
      </div>
    </div>
  );
};

export default CollageEditor;
