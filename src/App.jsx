import React, { useState, useEffect } from 'react';
import { 
  Upload, Shirt, User, Search, Trash2, Save, 
  Sparkles, X, ChevronRight, Ruler, Moon, Sun 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPROVED MOCK DATA WITH TRANSPARENT SVG OVERLAYS ---
const CATALOG = [
  {
    id: "top-01",
    name: "Classic White Tee",
    brand: "Essentials",
    category: "tops",
    price: 25.00,
    fitType: "Regular Fit",
    // This is a simplified SVG path for a T-shirt
    overlaySvg: "M20,40 L80,40 L90,60 L80,65 L80,100 L20,100 L20,65 L10,60 Z",
    color: "#FFFFFF",
    thumbnailUrl: "https://picsum.photos/id/225/400/600",
  },
  {
    id: "top-02",
    name: "Rose Linen Shirt",
    brand: "Studio M",
    category: "tops",
    price: 45.00,
    fitType: "Relaxed Fit",
    overlaySvg: "M15,35 L85,35 L95,70 L80,75 L80,100 L20,100 L20,75 L5,70 Z",
    color: "#E5989B",
    thumbnailUrl: "https://picsum.photos/id/338/400/600",
  },
  {
    id: "bot-01",
    name: "Dark Denim",
    brand: "Raw Co",
    category: "bottoms",
    price: 89.00,
    fitType: "Slim Fit",
    // Path for trousers
    overlaySvg: "M30,100 L70,100 L75,180 L55,180 L50,130 L45,180 L25,180 Z",
    color: "#1B263B",
    thumbnailUrl: "https://picsum.photos/id/674/400/600",
  },
  {
    id: "out-01",
    name: "Modern Blazer",
    brand: "Tailor It",
    category: "outerwear",
    price: 120.00,
    fitType: "Tailored",
    overlaySvg: "M10,30 L90,30 L95,100 L85,105 L85,130 L15,130 L15,105 L5,100 Z",
    color: "#415A77",
    thumbnailUrl: "https://picsum.photos/id/1059/400/600",
  }
];

export default function App() {
  const [activeOutfit, setActiveOutfit] = useState([]);
  const [userPhoto, setUserPhoto] = useState('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const toggleItem = (item) => {
    setLoadingId(item.id);
    
    // Simulate "Processing AI Fit"
    setTimeout(() => {
      setActiveOutfit(prev => {
        const isAlreadyOn = prev.find(i => i.id === item.id);
        if (isAlreadyOn) return prev.filter(i => i.id !== item.id);
        
        // Remove other items in same category (except outerwear/accessories)
        const others = prev.filter(i => i.category !== item.category || item.category === 'outerwear');
        return [...others, item];
      });
      setLoadingId(null);
    }, 500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setUserPhoto(URL.createObjectURL(file));
  };

  return (
    <div className={`${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-stone-50 text-slate-900'} min-h-screen flex flex-col transition-colors`}>
      
      {/* NAV */}
      <header className="p-4 flex justify-between items-center border-b dark:border-slate-800 bg-white dark:bg-slate-900">
        <h1 className="font-black tracking-tighter text-2xl text-rose-500">V-AURA</h1>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 bg-stone-100 dark:bg-slate-800 rounded-full">
          {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
        </button>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT: THE FITTING ROOM */}
        <section className="w-full lg:w-3/5 p-6 flex flex-col items-center justify-center bg-stone-100 dark:bg-slate-950 relative">
          
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
            <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform text-xs font-bold">
              <Upload size={16} /> UPLOAD PHOTO
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            
            {/* Active Layers List */}
            <div className="mt-4">
               <p className="text-[10px] font-bold text-stone-400 mb-2 uppercase tracking-widest">Active Layers</p>
               {activeOutfit.length === 0 && <p className="text-xs italic text-stone-400">Empty</p>}
               {activeOutfit.map(i => (
                 <div key={i.id} className="flex items-center gap-2 mb-1 bg-white dark:bg-slate-800 p-1 pr-3 rounded-lg text-[10px] font-bold shadow-sm">
                   <div className="w-2 h-2 rounded-full" style={{background: i.color}} /> {i.name}
                 </div>
               ))}
            </div>
          </div>

          {/* THE TRY-ON CANVAS */}
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-[2rem] shadow-2xl overflow-hidden bg-white border-4 border-white dark:border-slate-800">
            <img src={userPhoto} className="absolute inset-0 w-full h-full object-cover" alt="User" />
            
            {/* ILLUSTRATIVE OVERLAY ENGINE */}
            <svg viewBox="0 0 100 200" className="absolute inset-0 w-full h-full drop-shadow-2xl">
              <AnimatePresence>
                {activeOutfit.map((item) => (
                  <motion.path
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0.8, scale: 1 }}
                    exit={{ opacity: 0 }}
                    d={item.overlaySvg}
                    fill={item.color}
                    className="mix-blend-multiply dark:mix-blend-screen"
                  />
                ))}
              </AnimatePresence>
            </svg>

            {loadingId && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                <Sparkles className="text-white animate-spin" size={40} />
              </div>
            )}
          </div>

          <p className="mt-6 text-xs text-stone-400 font-medium">✨ Click clothing cards on the right to try them on</p>
        </section>

        {/* RIGHT: THE SHOP */}
        <section className="w-full lg:w-2/5 bg-white dark:bg-slate-900 overflow-y-auto p-6">
          <div className="mb-8">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-4 text-stone-400">Catalogue</h2>
            <div className="grid grid-cols-2 gap-4">
              {CATALOG.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => toggleItem(item)}
                  className={`group cursor-pointer rounded-2xl border-2 transition-all p-2 ${
                    activeOutfit.find(i => i.id === item.id) ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-900/10' : 'border-transparent hover:border-stone-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 mb-3 relative">
                    <img src={item.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {activeOutfit.find(i => i.id === item.id) && (
                      <div className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg">
                        <X size={12} />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xs font-bold truncate">{item.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">{item.fitType}</span>
                    <span className="text-xs font-black">£{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER ACTION TRAY */}
      {activeOutfit.length > 0 && (
        <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="p-4 bg-white dark:bg-slate-900 border-t flex justify-between items-center px-8 shadow-2xl">
          <div className="flex -space-x-2">
            {activeOutfit.map(i => <div key={i.id} className="w-8 h-8 rounded-full border-2 border-white bg-stone-200 overflow-hidden"><img src={i.thumbnailUrl}/></div>)}
          </div>
          <div className="flex gap-4">
            <button onClick={() => setActiveOutfit([])} className="p-3 text-stone-400 hover:text-rose-500"><Trash2 size={20}/></button>
            <button className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30">Checkout Look</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
