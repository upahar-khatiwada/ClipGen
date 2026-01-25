import { TRPCError } from "@trpc/server";
import { privateProcedure, router } from "../trpc";
import { z } from "zod";
import { generateAiShort } from "@/src/controllers/generate_ai_short";

export const generateVideoRouter = router({
  generateShortFromPrompt: privateProcedure
    .input(z.object({ prompt: z.string().min(1).max(500) }))
    .mutation(async ({ ctx, input }) => {
      const { prompt } = input;
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const jobId = `job_${crypto.randomUUID()}`;

      await ctx.redis.set(
        `video_job:${jobId}`,
        JSON.stringify({
          status: "processing",
          userId,
        }),
        "EX",
        60 * 10,
      );

      generateAiShort({
        jobId,
        prompt,
        userId,
      });

      return { jobId };
    }),

  getJobStatus: privateProcedure
    .input(z.object({ jobId: z.string() }))
    .query(async ({ ctx, input }) => {
      const job = await ctx.redis.get(`video_job:${input.jobId}`);

      if (!job) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The job id not found in redis",
        });
      }

      const parsed = JSON.parse(job);

      return {
        status: parsed.status as "processing" | "completed" | "failed",
        videoUrl: parsed.videoUrl as string | undefined,
      };
    }),
});
