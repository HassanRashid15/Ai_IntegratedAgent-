import { NextRequest, NextResponse } from 'next/server';
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getServerSupabase } from "@/lib/supabaseServer";
import { getUserFromRequest } from "@/lib/auth";
import { monthlyMortgagePayment, round2, runPropertyAI } from "@/lib/agents";
import { saveSharedReport, saveUserReport } from "@/lib/memoryStore";
import { ensureAndConsumeCredit } from "@/lib/credits";

const schema = z.object({
  price: z.number().positive(),
  deposit: z.number().nonnegative(),
  termYears: z.number().int().positive(),
  ratePercent: z.number().positive(),
  rentMonthly: z.number().nonnegative(),
  costsMonthly: z.object({
    serviceCharge: z.number().nonnegative().default(0),
    insurance: z.number().nonnegative().default(0),
    maintenance: z.number().nonnegative().default(0),
    other: z.number().nonnegative().default(0)
  }).default({ serviceCharge: 0, insurance: 0, maintenance: 0, other: 0 }),
  notes: z.string().optional().default(""),
  title: z.string().optional().default("Property report")
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const input = parsed.data;

    const loan = Math.max(0, input.price - input.deposit);
    const mortgage = monthlyMortgagePayment(loan, input.ratePercent, input.termYears);

    const costsMonthly =
      (input.costsMonthly?.serviceCharge || 0) +
      (input.costsMonthly?.insurance || 0) +
      (input.costsMonthly?.maintenance || 0) +
      (input.costsMonthly?.other || 0);

    const cashflow = input.rentMonthly - mortgage - costsMonthly;
    const grossYield = input.price > 0 ? (input.rentMonthly * 12) / input.price : 0;
    const netYield = input.price > 0 ? ((input.rentMonthly - costsMonthly) * 12) / input.price : 0;

    const stressRate = input.ratePercent + 2;
    const mortgageStress = monthlyMortgagePayment(loan, stressRate, input.termYears);
    const cashflowStress = input.rentMonthly - mortgageStress - costsMonthly;

    let score = 50;
    if (cashflow > 0) score += 20;
    if (cashflowStress > 0) score += 15;
    if (grossYield >= 0.06) score += 10;
    if (grossYield < 0.04) score -= 15;
    score = Math.max(0, Math.min(100, score));

    const results = {
      loan: round2(loan),
      mortgageMonthly: round2(mortgage),
      costsMonthly: round2(costsMonthly),
      rentMonthly: round2(input.rentMonthly),
      cashflowMonthly: round2(cashflow),
      grossYieldPercent: round2(grossYield * 100),
      netYieldPercent: round2(netYield * 100),
      stressTest: {
        stressRatePercent: round2(stressRate),
        mortgageMonthly: round2(mortgageStress),
        cashflowMonthly: round2(cashflowStress)
      },
      score
    };

    const user = await getUserFromRequest(request);
    const billing = await ensureAndConsumeCredit({ user, units: 1 });
    if (!billing.ok) {
      return NextResponse.json({ error: billing.reason }, { status: 402 });
    }

    const explanation = await runPropertyAI({ input, results });
    const output = { input, results, explanation };

    const shareId = uuidv4();

    const sb = getServerSupabase();
    if (user?.isDemo) {
      saveSharedReport(shareId, { type: "property", title: input.title, output });
      saveUserReport(user.id, { id: uuidv4(), type: "property", title: input.title, shareId, createdAt: new Date().toISOString() });
    } else if (user && sb) {
      const { error } = await sb.from("reports").insert({
        user_id: user.id,
        type: "property",
        title: input.title,
        input_json: input,
        output_json: output,
        share_id: shareId
      });
      if (error) console.warn("Save failed:", error.message);
    } else {
      saveSharedReport(shareId, { type: "property", title: input.title, output });
    }

    return NextResponse.json({ output, shareId });
  } catch (e) {
    return NextResponse.json({ error: (e as Error)?.message || "Server error" }, { status: 500 });
  }
}
