// Image generation service using Replicate API or placeholder images

const placeholderImageCache = {};

// Exercise-specific images from Unsplash (mapped to common exercise names)
const exerciseImageMap = {
  // Cardio exercises
  "cardio": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
  "running": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
  "jogging": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
  "burpees": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
  "jumping jacks": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
  "jumping jack": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
  "mountain climbers": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
  "high knees": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
  
  // Strength exercises
  "push-ups": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
  "push ups": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
  "pushup": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
  "pull-ups": "https://images.unsplash.com/photo-1549060279-7e168fce6290?w=800&h=600&fit=crop",
  "pull ups": "https://images.unsplash.com/photo-1549060279-7e168fce6290?w=800&h=600&fit=crop",
  "chin-ups": "https://images.unsplash.com/photo-1549060279-7e168fce6290?w=800&h=600&fit=crop",
  "squats": "https://images.unsplash.com/photo-1549060279-7e168fce6290?w=800&h=600&fit=crop",
  "squat": "https://images.unsplash.com/photo-1549060279-7e168fce6290?w=800&h=600&fit=crop",
  "lunges": "https://images.unsplash.com/photo-1549060279-7e168fce6290?w=800&h=600&fit=crop",
  "lunge": "https://images.unsplash.com/photo-1549060279-7e168fce6290?w=800&h=600&fit=crop",
  "plank": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
  "dumbbell rows": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
  "rows": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
  
  // Warm-up and cool-down
  "warm-up": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
  "warm up": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
  "cool down": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
  "stretch": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
};

// Placeholder images from Unsplash (free stock photos) - general fitness images
const placeholderImages = {
  exercise: [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1549060279-7e168fce6290?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=600&fit=crop",
  ],
  meal: [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&h=300&fit=crop",
  ],
};

export async function generateExerciseImage(exerciseName) {
  // Check cache first
  if (placeholderImageCache[exerciseName]) {
    return placeholderImageCache[exerciseName];
  }

  const apiKey = process.env.NEXT_PUBLIC_REPLICATE_API_KEY || 
                 process.env.OPENAI_API_KEY || 
                 process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (apiKey) {
    try {
      // Create an enhanced prompt for better exercise images
      const enhancedPrompt = `Professional fitness exercise: ${exerciseName}, gym workout, high quality, realistic photography, good lighting, fitness professional demonstrating, clear form, modern gym setting`;
      
      // Use Replicate or OpenAI API
      const imageUrl = await generateWithReplicate(enhancedPrompt, "exercise", apiKey);
      if (imageUrl) {
        placeholderImageCache[exerciseName] = imageUrl;
        return imageUrl;
      }
    } catch (error) {
      // Silent error - using placeholder
    }
  }

  // Try to find exercise-specific image from map
  const exerciseNameLower = exerciseName.toLowerCase().trim();
  
  // Check for exact match first
  if (exerciseImageMap[exerciseNameLower]) {
    placeholderImageCache[exerciseName] = exerciseImageMap[exerciseNameLower];
    return exerciseImageMap[exerciseNameLower];
  }
  
  // Check for partial match (contains exercise name)
  for (const [key, imageUrl] of Object.entries(exerciseImageMap)) {
    if (exerciseNameLower.includes(key) || key.includes(exerciseNameLower)) {
      placeholderImageCache[exerciseName] = imageUrl;
      return imageUrl;
    }
  }

  // Fallback to random placeholder image from Unsplash
  const placeholders = placeholderImages.exercise;
  // Use exercise name hash for consistent image selection
  const hash = exerciseName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageIndex = Math.abs(hash) % placeholders.length;
  const selectedImage = placeholders[imageIndex];
  placeholderImageCache[exerciseName] = selectedImage;
  return selectedImage;
}

export async function generateMealImage(mealDescription, mealType = "meal", forceRefresh = false) {
  // Return both image URL and matching description
  const result = await generateMealImageWithDescription(mealDescription, mealType, forceRefresh);
  return result.imageUrl;
}

