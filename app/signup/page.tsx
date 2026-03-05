'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle, AlertCircle, User, Shield, Sparkles, Lock, Key, ArrowLeft } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const sb = getBrowserSupabase();
  const [step, setStep] = useState<'details' | 'verification'>('details');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    async function init() {
      if (!sb) {
        setAuthChecked(true);
        return;
      }
      
      const { data } = await sb.auth.getUser();
      setUser(data?.user || null);
      setAuthChecked(true);
      
      // Redirect to dashboard if already logged in
      if (data?.user) {
        router.push('/');
      }
    }
    init();
  }, [sb, router]);

  // Don't render until auth check is complete
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-slate-900 dark:to-purple-950/20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Don't show signup form if user is already logged in
  if (user) {
    return null; // Will redirect
  }

  async function signUp() {
    setLoading(true);
    setMessage("");

    // Validation
    if (!firstName || !lastName) {
      setMessage("Please enter your first and last name");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!email) {
      setMessage("Please enter your email address");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!sb) {
      setMessage("Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      // Sign up with email and password
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) {
        setMessage(error.message);
        setMessageType("error");
      } else {
        // Move to verification step
        setStep('verification');
        setMessage("Account created! Please check your email for verification code.");
        setMessageType("success");
      }
    } catch (error: any) {
      setMessage(error.message || "An error occurred during signup");
      setMessageType("error");
    }

    setLoading(false);
  }

  async function verifyOTP() {
    setLoading(true);
    setMessage("");

    if (!sb) {
      setMessage("Authentication not configured");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await sb.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'signup'
      });

      if (error) {
        setMessage(error.message);
        setMessageType("error");
      } else {
        setMessage("Email verified successfully! Redirecting to dashboard...");
        setMessageType("success");
        
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (error: any) {
      setMessage(error.message || "Invalid verification code");
      setMessageType("error");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-slate-900 dark:to-purple-950/20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-sm border border-border/20 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {step === 'details' ? 'Create Account' : 'Verify Email'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {step === 'details' 
                ? 'Start your AI-powered journey today' 
                : 'Enter the verification code sent to your email'
              }
            </p>
          </div>

          {!sb ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium">Authentication Not Configured</p>
              <p className="text-sm text-muted-foreground mt-2">
                Set up Supabase environment variables to enable signup
              </p>
            </div>
          ) : step === 'details' ? (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  <Shield className="w-4 h-4" />
                  Free 5 credits daily
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">What you'll get:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>AI Immigration Guidance</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Property Analysis Tools</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>5 Free Credits Daily</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Save & Share Reports</span>
                  </div>
                </div>
              </div>

              <button
                onClick={signUp}
                disabled={!firstName || !lastName || !email || !password || !confirmPassword || loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={() => router.push('/login')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* Verification Step */
            <div className="space-y-6">
              <div className="text-center py-4">
                <Key className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit code to:<br />
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>

              <div>
                <label htmlFor="otpCode" className="block text-sm font-medium mb-2">
                  Verification Code
                </label>
                <input
                  id="otpCode"
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full text-center text-2xl tracking-widest px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={6}
                />
              </div>

              <button
                onClick={verifyOTP}
                disabled={otpCode.length !== 6 || loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Verify Email
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="space-y-3">
                <button
                  onClick={() => setStep('details')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border bg-background hover:bg-secondary/50 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Details
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code? Check your spam folder or{" "}
                    <button
                      onClick={signUp}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      resend
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
                messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              {messageType === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm">{message}</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
