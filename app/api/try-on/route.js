import { NextResponse } from 'next/server';

// Set a longer timeout for image generation
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

    // Convert blobs to Base64 strings
    const [userBuffer, outfitBuffer] = await Promise.all([
      userPhoto.arrayBuffer(),
      outfitPhoto.arrayBuffer(),
    ]);
    
    const userBase64 = Buffer.from(userBuffer).toString('base64');
    const outfitBase64 = Buffer.from(outfitBuffer).toString('base64');

    // Call the Gemini 3 Pro Image model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { 
                  text: "Task: Virtual clothing try-on. Image 1 is the person. Image 2 is the clothing item. Generate a photorealistic image of the person from Image 1 wearing the exact clothing from Image 2. Maintain the person's body shape, face, and pose. Ensure the fabric drapes realistically with natural lighting and shadows." 
                },
                { inline_data: { mime_type: userPhoto.type, data: userBase64 } },
                { inline_data: { mime_type: outfitPhoto.type, data: outfitBase64 } }
              ]
            }
          ],
          generationConfig: {
            sampleCount: 1,
            aspectRatio: "3:4"
          }
        }
      )
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini Error:", data);
      return NextResponse.json({ success: false, error: data.error?.message || "Generation failed" }, { status: 400 });
    }

    // Extract the generated image data
    const resultBase64 = data.candidates[0].content.parts[0].inline_data.data;
    
    return NextResponse.json({ 
      success: true, 
      resultUrl: `data:image/jpeg;base64,${resultBase64}` 
    });

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
