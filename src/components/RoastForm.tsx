"use client";

import { useState, useEffect } from "react";
import { roastTiktok } from "@/app/actions/roastingTiktok";
import axios from "axios";

export default function RoastForm() {
  const [username, setUsername] = useState("");
  const [roast, setRoast] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("indonesian");
  const [copySuccess, setCopySuccess] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRoast("");
    setAvatar("");
    setIsRateLimited(false);
    try {
      const profile = await roastTiktok(username);
      if (profile.avatar) {
        setAvatar(profile.avatar);
      }
      const response = await axios.post(
        "/api/generate-roast",
        {
          username,
          profile,
          language,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setRoast(response.data.roasting);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // Check if this is a rate limit error
        if (err.response.status === 429) {
          setIsRateLimited(true);
          setError("Your roasting limit has been reached on the same account and in any language (2x/10 minutes). Please try again later!");
        } else {
          setError(err.response.data.message);
        }
      } else {
        setError("Failed to roast. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roast);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all duration-300">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                TikTok Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">@</span>
                </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-tiktok-red focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-tiktok-red focus:border-transparent transition-all"
              >
                <option value="indonesian">Indonesian</option>
                <option value="english">English</option>
                <option value="mandarin">Mandarin</option>
                <option value="japanese">Japanese</option>
                <option value="korean">Korean</option>
                <option value="vietnamese">Vietnamese</option>
                <option value="filipino">Filipino</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || isRateLimited}
              className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-gradient-to-r from-tiktok-cyan to-tiktok-red text-white font-medium rounded-lg shadow-md hover:shadow-lg transform transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tiktok-red"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Roasting...</span>
                </>
              ) : (
                <>
                  <span>Generate Roast</span>
                  <span className="inline-block animate-pulse">🔥</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className={`mt-4 ${isRateLimited ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-500' : 'bg-red-50 dark:bg-red-900/30 border-red-500'} border-l-4 p-4 rounded-lg animate-fadeIn`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {isRateLimited ? (
                <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm ${isRateLimited ? 'text-yellow-700 dark:text-yellow-200' : 'text-red-700 dark:text-red-200'}`}>{error}</p>
            </div>
          </div>
        </div>
      )}

      {avatar && (
        <div className="mt-8 flex justify-center animate-fadeIn">
          <div className="relative">
            <img
              alt="TikTok user"
              src={avatar}
              className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-gradient-to-r from-tiktok-cyan to-tiktok-red"
            />
          </div>
        </div>
      )}

      {roast && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-tiktok-cyan to-tiktok-red">
              Roast Result 🔥
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{roast}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tiktok-red"
              >
                {copySuccess ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
