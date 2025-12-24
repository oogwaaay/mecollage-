
import React, { useState } from 'react';
import { LayoutGrid, Download, Plus, Type, Smile, Filter, Settings2 } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import CollageEditor from './components/CollageEditor';
import Sidebar from './components/Sidebar';
import { CollageImage, CollageSettings, TextLayer, StickerLayer } from './types';

const App: React.FC = () => {
  const [images, setImages] = useState<CollageImage[]>([]);
  const [texts, setTexts] = useState<TextLayer[]>([]);
  const [stickers, setStickers] = useState<StickerLayer[]>([]);
  const [activeTab, setActiveTab] = useState<'layout' | 'filter' | 'text' | 'sticker'>('layout');
  const [settings, setSettings] = useState<CollageSettings>({
    spacing: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    aspectRatio: '1:1',
  });

  const handleImagesUploaded = (newImages: CollageImage[]) => {
    setImages((prev) => {
      const combined = [...prev, ...newImages];
      return combined.slice(0, 20); // 严格限制 20 张
    });
  };

  const reorderImages = (draggedId: string, targetId: string) => {
    setImages((prev) => {
      const newArr = [...prev];
      const draggedIdx = newArr.findIndex(img => img.id === draggedId);
      const targetIdx = newArr.findIndex(img => img.id === targetId);
      if (draggedIdx === -1 || targetIdx === -1) return prev;
      const [removed] = newArr.splice(draggedIdx, 1);
      newArr.splice(targetIdx, 0, removed);
      return newArr;
    });
  };

  const addText = () => {
    const newText: TextLayer = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'Double click to edit',
      color: '#000000',
      fontSize: 28,
      x: 30,
      y: 30,
    };
    setTexts([...texts, newText]);
    setActiveTab('text');
  };

  const addSticker = (emoji: string) => {
    const newSticker: StickerLayer = {
      id: Math.random().toString(36).substr(2, 9),
      emoji,
      x: 45,
      y: 45,
    };
    setStickers([...stickers, newSticker]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfd] text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
            <LayoutGrid size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">MeCollage <span className="text-indigo-600">Pro</span></span>
        </div>
        
        {images.length > 0 && (
          <button
            onClick={() => alert('High-resolution export triggered!')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2"
          >
            <Download size={18} />
            Export Image
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {images.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-500">
            <div className="max-w-2xl w-full text-center space-y-8">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                Your photos, <br/><span className="text-indigo-600">perfectly arranged.</span>
              </h2>
              <p className="text-gray-400 text-lg font-medium">Simple. Professional. Support up to 20 photos.</p>
              <ImageUploader onUpload={handleImagesUploaded} />
            </div>
          </div>
        ) : (
          <>
            <Sidebar 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              settings={settings} 
              onSettingsChange={setSettings}
              onAddText={addText}
              onAddSticker={addSticker}
              images={images}
              onUpdateFilter={(id, filter) => setImages(prev => prev.map(img => img.id === id ? {...img, filter} : img))}
            />

            <div className="flex-1 relative overflow-auto bg-gray-50/30 p-4 md:p-12 flex flex-col items-center">
              <CollageEditor 
                images={images} 
                settings={settings}
                texts={texts}
                stickers={stickers}
                onReorder={reorderImages}
                onRemoveImage={(id) => setImages(prev => prev.filter(img => img.id !== id))}
                onUploadMore={handleImagesUploaded}
                onUpdateText={(id, updates) => setTexts(prev => prev.map(t => t.id === id ? {...t, ...updates} : t))}
                onUpdateSticker={(id, updates) => setStickers(prev => prev.map(s => s.id === id ? {...s, ...updates} : s))}
              />
              
              {/* Floating Action Bar */}
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-2xl shadow-2xl border border-white/50 rounded-2xl p-1.5 flex gap-1 z-40 ring-1 ring-black/5">
                {[
                  { id: 'layout', icon: Settings2 },
                  { id: 'filter', icon: Filter },
                  { id: 'text', icon: Type },
                  { id: 'sticker', icon: Smile }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)} 
                    className={`p-3.5 rounded-xl transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <tab.icon size={22}/>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
