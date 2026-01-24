// import fs from "fs";
// import path from "path";
import { redis } from "../server/redis";
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateAiShort({
  jobId,
  prompt,
  userId,
}: {
  jobId: string;
  prompt: string;
  userId: string;
}) {
  try {
    await sleep(5000);

    const videoUrl = "/videos/video.mp4";

    // let operation = await ai.models.generateVideos({
    //   model: "veo-3.1-generate-preview",
    //   prompt,
    // });

    // while (!operation.done) {
    //   await new Promise((r) => setTimeout(r, 3000));
    //   operation = await ai.operations.getVideosOperation({ operation });
    // }

    // const videoBase64 =
    //   operation.response?.generatedVideos?.[0]?.video?.videoBytes;

    // if (!videoBase64) {
    //   throw new Error("No video bytes returned from Veo");
    // }

    // const buffer = Buffer.from(videoBase64, "base64");
    // const videosDir = path.join(process.cwd(), "public", "videos");
    // await fs.promises.mkdir(videosDir, { recursive: true });

    // const fileName = `${jobId}.mp4`;
    // const filePath = path.join(videosDir, fileName);
    // await fs.promises.writeFile(filePath, buffer);

    // const videoUrl = `/videos/${fileName}`;

    await redis.set(
      `video_job:${jobId}`,
      JSON.stringify({
        status: "completed",
        userId,
        videoUrl,
      }),
      "EX",
      60 * 60,
    );
  } catch (err) {
    console.error("Veo generation failed:", err);

    await redis.set(
      `video_job:${jobId}`,
      JSON.stringify({
        status: "failed",
      }),
      "EX",
      60 * 10,
    );
  }
}
