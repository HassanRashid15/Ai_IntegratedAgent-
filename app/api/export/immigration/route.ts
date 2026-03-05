import { NextRequest, NextResponse } from 'next/server';
import { createSimplePdf } from "@/lib/pdf";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, output } = body || {};
    if (!output?.coverLetter) {
      return NextResponse.json({ error: "Missing output.coverLetter" }, { status: 400 });
    }

    const pdf = await createSimplePdf({
      title: title || "Immigration Report",
      sections: [
        { heading: "Summary", body: [JSON.stringify(output.summary, null, 2)] },
        { heading: "Warnings", body: (output.warnings || []).length ? output.warnings : ["None"] },
        { heading: "Checklist", body: output.checklist || [] },
        { heading: "Absence Summary", body: [JSON.stringify(output.absenceSummary, null, 2)] },
        { heading: "Cover Letter", body: output.coverLetter }
      ]
    });

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=immigration-report.pdf'
      }
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error)?.message || "Server error" }, { status: 500 });
  }
}
