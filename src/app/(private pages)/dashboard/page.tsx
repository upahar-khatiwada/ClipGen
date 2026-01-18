"use client";

import { useState } from "react";
import { Wand2, Play, Layout, Sparkles } from "lucide-react";
import FeatureCard from "./components/FeatureCard";

const DashboardPage = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="bg-slate-50 text-slate-900 font-sans w-full h-full">
      <main className="mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Turn Ideas into Viral Shorts
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Upload a script or just type a prompt. Our AI handles the captions,
            B-roll, and music in seconds.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100 border border-indigo-50 mb-16">
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-2 font-semibold text-slate-700">
              <Sparkles size={18} className="text-indigo-500" />
              What is your short about?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A 30-second motivational video about morning routines with lo-fi music..."
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-32 resize-none text-slate-700"
            />
            <div className="flex justify-end items-center">
              <button className="flex cursor-pointer items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all transform hover:scale-105 active:scale-95">
                <Wand2 size={20} />
                Generate Short
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Play className="text-emerald-500" />}
            title="AI Voiceover"
            desc="Choose from 50+ hyper-realistic voices."
          />
          <FeatureCard
            icon={<Layout className="text-blue-500" />}
            title="Auto-Captions"
            desc="Viral-style captions synced to every word."
          />
          <FeatureCard
            icon={<Wand2 className="text-purple-500" />}
            title="B-Roll Engine"
            desc="Matches relevant stock footage automatically."
          />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
