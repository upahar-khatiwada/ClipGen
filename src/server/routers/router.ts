import { router, publicProcedure } from "../trpc";
import { authRouter } from "./auth";
import { generateVideoRouter } from "./generate_video";
import { templatesRouter } from "./templates";
import { upgradeRouer } from "./upgrade";
import { userRouter } from "./user";

export const appRouter = router({
  hello: publicProcedure.query(() => ({ greeting: "Hello tRPC" })),

  auth: authRouter,

  templates: templatesRouter,

  upgrade: upgradeRouer,

  user: userRouter,

  generateVideo: generateVideoRouter,
});

export type AppRouter = typeof appRouter;
