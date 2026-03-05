'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBrowserSupabase } from "@/lib/supabaseClient";
import { fmtDate } from "@/lib/ui";
import { FileText, Calculator, Clock, Share2, Download, Sparkles, Zap, Shield, ChevronRight, Play, Square, RefreshCw, ArrowRight, Star } from "lucide-react";
import { ProUpgradeCard } from "@/components/pricing-section";
import { SplitBlurText, TypingEffect, GlitchText, MorphingText } from "@/components/ui/text-effects";
import AuthGuard from "@/components/auth-guard";

interface Report {
  id: string;
  type: string;
  title: string;
  shareId: string;
  createdAt: string;
}

interface User {
  id: string;
  email?: string;
}

function AnimatedText() {
  const texts = [
    "Immigration Guidance",
    "Property Analysis", 
    "AI-Powered Reports",
    "Professional Tools"
  ];
  
  return (
    <TypingEffect 
      texts={texts} 
      className="text-primary font-semibold"
      typingSpeed={100}
      deletingSpeed={50}
      pauseDuration={2500}
      splitEffect={true}
    />
  );
}

function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full blur-2xl animate-float delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full blur-xl animate-float delay-2000"></div>
      <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full blur-2xl animate-float delay-500"></div>
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-br from-pink-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
    </div>
  );
}

function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [demoKey, setDemoKey] = useState<string>("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const sb = getBrowserSupabase();
    const dk = localStorage.getItem("demo_user") || "";
    setDemoKey(dk);

    async function init() {
      try {
        if (sb) {
          const { data } = await sb.auth.getUser();
          setUser(data?.user || null);
        }
      } catch {}
    }
    init();
  }, []);

  async function loadReports() {
    setErr("");
    try {
      let headers: Record<string, string> = {};
      const sb = getBrowserSupabase();
      if (sb) {
        const { data } = await sb.auth.getSession();
        const token = data?.session?.access_token;
        if (token) headers = { Authorization: `Bearer ${token}` };
      } else if (demoKey) {
        headers = { "x-demo-user": demoKey };
      } else {
        return;
      }

      const res = await fetch("/api/reports", { headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed");
      setReports(json.items || []);
    } catch (e) {
      setErr((e as Error).message || "Error");
    }
  }

  useEffect(() => { loadReports(); }, [user, demoKey]);

  function startDemo() {
    const key = Math.random().toString(36).slice(2);
    localStorage.setItem("demo_user", key);
    setDemoKey(key);
  }

  function clearDemo() {
    localStorage.removeItem("demo_user");
    setDemoKey("");
    setReports([]);
  }

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description: "Advanced AI algorithms provide comprehensive insights for immigration and property decisions"
    },
    {
      icon: Download,
      title: "PDF Export",
      description: "Download professional reports in PDF format for documentation and sharing"
    },
    {
      icon: Share2,
      title: "Shareable Links",
      description: "Generate secure shareable links to collaborate with advisors and stakeholders"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and protected with enterprise-grade security"
    }
  ];

  const tools = [
    {
      href: "/immigration",
      icon: FileText,
      title: "Immigration Assistant",
      description: "AI-powered immigration guidance with document checklists and cover letters",
      color: "from-blue-500 to-cyan-600"
    },
    {
      href: "/property",
      icon: Calculator,
      title: "Property Deal Analyzer",
      description: "Comprehensive property investment analysis with mortgage calculations",
      color: "from-emerald-500 to-teal-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-slate-900 dark:to-purple-950/20">
        <FloatingElements />
        <div className="absolute inset-0 bg-grid-black opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
              viewport={{ once: true, margin: "-100px" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span>AI-Powered Professional Tools</span>
            </motion.div>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <SplitBlurText blurDelay={400}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                    Professional
                  </span>
                  <br />
                  <AnimatedText />
                </h1>
              </SplitBlurText>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 50 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              >
                Transform complex decisions into actionable insights with our AI-powered tools. 
                Generate comprehensive reports, export PDFs, and share insights securely.
              </motion.p>
            </div>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, type: "spring", stiffness: 60 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  href="/immigration"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Try Immigration Assistant
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  href="/property"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Analyze Property Deal
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  />
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, type: "spring", stiffness: 50 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-wrap justify-center items-center gap-8 pt-8 text-sm text-muted-foreground"
            >
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Shield className="w-4 h-4 text-green-500" />
                </motion.div>
                <span>Bank-level Security</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Zap className="w-4 h-4 text-yellow-500" />
                </motion.div>
                <span>Instant Results</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-4 h-4 text-blue-500" />
                </motion.div>
                <span>4.9/5 Rating</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Removed from main flow, now in modal */}

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose AI Agents?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with professional expertise to deliver actionable insights
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group relative p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 card-hover">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Tools</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Specialized AI assistants for your specific needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {tools.map((tool, index) => (
              <Link
                key={index}
                href={tool.href}
                className="group relative p-8 rounded-3xl border border-border bg-card hover:shadow-xl transition-all duration-300 card-hover"
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${tool.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{tool.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{tool.description}</p>
                <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all duration-200">
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Demo & History Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Demo Controls */}
            <div className="p-8 rounded-3xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Play className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Quick Start</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-2">Required Configuration:</p>
                  <code className="text-xs px-2 py-1 bg-background border border-border rounded">OPENAI_API_KEY</code>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-2">Optional (for saved history):</p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Supabase configuration for login</li>
                    <li>• Or use Demo Mode below</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {!demoKey ? (
                  <button
                    onClick={startDemo}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Start Demo Mode
                  </button>
                ) : (
                  <button
                    onClick={clearDemo}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                  >
                    <Square className="w-4 h-4" />
                    Stop Demo Mode
                  </button>
                )}
                <button
                  onClick={loadReports}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-background hover:bg-secondary/50 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh History
                </button>
              </div>

              {demoKey && (
                <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 text-green-700 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Demo Mode Active
                  </div>
                  <code className="text-xs text-green-600 mt-1 block">{demoKey}</code>
                </div>
              )}

              {err && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{err}</p>
                </div>
              )}
            </div>

            {/* Recent Reports */}
            <div className="p-8 rounded-3xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Recent Reports</h3>
              </div>

              {(!user && !demoKey) ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Share2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">Login or enable Demo Mode to save and view your report history</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      Login
                    </Link>
                    <button
                      onClick={startDemo}
                      className="px-4 py-2 border border-border bg-background hover:bg-secondary/50 rounded-lg transition-colors"
                    >
                      Start Demo Mode
                    </button>
                  </div>
                </div>
              ) : reports.length > 0 ? (
                <div className="space-y-3">
                  {reports.map((report: Report) => (
                    <div key={report.id} className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {report.type}
                          </span>
                          <h4 className="font-medium">{report.title}</h4>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{fmtDate(report.createdAt)}</p>
                      <Link
                        href={`/share/${report.shareId}`}
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        View Report
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No reports yet. Generate your first report from one of our AI tools!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Wrap the entire Home component with AuthGuard
export default function ProtectedHomePage() {
  return (
    <AuthGuard>
      <Home />
    </AuthGuard>
  );
}
