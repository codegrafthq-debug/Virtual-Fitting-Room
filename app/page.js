'use client';

import { useState } from 'react';

const ukBrandsOutfits = [
  { id: 1, brand: 'Burberry', name: 'Trench Coat', image: 'https://placehold.co/300x400/f8fafc/334155?text=Burberry\nTrench' },
  { id: 2, brand: 'ASOS', name: 'Floral Dress', image: 'https://placehold.co/300x400/f8fafc/334155?text=ASOS\nDress' },
  { id: 3, brand: 'M&S', name: 'Wool Suit', image: 'https://placehold.co/300x400/f8fafc/334155?text=M%26S\nSuit' },
  { id: 4, brand: 'Barbour', name: 'Waxed Jacket', image: 'https://placehold.co/300x400/f8fafc/334155?text=Barbour\nJacket' },
  { id: 5, brand: 'AllSaints', name: 'Biker Jacket', image: 'https://placehold.co/300x400/f8fafc/334155?text=AllSaints\nLeather' },
  { id: 6, brand: 'Ted Baker', name: 'Midi Skirt', image: 'https://placehold.co/300x400/f8fafc/334155?text=Ted+Baker\nSkirt' },
];

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
    setOutfitPhoto(imageUrl); 
  };

  const handleTryOn = async () => {
    if (!userPhoto || !outfitPhoto) return alert("Please select both your photo and an outfit.");
    
    setLoading(true);
    setResultImage(null);
    
    const formData = new FormData();
    formData.append('userPhoto', userPhoto);
    formData.append('outfitPhoto', outfitPhoto);

    try {
      // This is the URL that was throwing the 404 error
      const response = await fetch('/api/try-on', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        setResultImage(data.resultUrl);
      } else {
        alert("Error generating image: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      <header className="bg-white border-b border-slate-200 px-8 py-6 mb-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Virtual Try-On Studio
          </h1>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div className="lg:col-span-5 space-y-8">
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
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleUserPhotoUpload} className="hidden" />
            </label>
          </div>

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

        <div className="lg:col-span-7 flex flex-col space-y-8">
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

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[300px]">
            {!resultImage ? (
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 mt-4">Ready to see your new look?</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">Upload your photo and select an outfit above to generate your virtual try-on.</p>
                
                <button 
                  onClick={handleTryOn} 
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 transition-all"
                >
                  {loading ? 'Stitching Garments...' : 'Generate Try-On'}
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
                    X
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
