import React, { useState, useEffect, useMemo } from 'react';
import { 
  Upload, Shirt, User, Search, Filter, Trash2, Save, 
  Share2, Sparkles, X, ChevronRight, Ruler, Moon, Sun, ShoppingBag 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const CATALOG = [
  {
    id: "top-001",
    name: "Relaxed Linen Shirt",
    brand: "Studio M",
    category: "tops",
    price: 49.99,
    currency: "GBP",
    sizes: ["XS", "S", "M", "L", "XL"],
    colours: ["white", "sand", "olive"],
    fitType: "Relaxed Fit",
    style: ["casual", "minimalist"],
    thumbnailUrl: "https://picsum.photos/id/225/400/600",
    overlayUrl: "https://via.placeholder.com/600x800/C06C5D/ffffff?text=Linen+Shirt+Overlay",
    sizeGuide: "True to size. Model is 5'9\" wearing size M."
  },
  {
    id: "bot-001",
    name: "Tailored Chinos",
    brand: "Form & Function",
    category: "bottoms",
    price: 75.00,
    currency: "GBP",
    sizes: ["30", "32", "34", "36"],
    colours: ["navy", "khaki"],
    fitType: "Slim Fit",
    style: ["formal", "office"],
    thumbnailUrl: "https://picsum.photos/id/443/400/600",
    overlayUrl: "https://via.placeholder.com/600x800/2D3436/ffffff?text=Chino+Overlay",
    sizeGuide: "Slim fit. If between sizes, size up."
  },
  {
    id: "out-001",
    name: "Heritage Trench Coat",
    brand: "London Fog",
    category: "outerwear",
    price: 189.00,
    currency: "GBP",
    sizes: ["S", "M", "L"],
    colours: ["tan"],
    fitType: "Oversized",
    style: ["minimalist", "office"],
    thumbnailUrl: "https://picsum.photos/id/1059/400/600",
    overlayUrl: "https://via.placeholder.com/600x800/D2B48C/ffffff?text=Trench+Overlay",
    sizeGuide: "Designed for layering. One size fits most."
  }
];

const DEFAULT_MODELS = [
  { id: 'm1', name: 'Alex', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600' },
  { id: 'm2', name: 'Jordan', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600' },
  { id: 'm3', name: 'Casey', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600' },
];

const VIBES = {
  Minimalist: ["tops", "bottoms"],
  Streetwear: ["tops", "outerwear", "bottoms"],
  Office: ["tops", "bottoms", "outerwear"],
};

// --- COMPONENTS ---

export default function VirtualTrialRoom() {
  const [activeOutfit, setActiveOutfit] = useState([]);
  const [userPhoto, setUserPhoto] = useState(DEFAULT_MODELS[1].url);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);
  const [measurements, setMeasurements] = useState({ height: '', weight: '', waist: '' });
  const [savedOutfits, setSavedOutfits] = useState([]);

  // Filter Logic
  const filteredCatalog = CATALOG.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Try-on Logic
  const toggleItem = (item) => {
    setIsLoadingOverlay(true);
    setTimeout(() => {
      setActiveOutfit(prev => {
        const exists = prev.find(i => i.id === item.id);
        if (exists) return prev.filter(i => i.id !== item.id);
        // Logic: Only one top/bottom at a time for realism, but allow layering outerwear
        const filtered = prev.filter(i => i.category !== item.category || item.category === 'outerwear' || item.category === 'accessories');
        return [...filtered, item];
      });
      setIsLoadingOverlay(false);
    }, 600);
  };

  const clearOutfit = () => setActiveOutfit([]);

  const saveOutfit = () => {
    const name = `Outfit ${savedOutfits.length + 1}`;
    const newSaved = [...savedOutfits, { name, items: activeOutfit }];
    setSavedOutfits(newSaved);
    localStorage.setItem('savedOutfits', JSON.stringify(newSaved));
    alert("Outfit saved to your collection!");
  };

  const handleSurpriseMe = () => {
    const randomOutfit = [
      CATALOG.find(c => c.category === 'tops'),
      CATALOG.find(c => c.category === 'bottoms')
    ].filter(Boolean);
    setActiveOutfit(randomOutfit);
  };

  return (
    <div className={`${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-stone-50 text-slate-900'} min-h-screen font-sans transition-colors duration-300`}>
      
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-stone-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <Shirt size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight uppercase">V-AURA</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="flex items-center gap-1 cursor-pointer group">
            <User size={20} className="group-hover:text-rose-500 transition-colors" />
            <span className="text-sm font-medium">Profile</span>
          </div>
        </div>
      </nav>

      <main className="flex flex-col lg:flex-row h-[calc(100vh-73px)] overflow-hidden">
        
        {/* LEFT PANEL: FITTING ROOM */}
        <section className="relative w-full lg:w-[60%] h-full bg-stone-100 dark:bg-slate-950 flex flex-col items-center justify-center p-8 border-r border-stone-200 dark:border-slate-800">
          
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
            <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-all border border-stone-200 dark:border-slate-700">
              <Upload size={16} className="text-rose-500" />
              <span className="text-xs font-semibold uppercase tracking-wider">Upload Photo</span>
              <input type="file" className="hidden" onChange={(e) => setUserPhoto(URL.createObjectURL(e.target.files[0]))} />
            </label>
            <div className="flex gap-2">
              {DEFAULT_MODELS.map(m => (
                <button key={m.id} onClick={() => setUserPhoto(m.url)} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden hover:scale-110 transition-transform shadow-sm">
                  <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* MAIN AVATAR DISPLAY */}
          <div className="relative w-full max-w-md aspect-[3/4] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-slate-800">
            <img src={userPhoto} alt="User Avatar" className="absolute inset-0 w-full h-full object-cover transition-all duration-700" />
            
            {/* ITEM OVERLAYS */}
            <AnimatePresence>
              {activeOutfit.map((item) => (
                <motion.img
                  key={item.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  src={item.overlayUrl}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none mix-blend-multiply dark:mix-blend-normal"
                />
              ))}
            </AnimatePresence>

            {/* LOADING ANIMATION */}
            {isLoadingOverlay && (
              <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                      className="w-2 h-2 bg-rose-500 rounded-full"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STYLE EXPLORER FLOATING BAR */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-stone-200 dark:border-slate-700">
            <button onClick={handleSurpriseMe} className="flex items-center gap-2 text-xs font-bold uppercase tracking-tighter hover:text-rose-500 transition-colors">
              <Sparkles size={16} className="text-rose-500" /> Surprise Me
            </button>
            <div className="w-px h-4 bg-stone-300 dark:bg-slate-600" />
            <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
              {Object.keys(VIBES).map(vibe => (
                <button key={vibe} className="hover:text-rose-500">{vibe}</button>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: CLOTHING BROWSER */}
        <section className="w-full lg:w-[40%] h-full flex flex-col bg-white dark:bg-slate-900">
          
          <div className="p-6 border-b border-stone-100 dark:border-slate-800">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input 
                type="text" 
                placeholder="Search items, brands..." 
                className="w-full pl-10 pr-4 py-3 bg-stone-100 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['all', 'tops', 'bottoms', 'dresses', 'outerwear', 'shoes'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-stone-100 dark:bg-slate-800 text-stone-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4">
            {filteredCatalog.map(item => (
              <motion.div 
                key={item.id} 
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
                onClick={() => toggleItem(item)}
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 dark:bg-slate-800 mb-3">
                  <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    activeOutfit.find(i => i.id === item.id) ? 'bg-rose-500 text-white scale-110' : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md opacity-0 group-hover:opacity-100'
                  }`}>
                    {activeOutfit.find(i => i.id === item.id) ? <X size={16} /> : <Shirt size={16} />}
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded text-[10px] font-bold uppercase text-rose-600">
                      {item.fitType}
                    </span>
                  </div>
                </div>
                <h3 className="text-xs font-bold truncate">{item.name}</h3>
                <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">{item.brand}</p>
                <p className="text-sm font-bold text-rose-500">£{item.price.toFixed(2)}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* OUTFIT TRAY (BOTTOM) */}
      <AnimatePresence>
        {activeOutfit.length > 0 && (
          <motion.footer 
            initial={{ y: 100 }} 
            animate={{ y: 0 }} 
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-slate-900 border-t border-stone-200 dark:border-slate-800 shadow-2xl p-4 lg:px-12 flex items-center justify-between"
          >
            <div className="flex items-center gap-4 overflow-x-auto">
              {activeOutfit.map(item => (
                <div key={item.id} className="relative group flex-shrink-0">
                  <img src={item.thumbnailUrl} className="w-12 h-12 rounded-lg object-cover border border-stone-200" />
                  <button onClick={() => toggleItem(item)} className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                </div>
              ))}
              <div className="w-px h-8 bg-stone-200 mx-2" />
              <div>
                <p className="text-[10px] font-bold uppercase text-stone-400">Total Look</p>
                <p className="text-sm font-bold">
                  £{activeOutfit.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={clearOutfit} className="p-3 text-stone-400 hover:text-rose-500 transition-colors">
                <Trash2 size={20} />
              </button>
              <button onClick={saveOutfit} className="flex items-center gap-2 px-6 py-3 bg-stone-100 dark:bg-slate-800 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-stone-200 transition-all">
                <Save size={18} /> Save Outfit
              </button>
              <button className="flex items-center gap-2 px-8 py-3 bg-rose-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-rose-500/30 hover:scale-105 transition-all">
                Checkout Look <ChevronRight size={18} />
              </button>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>

      {/* FIT GUIDE ASIDE (Optional UI Trigger) */}
      <div className="fixed top-1/2 -right-1 z-40 -translate-y-1/2 hidden xl:flex flex-col gap-2 p-2 bg-white dark:bg-slate-800 border border-stone-200 rounded-l-2xl shadow-xl">
        <button className="p-3 text-stone-500 hover:text-rose-500 transition-colors">
          <Ruler size={24} />
        </button>
        <button className="p-3 text-stone-500 hover:text-rose-500 transition-colors">
          <Share2 size={24} />
        </button>
      </div>

    </div>
  );
}