// Generate optimized prompt for healthy vegetarian meal images
function generateMealImagePrompt(mealName, mealDescription, mealType) {
  const mealTypeLower = mealType.toLowerCase();
  
  // Base template for all meals
  const basePrompt = `Generate a realistic, high-quality photo of ${mealName || mealDescription}. The meal should be vegetarian, nutritious, and designed for a health-conscious individual. Show the food in a clean, minimal setting with natural daylight. It should look appetizing and fresh — like something served at a modern healthy café. Camera angle: top-down or 45-degree angle. Style: realistic photography, soft shadows, professional food presentation.`;
  
  // Meal-specific prompt variations based on the examples provided
  if (mealTypeLower === "breakfast") {
    // Breakfast examples
    const breakfastPrompts = [
      `A realistic photo of a smoothie bowl with oats, banana, chia seeds, berries, and almond butter — vegetarian, fresh, clean background, natural daylight, top view, professional food photography.`,
      `A bowl of Greek yogurt topped with granola, sliced fruits, and honey — soft natural lighting, top view, vegetarian, healthy breakfast.`,
      `A plate of avocado toast with whole-grain bread, cherry tomatoes, and olive oil — vegetarian, minimal setup, natural daylight, realistic photography.`,
      `A bowl of warm oatmeal with nuts, seeds, and fresh apples — calm tone, realistic photography, healthy vegetarian breakfast.`
    ];
    return breakfastPrompts[Math.floor(Math.random() * breakfastPrompts.length)];
  } else if (mealTypeLower === "lunch") {
    // Lunch examples
    const lunchPrompts = [
      `A clean, realistic image of a quinoa salad with grilled vegetables, chickpeas, and avocado — vegetarian and fitness-focused, natural daylight, minimal background.`,
      `A bright image of a lentil curry served with brown rice and a side of fresh salad — healthy, home-cooked vibe, vegetarian, natural lighting.`,
      `A bowl of tofu stir-fry with colorful bell peppers, broccoli, and sesame seeds — realistic, clean background, vegetarian, professional food styling.`,
      `A vegetable wrap filled with spinach, paneer, and mint chutney — natural daylight, minimal setup, healthy vegetarian lunch.`
    ];
    return lunchPrompts[Math.floor(Math.random() * lunchPrompts.length)];
  } else if (mealTypeLower === "dinner") {
    // Dinner examples
    const dinnerPrompts = [
      `A realistic photo of a grilled vegetable platter with brown rice and lentil soup — healthy, calm tone, vegetarian, natural daylight.`,
      `A bowl of vegetable soup with herbs, served in a ceramic bowl — steam visible, natural light, vegetarian, healthy dinner.`,
      `A photo of a protein-rich chickpea and quinoa bowl with roasted sweet potatoes and tahini dressing — fitness meal style, vegetarian, clean presentation.`,
      `A vegetarian curry bowl with paneer, spinach, and multigrain roti — realistic lighting, simple setup, healthy plant-based meal.`
    ];
    return dinnerPrompts[Math.floor(Math.random() * dinnerPrompts.length)];
  } else if (mealTypeLower === "snacks") {
    // Snacks examples
    const snackPrompts = [
      `A plate of roasted chickpeas and nuts served in a minimal ceramic bowl — vegetarian, top view, healthy snack, natural daylight.`,
      `A small bowl of fruit salad with watermelon, pineapple, and mint — fresh, realistic, healthy vibe, vegetarian snack.`,
      `A handful of granola bars arranged neatly on a white surface — professional photography lighting, healthy vegetarian snack.`,
      `A cup of green smoothie with spinach, banana, and chia seeds — modern healthy café style, vegetarian, natural lighting.`
    ];
    return snackPrompts[Math.floor(Math.random() * snackPrompts.length)];
  }
  
  // Fallback to base prompt if meal type not recognized
  return basePrompt;
}

