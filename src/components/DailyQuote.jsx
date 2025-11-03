"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const fallbackQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can do it. It's your mind you need to convince.",
  "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Take care of your body. It's the only place you have to live.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "Don't stop when you're tired. Stop when you're done.",
];

export default function DailyQuote() {
  const [quote, setQuote] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        // Check if we have a cached quote for today
        const today = new Date().toDateString();
        const cached = localStorage.getItem(`quote_${today}`);
        
        if (cached) {
          setQuote(cached);
          setIsLoading(false);
          return;
        }

        // Try to fetch AI-generated quote
        const response = await fetch("/api/generate-quote");
        if (response.ok) {
          const data = await response.json();
          const newQuote = data.quote || fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
          setQuote(newQuote);
          // Cache for today
          localStorage.setItem(`quote_${today}`, newQuote);
        } else {
          throw new Error("Failed to fetch quote");
        }
      } catch (error) {
        // Silent error - use fallback quote
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        const index = dayOfYear % fallbackQuotes.length;
        setQuote(fallbackQuotes[index]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuote();
  }, []);

  if (isLoading || !quote) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-2xl p-6 shadow-lg dark:shadow-xl mb-8"
      >
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-white flex-shrink-0 mt-1 animate-pulse" />
          <p className="text-white text-lg font-medium leading-relaxed">
            Loading your daily inspiration...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 dark:from-purple-600 dark:via-pink-600 dark:to-orange-600 rounded-3xl p-8 shadow-2xl mb-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="relative z-10 flex items-start gap-4">
        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl flex-shrink-0">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="text-white/90 text-xs font-semibold mb-2 uppercase tracking-wider">Daily Motivation</p>
          <p className="text-white text-xl font-semibold leading-relaxed">
            "{quote}"
          </p>
        </div>
      </div>
    </motion.div>
  );
}
