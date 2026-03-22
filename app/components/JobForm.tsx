"use client";

import { useState } from "react";

export default function JobForm() {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    // simulate API
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold">Start Job Hunt</h2>

      <input
        type="text"
        placeholder="Role (e.g. Backend Engineer)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full bg-white/10 border border-white/20 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <input
        type="text"
        placeholder="Location (e.g. India)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full bg-white/10 border border-white/20 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <div>
  <label className="block text-sm text-gray-400 mb-2">
    Upload Resume
  </label>

  <div className="flex items-center gap-3">
    {/* Hidden Input */}
    <input
      type="file"
      id="resumeUpload"
      onChange={(e) => setResume(e.target.files?.[0] || null)}
      className="hidden"
    />

    {/* Custom Button */}
    <label
      htmlFor="resumeUpload"
      className="cursor-pointer px-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition"
    >
      📄 Choose File
    </label>

    {/* File Name */}
    <span className="text-sm text-gray-400 truncate max-w-[200px]">
      {resume ? resume.name : "No file chosen"}
    </span>
  </div>
</div>

      <button
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition font-semibold"
      >
        {loading ? "Running Agent..." : "🚀 Launch Agent"}
      </button>
    </form>
  );
}