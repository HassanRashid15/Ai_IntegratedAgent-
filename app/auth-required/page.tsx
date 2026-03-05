'use client'

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Mail, Lock, Sparkles, FileText, Calculator } from "lucide-react";

export default function AuthRequiredPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-slate-900 dark:to-purple-950/20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-sm border border-border/20 rounded-2xl shadow-xl p-8 text-center">
          {/* Lock Icon */}
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-8">
            Please sign in or create an account to access this page
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs text-muted-foreground">Immigration AI</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Calculator className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xs text-muted-foreground">Property Analysis</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <Shield className="w-4 h-4" />
              Sign In
            </button>
            
            <button
              onClick={() => router.push('/signup')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border bg-background hover:bg-secondary/50 rounded-xl transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Create Account
            </button>
          </div>

          {/* Demo Mode */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Want to try before signing up?
            </p>
            <button
              onClick={() => {
                const key = Math.random().toString(36).slice(2);
                localStorage.setItem("demo_user", key);
                router.push('/');
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
