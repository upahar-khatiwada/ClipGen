import { router, publicProcedure } from "./trpc";

export const appRouter = router({
  hello: publicProcedure.query(() => ({ greeting: "Hello tRPC" })),
});

export type AppRouter = typeof appRouter;
