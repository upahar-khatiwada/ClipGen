import { privateProcedure, router } from "../trpc";

export const userRouter = router({
  getUserCredits: privateProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: { id: ctx.user?.id },
      select: {
        credits: true,
      },
    });
  }),
});
