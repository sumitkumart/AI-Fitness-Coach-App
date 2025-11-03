import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    
    // If no API key, return a random quote from our collection
    if (!apiKey) {
      const quotes = [
        "The only bad workout is the one that didn't happen.",
        "Your body can do it. It's your mind you need to convince.",
        "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
        "The pain you feel today will be the strength you feel tomorrow.",
        "Success is the sum of small efforts repeated day in and day out.",
        "Take care of your body. It's the only place you have to live.",
        "Fitness is not about being better than someone else. It's about being better than you used to be.",
        "Don't stop when you're tired. Stop when you're done.",
      ];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      return NextResponse.json({ quote: randomQuote });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a motivational fitness coach. Generate inspiring, short fitness quotes (1-2 sentences max). Be authentic and encouraging.",
        },
        {
          role: "user",
          content: "Generate a fresh, inspiring fitness motivation quote for today. Make it personal, empowering, and under 15 words.",
        },
      ],
      temperature: 0.9,
      max_tokens: 50,
    });

    const quote = completion.choices[0]?.message?.content?.trim() || 
                  "The only bad workout is the one that didn't happen.";

    return NextResponse.json({ quote });
  } catch (error) {
    // Silent error - fallback to default quote
    return NextResponse.json({ 
      quote: "The only bad workout is the one that didn't happen." 
    });
  }
}

