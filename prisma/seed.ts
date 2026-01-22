import { SubscriptionInterval } from "@/src/generated/prisma/enums";
import prisma from "@/src/lib/prisma";

async function main() {
  const plans = [
    {
      name: "Monthly Plan",
      interval: SubscriptionInterval.MONTHLY,
      priceUsd: 10,
      stripePriceId: "stripe_price_monthly_placeholder",
      creditsPerPeriod: 5000,
      active: true,
      perks: [
        "500 AI videos/month (5K credits)",
        "Priority queue",
        "24/7 email support",
        "100+ templates",
      ],
    },
    {
      name: "Yearly Plan",
      interval: SubscriptionInterval.YEARLY,
      priceUsd: 100,
      stripePriceId: "stripe_price_yearly_placeholder",
      creditsPerPeriod: 80000,
      active: true,
      perks: [
        "8K AI videos/year (80K credits)",
        "VIP priority queue",
        "Dedicated Slack + phone support",
        "500+ premium templates",
        "Advanced analytics & insights",
        "Early feature access",
        "20% savings",
      ],
    },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name },
      update: {},
      create: plan,
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
