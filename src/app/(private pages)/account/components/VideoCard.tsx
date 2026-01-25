"use client";

import { trpc } from "@/src/app/_trpc/client";
import Image from "next/image";
import { useState } from "react";

interface VideoCardProps {
  publicId: string;
  thumbnail: string;
  url?: string;
  duration?: string | number;
  createdAt?: string;
  title?: string;
}

export function VideoCard({
  publicId,
  thumbnail,
  url,
  duration,
  createdAt,
  title: initialTitle,
}: VideoCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle || "");
  const [isPlaying, setIsPlaying] = useState(false);
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

  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition duration-200 overflow-hidden">
      <div
        className="bg-slate-200 rounded-t-3xl w-full h-120 cursor-pointer relative"
        onClick={() => setIsPlaying((prev) => !prev)}
      >
        {isPlaying && url ? (
          <video
            src={url}
            autoPlay
            controls
            className="w-full h-full object-cover rounded-t-3xl"
          />
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
            className="font-semibold mb-1"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
          >
            {title}
          </h3>
        )}

        <p className="text-sm text-slate-500">
          {duration ?? "—"} · {createdAt ?? "—"}
        </p>
      </div>
    </div>
  );
}
