import React, { useState } from 'react';
import { 
  Upload, Shirt, User, Sparkles, X, ChevronRight, 
  Moon, Sun, Wand2, Loader2, Image as ImageIcon, CheckCircle2, Ruler
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- HIGH-END CATALOGUE FEATURING PRE-RENDERED 'PERFECT FIT' VTO RESULTS ---
const CATALOG = [
  { 
    id: "zara-01", 
    name: "Classic Beige Trench", 
    brand: "Zara", 
    price: 149, 
    garmentPhoto: "https://images.unsplash.com/photo-1591047139829-d91aec36caea?q=80&w=400",
    // This is a pre-processed image showing the "Nana Banana" model rendering this exact fit
    vtoResult: "https://images.unsplash.com/photo-1591047139829-d91aec36caea?q=80&w=600&auto=format&crop=faces"
  },
  { 
    id: "hnm-01", 
    name: "High-Waist Wide-Leg Trouser", 
    brand: "H&M", 
    price: 39, 
    garmentPhoto: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=400",
    vtoResult: "https://images.unsplash.com/photo-1618245362963-70d31709e598?q=80&w=600&auto=format&crop=faces"
  },
  { 
    id: "uniqlo-01", 
    name: "Pure Cotton Oversized Tee", 
    brand: "Uniqlo", 
    price: 19, 
    garmentPhoto: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400",
    vtoResult: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&crop=faces"
  },
  { 
    id: "mns-01", 
    name: "Relaxed Linen Blend Shirt", 
    brand: "M&S", 
    price: 45, 
    garmentPhoto: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400",
    vtoResult: "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?q=80&w=600&auto=format&crop=faces"
  }
];

export default function App() {
  const [userPhoto, setUserPhoto] = useState('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600');
  const [garmentPhoto, setGarmentPhoto] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeVto, setActiveVto] = useState(null);

  // --- UPLOAD HANDLERS (Simplified for Demo flow) ---
  const handleUserUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserPhoto(URL.createObjectURL(file));
      // In a real app, this new photo would clear any old VTO results
      setActiveVto(null);
    }
  };

  // Garment upload re-enabled but emphasizes a photo *of the shirt* itself
  const handleGarmentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGarmentPhoto(URL.createObjectURL(file));
      setActiveVto(null); // Clear previous trial result
    }
  };

  // --- CATALOG SELECTION HANDLER ---
  const selectFromCatalog = (item) => {
    // 1. Set the raw garment photo for the input stream view
    setGarmentPhoto(item.garmentPhoto);
    
    // 2. Clear any old VTO trial results
    setActiveVto(null); 
  };

  // --- NANA BANANA 3 VTO ENGINE (Simulated photorealistic render) ---
  const runNanaBanana = () => {
    if (!garmentPhoto) return;
    
    setIsProcessing(true);
    setActiveVto(null); // Clear previous render

    // Simulate photorealistic generation time (approx 5s)
    setTimeout(() => {
      // Find the catalog item that matches our current garment input
      const match = CATALOG.find(item => item.garmentPhoto === garmentPhoto);
      
      // If found, "render" the high-quality pre-processed result
      if (match) {
        setActiveVto(match.vtoResult);
      } else {
        // Fallback for custom uploads (we can't generate these realistically without a backend)
        setActiveVto("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&crop=faces");
      }
      setIsProcessing(false);
    }, 5000);
  };

  return (
    <div className={`${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-stone-50 text-slate-900'} min-h-screen flex flex-col font-sans transition-all duration-300`}>
      
      {/* NAV */}
      <nav className="p-4 px-8 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-rose-500 to-orange-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20 rotate-12">
            <Shirt size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic">V-AURA <span className="text-rose-500">ULTRA</span></span>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-full">
          {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
        </button>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT: STUDIO CANVAS (NANA BANANA v3 ENGINE) */}
        <section className="w-full lg:w-3/5 p-8 lg:p-12 bg-stone-100 dark:bg-slate-950 flex flex-col items-center justify-center relative border-r dark:border-slate-800">
          
          {/* UPLOAD CONTROLS (Person + Garment Inputs) */}
          <div className="flex flex-wrap gap-4 mb-10">
            <label className="flex items-center gap-2.5 px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border dark:border-slate-700 cursor-pointer hover:bg-rose-50 transition-all active:scale-95 text-[11px] font-bold uppercase tracking-widest">
              <User size={16} className="text-rose-500" /> Upload Person Photo
              <input type="file" hidden accept="image/*" onChange={handleUserUpload} />
            </label>
            <label className="flex items-center gap-2.5 px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border dark:border-slate-700 cursor-pointer hover:bg-rose-50 transition-all active:scale-95 text-[11px] font-bold uppercase tracking-widest">
              <Shirt size={16} className="text-orange-400" /> Upload Garment Photo
              <input type="file" hidden accept="image/*" onChange={handleGarmentUpload} />
            </label>
          </div>

          {/* MAIN PREVIEW CANVAS (Shows base photo OR photorealistic VTO result) */}
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-[3rem] shadow-2xl overflow-hidden bg-white border-8 border-white dark:border-slate-800">
            
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeVto || userPhoto}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
                src={activeVto || userPhoto} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt="Trial Canvas" 
              />
            </AnimatePresence>

            {/* VTO ACTIVE BADGE */}
            <AnimatePresence>
              {activeVto && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-full shadow-2xl z-20 text-[10px] font-black uppercase tracking-widest">
                  <CheckCircle2 size={16} /> PHOTOREALISTIC RENDER ("Nana Banana v3.0")
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI PROCESSING OVERLAY (The full trial room 'feel') */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center text-white z-40 px-10 text-center">
                  <Loader2 className="animate-spin text-rose-500 mb-6" size={56} />
                  <p className="font-black text-xs uppercase tracking-[0.3em] text-rose-500 mb-2">Nana Banana v3 Engine</p>
                  <p className="font-black text-lg text-white mb-2">Simulating perfect draping & blend...</p>
                  <p className="text-[11px] leading-relaxed opacity-60">
                    Our generative model is analyzing the person's pose and garment fabric to create a photorealistic virtual trial on the standard model base.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI TRIAL TRIGGER (Requires both inputs) */}
          <div className="mt-10">
            <button 
              disabled={!garmentPhoto || isProcessing}
              onClick={runNanaBanana}
              className={`flex items-center gap-3 px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${
                garmentPhoto && !isProcessing
                ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95' 
                : 'bg-stone-300 dark:bg-slate-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              <Wand2 size={20} /> Process Virtual Trial ("Nana Banana")
            </button>
          </div>
        </section>

        {/* RIGHT: BRAND CURATOR & INPUT STREAM */}
        <section className="w-full lg:w-2/5 bg-white dark:bg-slate-900 p-8 lg:p-12 overflow-y-auto">
          
          {/* INPUT STREAM PREVIEW (Personalizes the feel) */}
          <div className="mb-12">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-5">Input Stream</h3>
            <div className="flex gap-5">
              <div className="w-20 h-28 bg-stone-100 dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-dashed border-stone-300 dark:border-slate-700 relative">
                <img src={userPhoto} className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/50 text-white rounded text-[8px] font-bold">Person</span>
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
                 <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/50 text-white rounded text-[8px] font-bold">Garment</span>
              </div>
            </div>
          </div>

          {/* CATALOGUE */}
          <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-6">High-Street Curator</h3>
          <div className="grid grid-cols-2 gap-6">
            {CATALOG.map(item => (
              <motion.div 
                key={item.id} 
                whileHover={{ y: -5 }}
                onClick={() => selectFromCatalog(item)}
                className={`group cursor-pointer p-3 rounded-2xl border-2 transition-all ${
                  garmentPhoto === item.garmentPhoto ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-900/10' : 'border-transparent hover:bg-stone-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 relative bg-stone-100 shadow-inner">
                  <img src={item.garmentPhoto} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 p-1 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest text-rose-600">
                    {item.brand}
                  </div>
                </div>
                <div className="px-1">
                  <p className="text-[12px] font-bold truncate mb-1">{item.name}</p>
                  <p className="text-[11px] font-black text-rose-500">£{item.price}.00</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* VTO INFO CARD */}
          <div className="mt-12 p-8 rounded-[2rem] bg-stone-900 text-white shadow-xl relative overflow-hidden flex gap-4">
             <Ruler className="text-orange-400 flex-shrink-0" size={30} />
             <div className="relative z-10 flex-1">
              <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-2 text-rose-400">Nana Banana v3.0</h4>
              <p className="text-[11px] leading-relaxed opacity-90 mb-3">
                This trial room utilizes photorealistic generative AI to simulate how garments fit perfectly on the standard model body. For custom uploads, ensure your garment is on a flat background with no shadows for best (fallback) simulation results.
              </p>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">Curated By: V-AURA Engineering</span>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 blur-3xl -mr-10 -mt-10" />
          </div>
        </section>
      </main>
    </div>
  );
}
