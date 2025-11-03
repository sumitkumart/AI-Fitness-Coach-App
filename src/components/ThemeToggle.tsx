"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use resolvedTheme to get the actual theme (handles "system" theme)
  const currentTheme = resolvedTheme || theme;

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700/60 cursor-not-allowed"
        aria-label="Toggle theme"
        type="button"
        disabled
      >
        <Moon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
      </button>
    );
  }

  const toggleTheme = () => {
    if (theme === "system") {
      // If system, switch to opposite of current resolved theme
      setTheme(currentTheme === "dark" ? "light" : "dark");
    } else {
      // Toggle between light and dark
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={currentTheme === "dark"}
      aria-label={`Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`}
      type="button"
      className={`relative inline-flex items-center p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 ${
        currentTheme === "dark" ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-gray-200 dark:bg-gray-700"
      }`}
    >
      {/* Sliding indicator */}
      <span
        className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white dark:bg-gray-900 shadow transform transition-transform ${
          currentTheme === "dark" ? "translate-x-5" : "translate-x-0"
        }`}
      />

      <div className="relative z-10 flex items-center gap-2 px-2">
        <AnimatePresence mode="wait" initial={false}>
          {currentTheme === "dark" ? (
            <motion.div
              key="sun"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Sun className="w-4 h-4 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
}

