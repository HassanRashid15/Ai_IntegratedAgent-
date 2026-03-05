import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from "@/lib/supabaseServer";
import { getSharedReport } from "@/lib/memoryStore";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const shareId = params.id;
  if (!shareId) {
    return NextResponse.json({ error: "Missing shareId" }, { status: 400 });
  }

  try {
    const sb = getServerSupabase();
    if (sb) {
      const { data, error } = await sb.rpc("public_get_report_by_share", { share: shareId });
      if (!error && data && data[0]) {
        return NextResponse.json({ item: data[0] });
      }
    }

    const mem = getSharedReport(shareId);
    if (mem) {
      return NextResponse.json({
        item: {
          type: mem.type,
          title: mem.title,
          output_json: mem.output,
          created_at: new Date().toISOString()
        }
      });
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error)?.message || "Server error" }, { status: 500 });
  }
}
