import { NextRequest, NextResponse } from 'next/server';
import Stripe from "stripe";
import { getServerSupabase } from "@/lib/supabaseServer";

async function buffer(readable: ReadableStream<Uint8Array>): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = readable.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

function startOfNextMonthUTC(now: Date = new Date()): string {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  return new Date(Date.UTC(y, m + 1, 1, 0, 0, 0)).toISOString();
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const proPerMonth = Number(process.env.PRO_CREDITS_PER_MONTH || 500);

  if (!secret || !whSecret) {
    return new NextResponse("Stripe not configured", { status: 400 });
  }

  const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });

  let event: Stripe.Event;
  try {
    const buf = await buffer(request.body!);
    const sig = request.headers.get("stripe-signature");
    if (!sig) {
      return new NextResponse("Missing stripe-signature header", { status: 400 });
    }
    event = stripe.webhooks.constructEvent(buf, sig, whSecret);
  } catch (err) {
    return new NextResponse(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  const sb = getServerSupabase();
  if (!sb) {
    return NextResponse.json({ received: true, note: "Supabase not configured" });
  }

  try {
    // We unlock PRO on checkout.session.completed and invoice.paid
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session?.metadata?.user_id || session?.client_reference_id;
      if (userId) {
        await sb.from("profiles").update({
          is_pro: true,
          credits_remaining: proPerMonth,
          credits_reset_at: startOfNextMonthUTC(new Date())
        }).eq("id", userId);
      }
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      const userId = invoice?.lines?.data?.[0]?.metadata?.user_id || invoice?.metadata?.user_id;
      // Some Stripe setups won't include metadata here; checkout event already handles unlock.
      if (userId) {
        await sb.from("profiles").update({
          is_pro: true,
          credits_remaining: proPerMonth,
          credits_reset_at: startOfNextMonthUTC(new Date())
        }).eq("id", userId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    return new NextResponse(`Webhook handler failed: ${(e as Error).message}`, { status: 500 });
  }
}
