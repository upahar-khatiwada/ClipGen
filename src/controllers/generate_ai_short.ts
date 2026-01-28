import { redis } from "../server/redis";
import cloudinary from "../services/cloudinary_video_storage";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

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
    const operation = await ai.models.generateVideos({
      model: "veo-3.1-generate-preview",
      prompt,
    });

    let opStatus = operation;
    while (!opStatus.done) {
      await new Promise((r) => setTimeout(r, 3000));
      opStatus = await ai.operations.getVideosOperation({
        operation: opStatus,
      });
    }

    const videoBase64 =
      opStatus.response?.generatedVideos?.[0]?.video?.videoBytes;
    if (!videoBase64) {
      throw new Error("No video bytes returned from Veo");
    }

    const buffer = Buffer.from(videoBase64, "base64");

    const stream = cloudinary.uploader.upload_stream(
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
      async (err, result) => {
        if (err) throw err;

        const cloudinary_url = result?.secure_url;
        const thumbnail_url = result?.eager?.[0]?.secure_url;

        await redis.set(
          `video_job:${jobId}`,
          JSON.stringify({
            status: "completed",
            userId,
            videoUrl: cloudinary_url,
            thumbnail_url,
          }),
          "EX",
          60 * 60,
        );
      },
    );

    stream.end(buffer);
  } catch (err) {
    console.error("Veo generation failed:", err);

    await redis.set(
      `video_job:${jobId}`,
      JSON.stringify({ status: "failed" }),
      "EX",
      60 * 10,
    );
  }
}
