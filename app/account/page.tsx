'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { User, Mail, Calendar, CreditCard, LogOut, Shield, Settings, Download, Share2, FileText, ArrowRight, CheckCircle } from "lucide-react";
import AuthGuard from "@/components/auth-guard";

function AccountPage() {
  const router = useRouter();
  const sb = getBrowserSupabase();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'billing'>('overview');

  useEffect(() => {
    async function loadUserData() {
      if (!sb) {
        setLoading(false);
        return;
      }

      const { data: { user: authUser } } = await sb.auth.getUser();
      
      if (!authUser) {
        router.push('/login');
        return;
      }

      setUser(authUser);

      // Load profile
      const { data: profileData } = await sb
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      setProfile(profileData);

      // Load reports
      const { data: reportsData } = await sb
        .from('reports')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setReports(reportsData || []);
      setLoading(false);
    }

    loadUserData();
  }, [sb, router]);

  async function logout() {
    if (!sb) return;
    await sb.auth.signOut();
    router.push('/');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-slate-900 dark:to-purple-950/20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-slate-900 dark:to-purple-950/20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm border border-border/20 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Account Dashboard</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 border border-border bg-background hover:bg-secondary/50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="bg-white/80 backdrop-blur-sm border border-border/20 rounded-xl shadow-lg p-2 flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-secondary/50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'reports' 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-secondary/50'
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'billing' 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-secondary/50'
              }`}
            >
              Billing
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Account Info */}
              <div className="bg-white/80 backdrop-blur-sm border border-border/20 rounded-2xl shadow-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Joined {new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{profile?.is_pro ? 'Pro Plan' : 'Free Plan'}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/80 backdrop-blur-sm border border-border/20 rounded-2xl shadow-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Quick Stats
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Reports</span>
                    <span className="font-semibold">{reports.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Credits Remaining</span>
                    <span className="font-semibold">{profile?.credits_remaining || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Plan Type</span>
                    <span className="font-semibold">{profile?.is_pro ? 'Pro' : 'Free'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white/80 backdrop-blur-sm border border-border/20 rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Reports
              </h2>
              {reports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No reports yet</p>
                  <button
                    onClick={() => router.push('/')}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                  >
                    Create Your First Report
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{report.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {report.type} • {new Date(report.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-secondary/50 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-secondary/50 rounded-lg transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Plan */}
              <div className="bg-white/80 backdrop-blur-sm border border-border/20 rounded-2xl shadow-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Current Plan
                </h2>
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{profile?.is_pro ? 'Pro Plan' : 'Free Plan'}</span>
                      <span className="text-sm text-muted-foreground">
                        {profile?.is_pro ? '$9.99/month' : 'Free'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {profile?.is_pro 
                        ? '500 credits per month, unlimited reports, priority support'
                        : '5 credits per day, basic features'
                      }
                    </div>
                  </div>
                  {!profile?.is_pro && (
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                      Upgrade to Pro
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Credits Usage */}
              <div className="bg-white/80 backdrop-blur-sm border border-border/20 rounded-2xl shadow-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Credits Usage
                </h2>
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Credits Remaining</span>
                      <span className="font-semibold">{profile?.credits_remaining || 0}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                        style={{ 
                          width: `${profile?.is_pro 
                            ? ((profile?.credits_remaining || 0) / 500) * 100
                            : ((profile?.credits_remaining || 0) / 5) * 100
                          }%` 
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {profile?.is_pro 
                      ? 'Credits reset monthly on your billing date'
                      : 'Credits reset daily at midnight UTC'
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Wrap AccountPage component with AuthGuard
export default function ProtectedAccountPage() {
  return (
    <AuthGuard>
      <AccountPage />
    </AuthGuard>
  );
}
