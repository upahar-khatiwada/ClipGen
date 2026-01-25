import { Prisma } from "@/src/generated/prisma/client";
import prisma from "@/src/lib/prisma";
import { stripe } from "@/src/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 },
    );
  }

  console.log("Stripe webhook event received:", event.type);

  const eventObject = event.data.object as
    | Stripe.Checkout.Session
    | Stripe.Invoice;

  const userId = eventObject.metadata?.userId;
  const creditPackId = eventObject.metadata?.creditPackId; // only for checkout session
  const planId = eventObject.metadata?.planId; // only for subscription
  const credits = Number(eventObject.metadata?.credits || 0);

  console.log(
    `The metadatas here:\n  userId: ${userId} \n creditPackId: ${creditPackId} \n planId: ${planId} \n credits: ${credits}`,
  );

  if (!userId) {
    console.error("Missing userId in metadata!", {
      metadata: eventObject.metadata,
    });
    return NextResponse.redirect(
      new URL(`${process.env.DOMAIN}/upgrade/failure`),
      req,
    );
  }

  try {
    if (creditPackId) {
      const sessionId = event.data.object as Stripe.Checkout.Session;

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: userId },
          data: { credits: { increment: credits } },
        });

        await tx.creditTransaction.create({
          data: {
            userId: userId,
            amount: credits,
            type: "PURCHASE",
            reason: `Purchased credit pack ${creditPackId}`,
            stripeSessionId: sessionId.id,
          },
        });
      });

      console.log(
        `User ${userId} purchased credit pack ${creditPackId} (${credits} credits)`,
      );
    } else if (planId) {
      // this is for subscription
      const invoice = event.data.object as Stripe.Invoice;

      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId },
      });

      const subscriptionId = invoice.id;
      if (!subscriptionId) {
        console.error("Missing Stripe subscription ID on invoice!");
      }

      await prisma.$transaction(async (tx) => {
        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: { credits: { increment: plan?.creditsPerPeriod ?? 0 } },
        });

        await tx.creditTransaction.create({
          data: {
            userId,
            amount: plan?.creditsPerPeriod ?? 0,
            type: "SUBSCRIPTION",
            reason: `Subscription payment for ${plan?.name}`,
            stripeInvoiceId: invoice.id,
          },
        });

        await tx.userSubscription.upsert({
          where: { userId },
          update: {
            status: "ACTIVE",
            currentPeriodStart: new Date((invoice.period_start ?? 0) * 1000),
            currentPeriodEnd: new Date((invoice.period_end ?? 0) * 1000),
            stripeSubscriptionId: subscriptionId,
          },
          create: {
            userId,
            subscriptionPlanId: planId,
            stripeSubscriptionId: subscriptionId,
            status: "ACTIVE",
            currentPeriodStart: new Date((invoice.period_start ?? 0) * 1000),
            currentPeriodEnd: new Date((invoice.period_end ?? 0) * 1000),
          },
        });

        console.log(
          `Subscription processed successfully:
         userId: ${userId}
         planId: ${planId} (${plan?.name})
         credits added: ${plan?.creditsPerPeriod}
         stripeInvoiceId: ${invoice.id}
         Updated user: ${updatedUser.email}
      `,
        );
      });
    }
  } catch (err) {
    console.error("Transaction failed:", err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Known Prisma error:", err.code, err.message);
      return NextResponse.redirect(`${process.env.DOMAIN}/upgrade/failure`);
    }
  }

  return NextResponse.json({ received: true });
}
