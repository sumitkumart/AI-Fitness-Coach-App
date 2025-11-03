import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request) {
  // Read request body once
  let userData;
  try {
    userData = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  // If no API key, return mock data
  if (!apiKey) {
    return NextResponse.json(generateMockPlan(userData));
  }

  try {
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Create a detailed prompt for the AI
    const prompt = `Create a personalized fitness plan for:
Name: ${userData.name}
Age: ${userData.age}
Gender: ${userData.gender}
Height: ${userData.height} cm
Weight: ${userData.weight} kg
Fitness Goal: ${userData.fitnessGoal}
Fitness Level: ${userData.fitnessLevel}
Workout Location: ${userData.workoutLocation}
Dietary Preference: ${userData.dietaryPreference}
${userData.medicalHistory ? `Medical History: ${userData.medicalHistory}` : ""}
${userData.stressLevel ? `Stress Level: ${userData.stressLevel}` : ""}

Please generate:
1. A detailed workout plan with 6 exercises including name, sets, reps, and rest time
2. A diet plan with breakfast, lunch, dinner, and snacks
3. 3 workout tips
4. Posture advice
5. A motivational tip

Return the response as a JSON object with this exact structure:
{
  "workoutPlan": {
    "exercises": [
      {"name": "...", "sets": "...", "reps": "...", "rest": "..."}
    ],
    "tips": ["...", "...", "..."],
    "postureAdvice": "..."
  },
  "dietPlan": {
    "breakfast": "...",
    "lunch": "...",
    "dinner": "...",
    "snacks": "..."
  },
  "motivationalTip": "..."
}

Make it specific, practical, and tailored to the user's goals and level.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-3.5-turbo" for cost savings
      messages: [
        {
          role: "system",
          content:
            "You are an expert fitness coach and nutritionist. Generate detailed, personalized fitness and diet plans. Always return valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    let planData;
    try {
      planData = JSON.parse(content);
    } catch (parseError) {
      // If JSON parsing fails, use mock data
      return NextResponse.json(generateMockPlan(userData));
    }

    // Validate plan structure
    if (!planData.workoutPlan || !planData.dietPlan) {
      return NextResponse.json(generateMockPlan(userData));
    }

    const plan = {
      userData,
      workoutPlan: planData.workoutPlan || {
        exercises: [],
        tips: [],
        postureAdvice: ""
      },
      dietPlan: planData.dietPlan || {
        breakfast: "",
        lunch: "",
        dinner: "",
        snacks: ""
      },
      motivationalTip: planData.motivationalTip || "You're doing great! Keep going!",
    };

    return NextResponse.json(plan);
  } catch (error) {
    // Silent error handling - return mock data gracefully
    return NextResponse.json(generateMockPlan(userData));
  }
}

// Mock plan generator (fallback)
function generateMockPlan(userData) {
  const goals = {
    "Lose Weight": {
      workout: [
        { name: "Cardio Warm-up", sets: "10 min", reps: "", rest: "N/A" },
        { name: "Burpees", sets: "3", reps: "12", rest: "45 sec" },
        { name: "Jumping Jacks", sets: "3", reps: "30", rest: "30 sec" },
        { name: "Mountain Climbers", sets: "3", reps: "20 each leg", rest: "45 sec" },
        { name: "High Knees", sets: "3", reps: "30 sec", rest: "30 sec" },
        { name: "Plank", sets: "3", reps: "45 sec", rest: "60 sec" },
      ],
      diet: {
        breakfast: "Oatmeal with berries and a tablespoon of almond butter",
        lunch: "Grilled chicken salad with mixed greens, vegetables, and olive oil dressing",
        dinner: "Baked salmon with steamed broccoli and quinoa",
        snacks: "Apple slices with peanut butter, Greek yogurt",
      },
    },
    "Build Muscle": {
      workout: [
        { name: "Warm-up", sets: "10 min", reps: "", rest: "N/A" },
        { name: "Push-ups", sets: "4", reps: "15", rest: "60 sec" },
        { name: "Pull-ups/Chin-ups", sets: "4", reps: "10", rest: "90 sec" },
        { name: "Squats", sets: "4", reps: "20", rest: "60 sec" },
        { name: "Dumbbell Rows", sets: "4", reps: "12 each", rest: "60 sec" },
        { name: "Plank", sets: "3", reps: "60 sec", rest: "60 sec" },
      ],
      diet: {
        breakfast: "Scrambled eggs (3) with whole grain toast and avocado",
        lunch: "Lean beef with brown rice and vegetables",
        dinner: "Grilled chicken breast with sweet potato and asparagus",
        snacks: "Protein shake, mixed nuts",
      },
    },
    "Maintain Fitness": {
      workout: [
        { name: "Light Warm-up", sets: "5 min", reps: "", rest: "N/A" },
        { name: "Bodyweight Squats", sets: "3", reps: "15", rest: "45 sec" },
        { name: "Push-ups", sets: "3", reps: "12", rest: "45 sec" },
        { name: "Plank", sets: "3", reps: "45 sec", rest: "45 sec" },
        { name: "Lunges", sets: "3", reps: "12 each leg", rest: "45 sec" },
        { name: "Cool Down Stretch", sets: "10 min", reps: "", rest: "N/A" },
      ],
      diet: {
        breakfast: "Greek yogurt with granola and fresh fruits",
        lunch: "Quinoa bowl with roasted vegetables and chickpeas",
        dinner: "Grilled fish with brown rice and green salad",
        snacks: "Fresh fruit, hummus with vegetables",
      },
    },
  };

  const goalData = goals[userData.fitnessGoal] || goals["Maintain Fitness"];

  return {
    userData,
    workoutPlan: {
      exercises: goalData.workout,
      tips: [
        "Stay hydrated throughout your workout",
        "Focus on proper form over speed",
        "Listen to your body and rest when needed",
      ],
      postureAdvice: "Maintain a straight back during all exercises. Engage your core to protect your spine.",
    },
    dietPlan: goalData.diet,
    motivationalTip: `You're taking the first step towards a healthier you! Remember: consistency beats perfection. Every workout counts!`,
  };
}
