import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { prompt, type } = await request.json();

    if (!prompt || !type) {
      return NextResponse.json(
        { error: "Prompt and type are required" },
        { status: 400 }
      );
    }

    // Try multiple image generation providers in order
    // Priority: OpenAI (best for food photography) > Replicate > Nano Banana
    const providers = [
      { name: "openai", apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY },
      { name: "replicate", apiKey: process.env.NEXT_PUBLIC_REPLICATE_API_KEY },
      { name: "nanobanana", apiKey: process.env.NEXT_PUBLIC_NANOBANANA_API_KEY },
    ];

    for (const provider of providers) {
      if (!provider.apiKey) continue;

      try {
        let imageUrl = null;

        if (provider.name === "nanobanana") {
          imageUrl = await generateWithNanoBanana(prompt, type, provider.apiKey);
        } else if (provider.name === "replicate") {
          imageUrl = await generateWithReplicate(prompt, type, provider.apiKey);
        } else if (provider.name === "openai") {
          imageUrl = await generateWithOpenAI(prompt, type, provider.apiKey);
        }

        if (imageUrl) {
          return NextResponse.json({ imageUrl });
        }
      } catch (error) {
        // Silent error - try next provider
        continue;
      }
    }

    // Fallback: return null to use placeholder images (no error - graceful fallback)
    return NextResponse.json({ imageUrl: null });
  } catch (error) {
    // Silent error - return null to use placeholder
    return NextResponse.json({ imageUrl: null });
  }
}

async function generateWithReplicate(prompt, type, apiKey) {
  // Use Stable Diffusion XL or Flux model
  const modelVersion = "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"; // flux-schnell
  
  let enhancedPrompt;
  if (type === "exercise") {
    enhancedPrompt = `Professional fitness exercise: ${prompt}, high quality, realistic, gym photography, good lighting, 4k, detailed`;
  } else {
    // The prompt already contains detailed instructions from generateMealImagePrompt in imageService.js
    // Add additional visual style guidelines for Replicate/Flux model
    enhancedPrompt = `${prompt} Lighting: natural daylight with soft shadows. Plate: clean white or matte ceramic. Background: light wood or textured neutral tone. No meat or eggs. Avoid clutter and over-stylization. Maintain color consistency across all images. Must look fresh, natural, and authentic. Designed for a fitness and wellness brand.`;
  }

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: modelVersion,
      input: {
        prompt: enhancedPrompt,
        num_outputs: 1,
        aspect_ratio: "4:3",
        output_format: "url",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Replicate API error: ${errorText}`);
  }

  const prediction = await response.json();
  
  // Poll for completion
  let result = prediction;
  let attempts = 0;
  const maxAttempts = 30; // 30 seconds max wait
  
  while (result.status !== "succeeded" && result.status !== "failed" && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
      headers: {
        Authorization: `Token ${apiKey}`,
      },
    });
    result = await statusResponse.json();
    attempts++;
  }

  if (result.status === "failed" || attempts >= maxAttempts) {
    // Return null instead of throwing - graceful fallback
    return null;
  }

  return result.output?.[0] || null;
}

async function generateWithNanoBanana(prompt, type, apiKey) {
  try {
    // Nano Banana AI image generation
    // Enhanced prompts optimized for Nano Banana's AI
    let enhancedPrompt;
    if (type === "exercise") {
      enhancedPrompt = `Professional fitness exercise: ${prompt}, high quality, realistic, gym photography, good lighting, 4k, detailed`;
    } else {
      // The prompt already contains detailed instructions from generateMealImagePrompt in imageService.js
      // Add Nano Banana specific style enhancements for food photography
      enhancedPrompt = `${prompt} Style: realistic, professional, natural light, healthy food photography. Lighting: natural daylight with soft shadows. Plate: clean white or matte ceramic. Background: light wood or textured neutral tone. No meat or eggs. Designed for a fitness and wellness brand.`;
    }

    // Nano Banana API endpoint (update URL when API is available)
    const response = await fetch("https://api.nanobnana.com/v1/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        style: type === "exercise" ? "photorealistic" : "food-photography",
        aspect_ratio: "4:3",
        quality: "high",
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.imageUrl || data.url || null;
  } catch (error) {
    // Return null on error - graceful fallback
    return null;
  }
}

async function generateWithOpenAI(prompt, type, apiKey) {
  try {
    const OpenAI = require("openai").default || require("openai");
    const client = new OpenAI({ apiKey });

    let enhancedPrompt;
    if (type === "exercise") {
      enhancedPrompt = `Professional fitness exercise: ${prompt}, high quality, realistic photography`;
    } else {
      // The prompt already contains detailed instructions from generateMealImagePrompt
      // Add final style specifications for OpenAI DALL-E
      enhancedPrompt = `${prompt} Style: realistic, professional, natural light, healthy food photography. Lighting: natural daylight with soft shadows. Plate: clean white or matte ceramic. Background: light wood or textured neutral tone. No meat or eggs. Avoid clutter and over-stylization. Maintain color consistency. Must look fresh, natural, and authentic. Designed for a fitness and wellness brand.`;
    }

    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data?.[0]?.url || null;
  } catch (error) {
    // Return null on error - graceful fallback
    return null;
  }
}

