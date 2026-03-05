import { NextRequest, NextResponse } from 'next/server';
import { z } from "zod";
import { badRequest, serverError } from "@/lib/_utils";
import { v4 as uuidv4 } from "uuid";
import { getServerSupabase } from "@/lib/supabaseServer";
import { getUserFromRequest } from "@/lib/auth";
import { calculateAbsences, generateImmigrationChecklist, draftCoverLetter, runImmigrationAI } from "@/lib/agents";
import { saveSharedReport, saveUserReport } from "@/lib/memoryStore";
import { ensureAndConsumeCredit } from "@/lib/credits";

const schema = z.object({
  route: z.string().min(2),
  applicantName: z.string().min(1),
  partnerName: z.string().optional().default(""),
  answers: z.record(z.any()).default({}),
  trips: z.array(z.object({ from: z.string().min(4), to: z.string().min(4) })).optional().default([]),
  title: z.string().optional().default("Immigration report")
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const input = parsed.data;
    const absenceSummary = calculateAbsences(input.trips);
    const { checklist, warnings } = generateImmigrationChecklist(input.route, input.answers);
    const baseLetter = draftCoverLetter({ ...input, checklist, warnings, absenceSummary });

    const user = await getUserFromRequest(request);
    const billing = await ensureAndConsumeCredit({ user, units: 1 });
    if (!billing.ok) {
      return NextResponse.json({ error: billing.reason }, { status: 402 });
    }

    const ai = await runImmigrationAI({ input, baseLetter, checklist, warnings, absenceSummary });

    const output = {
      route: input.route,
      applicantName: input.applicantName,
      partnerName: input.partnerName,
      absenceSummary,
      checklist,
      warnings,
      coverLetter: ai.coverLetter || baseLetter,
      summary: ai.summary || { route: input.route, topRisks: warnings, nextSteps: ["Review checklist and fill any gaps."] }
    };

    // Saving (optional)
    const shareId = uuidv4();

    const sb = getServerSupabase();
    if (user?.isDemo) {
      saveSharedReport(shareId, { type: "immigration", title: input.title, output });
      saveUserReport(user.id, { id: uuidv4(), type: "immigration", title: input.title, shareId, createdAt: new Date().toISOString() });
    } else if (user && sb) {
      const { data: row, error } = await sb.from("reports").insert({
        user_id: user.id,
        type: "immigration",
        title: input.title,
        input_json: input,
        output_json: output,
        share_id: shareId
      }).select("id").single();
      if (error) console.warn("Save failed:", error.message);
    } else {
      // no user / no supabase: still allow sharing via memory (best-effort)
      saveSharedReport(shareId, { type: "immigration", title: input.title, output });
    }

    return NextResponse.json({ output, shareId });
  } catch (e) {
    return NextResponse.json({ error: (e as Error)?.message || "Server error" }, { status: 500 });
  }
}
