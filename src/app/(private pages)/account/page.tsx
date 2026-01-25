"use client";

import { CreditCard, Crown, Video, Calendar } from "lucide-react";
import Link from "next/link";
import { trpc } from "../../_trpc/client";
import { VideoCardSkeleton } from "./skeletons/VideoCardSkeleton";
import { VideoCard } from "./components/VideoCard";
import { useAuth } from "@/src/context/AuthContext";

type Video = {
  publicId: string;
  url: string;
  thumbnail?: string;
  duration?: number | string;
  createdAt?: string;
  title?: string;
};

const AccountPage = () => {
  const {
    data: allVideos,
    error: allVideosError,
    isLoading: allVideosLoading,
  } = trpc.account.getAllVideosOfCurrentUser.useQuery<Video[]>();

  const { user } = useAuth();

  return (
    <div className="bg-slate-50 text-slate-900 font-sans w-full min-h-screen">
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        <div>
          <h1 className="text-4xl font-extrabold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Account
          </h1>
          <p className="text-slate-500">
            Manage your subscription, credits, and generated shorts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
            <div className="flex items-center gap-3 mb-3">
              <Crown className="text-indigo-600" />
              <h3 className="font-bold text-lg">Subscription</h3>
            </div>
            <p className="text-slate-600 mb-1">Pro Plan</p>
            <p className="text-sm text-slate-500 mb-4">
              Billed monthly · Renews Feb 12, 2026
            </p>
            <Link href="/upgrade">
              <button className="w-full mt-3 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors duration-200 cursor-pointer">
                Manage Subscription
              </button>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="text-emerald-600" />
              <h3 className="font-bold text-lg">Credits</h3>
            </div>
            <p className="text-3xl font-extrabold mb-1">{user?.credits}</p>
            <p className="text-sm text-slate-500 mb-4">Remaining credits</p>
            <Link href="/upgrade">
              <button className="cursor-pointer w-full py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors duration-200">
                Buy More Credits
              </button>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
            <div className="flex items-center gap-3 mb-3">
              <Video className="text-purple-600" />
              <h3 className="font-bold text-lg">Usage</h3>
            </div>
            <p className="text-slate-600">
              <span className="font-semibold">38</span> videos generated
            </p>
            <p className="text-sm text-slate-500 mt-1">This billing cycle</p>
          </div>
        </div>

        <section className="h-full">
          <div className="flex items-center gap-2 mb-4 mt-3">
            <Calendar className="text-indigo-600" />
            <h2 className="text-2xl font-bold">Your Videos</h2>
          </div>

          {allVideosLoading ? (
            <div className="grid w-full sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <VideoCardSkeleton key={i} />
              ))}
            </div>
          ) : allVideosError || !allVideos?.length ? (
            <p className="text-slate-500">
              You haven’t generated any videos yet.
            </p>
          ) : (
            <div className="grid w-full sm:grid-cols-2 md:grid-cols-3 gap-6">
              {allVideos.map((video) => (
                <VideoCard
                  key={video.publicId}
                  publicId={video.publicId}
                  title={video.title}
                  thumbnail={video.thumbnail ?? "/placeholder.webp"}
                  url={video.url}
                  duration={video.duration}
                  createdAt={video.createdAt}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AccountPage;
