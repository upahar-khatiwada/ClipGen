import { TRPCError } from "@trpc/server";
import { middleware } from "@/src/server/trpc";
import { verifyAccessToken } from "@/src/utils/token_generators";

export const protectedRouteMiddleware = middleware(async ({ ctx, next }) => {
  const cookie = ctx.req.headers.get("cookie") ?? "";
  const accessToken = cookie
    .split(";")
    .find((c) => c.trim().startsWith("accessToken="))
    ?.split("=")[1];

  if (!accessToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "No access token",
    });
  }

  const payload = verifyAccessToken(accessToken);

  if (!payload) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired access token",
    });
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
