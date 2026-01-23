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
    console.error("⚠️ Webhook signature verification failed.", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✅ Checkout completed:", session.id);
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log("🔁 Subscription invoice paid:", invoice.id);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("❌ Subscription cancelled:", subscription.id);
      break;
    }

    case "payment_intent.succeeded":
    case "payment_intent.created":
    case "charge.succeeded":
    case "charge.updated":
      break;

    default:
      console.log(`⚠️ Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
