import { TRPCError } from "@trpc/server";
import { privateProcedure, router } from "../trpc";
import { z } from "zod";
import { generateAiShort } from "@/src/controllers/generate_ai_short";

export const generateVideoRouter = router({
  generateShortFromPrompt: privateProcedure
    .input(z.object({ prompt: z.string().min(100).max(500) }))
    .mutation(async ({ ctx, input }) => {
      const { prompt } = input;
      const userId = ctx.user?.id;

      const user = await ctx.prisma.user.update({
        where: {
          id: userId,
          credits: { gte: 10 },
        },
        data: {
          credits: { decrement: 10 },
        },
      });

      if (!user || !userId) {
        throw new TRPCError({
          code: "PAYMENT_REQUIRED",
          message: "You do not have enough credits",
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
