"use client";

import { useState, useEffect } from "react";
import RoastForm from "@/components/RoastForm";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for user's preferred color scheme on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const savedTheme = localStorage.getItem("theme");
      const shouldUseDarkMode = savedTheme === "dark" || (!savedTheme && prefersDark);
      setIsDarkMode(shouldUseDarkMode);
      
      if (shouldUseDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", newMode ? "dark" : "light");
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  return (
    <main className={`min-h-screen flex flex-col ${isDarkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-pink-50 to-blue-50"}`}>
      {/* TikTok-inspired design patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-tiktok-red rounded-full opacity-10 blur-xl"></div>
        <div className="absolute top-1/4 -left-24 w-72 h-72 bg-tiktok-cyan rounded-full opacity-10 blur-xl"></div>
      </div>
      
      <div className="relative flex-grow container mx-auto px-4 py-10">
        <header className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-tiktok-cyan to-tiktok-red mb-4">
            TikTok Roaster
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-2">
            Jangan cobain kalo kamu gak mau kena mental!
          </p>
          <div className="flex items-center justify-center">
            <span className="h-1 w-20 bg-gradient-to-r from-tiktok-cyan to-tiktok-red rounded-full"></span>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          <button
            onClick={toggleDarkMode}
            className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all"
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
          
          <RoastForm />
        </div>
      </div>
      
      <footer className="relative py-8 mt-12 text-center bg-gray-50 dark:bg-gray-800 shadow-inner">
        <div className="container mx-auto px-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Developed by{" "}
            <a
              href="https://www.tiktok.com/@herherykwan"
              className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-tiktok-cyan to-tiktok-red hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @herherykwan
            </a>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Made with ❤️ using Next.js & Tailwind CSS
          </p>
        </div>
      </footer>
      
      <Analytics />
      <SpeedInsights />
    </main>
  );
}
