"use client";

import { LayoutTemplate, Sparkles, Timer } from "lucide-react";
import { useState } from "react";
import StyleCard from "./components/StyleCard";
import { trpc } from "../../_trpc/client";
import StyleCardSkeleton from "./skeletons/StyleCardSkeleton";
import DropdownSkeleton from "./skeletons/DropdownSkeleton";
import { toast } from "sonner";
import GeneratingShortDialog from "@/src/components/GeneratingShortDialog";

const TemplatesPage = () => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const [contentTypes, styles, durations] = trpc.useQueries((t) => [
    t.templates.getContentTypes(),
    t.templates.getStyles(),
    t.templates.getDuration(),
  ]);

  const buildTemplatePrompt = () => {
    const contentTypeName =
      contentTypes.data?.find((c) => c.id === effectiveContentTypeId)?.name ??
      "";

    const styleName =
      styles.data?.find((s) => s.id === selectedStyle)?.name ?? "";

    const durationLabel =
      durations.data?.find((d) => d.id === effectiveDurationId)?.label ?? "";

    return `
Create a ${durationLabel} vertical short-form video.

Content type: ${contentTypeName}
Style: ${styleName}

Requirements:
- Strong hook in first 2 seconds
- Bold viral captions
- Cinematic pacing
- Optimized for TikTok, Reels, Shorts
`.trim();
  };

  const generateShortMutation =
    trpc.generateVideo.generateShortFromPrompt.useMutation({
      onSuccess: (data) => {
        setJobId(data.jobId);
        setIsGenerating(true);
      },
      onError: (err) => {
        if (err.data?.code === "TOO_MANY_REQUESTS") {
          toast.error("You're hitting the rate limit. Please wait a bit!");
        }
      },
    });

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

  const effectiveContentTypeId =
    selectedContent ?? contentTypes.data?.[0]?.id ?? "";

  const effectiveDurationId = selectedDuration ?? durations.data?.[0]?.id ?? "";

  return (
    <div className="bg-slate-50 text-slate-900 font-sans w-full min-h-screen">
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

          {contentTypes.isLoading ? (
            <DropdownSkeleton />
          ) : (
            <select
              className="w-full border rounded-xl p-3 bg-white cursor-pointer"
              value={effectiveContentTypeId}
              onChange={(e) => setSelectedContent(e.target.value)}
            >
              {contentTypes.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </section>

        <section className="mb-14">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
            <Sparkles className="text-purple-600" />
            Style
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {styles.isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <StyleCardSkeleton key={i} />
                ))
              : styles.data?.map((style) => (
                  <StyleCard
                    key={style.id}
                    id={style.id}
                    label={style.name}
                    img={style.imageUrl}
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

          {durations.isLoading ? (
            <DropdownSkeleton />
          ) : (
            <select
              className="w-full border rounded-xl p-3 bg-white cursor-pointer"
              value={effectiveDurationId}
              onChange={(e) => setSelectedDuration(e.target.value)}
            >
              {durations.data?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          )}
        </section>

        <div className="md:ml-auto mt-4">
          <button
            disabled={!selectedContent || !selectedStyle || !selectedDuration}
            onClick={() => {
              const prompt = buildTemplatePrompt();
              generateShortMutation.mutate({ prompt });
            }}
            className="px-6 py-3 w-full bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold hover:bg-indigo-700 transition duration-200 cursor-pointer"
          >
            Generate
          </button>
          {isGenerating && (
            <GeneratingShortDialog
              status={dialogStatus}
              videoUrl={data?.videoUrl}
              onClose={() => {
                setIsGenerating(false);
                setJobId(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
