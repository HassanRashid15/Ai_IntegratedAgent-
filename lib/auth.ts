import { getServerSupabase } from "./supabaseServer";

export interface User {
  id: string;
  email: string | null;
  is_pro?: boolean;
  isDemo: boolean;
}

export async function getUserFromRequest(req: any): Promise<User | null> {
  // We accept either:
  // 1) Authorization: Bearer <access_token> (Supabase)
  // 2) x-demo-user: any string (demo mode)
  const demo = req.headers["x-demo-user"] || req.headers.get?.("x-demo-user");
  
  if (demo) {
    return { id: `demo:${demo}`, email: null, isDemo: true };
  }

  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;

  const sb = getServerSupabase();
  if (!sb) return null;

  const { data, error } = await sb.auth.getUser(token);
  if (error || !data?.user) return null;

  // Ensure profile exists
  const user = data.user;
  await sb.from("profiles").upsert({ 
    id: user.id, 
    email: user.email,
    first_name: user.user_metadata?.first_name || '',
    last_name: user.user_metadata?.last_name || ''
  });

  const { data: prof } = await sb.from("profiles").select("is_pro").eq("id", user.id).maybeSingle();
  return { id: user.id, email: user.email || null, is_pro: !!prof?.is_pro, isDemo: false };
}
