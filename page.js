'use client';

import { useState } from 'react';

// Sample outfits with cleaner placeholder URLs (3:4 aspect ratio)
const ukBrandsOutfits = [
  { id: 1, brand: 'Burberry', name: 'Trench Coat', image: 'https://placehold.co/300x400/f8fafc/334155?text=Burberry\nTrench' },
  { id: 2, brand: 'ASOS', name: 'Floral Dress', image: 'https://placehold.co/300x400/f8fafc/334155?text=ASOS\nDress' },
  { id: 3, brand: 'M&S', name: 'Wool Suit', image: 'https://placehold.co/300x400/f8fafc/334155?text=M%26S\nSuit' },
  { id: 4, brand: 'Barbour', name: 'Waxed Jacket', image: 'https://placehold.co/300x400/f8fafc/334155?text=Barbour\nJacket' },
  { id: 5, brand: 'AllSaints', name: 'Biker Jacket', image: 'https://placehold.co/300x400/f8fafc/334155?text=AllSaints\nLeather' },
  { id: 6, brand: 'Ted Baker', name: 'Midi Skirt', image: 'https://placehold.co/300x400/f8fafc/334155?text=Ted+Baker\nSkirt' },
];

// Reusable SVG Icon for Upload
const UploadIcon = () => (
  <svg className="w-8 h-8 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
  </svg>
);

export default function VirtualTrialRoom() {
  const [userPhoto, setUserPhoto] = useState(null);
  const [userPreview, setUserPreview] = useState(null);
  
  const [outfitPhoto, setOutfitPhoto] = useState(null);
  const [outfitPreview, setOutfitPreview] = useState(null);
  
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file uploads and generate object URLs for instant preview
  const handleUserPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserPhoto(file);
      setUserPreview(URL.createObjectURL(file));
    }
  };

  const handleOutfitUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOutfitPhoto(file);
      setOutfitPreview(URL.createObjectURL(file));
    }
  };

  const selectSampleOutfit = async (imageUrl) => {
    setOutfitPreview(imageUrl);
    // For the API, we'd ideally fetch this URL and convert to a file, 
    // but we'll store the URL temporarily to pass to the backend.
    setOutfitPhoto(imageUrl); 
  };

  const handleTryOn = async () => {
    if (!userPhoto || !outfitPhoto) return alert("Please select both your photo and an outfit.");
    
    setLoading(true);
    setResultImage(null); // Clear previous result
    
    const formData = new FormData();
    formData.append('userPhoto', userPhoto);
    formData.append('outfitPhoto', outfitPhoto);

    try {
      const response = await fetch('/api/try-on', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        setResultImage(data.resultUrl);
      } else {
        alert("Error generating image.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* Navbar / Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 mb-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Virtual Try-On Studio
          </h1>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Uploads */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* User Photo Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold mb-1">1. Your Photo</h2>
            <p className="text-sm text-slate-500 mb-4">Upload a clear, front-facing photo of yourself.</p>
            
            <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden group">
              {userPreview ? (
                <img src={userPreview} alt="User Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon />
                  <p className="text-sm text-slate-600 font-medium">Click to upload photo</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleUserPhotoUpload} className="hidden" />
              {/* Overlay on hover when image exists */}
              {userPreview && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-medium">Change Photo</span>
                </div>
              )}
            </label>
          </div>

          {/* Custom Outfit Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold mb-1">2. Choose an Outfit</h2>
            <p className="text-sm text-slate-500 mb-4">Upload your own garment or select from the gallery.</p>
            
            <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden group">
              {outfitPreview ? (
                <img src={outfitPreview} alt="Outfit Preview" className="w-full h-full object-contain bg-white" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon />
                  <p className="text-sm text-slate-600 font-medium">Upload custom outfit</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleOutfitUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Middle/Right Column: Gallery & Results */}
        <div className="lg:col-span-7 flex flex-col space-y-8">
          
          {/* Gallery Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold mb-4">Or Try a Brand Classic</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {ukBrandsOutfits.map((outfit) => (
                <div 
                  key={outfit.id} 
                  className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${outfitPreview === outfit.image ? 'border-blue-500 shadow-md ring-2 ring-blue-200' : 'border-transparent hover:border-slate-200'}`}
                  onClick={() => selectSampleOutfit(outfit.image)}
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-slate-100">
                    <img src={outfit.image} alt={outfit.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3 bg-slate-50">
                    <p className="text-xs font-bold text-slate-900">{outfit.brand}</p>
                    <p className="text-xs text-slate-500 truncate">{outfit.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button & Result */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[300px]">
            {!resultImage ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Ready to see your new look?</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">Upload your photo and select an outfit above to generate your virtual try-on.</p>
                
                <button 
                  onClick={handleTryOn} 
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Stitching Garments...
                    </span>
                  ) : 'Generate Try-On'}
                </button>
              </div>
            ) : (
              <div className="w-full animate-fade-in">
                <h3 className="text-xl font-bold mb-4 text-center">Your Result</h3>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-sm mx-auto">
                  <img src={resultImage} alt="Try-On Result" className="w-full h-auto object-cover" />
                  <button 
                    onClick={() => setResultImage(null)}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow hover:bg-white text-slate-800 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}
