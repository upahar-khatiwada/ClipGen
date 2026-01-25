import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/src/server/routers/router";
import { NextRequest } from "next/server";
import prisma from "@/src/lib/prisma";
import { redis } from "@/src/server/redis";
import { verifyAccessToken } from "@/src/utils/token_generators";

const createContext = async (opts: { req: Request }) => {
  const cookie = opts.req.headers.get("cookie") ?? "";

  const accessToken = cookie
    .split(";")
    .find((c) => c.trim().startsWith("accessToken="))
    ?.split("=")[1];

  // console.log("Access Token: ", accessToken);

  let user = null;

  if (accessToken) {
    const payload = verifyAccessToken(accessToken);
    // console.log(payload);
    if (payload) {
      user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    }
  }

  // console.log("In create context, user: ", user);

  return {
    req: opts.req,
    prisma,
    redis,
    user,
  };
};

const handler = (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  });
};

export type Context = Awaited<ReturnType<typeof createContext>>;
export { handler as GET, handler as POST };
