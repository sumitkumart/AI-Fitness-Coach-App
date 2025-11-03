"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Loader2 } from "lucide-react";
import { generateExerciseImage } from "@/lib/imageService";

export default function ExerciseCard({ exercise, index }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  // Automatically load exercise image when component mounts
  useEffect(() => {
    const loadImage = async () => {
      setIsLoadingImage(true);
      try {
        const url = await generateExerciseImage(exercise.name);
        setImageUrl(url);
      } catch (error) {
        // Silent error - image generation failed
      } finally {
        setIsLoadingImage(false);
      }
    };

    loadImage();
  }, [exercise.name]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 relative overflow-hidden group"
    >
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full">
                #{index + 1}
              </span>
            </div>
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              {exercise.name}
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-4">
          {exercise.sets && (
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">Sets</span>
              <span className="font-bold text-gray-800 dark:text-gray-200 text-lg">{exercise.sets}</span>
            </div>
          )}
          {exercise.reps && (
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">Reps</span>
              <span className="font-bold text-gray-800 dark:text-gray-200 text-lg">{exercise.reps}</span>
            </div>
          )}
          {exercise.rest && exercise.rest !== "N/A" && (
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">Rest</span>
              <span className="font-bold text-gray-800 dark:text-gray-200 text-lg">{exercise.rest}</span>
            </div>
          )}
        </div>

        {/* Image Section - Always visible, loading automatically */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-700 relative bg-gray-100 dark:bg-gray-700"
        >
          {isLoadingImage ? (
            <div className="w-full h-56 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Loading exercise image...</p>
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={exercise.name}
              className="w-full h-56 object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-56 flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
              <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Image loading...</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
