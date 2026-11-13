import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/app/(auth)/auth";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-10-28.endive",
    })
  : null;

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.VERCEL_URL ||
  "http://localhost:3000";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Add STRIPE_SECRET_KEY to enable payment checkout.",
      },
      { status: 400 }
    );
  }

  const body = (await request.json()) as { plan?: string };
  const plan = body.plan ?? "prime";

  const planConfig: Record<string, { amount: number; name: string }> = {
    prime: {
      amount: 1900,
      name: "Nexa Prime",
    },
  };

  const selectedPlan = planConfig[plan] ?? planConfig.prime;

  const checkoutSession = await stripe.checkout.sessions.create({
    allow_promotion_codes: true,
    customer_email: session.user.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            description: "Unlimited personal AI chats, priority access, and premium workflows.",
            name: selectedPlan.name,
          },
          recurring: { interval: "month" },
          unit_amount: selectedPlan.amount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      plan,
      userId: session.user.id,
    },
    mode: "subscription",
    success_url: `${baseUrl}/upgrade?checkout=success`,
    cancel_url: `${baseUrl}/upgrade?checkout=cancelled`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
