import { NextRequest, NextResponse } from 'next/server';
import Stripe from "stripe";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    if (!key || !priceId) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
    }

    const user = await getUserFromRequest(request);
    if (!user || user.isDemo) {
      return NextResponse.json({ error: "Login required to upgrade (Supabase)" }, { status: 400 });
    }

    const stripe = new Stripe(key, { apiVersion: "2024-06-20" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: user.id,
      metadata: { user_id: user.id, email: user.email || "" },
      success_url: `${baseUrl}/?paid=1`,
      cancel_url: `${baseUrl}/?paid=0`
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    return NextResponse.json({ error: (e as Error)?.message || "Server error" }, { status: 500 });
  }
}
