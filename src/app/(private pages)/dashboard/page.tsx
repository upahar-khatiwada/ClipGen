"use client";

import { useEffect, useState } from "react";
import { Wand2, Play, Layout, Sparkles } from "lucide-react";
import FeatureCard from "./components/FeatureCard";
import GeneratingShortDialog from "@/src/components/GeneratingShortDialog";
import { trpc } from "../../_trpc/client";
import { toast } from "sonner";

const DashboardPage = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const generateShortMutation =
    trpc.generateVideo.generateShortFromPrompt.useMutation({
      onSuccess: (data) => {
        setJobId(data.jobId);
        setIsGenerating(true);
      },
      onError: (err) => {
        if (err.data?.code === "TOO_MANY_REQUESTS") {
          toast.error("You're hitting the rate limit. Please wait a bit!");
        } else if (err.data?.code === "UNAUTHORIZED") {
          toast.error("You're not authorized");
        } else {
          toast.error("An error has occured while generating the short!");
        }
      },
    });

  const generateShort = (prompt: string) => {
    generateShortMutation.mutate({ prompt });
  };

  const { data } = trpc.generateVideo.getJobStatus.useQuery(
    { jobId: jobId! },
    {
      enabled: !!jobId && isGenerating,
      refetchInterval: 2000,
    },
  );

  const videoReady = data?.status === "completed";
  const videoFailed = data?.status === "failed";
  const dialogStatus = videoFailed
    ? "failed"
    : videoReady
      ? "completed"
      : "processing";

  useEffect(() => {
    if (!data) return;

    if (videoFailed) {
      toast.error("Video generation failed. Try again.");
    } else if (videoReady) {
      toast.success("Your short is ready!");
    }
  }, [data, videoFailed, videoReady]);

  return (
    <div className="bg-slate-50 text-slate-900 font-sans w-full min-h-screen">
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
              maxLength={500}
              minLength={100}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A 30-second motivational video about morning routines with lo-fi music..."
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-32 resize-none text-slate-700"
            />
            <div className="flex justify-end items-center">
              <button
                onClick={() => {
                  generateShort(prompt);
                }}
                disabled={prompt.length < 100}
                className="flex cursor-pointer items-center gap-2 disabled:cursor-not-allowed disabled:bg-indigo-300 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all transform hover:scale-105 active:scale-95"
              >
                <Wand2 size={20} />
                Generate Short
              </button>
            </div>
          </div>
        </div>

        {isGenerating && data && (
          <GeneratingShortDialog
            status={dialogStatus}
            videoUrl={data.videoUrl}
            onClose={() => {
              setIsGenerating(false);
              setJobId(null);
            }}
          />
        )}

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