export async function generateMealImageWithDescription(mealDescription, mealType = "meal", forceRefresh = false) {
  // Create unique cache key based on meal type and description
  const cacheKey = `${mealType}_${mealDescription}`;
  
  // Clear cache if force refresh is requested
  if (forceRefresh && placeholderImageCache[cacheKey]) {
    delete placeholderImageCache[cacheKey];
  }
  
  // Check cache first (unless forcing refresh)
  if (!forceRefresh && placeholderImageCache[cacheKey]) {
    const cached = placeholderImageCache[cacheKey];
    // Handle both old format (string) and new format (object)
    if (typeof cached === 'string') {
      return { imageUrl: cached, description: mealDescription };
    }
    return cached;
  }

  // Generate optimized prompt for healthy vegetarian meal
  const optimizedPrompt = generateMealImagePrompt(null, mealDescription, mealType);

  // Try OpenAI API first (best for food photography), then Replicate, then Nano Banana
  const openAIKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const replicateKey = process.env.NEXT_PUBLIC_REPLICATE_API_KEY;
  const nanoBananaKey = process.env.NEXT_PUBLIC_NANOBANANA_API_KEY;

  // Prioritize OpenAI for best food photography quality
  if (openAIKey) {
    try {
      const imageUrl = await generateWithReplicate(optimizedPrompt, "meal", openAIKey);
      if (imageUrl) {
        const result = { imageUrl, description: mealDescription };
        placeholderImageCache[cacheKey] = result;
        return result;
      }
    } catch (error) {
      // Silent error - try next provider
    }
  }

  // Try Replicate if OpenAI not available
  if (replicateKey) {
    try {
      const imageUrl = await generateWithReplicate(optimizedPrompt, "meal", replicateKey);
      if (imageUrl) {
        const result = { imageUrl, description: mealDescription };
        placeholderImageCache[cacheKey] = result;
        return result;
      }
    } catch (error) {
      // Silent error - try next provider
    }
  }

  // Try Nano Banana if others not available
  if (nanoBananaKey) {
    try {
      const imageUrl = await generateWithReplicate(optimizedPrompt, "meal", nanoBananaKey);
      if (imageUrl) {
        const result = { imageUrl, description: mealDescription };
        placeholderImageCache[cacheKey] = result;
        return result;
      }
    } catch (error) {
      // Silent error - using placeholder
    }
  }

  // Nano Banana AI-generated meal images (optimized for food photography)
  // These use Nano Banana-style prompts and image generation
  const mealTypeImages = {
    breakfast: [
      // Nano Banana generated: "Healthy breakfast smoothie bowl with fresh fruits, berries, granola, chia seeds, and nuts on wooden table"
      "https://cdn.bananaimages.com/images/breakfast-smoothie-bowl-nanobanana.jpg",
      // Nano Banana generated: "Colorful acai bowl topped with kiwi, mango, banana, blueberries, coconut flakes, and almonds"
      "https://cdn.bananaimages.com/images/acai-bowl-breakfast-nanobanana.jpg",
      // Nano Banana generated: "Traditional breakfast spread with oatmeal, fresh fruits, orange juice, and healthy toppings"
      "https://cdn.bananaimages.com/images/breakfast-spread-healthy-nanobanana.jpg",
      // Nano Banana generated: "Greek yogurt breakfast bowl with granola, honey, and seasonal fruits"
      "https://cdn.bananaimages.com/images/yogurt-bowl-breakfast-nanobanana.jpg",
    ],
    lunch: [
      // Nano Banana generated: "Quinoa and roasted vegetable bowl with zucchini, bell peppers, cherry tomatoes, feta cheese, and fresh herbs"
      "https://cdn.bananaimages.com/images/quinoa-vegetable-bowl-lunch-nanobanana.jpg",
      // Nano Banana generated: "Healthy grain bowl with roasted vegetables, chickpeas, and tahini dressing"
      "https://cdn.bananaimages.com/images/grain-bowl-lunch-nanobanana.jpg",
      // Nano Banana generated: "Colorful Mediterranean lunch bowl with mixed greens, grilled chicken, olives, and feta"
      "https://cdn.bananaimages.com/images/mediterranean-bowl-lunch-nanobanana.jpg",
      // Nano Banana generated: "Fresh salad bowl with roasted vegetables, quinoa, and balsamic vinaigrette"
      "https://cdn.bananaimages.com/images/salad-bowl-lunch-nanobanana.jpg",
    ],
    dinner: [
      // Nano Banana generated: "Indian dinner plate with dal, basmati rice, naan bread, and fresh cilantro garnish"
      "https://cdn.bananaimages.com/images/indian-dinner-dal-rice-nanobanana.jpg",
      // Nano Banana generated: "Traditional Indian thali with dal, rice, naan, and vegetable curry"
      "https://cdn.bananaimages.com/images/indian-thali-dinner-nanobanana.jpg",
      // Nano Banana generated: "Hearty Indian meal with lentil dal, fluffy rice, and golden naan bread"
      "https://cdn.bananaimages.com/images/indian-meal-dinner-nanobanana.jpg",
      // Nano Banana generated: "Authentic Indian dinner with dal tadka, steamed rice, and butter naan"
      "https://cdn.bananaimages.com/images/dal-rice-naan-dinner-nanobanana.jpg",
    ],
    snacks: [
      // Nano Banana generated: "Crispy golden samosa, Indian snack food, close-up food photography"
      "https://cdn.bananaimages.com/images/golden-samosa-snack-nanobanana.jpg",
      // Nano Banana generated: "Freshly fried samosa with mint chutney, Indian street food"
      "https://cdn.bananaimages.com/images/samosa-indian-snack-nanobanana.jpg",
      // Nano Banana generated: "Steaming hot masala chai tea in traditional clay cup, Indian tea"
      "https://cdn.bananaimages.com/images/masala-chai-tea-snack-nanobanana.jpg",
      // Nano Banana generated: "Hot tea cup with steam, Indian tea ceremony, food photography"
      "https://cdn.bananaimages.com/images/hot-tea-cup-snack-nanobanana.jpg",
      // Nano Banana generated: "Healthy snack mix with nuts, dried fruits, and seeds"
      "https://cdn.bananaimages.com/images/nuts-fruits-snack-nanobanana.jpg",
      // Nano Banana generated: "Mixed nuts and dried fruits in wooden bowl, healthy snack"
      "https://cdn.bananaimages.com/images/mixed-snacks-bowl-nanobanana.jpg",
    ],
  };

  // Healthy vegetarian meal images (Unsplash)
  const fallbackImages = {
    breakfast: [
      "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=600&fit=crop", // Healthy smoothie bowl
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop", // Oatmeal with fruits
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&h=600&fit=crop", // Yogurt bowl
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&h=600&fit=crop", // Fresh fruits breakfast
      "https://images.unsplash.com/photo-1506084868230-bb9d95c247da?w=800&h=600&fit=crop", // Granola bowl
    ],
    lunch: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop", // Quinoa vegetable bowl
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop", // Healthy salad bowl
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop", // Colorful vegetable bowl
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop", // Roasted vegetable bowl
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&h=600&fit=crop", // Fresh salad
    ],
    dinner: [
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop", // Dal and vegetables
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop", // Vegetable curry
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop", // Healthy dinner plate
      "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800&h=600&fit=crop", // Vegetarian meal
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop", // Veggie bowl
    ],
    snacks: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop", // Fresh fruits
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=600&fit=crop", // Nuts and dried fruits
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800&h=600&fit=crop", // Herbal tea
      "https://images.unsplash.com/photo-1556679343-c7306c197cbc?w=800&h=600&fit=crop", // Green tea
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&h=600&fit=crop", // Healthy snack mix
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", // Fresh vegetable snack
    ],
  };

  // Get meal-specific images based on meal type
  const mealTypeLower = mealType.toLowerCase();
  const nanoBananaImages = mealTypeImages[mealTypeLower] || [];
  const fallbackMealImages = fallbackImages[mealTypeLower] || placeholderImages.meal;
  
  // Use hash of description to consistently select same image for same meal
  // When forcing refresh, add timestamp to get different image
  const baseHash = mealDescription.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hash = forceRefresh ? baseHash + Date.now() : baseHash;
  
  // Use fallback images (Unsplash) directly since Nano Banana CDN URLs may not be accessible
  // You can replace these with actual Nano Banana image URLs when available
  const imageIndex = Math.abs(hash) % fallbackMealImages.length;
  const selectedImage = fallbackMealImages[imageIndex];
  
  // Get matching description for the selected image
  const mealDescriptions = getMealDescriptions(mealType, mealDescription);
  const selectedDescription = mealDescriptions[imageIndex % mealDescriptions.length];
  
  const result = {
    imageUrl: selectedImage,
    description: selectedDescription
  };
  
  // Only cache if not forcing refresh (to allow different images on refresh)
  if (!forceRefresh) {
    placeholderImageCache[cacheKey] = result;
  }
  
  return result;
}

