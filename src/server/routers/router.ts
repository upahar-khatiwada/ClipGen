import { router, publicProcedure } from "../trpc";
import { authRouter } from "./auth";
import { templatesRouter } from "./templates";
import { upgradeRouer } from "./upgrade";

export const appRouter = router({
  hello: publicProcedure.query(() => ({ greeting: "Hello tRPC" })),

  auth: authRouter,

  templates: templatesRouter,

  upgrade: upgradeRouer,
});

export type AppRouter = typeof appRouter;
