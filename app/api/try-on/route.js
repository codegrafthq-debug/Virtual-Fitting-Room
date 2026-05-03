import { NextResponse } from 'next/server';

export const maxDuration = 60; 

export async function POST(request) {
  try {
    const formData = await request.formData();
    const userPhoto = formData.get('userPhoto');
    const outfitPhoto = formData.get('outfitPhoto');

    const API_KEY = process.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ success: false, error: "API Key missing." }, { status: 500 });
    }

    // Convert images to Base64
    const userBuffer = await userPhoto.arrayBuffer();
    const outfitBuffer = await outfitPhoto.arrayBuffer();
    
    const userBase64 = Buffer.from(userBuffer).toString('base64');
    const outfitBase64 = Buffer.from(outfitBuffer).toString('base64');

    // Imagen 3.0 Predict Call
    const imageResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [
          { 
            prompt: "A professional full-body photograph of the person in [1] wearing the exact clothing from [2]. The person is standing in a modern living room. Maintain the person's physical features and drape the fabric naturally with realistic folds. High-resolution, photorealistic, cinematic lighting.",
            referenceImages: [
              {
                referenceId: 1,
                referenceType: "SUBJECT",
                image: { mimeType: userPhoto.type, bytesBase64Encoded: userBase64 }
              },
              {
                referenceId: 2,
                referenceType: "SUBJECT",
                image: { mimeType: outfitPhoto.type, bytesBase64Encoded: outfitBase64 }
              }
            ]
          }
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: "3:4"
        }
      })
    });

    const imageData = await imageResponse.json();

    if (!imageResponse.ok) {
        console.error("API Error Response:", imageData);
        throw new Error(imageData.error?.message || "Failed the image generation step");
    }

    // Extract the image
    const resultBase64Bytes = imageData.predictions[0].bytesBase64Encoded;
    const finalImageUrl = `data:image/jpeg;base64,${resultBase64Bytes}`;

    return NextResponse.json({ 
      success: true, 
      resultUrl: finalImageUrl 
    });

  } catch (error) {
    console.error("Gemini MVP Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Server error" }, { status: 500 });
  }
}
