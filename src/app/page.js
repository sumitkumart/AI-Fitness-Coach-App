"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MultiStepForm from "@/components/MultiStepForm";
import PlanDisplay from "@/components/PlanDisplay";
import DailyQuote from "@/components/DailyQuote";

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
          // Silent error - plan not loaded from storage
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
      // Error handled - using mock plan fallback
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
      // Error handled - using mock plan fallback
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToForm = () => {
    setFitnessPlan(null);
    // Keep userData so form is pre-filled
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <DailyQuote />
        
        {!fitnessPlan && !isGenerating && (
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MultiStepForm onSubmit={handleFormSubmit} initialData={userData} />
          </motion.div>
        )}

        {isGenerating && (
          <div className="mt-8 flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative inline-block animate-spin rounded-full h-20 w-20 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"></div>
              </div>
              <motion.h3 
                className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Generating Your Personalized Plan...
              </motion.h3>
              <motion.p 
                className="text-gray-600 dark:text-gray-300 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Our AI coach is analyzing your goals and creating the perfect workout and diet plan for you.
              </motion.p>
              <motion.div 
                className="mt-6 flex justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-blue-600 rounded-full"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                  />
                ))}
              </motion.div>
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
    // Graceful fallback to mock data
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
