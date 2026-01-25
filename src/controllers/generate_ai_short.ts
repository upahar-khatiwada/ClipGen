// import fs from "fs";
// import path from "path";
import { TRPCError } from "@trpc/server";
import { redis } from "../server/redis";
import cloudinary from "../services/cloudinary_video_storage";
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

    const uploadResult = await cloudinary.uploader.upload(
      "C:/Users/Legion/Desktop/ai-short-generator/public/videos/video.mp4",
      {
        resource_type: "video",
        folder: `videos-${userId}`,
        eager: [
          {
            format: "jpg",
            width: 300,
            height: 600,
            crop: "fill",
            start_offset: "2",
          },
        ],
      },
    );

    const cloudinary_url = uploadResult.secure_url;
    const thumbnail_url = uploadResult.eager?.[0].secure_url;

    // const uploadResult = await new Promise((resolve, reject) => {
    //   cloudinary.uploader
    //     .upload_stream(
    //       {
    //         resource_type: "video",
    //         folder: "generated-videos",
    //         public_id: jobId,
    //       },
    //       (error, result) => {
    //         if (error) reject(error);
    //         else resolve(result);
    //       },
    //     )
    //     .end(buffer);
    // });

    // const videosDir = path.join(process.cwd(), "public", "videos");
    // await fs.promises.mkdir(videosDir, { recursive: true });

    // const fileName = `${jobId}.mp4`;
    // const filePath = path.join(videosDir, fileName);
    // await fs.promises.writeFile(filePath, buffer);

    // const videoUrl = `/videos/${fileName}`;

    // throw new TRPCError({
    //   code: "INTERNAL_SERVER_ERROR",
    //   message: "Simulated backend failure",
    // });


    // TODO SAVE IN DB
    await redis.set(
      `video_job:${jobId}`,
      JSON.stringify({
        status: "completed",
        userId,
        videoUrl: cloudinary_url,
        thumbnail_url: thumbnail_url,
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
