import { initTRPC } from "@trpc/server";
import { Context } from "../app/api/trpc/[trpc]/route";
import { rateLimitMiddleware } from "./middlewares/rate_limit_middleware";

const t = initTRPC.context<Context>().create();

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure.use(
  rateLimitMiddleware({ limit: 10, window: 60 }),
);
