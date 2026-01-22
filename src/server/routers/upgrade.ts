import { router, privateProcedure } from "../trpc";

export const upgradeRouer = router({
  getCreditDetails: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.creditPack.findMany({
      where: { active: true },
      orderBy: { credits: "asc" },
    });
  }),

  getSubscriptionDetails: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.subscriptionPlan.findMany({
      where: { active: true },
    });
  }),
});
