"use client";

import { useState } from "react";
import { roastTiktok } from "@/app/actions/roastingTiktok";
import axios from "axios";

export default function RoastForm() {
  const [username, setUsername] = useState("");
  const [roast, setRoast] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("indonesian"); // Default language

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
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
          language, // Pass the selected language to the API
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
        setError(err.response.data.message);
      } else {
        setError("Failed to roast. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-5 mr-5 mt-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Tiktok username"
          className="w-full p-2 border rounded text-black"
          required
        />

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border rounded text-black"
        >
          <option value="indonesian">Indonesian</option>
          <option value="english">English</option>
          <option value="mandarin">Mandarin</option>
          <option value="japanese">Japanese</option>
          <option value="korean">Korean</option>
          <option value="vietnamese">Vietnamese</option>
          <option value="filipino">Filipino</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Roasting..." : "Roast"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {avatar && (
        <div className="flex justify-center mt-4 items-center p-4">
          <img
            alt=""
            src={avatar}
            className="w-32 h-32 rounded-full border-4 border-blue-600 shadow-lg object-cover"
          />
        </div>
      )}
      {roast && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-bold mb-2 text-black">
            Roast Result🔥🔥🔥:
          </h2>
          <p className="text-black">{roast}</p>
        </div>
      )}
    </div>
  );
}
