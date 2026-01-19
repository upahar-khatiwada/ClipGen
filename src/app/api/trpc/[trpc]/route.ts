import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/src/server/routers/router";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { redis } from "@/src/server/redis";
import { TRPCError } from "@trpc/server";

const statusMap: Record<string, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_SUPPORTED: 405,
  TIMEOUT: 408,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  TOO_MANY_REQUESTS: 429,
};

const createContext = (opts: { req: Request }) => {
  return {
    req: opts.req,
    prisma,
    redis,
  };
};

const handler = (req: NextRequest) => {
  try {
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext,
    });
  } catch (err: unknown) {
    if (err instanceof TRPCError) {
      const status = statusMap[err.code] ?? 500;

      return NextResponse.json(
        { error: err.message, code: err.code },
        { status },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

export type Context = Awaited<ReturnType<typeof createContext>>;
export { handler as GET, handler as POST };
