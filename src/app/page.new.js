"use client";

import DailyQuote from "@/components/DailyQuote";
import MultiStepForm from "@/components/MultiStepForm";
import PlanDisplay from "@/components/PlanDisplay";
import { useEffect, useState } from "react";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [fitnessPlan, setFitnessPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load saved plan from localStorage
  useEffect(() => {
    // Only access localStorage in the browser
    if (typeof window !== "undefined") {
      const savedPlan = localStorage.getItem("fitnessPlan");
      if (savedPlan) {
        try {
          const parsed = JSON.parse(savedPlan);
          setFitnessPlan(parsed);
          setUserData(parsed.userData);
        } catch (error) {
          console.error("Error loading saved plan:", error);
        }
      }
    }
  }, []);

  const handleFormSubmit = async (data) => {
    setUserData(data);
    setIsGenerating(true);
    try {
      const plan = await generateFitnessPlan(data);
      setFitnessPlan(plan);
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("fitnessPlan", JSON.stringify(plan));
      }
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!userData) return;
    setIsGenerating(true);
    try {
      const plan = await generateFitnessPlan(userData);
      setFitnessPlan(plan);
      if (typeof window !== "undefined") {
        localStorage.setItem("fitnessPlan", JSON.stringify(plan));
      }
    } catch (error) {
      console.error("Error regenerating plan:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToForm = () => {
    // Clear the fitness plan but keep user data for pre-filling the form
    setFitnessPlan(null);
    // Clear from localStorage to prevent auto-loading
    if (typeof window !== "undefined") {
      localStorage.removeItem("fitnessPlan");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <DailyQuote />
        
        {!fitnessPlan && !isGenerating && (
          <div className="mt-8">
            <MultiStepForm onSubmit={handleFormSubmit} initialData={userData} />
          </div>
        )}

        {isGenerating && (
          <div className="mt-8 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400 mb-4"></div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Generating Your Personalized Plan...
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI coach is analyzing your goals and creating the perfect workout and diet plan for you.
              </p>
            </div>
          </div>
        )}

        {fitnessPlan && !isGenerating && (
          <div className="mt-8">
            <PlanDisplay 
              plan={fitnessPlan} 
              onRegenerate={handleRegenerate}
              onBackToForm={handleBackToForm}
            />
          </div>
        )}
      </div>
    </main>
  );
}

// AI Plan Generation Function
async function generateFitnessPlan(userData) {
  try {
    const response = await fetch("/api/generate-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to generate plan");
    }

    const plan = await response.json();
    return plan;
  } catch (error) {
    console.error("Error generating plan, using mock data:", error);
    return generateMockPlan(userData);
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