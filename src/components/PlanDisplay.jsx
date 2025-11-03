"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  RefreshCw, 
  Download, 
  Volume2, 
  VolumeX, 
  Dumbbell,
  UtensilsCrossed,
  Target,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import ExerciseCard from "./ExerciseCard";
import MealCard from "./MealCard";
import { exportToPDF } from "@/lib/pdfExport";
import { speakText, stopSpeaking } from "@/lib/voiceService";

export default function PlanDisplay({ plan, onRegenerate, onBackToForm }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeVoice, setActiveVoice] = useState(null);

  const handleSpeakWorkout = async () => {
    if (isSpeaking && activeVoice === "workout") {
      stopSpeaking();
      setIsSpeaking(false);
      setActiveVoice(null);
      return;
    }

    // Stop any other active speech
    if (isSpeaking) {
      stopSpeaking();
    }

    const workoutText = generateWorkoutText(plan);
    setIsSpeaking(true);
    setActiveVoice("workout");
    
    try {
      await speakText(workoutText);
    } catch (error) {
      // Silent error - voice playback failed
    } finally {
      setIsSpeaking(false);
      setActiveVoice(null);
    }
  };

  const handleSpeakDiet = async () => {
    if (isSpeaking && activeVoice === "diet") {
      stopSpeaking();
      setIsSpeaking(false);
      setActiveVoice(null);
      return;
    }

    // Stop any other active speech
    if (isSpeaking) {
      stopSpeaking();
    }

    const dietText = generateDietText(plan);
    setIsSpeaking(true);
    setActiveVoice("diet");
    
    try {
      await speakText(dietText);
    } catch (error) {
      // Silent error - voice playback failed
    } finally {
      setIsSpeaking(false);
      setActiveVoice(null);
    }
  };

  const handleExportPDF = () => {
    exportToPDF(plan);
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl mb-8 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="relative z-10 flex flex-wrap gap-6 justify-between items-start">
          <div className="flex-1 min-w-[280px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white">
                Your Personalized Plan
              </h2>
            </div>
            <p className="text-white/90 text-lg font-medium ml-[60px]">
              Welcome, <span className="font-bold">{plan.userData.name}</span>! We are here to help you achieve your fitness goals.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
          {onBackToForm && (
            <motion.button
              onClick={onBackToForm}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all font-medium shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
          )}
          <motion.button
            onClick={onRegenerate}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all font-medium shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </motion.button>
          <motion.button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition-all font-semibold shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
            Export PDF
          </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Motivational Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 dark:from-green-600 dark:via-emerald-600 dark:to-teal-600 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-24 -mt-24"></div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl flex-shrink-0">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-2 uppercase tracking-wide">Trainer's Tip</h3>
            <p className="text-white text-xl leading-relaxed font-medium">
              {plan.motivationalTip}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Workout Plan */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 md:p-10 relative overflow-hidden"
      >
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-purple-100/30 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                Workout Plan
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{plan.workoutPlan.exercises.length} exercises</p>
            </div>
          </div>
          <motion.button
            onClick={handleSpeakWorkout}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all font-medium shadow-lg hover:shadow-xl ${
              isSpeaking && activeVoice === "workout"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSpeaking && activeVoice === "workout" ? (
              <>
                <VolumeX className="w-5 h-5" />
                Stop
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                Listen
              </>
            )}
          </motion.button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {plan.workoutPlan.exercises.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} index={index} />
          ))}
        </div>

        <div className="mt-8 space-y-6 relative z-10">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
            <h4 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Training Tips
            </h4>
            <ul className="space-y-3 text-gray-700 dark:text-gray-200">
              {plan.workoutPlan.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-1 text-lg">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800">
            <h4 className="font-bold text-xl mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
              Posture & Form
            </h4>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-lg">
              {plan.workoutPlan.postureAdvice}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Diet Plan */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 md:p-10 relative overflow-hidden"
      >
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-green-100/30 to-emerald-100/30 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full blur-3xl -ml-32 -mt-32"></div>
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                Nutrition Plan
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Fuel your fitness journey</p>
            </div>
          </div>
          <motion.button
            onClick={handleSpeakDiet}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all font-medium shadow-lg hover:shadow-xl ${
              isSpeaking && activeVoice === "diet"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSpeaking && activeVoice === "diet" ? (
              <>
                <VolumeX className="w-5 h-5" />
                Stop
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                Listen
              </>
            )}
          </motion.button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <MealCard meal="Breakfast" description={plan.dietPlan.breakfast} />
          <MealCard meal="Lunch" description={plan.dietPlan.lunch} />
          <MealCard meal="Dinner" description={plan.dietPlan.dinner} />
          <MealCard meal="Snacks" description={plan.dietPlan.snacks} />
        </div>
      </motion.section>

      {/* User Info Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mb-32"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-white">
              Your Profile Summary
            </h4>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30">
              <p className="text-white/80 text-sm font-medium mb-2 uppercase tracking-wide">Fitness Goal</p>
              <p className="text-white text-xl font-bold">{plan.userData.fitnessGoal}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30">
              <p className="text-white/80 text-sm font-medium mb-2 uppercase tracking-wide">Experience Level</p>
              <p className="text-white text-xl font-bold">{plan.userData.fitnessLevel}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30">
              <p className="text-white/80 text-sm font-medium mb-2 uppercase tracking-wide">Workout Location</p>
              <p className="text-white text-xl font-bold">{plan.userData.workoutLocation}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function generateWorkoutText(plan) {
  let text = `Workout plan for ${plan.userData.name}. `;
  text += `Today's workout includes: `;
  plan.workoutPlan.exercises.forEach((exercise, index) => {
    text += `${index + 1}. ${exercise.name}`;
    if (exercise.sets && exercise.reps) {
      text += `, ${exercise.sets} sets of ${exercise.reps} reps`;
    } else if (exercise.sets) {
      text += `, ${exercise.sets}`;
    }
    if (exercise.rest && exercise.rest !== "N/A") {
      text += `, rest ${exercise.rest} between sets. `;
    } else {
      text += ". ";
    }
  });
  text += `Tips: ${plan.workoutPlan.tips.join(". ")}. `;
  text += `Posture advice: ${plan.workoutPlan.postureAdvice}.`;
  return text;
}

function generateDietText(plan) {
  let text = `Diet plan for ${plan.userData.name}. `;
  text += `For breakfast: ${plan.dietPlan.breakfast}. `;
  text += `For lunch: ${plan.dietPlan.lunch}. `;
  text += `For dinner: ${plan.dietPlan.dinner}. `;
  text += `For snacks: ${plan.dietPlan.snacks}.`;
  return text;
}
