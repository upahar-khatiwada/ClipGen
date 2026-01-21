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
  await prisma.contentType.createMany({
    data: [
      { name: "Motivation" },
      { name: "Did You Know" },
      { name: "Story" },
      { name: "Podcast" },
    ],
  });

  await prisma.style.createMany({
    data: [
      {
        name: "Realistic",
        imageUrl:
          "https://i.pinimg.com/736x/00/b2/2d/00b22d50cc17388ff58b7f1ec88cc67a.jpg",
      },
      {
        name: "Cartoon",
        imageUrl:
          "https://i.pinimg.com/736x/56/23/90/56239038ef0b328f6b57fc6dce7af81c.jpg",
      },
      {
        name: "Cinematic",
        imageUrl:
          "https://i.pinimg.com/736x/04/db/96/04db968ab9d8c3d70b8b698d67668d15.jpg",
      },
      {
        name: "Minimal",
        imageUrl:
          "https://i.pinimg.com/736x/0f/4c/60/0f4c60775d89930330a769aea211f43b.jpg",
      },
      {
        name: "Sketch",
        imageUrl:
          "https://i.pinimg.com/1200x/b9/16/5a/b9165aa48b825d6d3787f091954faab0.jpg",
      },
      {
        name: "Vintage",
        imageUrl:
          "https://i.pinimg.com/736x/22/85/b7/2285b700e44a45f21d24484eb8f787cf.jpg",
      },
    ],
  });

  await prisma.duration.createMany({
    data: [
      { label: "15s", seconds: 15 },
      { label: "30s", seconds: 30 },
      { label: "60s", seconds: 60 },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
