import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const creditPacks = [
    {
      name: "50 Coins Pack",
      credits: 50,
      priceUsd: 2,
      stripePriceId: "price_1SsIGJ2cq13Bh16q0kZrz70y",
      active: true,
    },
    {
      name: "200 Coins Pack",
      credits: 200,
      priceUsd: 7,
      stripePriceId: "price_1SsIcm2cq13Bh16qT3BftvSh",
      active: true,
    },
    {
      name: "500 Coins Pack",
      credits: 500,
      priceUsd: 15,
      stripePriceId: "price_1SsIdK2cq13Bh16qybG76AZf",
      active: true,
    },
    {
      name: "1000 Coins Pack",
      credits: 1000,
      priceUsd: 25,
      stripePriceId: "price_1SsIeN2cq13Bh16qKyWTvqYK",
      active: true,
    },
    {
      name: "2500 Coins Pack",
      credits: 2500,
      priceUsd: 55,
      stripePriceId: "price_1SsJ0h2cq13Bh16qkotHjOyS",
      active: true,
    },
    {
      name: "5000 Coins Pack",
      credits: 5000,
      priceUsd: 99.99,
      stripePriceId: "price_1SsIeq2cq13Bh16qT18s328a",
      active: true,
    },
  ];

  await prisma.creditPack.createMany({
    data: creditPacks,
    skipDuplicates: true,
  });

  console.log("Credit packs seeded successfully!");
}

// async function main() {
//   await prisma.contentType.createMany({
//     data: [
//       { name: "Motivation" },
//       { name: "Did You Know" },
//       { name: "Story" },
//       { name: "Podcast" },
//     ],
//   });

//   await prisma.style.createMany({
//     data: [
//       {
//         name: "Realistic",
//         imageUrl:
//           "https://i.pinimg.com/736x/00/b2/2d/00b22d50cc17388ff58b7f1ec88cc67a.jpg",
//       },
//       {
//         name: "Cartoon",
//         imageUrl:
//           "https://i.pinimg.com/736x/56/23/90/56239038ef0b328f6b57fc6dce7af81c.jpg",
//       },
//       {
//         name: "Cinematic",
//         imageUrl:
//           "https://i.pinimg.com/736x/04/db/96/04db968ab9d8c3d70b8b698d67668d15.jpg",
//       },
//       {
//         name: "Minimal",
//         imageUrl:
//           "https://i.pinimg.com/736x/0f/4c/60/0f4c60775d89930330a769aea211f43b.jpg",
//       },
//       {
//         name: "Sketch",
//         imageUrl:
//           "https://i.pinimg.com/1200x/b9/16/5a/b9165aa48b825d6d3787f091954faab0.jpg",
//       },
//       {
//         name: "Vintage",
//         imageUrl:
//           "https://i.pinimg.com/736x/22/85/b7/2285b700e44a45f21d24484eb8f787cf.jpg",
//       },
//     ],
//   });

//   await prisma.duration.createMany({
//     data: [
//       { label: "15s", seconds: 15 },
//       { label: "30s", seconds: 30 },
//       { label: "60s", seconds: 60 },
//     ],
//   });
// }

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
