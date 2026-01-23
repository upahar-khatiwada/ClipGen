import { TRPCError } from "@trpc/server";
import { middleware } from "@/src/server/trpc";
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/src/utils/token_generators";
import { cookies } from "next/headers";

export const protectedRouteMiddleware = middleware(async ({ ctx, next }) => {
  const cookie = ctx.req.headers.get("cookie") ?? "";
  let accessToken = cookie
    .split(";")
    .find((c) => c.trim().startsWith("accessToken="))
    ?.split("=")[1];

  const refreshToken = cookie
    .split(";")
    .find((c) => c.trim().startsWith("refreshToken="))
    ?.split("=")[1];

  if (!refreshToken) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "No refresh token" });
  }

  let payload = accessToken ? verifyAccessToken(accessToken) : null;

  if (!payload) {
    try {
      const refreshPayload = verifyRefreshToken(refreshToken);

      if (!refreshPayload) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid refresh token",
        });
      }

      const session = await ctx.redis.get(`refresh_token:${refreshToken}`);

      if (!session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Refresh token revoked or expired",
        });
      }

      const userId = refreshPayload.userId;
      accessToken = createAccessToken(userId);
      const newRefreshToken = createRefreshToken(userId);

      await ctx.redis
        .multi()
        .del(`refresh_token:${refreshToken}`)
        .set(`refresh_token:${newRefreshToken}`, JSON.stringify({ userId }))
        .exec();

      const cookieStore = await cookies();

      cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        path: "/",
        maxAge: 15 * 60,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
      });

      cookieStore.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
      });

      payload = verifyAccessToken(accessToken);

      if (!payload) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    } catch (err) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `Token expired and refresh failed: ${err}`,
      });
    }
  }

  const user = await ctx.prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, name: true, email: true },
  });

  if (!user)
    throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" });

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
