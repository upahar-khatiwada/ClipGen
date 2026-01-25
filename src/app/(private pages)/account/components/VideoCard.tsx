"use client";

import { trpc } from "@/src/app/_trpc/client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume, VolumeX } from "lucide-react";

interface VideoCardProps {
  publicId: string;
  thumbnail: string;
  url?: string;
  createdAt?: string;
  title?: string;
}

export function VideoCard({
  publicId,
  thumbnail,
  url,
  createdAt,
  title: initialTitle,
}: VideoCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle || "");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout>(null);

  const updateTitleMutation = trpc.account.updateVideoTitle.useMutation();

  const saveTitle = async () => {
    if (!title.trim()) return;
    try {
      const result = await updateTitleMutation.mutateAsync({
        publicId,
        newTitle: title,
      });
      if (result.success) setEditing(false);
    } catch (err) {
      console.error("Failed to update title", err);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
      setShowControls(false);
    }
    showControlsTemporarily();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const percent =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(percent);
  };

  const handleProgressClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPos = e.clientX - rect.left;
    const newTime = (clickPos / rect.width) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition duration-200 overflow-hidden group">
      <div
        className="bg-slate-200 rounded-t-3xl w-full h-120  relative overflow-hidden"
        onMouseMove={showControlsTemporarily}
        onClick={togglePlay}
      >
        {url ? (
          <>
            <video
              src={url}
              ref={videoRef}
              className="w-full h-full object-cover rounded-t-3xl"
              onTimeUpdate={handleTimeUpdate}
            />

            {showControls && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/30 flex flex-col gap-2 rounded-t-lg transition-opacity duration-300">
                <div
                  className="h-1 bg-gray-300 rounded cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-1 bg-purple-600 rounded transition-all duration-200 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="text-white p-2 cursor-pointer"
                  >
                    {playing ? <Pause size={20} /> : <Play size={20} />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="text-white p-2 cursor-pointer"
                  >
                    {muted ? <VolumeX size={20} /> : <Volume size={20} />}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <Image
            src={thumbnail}
            alt={title ?? "Video thumbnail"}
            className="w-full h-full object-cover rounded-t-3xl"
            width={200}
            height={144}
          />
        )}
      </div>

      <div className="p-4">
        {editing ? (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded px-2 py-1 flex-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitle();
                if (e.key === "Escape") {
                  setTitle(initialTitle || "");
                  setEditing(false);
                }
              }}
            />
            <button
              onClick={saveTitle}
              className="bg-indigo-600 text-white px-3 py-1 rounded font-semibold cursor-pointer hover:bg-indigo-700 transition-colors duration-200"
            >
              Save
            </button>
          </div>
        ) : (
          <h3
            className="font-semibold mb-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
          >
            {title}
          </h3>
        )}

        <p className="text-sm text-slate-500">
          {createdAt
            ? new Date(createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—"}
        </p>
      </div>
    </div>
  );
}
