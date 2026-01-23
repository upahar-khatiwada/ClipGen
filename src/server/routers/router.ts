import { router, publicProcedure } from "../trpc";
import { authRouter } from "./auth";
import { templatesRouter } from "./templates";
import { upgradeRouer } from "./upgrade";
import { userRouter } from "./user";

export const appRouter = router({
  hello: publicProcedure.query(() => ({ greeting: "Hello tRPC" })),

  auth: authRouter,

  templates: templatesRouter,

  upgrade: upgradeRouer,

  user: userRouter,
});

export type AppRouter = typeof appRouter;
