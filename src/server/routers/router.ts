import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const appRouter = router({
  hello: publicProcedure.query(() => ({ greeting: "Hello tRPC" })),

  add: publicProcedure
    .input(z.object({ a: z.number(), b: z.number() }))
    .mutation(({ input }) => {
      return { result: input.a + input.b };
    }),

  echo: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(({ input }) => {
      return { echoed: input.message };
    }),

  randomNumber: publicProcedure.query(() => {
    return { value: Math.floor(Math.random() * 100) };
  }),
});


export type AppRouter = typeof appRouter;
