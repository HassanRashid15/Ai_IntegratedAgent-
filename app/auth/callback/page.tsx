'use client'

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sb = getBrowserSupabase();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function handleAuthCallback() {
      if (!sb) {
        setStatus('error');
        setMessage("Authentication not configured");
        return;
      }

      const { data, error } = await sb.auth.getSession();
      
      if (error) {
        setStatus('error');
        setMessage(error.message);
        return;
      }

      if (data?.session) {
        setStatus('success');
        setMessage("Authentication successful!");
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        // Try to exchange the code for a session
        const code = searchParams.get('code');
        if (code) {
          const { error: exchangeError } = await sb.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            setStatus('error');
            setMessage(exchangeError.message);
          } else {
            setStatus('success');
            setMessage("Email verified successfully!");
            setTimeout(() => {
              router.push('/');
            }, 2000);
          }
        } else {
          setStatus('error');
          setMessage("No authentication code found");
        }
      }
    }

    handleAuthCallback();
  }, [sb, router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-slate-900 dark:to-purple-950/20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-sm border border-border/20 rounded-2xl shadow-xl p-8 text-center">
          {status === 'loading' && (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <h2 className="text-xl font-semibold">Verifying Authentication</h2>
              <p className="text-muted-foreground">Please wait while we verify your account...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-green-600">Success!</h2>
              <p className="text-muted-foreground">{message}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting to dashboard...</span>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-red-600">Authentication Failed</h2>
              <p className="text-muted-foreground">{message}</p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/login')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <ArrowRight className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-slate-900 dark:to-purple-950/20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
