import { NextRequest, NextResponse } from 'next/server';
import { createSimplePdf } from "@/lib/pdf";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, output } = body || {};
    if (!output?.results) {
      return NextResponse.json({ error: "Missing output.results" }, { status: 400 });
    }

    const pdf = await createSimplePdf({
      title: title || "Property Report",
      sections: [
        { heading: "Results", body: [JSON.stringify(output.results, null, 2)] },
        { heading: "AI Explanation", body: [JSON.stringify(output.explanation, null, 2)] }
      ]
    });

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=property-report.pdf'
      }
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error)?.message || "Server error" }, { status: 500 });
  }
}
