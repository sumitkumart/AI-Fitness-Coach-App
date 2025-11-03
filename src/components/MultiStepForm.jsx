"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, User, Target, Settings, FileText } from "lucide-react";

const totalSteps = 4;

export default function MultiStepForm({ onSubmit, initialData }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: 25,
    gender: "",
    height: 170,
    weight: 70,
    fitnessGoal: "",
    fitnessLevel: "",
    workoutLocation: "",
    dietaryPreference: "",
    medicalHistory: "",
    stressLevel: "",
  });

  // Pre-fill form if initialData is provided
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (isStepValid()) {
      onSubmit(formData);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!(formData.name && formData.age && formData.gender && formData.height && formData.weight);
      case 2:
        return !!(formData.fitnessGoal && formData.fitnessLevel);
      case 3:
        return !!(formData.workoutLocation && formData.dietaryPreference);
      case 4:
        return true; // Optional fields
      default:
        return false;
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 overflow-hidden shadow-inner">
          <motion.div
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-3 rounded-full shadow-lg relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-white/30"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Form Steps */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 md:p-10 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100/50 to-purple-100/50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-full blur-3xl -ml-24 -mb-24"></div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="relative z-10"
          >
            {currentStep === 1 && (
              <Step1 formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 2 && (
              <Step2 formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 3 && (
              <Step3 formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 4 && (
              <Step4 formData={formData} updateFormData={updateFormData} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 relative z-10">
          <motion.button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium shadow-sm hover:shadow-md disabled:hover:shadow-sm"
            whileHover={currentStep !== 1 ? { scale: 1.02, x: -2 } : {}}
            whileTap={currentStep !== 1 ? { scale: 0.98 } : {}}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </motion.button>

          {currentStep < totalSteps ? (
            <motion.button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
              whileHover={isStepValid() ? { scale: 1.05 } : {}}
              whileTap={isStepValid() ? { scale: 0.95 } : {}}
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Generate Plan
              <Check className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 1: Personal Information
function Step1({ formData, updateFormData }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Personal Information
        </h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Tell us about yourself to get started</p>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Name *
          </label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => updateFormData("name", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
            placeholder="Enter your name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Age *
            </label>
            <input
              type="number"
              value={formData.age || ""}
              onChange={(e) => updateFormData("age", parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md cursor-pointer"
              placeholder="25"
              min="1"
              max="120"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Gender *
            </label>
            <select
              value={formData.gender || ""}
              onChange={(e) => updateFormData("gender", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Height (cm) *
            </label>
            <input
              type="number"
              value={formData.height || ""}
              onChange={(e) => updateFormData("height", parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md cursor-pointer"
              placeholder="170"
              min="100"
              max="250"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Weight (kg) *
            </label>
            <input
              type="number"
              value={formData.weight || ""}
              onChange={(e) => updateFormData("weight", parseFloat(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md cursor-pointer"
              placeholder="70"
              min="30"
              max="300"
              step="0.1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2: Fitness Goals
function Step2({ formData, updateFormData }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
          <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Fitness Goals
        </h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">What do you want to achieve?</p>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Fitness Goal *
          </label>
          <select
            value={formData.fitnessGoal || ""}
            onChange={(e) => updateFormData("fitnessGoal", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select your goal</option>
            <option value="Lose Weight">Lose Weight</option>
            <option value="Build Muscle">Build Muscle</option>
            <option value="Maintain Fitness">Maintain Fitness</option>
            <option value="Improve Endurance">Improve Endurance</option>
            <option value="Increase Flexibility">Increase Flexibility</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Fitness Level *
          </label>
          <select
            value={formData.fitnessLevel || ""}
            onChange={(e) => updateFormData("fitnessLevel", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select your level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Step 3: Preferences
function Step3({ formData, updateFormData }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
          <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Preferences
        </h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Customize your workout and diet preferences</p>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Workout Location *
          </label>
          <select
            value={formData.workoutLocation || ""}
            onChange={(e) => updateFormData("workoutLocation", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select location</option>
            <option value="Home">Home</option>
            <option value="Gym">Gym</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Dietary Preference *
          </label>
          <select
            value={formData.dietaryPreference || ""}
            onChange={(e) => updateFormData("dietaryPreference", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select preference</option>
            <option value="No Restrictions">No Restrictions</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Keto">Keto</option>
            <option value="Paleo">Paleo</option>
            <option value="Low Carb">Low Carb</option>
            <option value="Mediterranean">Mediterranean</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Step 4: Additional Information (Optional)
function Step4({ formData, updateFormData }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
          <FileText className="w-6 h-6 text-pink-600 dark:text-pink-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Additional Information
        </h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Share any additional details (optional)</p>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Medical History
          </label>
          <textarea
            value={formData.medicalHistory || ""}
            onChange={(e) => updateFormData("medicalHistory", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md resize-none"
            placeholder="Any medical conditions, injuries, or health concerns..."
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Stress Level
          </label>
          <select
            value={formData.stressLevel || ""}
            onChange={(e) => updateFormData("stressLevel", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select stress level</option>
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
            <option value="Very High">Very High</option>
          </select>
        </div>
      </div>
    </div>
  );
}