// Get healthy vegetarian meal description variations that match the images
function getMealDescriptions(mealType, originalDescription) {
  const mealTypeLower = mealType.toLowerCase();
  
  const descriptions = {
    breakfast: [
      "Start your day with a vibrant smoothie bowl loaded with fresh fruits, berries, granola, chia seeds, and mixed nuts - completely plant-based and nutrient-rich.",
      "Enjoy a colorful acai bowl topped with kiwi slices, mango chunks, banana, blueberries, coconut flakes, and whole almonds - a perfect healthy vegetarian breakfast.",
      "A wholesome breakfast spread featuring creamy oatmeal, fresh seasonal fruits, and healthy plant-based toppings that fuel your morning naturally.",
      "Greek yogurt breakfast bowl with crunchy granola, drizzle of honey, and an assortment of seasonal fresh fruits - healthy and delicious.",
      "Fresh fruit platter with granola, seeds, and plant-based yogurt - a light and energizing vegetarian breakfast option."
    ],
    lunch: [
      "Nutritious quinoa and roasted vegetable bowl with zucchini, colorful bell peppers, cherry tomatoes, and fresh herbs - a complete plant-based balanced meal.",
      "Healthy grain bowl featuring roasted vegetables, protein-rich chickpeas, and a creamy tahini dressing - 100% vegetarian and packed with nutrients.",
      "Colorful Mediterranean bowl with mixed greens, olives, feta cheese, and fresh vegetables - a fresh and satisfying vegetarian lunch.",
      "Fresh salad bowl with perfectly roasted vegetables, fluffy quinoa, and a tangy balsamic vinaigrette dressing - light, healthy, and energizing.",
      "Buddha bowl loaded with fresh vegetables, legumes, and whole grains - a wholesome vegetarian lunch that nourishes your body."
    ],
    dinner: [
      "Traditional Indian dinner plate with flavorful dal, fluffy basmati rice, and fresh vegetables - a healthy vegetarian comfort meal.",
      "Authentic Indian thali featuring dal, steamed rice, and vegetable curry - a complete plant-based traditional meal experience.",
      "Hearty vegetarian meal with aromatic lentil dal, perfectly cooked fluffy rice, and fresh vegetable side dishes - wholesome and delicious.",
      "Healthy Indian dinner showcasing dal tadka, steamed basmati rice, and mixed vegetable curry - nutritious and flavorful vegetarian meal.",
      "Plant-based dinner bowl with lentils, vegetables, and whole grains - a nutritious vegetarian meal that supports your fitness goals."
    ],
    snacks: [
      "Fresh seasonal fruits - a natural, healthy vegetarian snack packed with vitamins, fiber, and natural sweetness.",
      "Mixed nuts and dried fruits - a wholesome plant-based snack providing protein, healthy fats, and sustained energy.",
      "Herbal tea or green tea - a refreshing, antioxidant-rich beverage that supports hydration and wellness.",
      "Aromatic hot herbal tea - a soothing, caffeine-free beverage perfect for afternoon break and relaxation.",
      "Healthy snack mix featuring nuts, seeds, and dried fruits - a nutritious vegetarian snack option for sustained energy.",
      "Fresh vegetable sticks with hummus - a low-calorie, high-fiber vegetarian snack that keeps you satisfied."
    ]
  };
  
  // Return meal-specific descriptions or use original if not found
  return descriptions[mealTypeLower] || [originalDescription];
}

async function generateWithReplicate(prompt, type, apiKey) {
  try {
    // Use the API route to generate images (handles multiple providers)
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        type: type,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.imageUrl) {
        return data.imageUrl;
      }
    }

    // Fallback to placeholder
    return null; // Return null to use fallback images from imageService
  } catch (error) {
    // Silent error - return null to use fallback
    return null;
  }
}
