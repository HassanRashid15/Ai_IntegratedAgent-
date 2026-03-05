import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabaseServer";
import { listUserReports } from "@/lib/memoryStore";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    if (user.isDemo) {
      return NextResponse.json({ items: listUserReports(user.id) });
    }

    const sb = getServerSupabase();
    if (!sb) return NextResponse.json({ items: [] });

    const { data, error } = await sb
      .from("reports")
      .select("id,type,title,share_id,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) return NextResponse.json({ items: [] });

    const items = (data || []).map(r => ({
      id: r.id, type: r.type, title: r.title, shareId: r.share_id, createdAt: r.created_at
    }));

    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json({ error: (e as Error)?.message || "Server error" }, { status: 500 });
  }
}
