'use client'

import { useMemo, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabaseClient";
import { FileText, Download, Share2, AlertTriangle, CheckCircle, Calendar, User, MapPin, CreditCard, Home, Send, Loader2 } from "lucide-react";
import AuthGuard from "@/components/auth-guard";

interface Trip {
  from: string;
  to: string;
}

interface ImmigrationOutput {
  route: string;
  applicantName: string;
  partnerName: string;
  absenceSummary: any;
  checklist: string[];
  warnings: string[];
  coverLetter: string;
  summary: any;
}

function ImmigrationPage() {
  const [route, setRoute] = useState("spouse");
  const [title, setTitle] = useState("Immigration report");
  const [applicantName, setApplicantName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [incomeProof, setIncomeProof] = useState("6 payslips + 6 bank statements");
  const [addressProof, setAddressProof] = useState("tenancy + council tax + utility bill");
  const [tripsText, setTripsText] = useState("");

  const [out, setOut] = useState<ImmigrationOutput | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const tripsParsed: Trip[] = useMemo(() => {
    const lines = tripsText.split("\n").map(l => l.trim()).filter(Boolean);
    const trips: Trip[] = [];
    for (const line of lines) {
      const [from, to] = line.split(",").map(s => (s || "").trim());
      if (from && to) trips.push({ from, to });
    }
    return trips;
  }, [tripsText]);

  async function authHeaders(): Promise<Record<string, string>> {
    const sb = getBrowserSupabase();
    const demoKey = localStorage.getItem("demo_user");
    if (sb) {
      const { data } = await sb.auth.getSession();
      const token = data?.session?.access_token;
      if (token) return { Authorization: `Bearer ${token}` };
    }
    if (demoKey) return { "x-demo-user": demoKey };
    return {};
  }

  async function run() {
    setLoading(true);
    setErr("");
    setOut(null);
    setShareId(null);

    try {
      const headers = { "Content-Type": "application/json", ...(await authHeaders()) };
      const res = await fetch("/api/immigration", {
        method: "POST",
        headers,
        body: JSON.stringify({
          route,
          title,
          applicantName,
          partnerName,
          answers: { incomeProof, addressProof },
          trips: tripsParsed
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Request failed");
      setOut(json.output);
      setShareId(json.shareId);
    } catch (e) {
      setErr((e as Error).message || "Error");
    } finally {
      setLoading(false);
    }
  }

  async function downloadPdf() {
    if (!out) return;
    const res = await fetch("/api/export/immigration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, output: out })
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "immigration-report.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }

  const shareUrl = shareId ? `${typeof window !== "undefined" ? window.location.origin : ""}/share/${shareId}` : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <FileText className="w-4 h-4" />
            Immigration Assistant
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            AI-Powered Immigration Guidance
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate comprehensive immigration reports with AI-powered checklists, cover letters, and absence summaries
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Application Details
              </h2>

              <div className="space-y-6">
                {/* Route and Title */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Immigration Route</label>
                    <select 
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      value={route} 
                      onChange={(e) => setRoute(e.target.value)}
                    >
                      <option value="spouse">Spouse / FLR(M)</option>
                      <option value="ilr">ILR</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Report Title</label>
                    <input 
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                    />
                  </div>
                </div>

                {/* Names */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Applicant Name *</label>
                    <input 
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      value={applicantName} 
                      onChange={(e) => setApplicantName(e.target.value)} 
                      placeholder="e.g., John Smith"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Partner Name (Optional)</label>
                    <input 
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      value={partnerName} 
                      onChange={(e) => setPartnerName(e.target.value)} 
                      placeholder="e.g., Victoria Smith"
                    />
                  </div>
                </div>

                {/* Evidence */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Income Proof Notes
                    </label>
                    <input 
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      value={incomeProof} 
                      onChange={(e) => setIncomeProof(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Address Proof Notes
                    </label>
                    <input 
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      value={addressProof} 
                      onChange={(e) => setAddressProof(e.target.value)} 
                    />
                  </div>
                </div>

                {/* Trips */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Travel History (Optional)
                  </label>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">
                      One trip per line: <code className="px-1 py-0.5 bg-background border border-border rounded text-xs">YYYY-MM-DD,YYYY-MM-DD</code>
                    </p>
                    <textarea 
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-24 resize-vertical"
                      value={tripsText} 
                      onChange={(e) => setTripsText(e.target.value)} 
                      placeholder={"2025-03-19,2025-04-11\n2024-12-01,2024-12-10"} 
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <button 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                    onClick={run} 
                    disabled={loading || !applicantName}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Generate Report
                      </>
                    )}
                  </button>
                  
                  <button 
                    className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-background hover:bg-secondary/50 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                    onClick={downloadPdf} 
                    disabled={!out}
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>

                {err && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">Error</span>
                    </div>
                    <p className="text-sm text-destructive mt-1">{err}</p>
                  </div>
                )}

                {shareId ? (
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Report Generated Successfully</span>
                    </div>
                    <p className="text-sm text-green-600 mb-2">Share link:</p>
                    <a 
                      className="inline-flex items-center gap-2 text-xs px-3 py-2 bg-white border border-green-200 rounded-lg text-green-700 hover:bg-green-50 transition-colors"
                      href={shareUrl} 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      <Share2 className="w-3 h-3" />
                      {shareUrl}
                    </a>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-700">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-medium">Pro Tip</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-1">
                      Login or enable Demo Mode from the home page to save history and generate share links
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            {out ? (
              <div className="space-y-4">
                {/* Summary */}
                <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Summary
                  </h3>
                  <pre className="text-xs bg-muted/30 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(out.summary, null, 2)}
                  </pre>
                </div>

                {/* Warnings */}
                {out.warnings && out.warnings.length > 0 && (
                  <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="w-5 h-5" />
                      Important Notes
                    </h3>
                    <ul className="space-y-2">
                      {out.warnings.map((warning, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0"></span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Checklist */}
                {out.checklist && out.checklist.length > 0 && (
                  <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      Document Checklist
                    </h3>
                    <ul className="space-y-2">
                      {out.checklist.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cover Letter */}
                {out.coverLetter && (
                  <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Cover Letter
                    </h3>
                    <div className="text-xs bg-muted/30 p-3 rounded-lg max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap">{out.coverLetter}</pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-border shadow-sm p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-2">Ready to Generate</h3>
                <p className="text-sm text-muted-foreground">
                  Fill in the form and click "Generate Report" to create your AI-powered immigration analysis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap the ImmigrationPage component with AuthGuard
export default function ProtectedImmigrationPage() {
  return (
    <AuthGuard>
      <ImmigrationPage />
    </AuthGuard>
  );
}
