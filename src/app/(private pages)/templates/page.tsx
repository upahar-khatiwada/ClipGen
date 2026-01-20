"use client";

import { LayoutTemplate, Sparkles, Timer } from "lucide-react";
import { useState } from "react";
import StyleCard from "./components/StyleCard";

const styles = [
  { id: "realistic", label: "Realistic", img: "/templates/realistic.webp" },
  { id: "cartoon", label: "Cartoon", img: "/templates/cartoon.webp" },
  { id: "cinematic", label: "Cinematic", img: "/templates/cinematic.avif" },
];

const contentTypes = ["Motivation", "Did You Know", "Story", "Podcast"];
const durations = ["15s", "30s", "60s"];

const TemplatesPage = () => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<string>(
    contentTypes[0],
  );
  const [selectedDuration, setSelectedDuration] = useState<string>(
    durations[0],
  );

  return (
    <div className="bg-slate-50 text-slate-900 font-sans w-full h-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Templates
          </h1>
          <p className="text-slate-500">
            Choose a proven format to create viral shorts faster.
          </p>
        </div>

        <section className="mb-14">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
            <LayoutTemplate className="text-indigo-600" />
            Content Type
          </h2>

          <select
            className="w-full border rounded-xl p-3 bg-white cursor-pointer"
            value={selectedContent}
            onChange={(e) => {
              setSelectedContent(e.target.value);
            }}
          >
            {contentTypes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </section>

        <section className="mb-14">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
            <Sparkles className="text-purple-600" />
            Style
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {styles.map((style) => (
              <StyleCard
                key={style.id}
                id={style.id}
                label={style.label}
                img={style.img}
                selected={selectedStyle === style.id}
                onClick={() => setSelectedStyle(style.id)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
            <Timer className="text-emerald-600" />
            Duration
          </h2>

          <select
            className="w-full border rounded-xl p-3 bg-white cursor-pointer"
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
          >
            {durations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </section>

        <div className="md:ml-auto mt-4">
          <button className="px-6 py-3 w-full bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition duration-200 cursor-pointer">
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
