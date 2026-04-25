import React, { useState } from 'react';
import { 
  Upload, Shirt, User, Sparkles, X, ChevronRight, 
  Moon, Sun, Wand2, Loader2, Image as ImageIcon, Ruler, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CURATED CATALOGUE ---
const CATALOG = [
  { id: "look_01", name: "Premium Olive Tee", brand: "Uniqlo", price: 29, color: "Olive", thumb: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400", hex: "#556B2F" },
  { id: "look_02", name: "Rose Linen Shirt", brand: "Zara", price: 55, color: "Rose", thumb: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400", hex: "#E5989B" },
  { id: "look_03", name: "Urban Dark Denim", brand: "H&M", price: 95, color: "Dark Indigo", thumb: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=400", hex: "#1B263B" },
  { id: "look_04", name: "Pure Silk Wrap Dress", brand: "M&S", price: 85, color: "Navy", thumb: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400", hex: "#000080" }
];

export default function App() {
  const [userPhoto, setUserPhoto] = useState('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600');
  const [garmentPhoto, setGarmentPhoto] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeVtoGarmentId, setActiveVtoGarmentId] = useState(null);

  const handleUserUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserPhoto(URL.createObjectURL(file));
      setActiveVtoGarmentId(null); 
    }
  };

  const handleGarmentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGarmentPhoto(URL.createObjectURL(file));
      setActiveVtoGarmentId(null); 
    }
  };

  const selectFromCatalog = (item) => {
    setGarmentPhoto(item.thumb);
    setActiveVtoGarmentId(null); 
  };

  const runNanaBanana = () => {
    if (!garmentPhoto) return;
    setIsProcessing(true);
    setActiveVtoGarmentId(null);

    // Simulating Localized Identity-Safe VTO processing
    setTimeout(() => {
      const match = CATALOG.find(item => item.thumb === garmentPhoto);
      if (match) {
        setActiveVtoGarmentId(match.id);
      } else {
        // Fallback ID for custom uploads
        setActiveVtoGarmentId("custom");
      }
      setIsProcessing(false);
    }, 5000);
  };

  return (
    <div className={`${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-stone-50 text-slate-900'} min-h-screen flex flex-col font-sans transition-all duration-300`}>
      
      {/* HEADER */}
      <nav className="p-4 px-8 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-black dark:bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20 rotate-12">
            <Shirt size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic">V-AURA <span className="text-rose-500">ULTRA</span></span>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
        </button>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT: STUDIO CANVAS */}
        <section className="w-full lg:w-3/5 p-8 lg:p-12 bg-stone-100 dark:bg-slate-950 flex flex-col items-center justify-center relative border-r dark:border-slate-800">
          
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-[3rem] shadow-2xl overflow-hidden border-[6px] border-white dark:border-slate-800 bg-white group">
            <img src={userPhoto} className="absolute inset-0 w-full h-full object-cover" alt="Avatar" />
            
            <AnimatePresence>
              {activeVtoGarmentId && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
                  className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10"
                >
                    <img 
                      src={garmentPhoto} 
                      className="w-1/2 h-1/2 object-contain rounded-2xl mix-blend-multiply opacity-90 mt-20" 
                    />
                    <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                        <Sparkles size={14} /> IDENTITY LOCKED • VTO ACTIVE
                    </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isProcessing && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center gap-4 z-40 text-white"
                >
                  <Loader2 className="animate-spin text-rose-500" size={50} />
                  <p className="text-sm font-bold tracking-tight">Nana Banana v3.1 Processing...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DUAL UPLOAD CONTROLS */}
          <div className="absolute top-8 left-8 z-20 flex flex-col gap-3">
            <label className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl cursor-pointer font-bold text-xs hover:scale-105 transition-transform border border-stone-200 dark:border-slate-700">
              <User size={18} className="text-rose-500" /> UPLOAD PERSON
              <input type="file" className="hidden" accept="image/*" onChange={handleUserUpload} />
            </label>
            <label className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl cursor-pointer font-bold text-xs hover:scale-105 transition-transform border border-stone-200 dark:border-slate-700">
              <Shirt size={18} className="text-orange-400" /> UPLOAD OUTFIT
              <input type="file" className="hidden" accept="image/*" onChange={handleGarmentUpload} />
            </label>
          </div>
        </section>

        {/* RIGHT: CURATOR */}
        <section className="w-full lg:w-2/5 bg-white dark:bg-slate-900 p-8 lg:p-12 overflow-y-auto">
          
          <div className="mb-12">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-5">Input Stream</h3>
            <div className="flex gap-5">
              <div className="w-20 h-28 bg-stone-100 dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-stone-300 dark:border-slate-700">
                <img src={userPhoto} className="w-full h-full object-cover" />
              </div>
              <div className="w-20 h-28 bg-stone-100 dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-dashed border-stone-300 dark:border-slate-700 flex flex-col items-center justify-center">
                {garmentPhoto ? (
                  <img src={garmentPhoto} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={20} className="text-stone-300" />
                )}
              </div>
            </div>
          </div>

          <h2 className="font-black text-sm uppercase tracking-widest text-stone-400 mb-8 pb-4 border-b dark:border-slate-800">High-Street Curator</h2>
          <div className="grid grid-cols-2 gap-6">
            {CATALOG.map(item => (
              <div 
                key={item.id} 
                onClick={() => selectFromCatalog(item)}
                className={`group cursor-pointer rounded-[2rem] overflow-hidden border-2 transition-all p-3 ${
                  garmentPhoto === item.thumb ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-transparent bg-stone-50 dark:bg-slate-800 hover:border-stone-200'
                }`}
              >
                <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 relative shadow-inner">
                  <img src={item.thumb} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.name}/>
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 p-1 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest text-rose-600">
                      {item.brand}
                  </div>
                </div>
                <h3 className="text-[13px] font-bold px-1 truncate">{item.name}</h3>
                <p className="text-[11px] font-black text-rose-500 px-1 mt-1">£{item.price}.00</p>
              </div>
            ))}
          </div>

          {garmentPhoto && (
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="mt-12 p-6 bg-stone-900 text-white rounded-[2rem] shadow-2xl relative overflow-hidden flex gap-4">
               <Wand2 className="text-orange-400 flex-shrink-0" size={30} />
               <div className="relative z-10 flex-1">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-2 text-rose-400">Nana Banana v3.1</h4>
                <p className="text-[11px] leading-relaxed opacity-90 mb-4">Click below to render the garment onto your photo while keeping your face and pose locked.</p>
                <button 
                  disabled={isProcessing}
                  onClick={runNanaBanana}
                  className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? "Processing..." : "Render Local Trial"}
                </button>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 blur-3xl -mr-10 -mt-10" />
            </motion.div>
          )}

          <div className="mt-12 p-6 bg-stone-100 dark:bg-slate-800 rounded-3xl flex gap-4 border dark:border-slate-700">
             <Ruler className="text-orange-400 flex-shrink-0" size={30} />
             <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold">Identity-Safe VTO</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">Nana Banana preserves your original photo while re-draping the garment.</p>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
