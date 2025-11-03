"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Loader2, RefreshCw } from "lucide-react";
import { generateMealImageWithDescription } from "@/lib/imageService";

export default function MealCard({ meal, description }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [displayDescription, setDisplayDescription] = useState(description);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Automatically load image when component mounts or meal/description changes
  useEffect(() => {
    // Reset image state when meal or description changes
    setImageUrl(null);
    setDisplayDescription(description);
    setImageError(false);
    loadImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meal, description]);

  const loadImage = async (forceRefresh = false) => {
    setIsLoadingImage(true);
    setImageError(false);
    try {
      // Generate specific image based on meal type and description
      let mealPrompt = `${meal.toLowerCase()}: ${description}`;
      
      // Special handling for snacks - enhance prompt for samosa and tea
      if (meal.toLowerCase() === "snacks") {
        const descriptionLower = description.toLowerCase();
        if (descriptionLower.includes("samosa") || descriptionLower.includes("tea") || descriptionLower.includes("chai")) {
          mealPrompt = `${description}, Indian snack, food photography, high quality`;
        } else {
          mealPrompt = `healthy snack: ${description}, food photography`;
        }
      }
      
      // Get both image URL and matching description
      const result = await generateMealImageWithDescription(mealPrompt, meal, forceRefresh);
      
      // Add cache-busting timestamp to URL to force browser reload
      const urlWithCacheBust = forceRefresh && result.imageUrl ? `${result.imageUrl}?t=${Date.now()}` : result.imageUrl;
      
      setImageUrl(urlWithCacheBust || result.imageUrl);
      
      // Update description to match the selected image
      if (result.description) {
        setDisplayDescription(result.description);
      }
    } catch (error) {
      setImageError(true);
    } finally {
      setIsLoadingImage(false);
    }
  };

  const handleRefreshImage = async () => {
    // Force refresh by bypassing cache and adding timestamp
    await loadImage(true);
  };

  const mealColors = {
    Breakfast: "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
    Lunch: "from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20",
    Dinner: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
    Snacks: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 relative overflow-hidden group`}
    >
      {/* Decorative gradient background based on meal */}
      <div className={`absolute inset-0 bg-gradient-to-br ${mealColors[meal] || "from-gray-50 to-gray-100"} opacity-30 dark:opacity-10 group-hover:opacity-40 dark:group-hover:opacity-15 transition-opacity`}></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 ${
                meal === 'Breakfast' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                meal === 'Lunch' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                meal === 'Dinner' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              } text-xs font-bold rounded-full`}>
                {meal}
              </span>
            </div>
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {meal}
            </h4>
          </div>
          <motion.button
            onClick={handleRefreshImage}
            disabled={isLoadingImage}
            className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex-shrink-0"
            title="Refresh image"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            {isLoadingImage ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        <motion.p 
          key={displayDescription}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-sm"
        >
          {displayDescription}
        </motion.p>

        {/* Image Section - Always visible */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl overflow-hidden relative bg-gray-100 dark:bg-gray-700 shadow-lg border-2 border-gray-200 dark:border-gray-700"
        >
          {isLoadingImage ? (
            <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Generating image...</p>
              </div>
            </div>
          ) : imageUrl ? (
            <img
              key={imageUrl} // Force re-render when URL changes
              src={imageUrl}
              alt={`${meal}: ${displayDescription}`}
              className="w-full h-64 object-cover"
              onError={() => {
                setImageError(true);
                setImageUrl(null);
              }}
              onLoad={() => setImageError(false)}
            />
          ) : (
            <div className="w-full h-64 flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
              <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Image will load automatically</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
