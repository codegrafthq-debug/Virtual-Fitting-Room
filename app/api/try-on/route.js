export async function POST(request) {
  try {
    const maxDuration = 120; // Sets timeout to 60 seconds
    const formData = await request.formData();
    const userPhoto = formData.get('userPhoto');
    const outfitPhoto = formData.get('outfitPhoto');

    const API_KEY = process.env.VITE_GEMINI_API_KEY;

    const [userBuffer, outfitBuffer] = await Promise.all([
      userPhoto.arrayBuffer(),
      outfitPhoto.arrayBuffer(),
    ]);
    
    const userBase64 = Buffer.from(userBuffer).toString('base64');
    const outfitBase64 = Buffer.from(outfitBuffer).toString('base64');
    console.log("Calling URL:", `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY ? 'EXISTS' : 'MISSING'}`);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Virtual Try-On Task: Generate a photo of the person in the first image wearing the exact outfit from the second image. High resolution, photorealistic." },
                { inline_data: { mime_type: userPhoto.type, data: userBase64 } },
                { inline_data: { mime_type: outfitPhoto.type, data: outfitBase64 } }
              ]
            }
          ],
          generation_config: {
            response_modalities: ["TEXT", "IMAGE"], // REQUIRED for image output
            candidate_count: 1,
            // You can specify the aspect ratio and resolution here instead of just text
            image_config: {
                aspect_ratio: "3:4",
                image_size: "1K" // Options: 0.5K, 1K, 2K, 4K
            }
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini Error:", data);
      return NextResponse.json({ success: false, error: data.error?.message || "Generation failed" }, { status: 400 });
    }

    // SAFE EXTRACTION: Look for the part that actually contains inline_data (the image)
    const candidates = data.candidates?.[0]?.content?.parts || [];
    const imagePart = candidates.find(part => part.inline_data);
    
    if (!imagePart) {
        return NextResponse.json({ success: false, error: "Model didn't return an image." }, { status: 500 });
    }

    const resultBase64 = imagePart.inline_data.data;
    
    return NextResponse.json({ 
      success: true, 
      resultUrl: `data:image/jpeg;base64,${resultBase64}` 
    });

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
