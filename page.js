'use client';

import { useState } from 'react';

// Sample outfits from famous UK brands
const ukBrandsOutfits = [
  { id: 1, brand: 'Burberry', name: 'Classic Trench Coat', image: 'https://via.placeholder.com/150?text=Burberry+Trench' },
  { id: 2, brand: 'ASOS', name: 'Summer Floral Dress', image: 'https://via.placeholder.com/150?text=ASOS+Dress' },
  { id: 3, brand: 'Marks & Spencer', name: 'Tailored Wool Suit', image: 'https://via.placeholder.com/150?text=M%26S+Suit' },
  { id: 4, brand: 'Barbour', name: 'Waxed Cotton Jacket', image: 'https://via.placeholder.com/150?text=Barbour+Jacket' },
  { id: 5, brand: 'AllSaints', name: 'Leather Biker Jacket', image: 'https://via.placeholder.com/150?text=AllSaints+Leather' },
  { id: 6, brand: 'Ted Baker', name: 'Pleated Midi Skirt', image: 'https://via.placeholder.com/150?text=Ted+Baker+Skirt' },
  { id: 7, brand: 'Superdry', name: 'Vintage Logo Hoodie', image: 'https://via.placeholder.com/150?text=Superdry+Hoodie' },
  { id: 8, brand: 'Paul Smith', name: 'Signature Stripe Shirt', image: 'https://via.placeholder.com/150?text=Paul+Smith+Shirt' },
  { id: 9, brand: 'Next', name: 'Casual Denim Jacket', image: 'https://via.placeholder.com/150?text=Next+Denim' },
  { id: 10, brand: 'Mulberry', name: 'Silk Evening Gown', image: 'https://via.placeholder.com/150?text=Mulberry+Gown' },
];

export default function VirtualTrialRoom() {
  const [userPhoto, setUserPhoto] = useState(null);
  const [outfitPhoto, setOutfitPhoto] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUserPhotoUpload = (e) => setUserPhoto(e.target.files[0]);
  const handleOutfitUpload = (e) => setOutfitPhoto(e.target.files[0]);
  const selectSampleOutfit = (imageUrl) => setOutfitPhoto(imageUrl);

  const handleTryOn = async () => {
    if (!userPhoto || !outfitPhoto) return alert("Please provide both a user photo and an outfit.");
    
    setLoading(true);
    
    // Create FormData to send files to your backend API route
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
    <div className="min-h-screen p-8 bg-gray-50 text-gray-800 font-sans">
      <h1 className="text-3xl font-bold text-center mb-8">Virtual Trial Room</h1>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">1. Upload Your Photo</h2>
          <input type="file" accept="image/*" onChange={handleUserPhotoUpload} className="mb-6 w-full" />

          <h2 className="text-xl font-semibold mb-4">2. Upload Custom Outfit</h2>
          <input type="file" accept="image/*" onChange={handleOutfitUpload} className="w-full" />
        </div>

        {/* UK Brands Sample Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Or Choose a UK Brand Sample</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-64 overflow-y-auto">
            {ukBrandsOutfits.map((outfit) => (
              <div 
                key={outfit.id} 
                className="cursor-pointer border p-2 rounded hover:border-blue-500 transition"
                onClick={() => selectSampleOutfit(outfit.image)}
              >
                <img src={outfit.image} alt={outfit.name} className="w-full h-24 object-cover mb-2" />
                <p className="text-xs font-bold">{outfit.brand}</p>
                <p className="text-xs text-gray-500 truncate">{outfit.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center mt-8">
        <button 
          onClick={handleTryOn} 
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Generating...' : 'Try It On'}
        </button>
      </div>

      {/* Result Section */}
      {resultImage && (
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Your Virtual Try-On Result</h2>
          <img src={resultImage} alt="Try-On Result" className="mx-auto max-w-md rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
}