import { TRPCError } from "@trpc/server";
import { middleware } from "@/src/server/trpc";

export const protectedRouteMiddleware = middleware(async ({ ctx, next }) => {
  const cookie = ctx.req.headers.get("cookie") ?? "";
  const refreshToken = cookie
    .split(";")
    .find((c) => c.trim().startsWith("refreshToken="))
    ?.split("=")[1];

  if (!refreshToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "No refresh token",
    });
  }

  const session = await ctx.redis.get(`refresh_token:${refreshToken}`);

  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid session" });
  }

  const user = JSON.parse(session);

  return next({
    ctx: {
      user,
    },
  });
});
