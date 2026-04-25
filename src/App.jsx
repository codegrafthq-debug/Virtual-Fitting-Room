import React, { useState, useEffect } from 'react';
import { 
  Upload, Shirt, User, Sparkles, X, ChevronRight, 
  Moon, Sun, MessageSquare, Wand2, RefreshCcw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- INITIALIZE GEMINI ---
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const CATALOG = [
  { id: "t1", name: "Classic White Tee", category: "tops", price: 25, color: "#FFFFFF", svg: "M20,40 L80,40 L90,60 L80,65 L80,100 L20,100 L20,65 L10,60 Z", thumb: "https://picsum.photos/id/225/400/600" },
  { id: "t2", name: "Rose Linen Shirt", category: "tops", price: 45, color: "#E5989B", svg: "M15,35 L85,35 L95,70 L80,75 L80,100 L20,100 L20,75 L5,70 Z", thumb: "https://picsum.photos/id/338/400/600" },
  { id: "b1", name: "Dark Denim", category: "bottoms", price: 89, color: "#1B263B", svg: "M30,100 L70,100 L75,180 L55,180 L50,130 L45,180 L25,180 Z", thumb: "https://picsum.photos/id/674/400/600" },
  { id: "o1", name: "Modern Blazer", category: "outerwear", price: 120, color: "#415A77", svg: "M10,30 L90,30 L95,100 L85,105 L85,130 L15,130 L15,105 L5,100 Z", thumb: "https://picsum.photos/id/1059/400/600" }
];

export default function App() {
  const [activeOutfit, setActiveOutfit] = useState([]);
  const [userPhoto, setUserPhoto] = useState('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // --- AI STYLIST LOGIC ---
  const askGemini = async () => {
    if (activeOutfit.length === 0) return;
    setIsAiLoading(true);
    try {
      const itemNames = activeOutfit.map(i => i.name).join(", ");
      const prompt = `You are a world-class fashion stylist named Aura. I am trying on: ${itemNames}. 
      Give me a short, trendy, and supportive 3-sentence styling tip for this specific look. 
      Tell me what shoes to pair it with and what "vibe" I'm giving off.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAiAdvice(response.text());
    } catch (error) {
      setAiAdvice("Aura is resting right now. Check back in a moment!");
    }
    setIsAiLoading(false);
  };

  const toggleItem = (item) => {
    setActiveOutfit(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.filter(i => i.id !== item.id);
      const others = prev.filter(i => i.category !== item.category || item.category === 'outerwear');
      return [...others, item];
    });
    setAiAdvice(""); // Clear old advice when outfit changes
  };

  return (
    <div className={`${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-stone-50 text-slate-900'} min-h-screen flex flex-col font-sans transition-colors`}>
      
      {/* HEADER */}
      <header className="p-5 flex justify-between items-center bg-white dark:bg-slate-900 border-b dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-rose-500 to-orange-400 rounded-lg rotate-12" />
          <h1 className="font-black text-xl tracking-tighter uppercase italic">V-AURA <span className="text-rose-500">AI</span></h1>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
        </button>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT: FITTING ROOM */}
        <section className="w-full lg:w-3/5 p-8 flex flex-col items-center justify-center bg-stone-100 dark:bg-slate-950 relative">
          <div className="absolute top-8 left-8">
            <label className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl cursor-pointer font-bold text-xs hover:scale-105 transition-transform border border-stone-200 dark:border-slate-700">
              <Upload size={18} className="text-rose-500" /> CHANGE PHOTO
              <input type="file" className="hidden" onChange={(e) => setUserPhoto(URL.createObjectURL(e.target.files[0]))} />
            </label>
          </div>

          {/* AVATAR CANVAS */}
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-[3rem] shadow-2xl overflow-hidden border-[6px] border-white dark:border-slate-800 bg-white group">
            <img src={userPhoto} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Avatar" />
            
            <svg viewBox="0 0 100 200" className="absolute inset-0 w-full h-full drop-shadow-2xl">
              <AnimatePresence>
                {activeOutfit.map((item) => (
                  <motion.path
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.7, y: 0 }}
                    exit={{ opacity: 0 }}
                    d={item.svg}
                    fill={item.color}
                    className="mix-blend-multiply dark:mix-blend-screen"
                  />
                ))}
              </AnimatePresence>
            </svg>
          </div>

          {/* AI STYLIST BUBBLE */}
          <AnimatePresence>
            {(aiAdvice || isAiLoading) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-10 right-10 left-10 lg:left-auto lg:w-80 bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-2xl border-t-4 border-rose-500"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-rose-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Aura Stylist Bot</span>
                </div>
                {isAiLoading ? (
                  <div className="flex gap-1 py-2">
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed italic">"{aiAdvice}"</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* RIGHT: SHOP & CATALOGUE */}
        <section className="w-full lg:w-2/5 bg-white dark:bg-slate-900 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-black text-sm uppercase tracking-widest text-stone-400">Curated Collection</h2>
            {activeOutfit.length > 0 && (
              <button 
                onClick={askGemini}
                className="flex items-center gap-2 bg-black dark:bg-rose-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter hover:scale-105 transition-all shadow-lg"
              >
                <Wand2 size={14} /> Consult Stylist
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {CATALOG.map(item => (
              <motion.div 
                key={item.id} 
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleItem(item)}
                className={`group cursor-pointer rounded-[2rem] overflow-hidden border-2 transition-all p-3 ${
                  activeOutfit.find(i => i.id === item.id) ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-transparent bg-stone-50 dark:bg-slate-800 hover:border-stone-200'
                }`}
              >
                <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 relative shadow-inner">
                  <img src={item.thumb} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
                  {activeOutfit.find(i => i.id === item.id) && (
                    <div className="absolute inset-0 bg-rose-500/10 flex items-center justify-center backdrop-blur-[2px]">
                       <div className="bg-white text-rose-500 p-2 rounded-full shadow-xl"><RefreshCcw size={20} /></div>
                    </div>
                  )}
                </div>
                <h3 className="text-[13px] font-bold px-1">{item.name}</h3>
                <p className="text-[11px] font-black text-rose-500 px-1 mt-1">£{item.price}.00</p>
              </motion.div>
            ))}
          </div>

          {activeOutfit.length > 0 && (
            <div className="mt-12 p-6 bg-stone-900 text-white rounded-[2rem] shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400 mb-4">Your Selection</h4>
                <div className="flex gap-3 mb-6">
                  {activeOutfit.map(i => <img key={i.id} src={i.thumb} className="w-12 h-16 rounded-lg object-cover border border-white/20" />)}
                </div>
                <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2">
                  Complete Look <ChevronRight size={16} />
                </button>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 blur-3xl -mr-10 -mt-10" />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
