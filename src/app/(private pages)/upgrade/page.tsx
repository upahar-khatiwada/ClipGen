"use client";

import { useState } from "react";
import SubscriptionCard from "./components/SubscriptionCard";

const UpgradePage = () => {
  const [selectedCredits, setSelectedCredits] = useState(100);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "monthly",
  );

  const creditsOptions = [50, 100, 200, 500];

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
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <select
              className="border rounded-xl p-3 bg-white cursor-pointer flex-1"
              value={selectedCredits}
              onChange={(e) => setSelectedCredits(Number(e.target.value))}
            >
              {creditsOptions.map((c) => (
                <option key={c} value={c}>
                  {c} Credits
                </option>
              ))}
            </select>
            <button
              onClick={handleBuyCredits}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition duration-200 cursor-pointer"
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

          <div className="mt-6 text-right">
            <button
              onClick={handleBuySubscription}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition duration-200 cursor-pointer"
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
