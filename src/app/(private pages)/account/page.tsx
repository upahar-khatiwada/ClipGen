"use client";

import { CreditCard, Crown, Video, Calendar } from "lucide-react";
import Link from "next/link";
import { trpc } from "../../_trpc/client";
import { VideoCardSkeleton } from "./skeletons/VideoCardSkeleton";
import { VideoCard } from "./components/VideoCard";
import { useAuth } from "@/src/context/AuthContext";
import { SubscriptionInterval } from "@/src/generated/prisma/enums";
import CreditsCardSkeleton from "./skeletons/CreditsCardSkeleton";
import SubscriptionSkeleton from "./skeletons/SubscriptionSkeleton";

type Video = {
  publicId: string;
  url: string;
  thumbnail?: string;
  duration?: number | string;
  createdAt?: string;
  title?: string;
};

const AccountPage = () => {
  const { user } = useAuth();

  const [videosOfCurrentUser, subscriptionOfCurrentUser] = trpc.useQueries(
    (t) => [
      t.account.getAllVideosOfCurrentUser<Video[]>(),
      t.account.getCurrentSubscription(),
    ],
  );

  const subscription = subscriptionOfCurrentUser.data;

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
          <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col h-full">
            {subscriptionOfCurrentUser.isLoading ? (
              <SubscriptionSkeleton />
            ) : subscription ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <Crown className="text-indigo-600" />
                  <h3 className="font-bold text-lg">Subscription</h3>
                </div>
                <p className="text-slate-600 mb-1">{subscription.plan.name}</p>
                <p className="text-sm text-slate-500 mb-4">
                  {subscription.status === "ACTIVE"
                    ? `Billed ${
                        subscription.plan.interval ===
                        SubscriptionInterval.MONTHLY
                          ? "monthly"
                          : "yearly"
                      }`
                    : "Inactive"}{" "}
                  · Renews{" "}
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )}
                </p>
                <Link href="/upgrade">
                  <button className="w-full mt-3 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors duration-200 cursor-pointer">
                    Manage Subscription
                  </button>
                </Link>
              </>
            ) : (
              <div className="text-sm text-slate-500 flex-1 h-full">
                You don’t have an active subscription yet.
                <Link
                  href="/upgrade"
                  className="ml-1 text-[16px] text-indigo-600 underline"
                >
                  <button className="mt-13 cursor-pointer w-full py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors duration-200">
                    Upgrade Now
                  </button>
                </Link>
              </div>
            )}
          </div>

          {user?.credits ? (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="text-emerald-600" />
                <h3 className="font-bold text-lg">Credits</h3>
              </div>
              <p className="text-3xl font-extrabold">{user?.credits}</p>
              <p className="text-sm text-slate-500 mb-4">Remaining credits</p>
              <Link href="/upgrade">
                <button className="cursor-pointer w-full py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors duration-200">
                  Buy More Credits
                </button>
              </Link>
            </div>
          ) : (
            <CreditsCardSkeleton />
          )}

          <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
            <div className="flex items-center gap-3 mb-3">
              <Video className="text-purple-600" />
              <h3 className="font-bold text-lg">Usage</h3>
            </div>
            <p className="text-slate-600">
              <span className="font-semibold">
                {videosOfCurrentUser.data?.length}
              </span>{" "}
              videos generated
            </p>
            <p className="text-sm text-slate-500 mt-1">Lifetime Usage</p>
          </div>
        </div>

        <section className="h-full">
          <div className="flex items-center gap-2 mb-4 mt-3">
            <Calendar className="text-indigo-600" />
            <h2 className="text-2xl font-bold">Your Videos</h2>
          </div>

          {videosOfCurrentUser.isLoading ? (
            <div className="grid w-full sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <VideoCardSkeleton key={i} />
              ))}
            </div>
          ) : videosOfCurrentUser.isError ||
            !videosOfCurrentUser.data?.length ? (
            <p className="text-slate-500">
              You haven’t generated any videos yet.
            </p>
          ) : (
            <div className="grid w-full sm:grid-cols-2 md:grid-cols-3 gap-6">
              {videosOfCurrentUser.data.map((video) => (
                <VideoCard
                  key={video.publicId}
                  publicId={video.publicId}
                  title={video.title}
                  thumbnail={video.thumbnail ?? "/placeholder.png"}
                  url={video.url}
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
