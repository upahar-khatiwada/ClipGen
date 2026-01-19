import { TRPCError } from "@trpc/server";
import { rateLimiter } from "@/src/utils/rate_limiter";
import { middleware } from "@/src/server/trpc";

export const rateLimitMiddleware = (opts?: {
  limit?: number;
  window?: number;
}) =>
  middleware(async ({ ctx, next }) => {
    const limit = opts?.limit ?? 10;
    const window = opts?.window ?? 60;

    const ip =
      ctx.req.headers.get("x-forwarded-for") ??
      ctx.req.headers.get("x-real-ip") ??
      "anonymous";

    const result = await rateLimiter({
      key: `ratelimit:ip:${ip}`,
      limit,
      window,
    });

    if (!result.success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
      });
    }

    return next();
  });
