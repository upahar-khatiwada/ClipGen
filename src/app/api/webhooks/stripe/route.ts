import { Prisma } from "@/src/generated/prisma/client";
import prisma from "@/src/lib/prisma";
import { stripe } from "@/src/lib/stripe";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
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

  const relevantEvents = [
    "checkout.session.completed",
    "invoice.payment_succeeded",
  ];

  if (!relevantEvents.includes(event.type)) {
    console.log(`Ignoring Stripe event: ${event.type}`);
    return NextResponse.json({ received: true });
  }

  const eventObject = event.data.object as
    | Stripe.Checkout.Session
    | Stripe.Invoice;

  const userId = eventObject.metadata?.userId;
  const creditPackId = eventObject.metadata?.creditPackId; // only for checkout session
  const planId = eventObject.metadata?.planId; // only for subscription
  const credits = Number(eventObject.metadata?.credits || 0);

  // console.log(
  //   `The metadatas here:\n  userId: ${userId} \n creditPackId: ${creditPackId} \n planId: ${planId} \n credits: ${credits}`,
  // );

  if (!userId) {
    console.error("Missing userId in metadata!", {
      metadata: eventObject.metadata,
    });
    return NextResponse.json({ received: true });
  }

  try {
    if (creditPackId) {
      const sessionId = (event.data.object as Stripe.Checkout.Session).id;

      const existing = await prisma.creditTransaction.findUnique({
        where: { stripeSessionId: sessionId },
      });

      if (existing) {
        console.log(`Duplicate checkout session ${sessionId}, skipping.`);
        return NextResponse.json({ received: true });
      }

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
            stripeSessionId: sessionId,
          },
        });
      });

      console.log(
        `User ${userId} purchased credit pack ${creditPackId} (${credits} credits)`,
      );

      return NextResponse.json({ received: true });
    } else if (planId) {
      // this is for subscription
      const invoice = event.data.object as Stripe.Invoice;

      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId },
      });

      const subscriptionId = invoice.id;
      if (!subscriptionId) {
        console.error("Missing Stripe subscription ID on invoice!");
        return NextResponse.json({ received: true });
      }

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
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

        const periodStart = new Date(Date.now());
        let periodEnd: Date;

        if (plan?.interval === "MONTHLY") {
          periodEnd = new Date(
            periodStart.getTime() + 30 * 24 * 60 * 60 * 1000,
          );
        } else {
          periodEnd = new Date(
            periodStart.getTime() + 365 * 24 * 60 * 60 * 1000,
          );
        }

        await tx.userSubscription.upsert({
          where: { userId },
          update: {
            status: "ACTIVE",
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            stripeSubscriptionId: subscriptionId,
          },
          create: {
            userId,
            subscriptionPlanId: planId,
            stripeSubscriptionId: subscriptionId,
            status: "ACTIVE",
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
          },
        });

        return NextResponse.json({ received: true });

        //   console.log(
        //     `Subscription processed successfully:
        //    userId: ${userId}
        //    planId: ${planId} (${plan?.name})
        //    credits added: ${plan?.creditsPerPeriod}
        //    stripeInvoiceId: ${invoice.id}
        // `,
        //   );
      });
    }
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
      console.error("Duplicate webhook detected, skipping transaction");
    }
    console.error("Transaction failed:", err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Known Prisma error:", err.code, err.message);
      return NextResponse.redirect(`${process.env.DOMAIN}/upgrade/failure`);
    }
  }

  return NextResponse.json({ received: true });
}
