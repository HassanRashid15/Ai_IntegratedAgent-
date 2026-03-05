'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { Shield, Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const sb = getBrowserSupabase();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [demoKey, setDemoKey] = useState<string | null>(null);

  useEffect(() => {
    // Check for demo mode first
    const dk = localStorage.getItem("demo_user");
    setDemoKey(dk);

    async function checkAuth() {
      if (!sb) {
        // Allow access in demo mode even without Supabase
        if (demoKey) {
          setLoading(false);
          return;
        }
        setLoading(false);
        return;
      }

      const { data: { user: authUser } } = await sb.auth.getUser();
      
      if (!authUser && !demoKey) {
        router.push('/auth-required');
        return;
      }

      setUser(authUser);
      setLoading(false);
    }

    checkAuth();
  }, [sb, router, demoKey]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-slate-900 dark:to-purple-950/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground mt-4">Verifying authentication...</p>
        </motion.div>
      </div>
    );
  }

  if (!user && !demoKey) {
    return fallback || null;
  }

  return <>{children}</>;
}
