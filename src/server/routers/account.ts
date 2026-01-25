import cloudinary from "@/src/services/cloudinary_video_storage";
import { privateProcedure, router } from "../trpc";
import type { ResourceApiResponse } from "cloudinary";
import { z } from "zod";

type CloudinaryVideoResource = ResourceApiResponse["resources"][number];

export const accountRouter = router({
  getAllVideosOfCurrentUser: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.user!.id;

    const result = await cloudinary.api.resources({
      resource_type: "video",
      type: "upload",
      prefix: `videos-${userId}`,
      max_results: 100,
    });

    return result.resources.map((video: CloudinaryVideoResource) => ({
      publicId: video.public_id,
      url: video.secure_url,
      thumbnail:
        video.thumbnail ??
        cloudinary.url(video.public_id, {
          resource_type: "video",
          format: "jpg",
          width: 300,
          height: 600,
          crop: "fill",
          start_offset: "2",
        }),
      duration: video.duration,
      bytes: video.bytes,
      createdAt: video.created_at,
    }));
  }),

  updateVideoTitle: privateProcedure
    .input(
      z.object({
        publicId: z.string(),
        newTitle: z.string().min(1).max(100),
      }),
    )
    .mutation(async ({ input }) => {
      const { publicId, newTitle } = input;

      await cloudinary.uploader.explicit(publicId, {
        resource_type: "video",
        type: "upload",
        context: { title: newTitle },
      });

      return { success: true, publicId, newTitle };
    }),
});
