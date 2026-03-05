'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { Shield, Loader2, Lock, ArrowRight } from "lucide-react";

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
      // If demo mode is active, allow access regardless of Supabase
      if (dk) {
        setLoading(false);
        return;
      }

      if (!sb) {
        // No Supabase and no demo mode - show fallback instead of redirecting
        setLoading(false);
        return;
      }

      const { data: { user: authUser } } = await sb.auth.getUser();
      
      if (!authUser) {
        // No user and no demo mode - show fallback instead of redirecting
        setLoading(false);
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
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-slate-900 dark:to-purple-950/20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-sm border border-border/20 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-8">
              Please sign in or create an account to access this page
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <Shield className="w-4 h-4" />
                Sign In
              </button>
              <button
                onClick={() => {
                  const key = Math.random().toString(36).slice(2);
                  localStorage.setItem("demo_user", key);
                  window.location.reload();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                Try Demo Mode
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
