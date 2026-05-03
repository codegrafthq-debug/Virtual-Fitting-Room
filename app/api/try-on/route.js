import { NextResponse } from 'next/server';

export const maxDuration = 60; 

export async function POST(request) {
  try {
    const formData = await request.formData();
    const userPhoto = formData.get('userPhoto');
    const outfitPhoto = formData.get('outfitPhoto');

    const API_KEY = process.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ success: false, error: "Missing API Key." }, { status: 500 });
    }

    const [userBuffer, outfitBuffer] = await Promise.all([
      userPhoto.arrayBuffer(),
      outfitPhoto.arrayBuffer(),
    ]);
    
    const userBase64 = Buffer.from(userBuffer).toString('base64');
    const outfitBase64 = Buffer.from(outfitBuffer).toString('base64');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { 
                  // I've added the aspect ratio request directly into the prompt text
                  text: "Virtual Try-On Task: Generate a high-resolution, photorealistic 3:4 portrait of the person in Image 1 wearing the exact clothing shown in Image 2. Maintain the person's identity and body shape. The fabric should drape naturally with realistic folds." 
                },
                { inline_data: { mime_type: userPhoto.type, data: userBase64 } },
                { inline_data: { mime_type: outfitPhoto.type, data: outfitBase64 } }
              ]
            }
          ],
          generationConfig: {
            // "candidateCount" is the correct name for "sampleCount" in Gemini 3
            candidateCount: 1
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini Error:", JSON.stringify(data, null, 2));
      return NextResponse.json({ success: false, error: data.error?.message || "Generation failed" }, { status: 400 });
    }

    // Extracting the image from the response candidates
    const resultBase64 = data.candidates[0].content.parts[0].inline_data.data;
    
    return NextResponse.json({ 
      success: true, 
      resultUrl: `data:image/jpeg;base64,${resultBase64}` 
    });

  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
