import React, { useState, useEffect } from 'react';
import { 
  Upload, Shirt, User, Sparkles, X, ChevronRight, 
  Moon, Sun, Wand2, RefreshCcw, Loader2, Image as ImageIcon, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- EXPANDED BRAND CATALOGUE ---
const CATALOG = [
  { id: "zara-01", name: "Oversized Wool Coat", brand: "Zara", price: 129, category: "Outerwear", thumb: "https://images.unsplash.com/photo-1591047139829-d91aec36caea?q=80&w=400" },
  { id: "hnm-01", name: "High-Waist Wide Trousers", brand: "H&M", price: 34.99, category: "Bottoms", thumb: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=400" },
  { id: "uniqlo-01", name: "Airism Cotton Oversized Tee", brand: "Uniqlo", price: 19.90, category: "Tops", thumb: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400" },
  { id: "mns-01", name: "Pure Silk Wrap Dress", brand: "M&S", price: 85, category: "Dresses", thumb: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400" },
  { id: "zara-02", name: "Cropped Denim Jacket", brand: "Zara", price: 49.99, category: "Outerwear", thumb: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=400" },
  { id: "uniqlo-02", name: "Ultra Light Down Vest", brand: "Uniqlo", price: 59.90, category: "Outerwear", thumb: "https://images.unsplash.com/photo-1621072156002-e2fcced0b17d?q=80&w=400" }
];

export default function App() {
  const [userPhoto, setUserPhoto] = useState('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600');
  const [garmentPhoto, setGarmentPhoto] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [vtoResult, setVtoResult] = useState(null);

  // --- HANDLERS ---
  const handleUserUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserPhoto(URL.createObjectURL(file));
      setVtoResult(null);
    }
  };

  const handleGarmentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGarmentPhoto(URL.createObjectURL(file));
      setVtoResult(null);
    }
  };

  const selectFromCatalog = (item) => {
    setGarmentPhoto(item.thumb);
    setVtoResult(null);
  };

  const runNanaBanana = () => {
    if (!userPhoto || !garmentPhoto) return;
    setIsProcessing(true);
    
    // Simulating Nana Banana 2 (Gemini 3 Flash Image) processing
    setTimeout(() => {
      // In a real implementation, the AI would return a merged image.
      // We simulate success by setting the garment as the "result" overlayed on the user.
      setVtoResult(garmentPhoto); 
      setIsProcessing(false);
    }, 4000);
  };

  return (
    <div className={`${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-stone-50 text-slate-900'} min-h-screen flex flex-col transition-all duration-500`}>
      
      {/* HEADER */}
      <nav className="p-4 px-8 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <Sparkles size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic">V-AURA <span className="text-rose-500">ULTRA</span></span>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-full">
          {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
        </button>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT: STUDIO CANVAS */}
        <section className="w-full lg:w-3/5 p-6 lg:p-12 bg-stone-100 dark:bg-slate-950 flex flex-col items-center justify-center relative">
          
          {/* UPLOAD CONTROLS */}
          <div className="flex flex-wrap gap-3 mb-8">
            <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border dark:border-slate-700 cursor-pointer hover:bg-rose-50 transition-colors text-[10px] font-bold uppercase tracking-widest">
              <User size={14} className="text-rose-500" /> Upload Person
              <input type="file" hidden onChange={handleUserUpload} />
            </label>
            <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border dark:border-slate-700 cursor-pointer hover:bg-rose-50 transition-colors text-[10px] font-bold uppercase tracking-widest">
              <Shirt size={14} className="text-rose-500" /> Upload Garment
              <input type="file" hidden onChange={handleGarmentUpload} />
            </label>
          </div>

          {/* MAIN PREVIEW CANVAS */}
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-[3rem] shadow-2xl overflow-hidden bg-white border-8 border-white dark:border-slate-800">
            <img src={userPhoto} className="absolute inset-0 w-full h-full object-cover" alt="User" />
            
            {/* VTO MASK / RESULT */}
            <AnimatePresence>
              {vtoResult && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
                  <img src={vtoResult} className="w-full h-full object-cover mix-blend-multiply opacity-80" alt="Result" />
                  <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg">
                    <CheckCircle2 size={16} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PROCESSING OVERLAY */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-lg flex flex-col items-center justify-center text-white z-20">
                  <Loader2 className="animate-spin text-rose-500 mb-4" size={48} />
                  <p className="font-black text-xs uppercase tracking-[0.3em] animate-pulse">Nana Banana 2 Processing...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI TRIGGER */}
          <div className="mt-8">
            <button 
              disabled={!garmentPhoto || isProcessing}
              onClick={runNanaBanana}
              className={`flex items-center gap-3 px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                garmentPhoto 
                ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95' 
                : 'bg-stone-300 dark:bg-slate-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              <Wand2 size={18} /> Render Virtual Fit
            </button>
          </div>
        </section>

        {/* RIGHT: BRAND EXPLORER */}
        <section className="w-full lg:w-2/5 bg-white dark:bg-slate-900 p-8 border-l dark:border-slate-800 overflow-y-auto">
          
          {/* CUSTOM GARMENT PREVIEW */}
          <div className="mb-10">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">Input Stream</h3>
            <div className="flex gap-4">
              <div className="w-20 h-28 bg-stone-100 dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-dashed border-stone-300 dark:border-slate-700 flex flex-col items-center justify-center text-stone-400">
                <img src={userPhoto} className="w-full h-full object-cover" />
              </div>
              <div className="w-20 h-28 bg-stone-100 dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-dashed border-stone-300 dark:border-slate-700 flex flex-col items-center justify-center text-stone-400 relative">
                {garmentPhoto ? (
                  <img src={garmentPhoto} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon size={20} />
                    <span className="text-[8px] mt-2">No Garment</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* CATALOGUE */}
          <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-6">High-Street Curator</h3>
          <div className="grid grid-cols-2 gap-4">
            {CATALOG.map(item => (
              <motion.div 
                key={item.id} 
                whileHover={{ y: -5 }}
                onClick={() => selectFromCatalog(item)}
                className={`group cursor-pointer p-2 rounded-2xl border-2 transition-all ${
                  garmentPhoto === item.thumb ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-900/10' : 'border-transparent hover:bg-stone-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 relative bg-stone-100">
                  <img src={item.thumb} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-white/90 dark:bg-slate-900/90 p-1 px-2 rounded-lg text-[8px] font-black uppercase tracking-tighter">
                    {item.brand}
                  </div>
                </div>
                <div className="px-1">
                  <p className="text-[11px] font-bold truncate">{item.name}</p>
                  <p className="text-[10px] font-black text-rose-500">£{item.price}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* INFO CARD */}
          <div className="mt-12 p-6 rounded-3xl bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-xl">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-2">Nana Banana v2.0</h4>
            <p className="text-[11px] leading-relaxed opacity-90">
              For custom uploads, ensure your garment is on a flat background or a mannequin. The AI engine performs best with high-contrast inputs.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
