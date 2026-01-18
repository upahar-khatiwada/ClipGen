import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/src/server/routers/router";
import { NextRequest } from "next/server";
import prisma from "@/src/lib/prisma";
import { redis } from "@/src/server/redis";

const createContext = (opts: { req: Request }) => {
  return {
    req: opts.req,
    prisma,
    redis,
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
