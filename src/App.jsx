import React, { useState, useEffect } from 'react';
import { 
  Upload, Shirt, User, Sparkles, X, ChevronRight, 
  Moon, Sun, Wand2, RefreshCcw, Loader2, Maximize, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CURATED CATALOGUE WITH CLEAR "OUTFIT PHOTOS" FOR VTO INPUT ---
const CATALOG = [
  { 
    id: "look_01", 
    name: "Summer Linen Chic", 
    category: "casual", 
    price: 110, 
    // This is the photo the Nana banana model would use as the "garment photo"
    garmentPhoto: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600",
    thumb: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&crop=faces"
  },
  { 
    id: "look_02", 
    name: "Urban Explorer", 
    category: "streetwear", 
    price: 240, 
    garmentPhoto: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600", 
    thumb: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=400&auto=format&crop=faces"
  },
  { 
    id: "look_03", 
    name: "Tailored Executive", 
    category: "formal", 
    price: 450, 
    garmentPhoto: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=600", 
    thumb: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=400&auto=format&crop=faces"
  }
];

export default function App() {
  // --- STATE MANAGEMENT ---
  const [activeLook, setActiveLook] = useState(null);
  // Default base photo (User's avatar)
  const [userPhoto, setUserPhoto] = useState('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600');
  // The VTO result photo (or null if not processed)
  const [vtoResultPhoto, setVtoResultPhoto] = useState(null); 
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProcessingVto, setIsProcessingVto] = useState(false);
  const [showVtoAlert, setShowVtoAlert] = useState(false);

  // --- RESTORED UPLOAD LOGIC (USER SELFIE) ---
  const handleUserPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserPhoto(URL.createObjectURL(file));
      // Clear old VTO result if a new user photo is uploaded
      setVtoResultPhoto(null); 
      setShowVtoAlert(true);
      setTimeout(() => setShowVtoAlert(false), 3000);
    }
  };

  // --- "NANA BANANA" VTO INTEGRATION (SIMULATED ENGINE) ---
  const runNanaBananaVto = () => {
    if (!activeLook) return;
    
    // Clear previous results to avoid confusion
    setVtoResultPhoto(null);
    setIsProcessingVto(true);

    /* ⚠️ PRODUCTIONS INTEGRATION PLACEHOLDER ⚠️
      In a real app, you would perform a fetch here to your backend AI API:
      ----------------------------------------------------------------------
      const response = await fetch('your-backend-vto-api.com/process', {
        method: 'POST',
        body: JSON.stringify({
          user_photo_url: userPhoto,
          garment_photo_url: activeLook.garmentPhoto,
          model_name: "Nana banana" // Tell backend which model to use
        })
      });
      const resultData = await response.json();
      setVtoResultPhoto(resultData.processed_image_url);
      ----------------------------------------------------------------------
    */

    // FOR THIS PROTOTYPE, WE SIMULATE THE NANA BANANA MODEL PROCESSING
    setTimeout(() => {
      // For Look 01 (Summer Linen Chic), we "return" a photorealistic try-on result image
      let simulationResult = "";
      if(activeLook.id === "look_01") simulationResult = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600";
      if(activeLook.id === "look_02") simulationResult = "https://images.unsplash.com/photo-1618245362963-70d31709e598?q=80&w=600";
      if(activeLook.id === "look_03") simulationResult = "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=600";
      
      setVtoResultPhoto(simulationResult);
      setIsProcessingVto(false);
    }, 4500); // Simulate model processing time
  };

  const handleSelectLook = (look) => {
    // If we select a new look, clear the old VTO result
    if (activeLook?.id !== look.id) {
      setVtoResultPhoto(null);
    }
    setActiveLook(look);
  };

  return (
    <div className={`${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-stone-50 text-slate-900'} min-h-screen flex flex-col font-sans transition-colors duration-300`}>
      
      {/* HEADER */}
      <header className="p-5 flex justify-between items-center bg-white dark:bg-slate-900 border-b dark:border-slate-800 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-orange-400 to-rose-500 rounded-lg rotate-12" />
          <h1 className="font-black text-xl tracking-tighter uppercase italic">V-AURA <span className="text-rose-500">PRO</span></h1>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
        </button>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT: FITTING ROOM & NANA BANANA VTO ENGINE */}
        <section className="w-full lg:w-3/5 p-8 flex flex-col items-center justify-center bg-stone-100 dark:bg-slate-950 relative border-r dark:border-slate-800">
          
          {/* Main User photo / Processed Result */}
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-[3rem] shadow-2xl overflow-hidden border-[6px] border-white dark:border-slate-800 bg-white group">
            
            {/* Show Processed result if available, otherwise base user photo */}
            <AnimatePresence mode="wait">
              <motion.img 
                key={vtoResultPhoto || userPhoto}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                src={vtoResultPhoto || userPhoto} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt="Avatar" 
              />
            </AnimatePresence>

            {/* If VTO is active, show the "Processed" badge */}
            {vtoResultPhoto && (
              <div className="absolute top-6 right-6 bg-rose-500 text-white flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 z-10">
                <Sparkles size={14} className="animate-pulse" /> VTO PROCESSED <span className="text-white/70">("Nana banana")</span>
              </div>
            )}

            {/* NANA BANANA LOADING OVERLAY */}
            <AnimatePresence>
              {isProcessingVto && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-40 text-white"
                >
                  <Loader2 className="animate-spin text-rose-500" size={50} />
                  <p className="text-sm font-bold tracking-tight">Processing Virtual Try-On...</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-white/50">Powered by Nana banana model</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FITTING ROOM CONTROLS (Upload & VTO Trigger) */}
          <div className="absolute top-8 left-8 z-20">
            <label className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl cursor-pointer font-bold text-xs hover:scale-105 transition-transform border border-stone-200 dark:border-slate-700">
              <Upload size={18} className="text-rose-500" /> UPLOAD PHOTO
              <input type="file" className="hidden" accept="image/*" onChange={handleUserPhotoUpload} />
            </label>
          </div>

          <AnimatePresence>
            {activeLook && !vtoResultPhoto && !isProcessingVto && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border-t-4 border-rose-500"
              >
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-rose-500 tracking-widest">Selected Look</span>
                    <span className="text-sm font-bold truncate max-w-[150px]">{activeLook.name}</span>
                </div>
                <button 
                  onClick={runNanaBananaVto}
                  className="flex items-center gap-2 bg-black dark:bg-rose-500 text-white px-6 py-4 rounded-full text-xs font-black uppercase tracking-tighter hover:scale-105 transition-all shadow-lg"
                >
                  <Wand2 size={16} /> Process VTO (Nana banana)
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Photo Alert */}
          <AnimatePresence>
            {showVtoAlert && (
              <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="fixed top-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-3 px-5 rounded-full flex items-center gap-3 text-xs shadow-2xl z-50">
                 <RefreshCcw size={16} className="text-rose-500 animate-spin"/> Photo updated. Old VTO results cleared.
              </motion.div>
            )}
          </AnimatePresence>

        </section>

        {/* RIGHT: SHOP & OUTFIT SELECTOR */}
        <section className="w-full lg:w-2/5 bg-white dark:bg-slate-900 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b dark:border-slate-800">
            <h2 className="font-black text-sm uppercase tracking-widest text-stone-400">Complete Looks</h2>
            <p className="text-[10px] text-stone-500 italic max-w-[150px]">Select a look to trigger Nana banana VTO processing</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {CATALOG.map(look => (
              <motion.div 
                key={look.id} 
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectLook(look)}
                className={`group cursor-pointer rounded-[2rem] overflow-hidden border-2 transition-all p-3 ${
                  activeLook?.id === look.id ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-transparent bg-stone-50 dark:bg-slate-800 hover:border-stone-200'
                }`}
              >
                <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 relative shadow-inner">
                  <img src={look.thumb} className="w-full h-full object-cover transition-all duration-500" alt={look.name}/>
                  {activeLook?.id === look.id && (
                    <div className="absolute inset-0 bg-rose-500/10 flex items-center justify-center backdrop-blur-[1px]">
                       <div className="bg-white text-rose-500 p-2 rounded-full shadow-xl"><RefreshCcw size={20} /></div>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1 px-2.5 rounded-full text-[9px] font-black uppercase tracking-wider text-rose-600">
                      {look.category}
                  </div>
                </div>
                <h3 className="text-[13px] font-bold px-1 truncate">{look.name}</h3>
                <p className="text-[11px] font-black text-rose-500 px-1 mt-1">£{look.price}.00</p>
              </motion.div>
            ))}
          </div>

          {/* Nana Banana info card */}
          <div className="mt-12 p-6 bg-stone-100 dark:bg-slate-800 rounded-3xl flex gap-4 border dark:border-slate-700">
             <AlertCircle className="text-orange-400 flex-shrink-0" size={30} />
             <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold">About Photorealistic VTO</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">This app uses the advanced "Nana banana" generative model. For best fit and draping results, ensure your input photo has clear lighting and shows your full body pose.</p>
                <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-rose-500">Model: Nana banana v2.1</p>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
