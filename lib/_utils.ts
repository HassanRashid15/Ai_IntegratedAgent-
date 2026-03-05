import type { NextApiResponse } from 'next';

export function badRequest(res: NextApiResponse, message: string, details?: any) {
  return res.status(400).json({ error: message, details });
}

export function serverError(res: NextApiResponse, e?: any) {
  return res.status(500).json({ error: e?.message || "Server error" });
}
