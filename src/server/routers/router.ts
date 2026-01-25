import { router, publicProcedure } from "../trpc";
import { accountRouter } from "./account";
import { authRouter } from "./auth";
import { generateVideoRouter } from "./generate_video";
import { templatesRouter } from "./templates";
import { upgradeRouer } from "./upgrade";

export const appRouter = router({
  hello: publicProcedure.query(() => ({ greeting: "Hello tRPC" })),

  auth: authRouter,

  templates: templatesRouter,

  upgrade: upgradeRouer,

  generateVideo: generateVideoRouter,

  account: accountRouter,
});

export type AppRouter = typeof appRouter;
