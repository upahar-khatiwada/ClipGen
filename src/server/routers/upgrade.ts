import { TRPCError } from "@trpc/server";
import { router, privateProcedure } from "../trpc";
import { z } from "zod";
import { stripe } from "@/src/lib/stripe";

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
      orderBy: {
        priceUsd: "asc",
      },
    });
  }),

  createCreditCheckout: privateProcedure
    .input(
      z.object({
        credits: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const creditPack = await ctx.prisma.creditPack.findFirst({
        where: { credits: input.credits, active: true },
      });

      if (!creditPack) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The selected credits not found",
        });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price: creditPack.stripePriceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.DOMAIN}/upgrade/success`,
        cancel_url: `${process.env.DOMAIN}/upgrade/failure`,
      });

      return { url: session.url };
    }),

  createSubscriptionCheckout: privateProcedure
    .input(
      z.object({
        planId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const plan = await ctx.prisma.subscriptionPlan.findFirst({
        where: { id: input.planId },
      });

      if (!plan) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price: plan.stripePriceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.DOMAIN}/upgrade/success`,
        cancel_url: `${process.env.DOMAIN}/upgrade/failure`,
      });

      return { url: session.url };
    }),
});
