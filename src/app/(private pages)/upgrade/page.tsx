"use client";

import { useState } from "react";
import SubscriptionCard from "./components/SubscriptionCard";

const UpgradePage = () => {
  const [selectedCredits, setSelectedCredits] = useState(100);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "monthly",
  );

  const creditsOptions = [
    { credits: 50, price: 5 },
    { credits: 100, price: 10 },
    { credits: 200, price: 18 },
    { credits: 500, price: 40 },
  ];

  const handleBuyCredits = () => {};

  const handleBuySubscription = () => {};

  return (
    <div className="bg-slate-50 text-slate-900 font-sans w-full h-full">
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
            {creditsOptions.map((option) => (
              <div
                key={option.credits}
                onClick={() => setSelectedCredits(option.credits)}
                className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 flex flex-col items-center justify-center text-center ${
                  selectedCredits === option.credits
                    ? "border-indigo-600 bg-indigo-50 shadow-lg"
                    : "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30"
                }`}
              >
                <p className="text-lg font-semibold">
                  {option.credits} Credits
                </p>
                <p className="text-sm text-slate-500">${option.price}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 w-full text-right">
            <button
              onClick={handleBuyCredits}
              className="px-6 py-3 w-full bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition duration-200 cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Subscription Plans</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <SubscriptionCard
              title="Monthly Plan"
              price="$10 / month"
              selected={selectedPlan === "monthly"}
              onSelect={() => setSelectedPlan("monthly")}
            />
            <SubscriptionCard
              title="Yearly Plan"
              price="$100 / year"
              description="Save 20%"
              selected={selectedPlan === "yearly"}
              onSelect={() => setSelectedPlan("yearly")}
            />
          </div>

          <div className="mt-6 w-full text-right">
            <button
              onClick={handleBuySubscription}
              className="px-6 py-3 w-full bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition duration-200 cursor-pointer"
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
