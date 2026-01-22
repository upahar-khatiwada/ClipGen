"use client";

import { useState } from "react";
import SubscriptionCard from "./components/SubscriptionCard";
import { trpc } from "../../_trpc/client";
import CreditPacksSkeleton from "./skeletons/CreditPacksSkeleton";
import SubscriptionCardSkeleton from "./skeletons/SubscriptionCardSkeleton";

const UpgradePage = () => {
  const [selectedCredits, setSelectedCredits] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { data: creditPacksData, isLoading: credisPacksLoading } =
    trpc.upgrade.getCreditDetails.useQuery();

  const { data: subscriptionsData, isLoading: subscriptionsLoading } =
    trpc.upgrade.getSubscriptionDetails.useQuery();

  const handleBuyCredits = () => {};

  const handleBuySubscription = () => {};

  return (
    <div className="bg-slate-50 text-slate-900 font-sans w-full min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-4xl font-extrabold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Upgrade Your Account
        </h1>
        <p className="text-slate-500 mb-6">
          Choose the plan or credits package that suits your needs.
        </p>

        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Buy Credits</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {credisPacksLoading
              ? Array.from({ length: 8 }).map((_, i) => {
                  return <CreditPacksSkeleton key={i} />;
                })
              : creditPacksData?.map((creditPack) => (
                  <div
                    key={creditPack.credits}
                    onClick={() => setSelectedCredits(creditPack.credits)}
                    className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 flex flex-col items-center justify-center text-center ${
                      selectedCredits === creditPack.credits
                        ? "border-indigo-600 bg-indigo-50 shadow-lg"
                        : "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30"
                    }`}
                  >
                    <p className="text-lg font-semibold">
                      {creditPack.credits} Credits
                    </p>
                    <p className="text-sm text-slate-500">
                      ${creditPack.priceUsd}
                    </p>
                  </div>
                ))}
          </div>

          <div className="mt-6 w-full text-right">
            <button
              onClick={handleBuyCredits}
              disabled={selectedCredits === null}
              className="px-6 py-3 w-full disabled:bg-gray-400 disabled:cursor-not-allowed bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition duration-200 cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Subscription Plans</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {subscriptionsLoading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <SubscriptionCardSkeleton key={i} />
                ))
              : subscriptionsData?.map((plan) => (
                  <SubscriptionCard
                    key={plan.id}
                    title={plan.name}
                    price={`$${plan.priceUsd} / ${
                      plan.interval === "MONTHLY" ? "month" : "year"
                    }`}
                    description={plan.perks}
                    selected={selectedPlan === plan.id}
                    onSelect={() => setSelectedPlan(plan.interval)}
                  />
                ))}
          </div>

          <div className="mt-6 w-full text-right">
            <button
            disabled={selectedPlan === null}
              onClick={handleBuySubscription}
              className="px-6 py-3 w-full disabled:bg-gray-400 disabled:cursor-not-allowed bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition duration-200 cursor-pointer"
            >
              Subscribe
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UpgradePage;
