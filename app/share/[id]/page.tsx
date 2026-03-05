'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SharedItem {
  type: string;
  title: string;
  output_json: any;
  created_at: string;
}

export default function SharePage() {
  const params = useParams();
  const shareId = params.id as string;
  const [item, setItem] = useState<SharedItem | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!shareId) return;
    async function load() {
      setErr("");
      try {
        const res = await fetch(`/api/share/${shareId}`);
        const json = await res.json();
        if (!res.ok) setErr(json?.error || "Not found");
        else setItem(json.item);
      } catch (error) {
        setErr("Failed to load report");
      }
    }
    load();
  }, [shareId]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-extrabold">Shared Report</h1>
      {err ? <p className="text-gray-500 text-xs" style={{ color: "crimson" }}>{err}</p> : null}
      {!item ? <p className="text-gray-500 text-xs">Loading…</p> : (
        <div className="border border-gray-200 rounded-2xl p-4 bg-white grid gap-3" style={{ marginTop: 16 }}>
          <div className="flex gap-2.5 flex-wrap items-center">
            <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs border border-gray-200 bg-gray-50">{item.type}</span>
            <b>{item.title}</b>
            <span className="text-gray-500 text-xs">{item.created_at}</span>
          </div>
          <div className="border border-gray-200 rounded-2xl p-4" style={{ background:"#f9fafb" }}>
            <pre className="whitespace-pre-wrap text-xs leading-relaxed">{JSON.stringify(item.output_json, null, 2)}</pre>
          </div>
        </div>
      )}
    </main>
  );
}
