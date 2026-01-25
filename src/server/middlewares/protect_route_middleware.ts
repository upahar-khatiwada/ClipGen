import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "@/src/app/api/trpc/[trpc]/route";
// import { verifyAccessToken } from "@/src/utils/token_generators";

const t = initTRPC.context<Context>().create();

export const protectedRouteMiddleware = t.middleware(async ({ ctx, next }) => {
  const cookieHeader = ctx.req.headers.get("cookie") ?? "";

  const accessToken = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("accessToken="))
    ?.split("=")[1];

  if (!accessToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "No access token",
    });
  }

  // let payload;
  // try {
  //   payload = verifyAccessToken(accessToken);
  // } catch (err) {
  //   throw new TRPCError({
  //     code: "UNAUTHORIZED",
  //     message: `Invalid or expired token`,
  //   });
  // }

  return next();
});
