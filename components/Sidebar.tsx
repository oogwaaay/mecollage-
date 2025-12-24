
import React from 'react';
import { CollageSettings, CollageImage } from '../types';
import { Maximize2, Palette, Sliders, Type, Smile, Filter as FilterIcon, Wand2 } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  settings: CollageSettings;
  onSettingsChange: (settings: CollageSettings) => void;
  onAddText: () => void;
  onAddSticker: (emoji: string) => void;
  images: CollageImage[];
  onUpdateFilter: (id: string, filter: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, setActiveTab, settings, onSettingsChange, onAddText, onAddSticker, images, onUpdateFilter 
}) => {
  const updateSetting = <K extends keyof CollageSettings>(key: K, value: CollageSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const filters = [
    { name: 'None', value: 'none' },
    { name: 'Noir', value: 'grayscale(100%)' },
    { name: 'Retro', value: 'sepia(60%)' },
    { name: 'Fade', value: 'brightness(110%) saturate(70%)' },
    { name: 'Glow', value: 'saturate(160%) contrast(110%)' },
    { name: 'Cool', value: 'hue-rotate(180deg) brightness(105%)' },
  ];

  const emojis = ['✨', '💖', '🔥', '🎨', '✌️', '🌈', '🥳', '📍', '💭', '⭐', '🎈', '📷'];

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-100 flex flex-col h-full z-30 shadow-sm">
      <div className="flex-1 overflow-y-auto p-8 space-y-10">
        
        {activeTab === 'layout' && (
          <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
            <section>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Aspect Ratio</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {['1:1', '4:5', '9:16', '3:4', '16:9'].map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => updateSetting('aspectRatio', ratio)}
                    className={`py-3.5 text-xs font-bold rounded-2xl border-2 transition-all ${settings.aspectRatio === ratio ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-gray-50 text-gray-500 hover:border-gray-100'}`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Geometry</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold"><span className="text-gray-400">Gutter</span> <span className="text-indigo-600">{settings.spacing}px</span></div>
                  <input type="range" min="0" max="40" value={settings.spacing} onChange={(e) => updateSetting('spacing', parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold"><span className="text-gray-400">Radius</span> <span className="text-indigo-600">{settings.borderRadius}px</span></div>
                  <input type="range" min="0" max="120" value={settings.borderRadius} onChange={(e) => updateSetting('borderRadius', parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'filter' && (
          <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Photo Filters</h3>
             <div className="grid grid-cols-2 gap-4">
               {filters.map(f => (
                 <button
                   key={f.name}
                   onClick={() => images.forEach(img => onUpdateFilter(img.id, f.value))}
                   className="group relative aspect-video bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:ring-2 hover:ring-indigo-500 transition-all flex items-center justify-center"
                 >
                   <span className="relative z-10 text-[10px] font-black uppercase tracking-widest text-gray-600 group-hover:text-indigo-600">{f.name}</span>
                   <div className="absolute inset-0 bg-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </button>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-8 animate-in slide-in-from-left-4 duration-500 text-center">
            <div className="bg-indigo-50 p-8 rounded-[2rem] border-2 border-dashed border-indigo-100">
              <Type className="mx-auto text-indigo-400 mb-6" size={40} />
              <button 
                onClick={onAddText}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                Add Text
              </button>
            </div>
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-loose">Double click text on canvas to modify content</p>
          </div>
        )}

        {activeTab === 'sticker' && (
          <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Emoji Stickers</h3>
            <div className="grid grid-cols-4 gap-4">
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => onAddSticker(emoji)}
                  className="text-4xl p-2 hover:scale-125 transition-transform active:scale-90"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Sidebar;
