import { initTRPC } from "@trpc/server";
import { Context } from "../app/api/trpc/[trpc]/route";
import { rateLimitMiddleware } from "./middlewares/rate_limit_middleware";
// import { protectedRouteMiddleware } from "./middlewares/protect_route_middleware";

const t = initTRPC.context<Context>().create();

const limit = process.env.NODE_ENV === "development" ? 100 : 10;

export const middleware = t.middleware;
export const router = t.router;

// public route with rate limit
export const publicProcedure = t.procedure.use(
  rateLimitMiddleware({ limit: limit, window: 60 }),
);

// protected route for private pages
export const privateProcedure = t.procedure.use(
  rateLimitMiddleware({ limit: limit, window: 60 }),
);
// .use(protectedRouteMiddleware);
