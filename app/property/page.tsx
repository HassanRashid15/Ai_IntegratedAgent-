'use client'

import { useState } from "react";
import { getBrowserSupabase } from "@/lib/supabaseClient";
import { Calculator, Download, Share2, TrendingUp, Home, DollarSign, Percent, Calendar, Wrench, Shield, FileText, Send, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import AuthGuard from "@/components/auth-guard";

interface PropertyOutput {
  input: any;
  results: any;
  explanation: any;
}

function PropertyPage() {
  const [title, setTitle] = useState("Property report");
  const [price, setPrice] = useState(250000);
  const [deposit, setDeposit] = useState(25000);
  const [termYears, setTermYears] = useState(30);
  const [ratePercent, setRatePercent] = useState(5);
  const [rentMonthly, setRentMonthly] = useState(1400);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [maintenance, setMaintenance] = useState(0);
  const [other, setOther] = useState(0);

  const [out, setOut] = useState<PropertyOutput | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

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
      const res = await fetch("/api/property", {
        method: "POST",
        headers,
        body: JSON.stringify({
          title,
          price: Number(price),
          deposit: Number(deposit),
          termYears: Number(termYears),
          ratePercent: Number(ratePercent),
          rentMonthly: Number(rentMonthly),
          costsMonthly: {
            serviceCharge: Number(serviceCharge),
            insurance: Number(insurance),
            maintenance: Number(maintenance),
            other: Number(other)
          }
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
    const res = await fetch("/api/export/property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, output: out })
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "property-report.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }

  const shareUrl = shareId ? `${typeof window !== "undefined" ? window.location.origin : ""}/share/${shareId}` : "";

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const monthlyCosts = serviceCharge + insurance + maintenance + other;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            Property Deal Analyzer
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            AI-Powered Property Investment Analysis
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive property investment analysis with mortgage calculations, yields, cashflow projections, and AI-powered insights
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" />
                Property Details
              </h2>

              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Report Title</label>
                  <input 
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                  />
                </div>

                {/* Price and Deposit */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Property Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">£</span>
                      <input 
                        className="w-full pl-8 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        type="number" 
                        value={price} 
                        onChange={(e) => setPrice(Number(e.target.value))} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Deposit Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">£</span>
                      <input 
                        className="w-full pl-8 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        type="number" 
                        value={deposit} 
                        onChange={(e) => setDeposit(Number(e.target.value))} 
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {((deposit / price) * 100).toFixed(1)}% of property value
                    </p>
                  </div>
                </div>

                {/* Mortgage Terms */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Mortgage Term
                    </label>
                    <div className="relative">
                      <input 
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        type="number" 
                        value={termYears} 
                        onChange={(e) => setTermYears(Number(e.target.value))} 
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">years</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Interest Rate
                    </label>
                    <div className="relative">
                      <input 
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        type="number" 
                        step="0.1"
                        value={ratePercent} 
                        onChange={(e) => setRatePercent(Number(e.target.value))} 
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>

                {/* Rental Income */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Expected Monthly Rent
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">£</span>
                    <input 
                      className="w-full pl-8 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      type="number" 
                      value={rentMonthly} 
                      onChange={(e) => setRentMonthly(Number(e.target.value))} 
                    />
                  </div>
                </div>

                {/* Monthly Costs */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-medium text-foreground">Monthly Costs</h3>
                    <span className="text-xs text-muted-foreground">
                      Total: {formatCurrency(monthlyCosts)}/month
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Service Charge</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-xs">£</span>
                        <input 
                          className="w-full pl-7 pr-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                          type="number" 
                          value={serviceCharge} 
                          onChange={(e) => setServiceCharge(Number(e.target.value))} 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Insurance</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-xs">£</span>
                        <input 
                          className="w-full pl-7 pr-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                          type="number" 
                          value={insurance} 
                          onChange={(e) => setInsurance(Number(e.target.value))} 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Maintenance</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-xs">£</span>
                        <input 
                          className="w-full pl-7 pr-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                          type="number" 
                          value={maintenance} 
                          onChange={(e) => setMaintenance(Number(e.target.value))} 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Other Costs</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-xs">£</span>
                        <input 
                          className="w-full pl-7 pr-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                          type="number" 
                          value={other} 
                          onChange={(e) => setOther(Number(e.target.value))} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <button 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                    onClick={run} 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Analyze Deal
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
                      <span className="text-sm font-medium">Analysis Complete</span>
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
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">Pro Tip</span>
                    </div>
                    <p className="text-sm text-emerald-600 mt-1">
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
                {/* Results */}
                <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Investment Metrics
                  </h3>
                  <pre className="text-xs bg-muted/30 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(out.results, null, 2)}
                  </pre>
                </div>

                {/* AI Explanation */}
                <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    AI Analysis
                  </h3>
                  <div className="text-xs bg-muted/30 p-3 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(out.explanation, null, 2)}</pre>
                  </div>
                </div>

                {/* Quick Summary */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6">
                  <h3 className="text-lg font-bold mb-4 text-emerald-800">Quick Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-emerald-700">Property Value</span>
                      <span className="font-bold text-emerald-900">{formatCurrency(price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-emerald-700">Monthly Rent</span>
                      <span className="font-bold text-emerald-900">{formatCurrency(rentMonthly)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-emerald-700">Monthly Costs</span>
                      <span className="font-bold text-emerald-900">{formatCurrency(monthlyCosts)}</span>
                    </div>
                    <div className="h-px bg-emerald-200"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-emerald-700">Net Monthly</span>
                      <span className="font-bold text-emerald-900">{formatCurrency(rentMonthly - monthlyCosts)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-emerald-700">Annual Yield</span>
                      <span className="font-bold text-emerald-900">
                        {(((rentMonthly - monthlyCosts) * 12) / (price - deposit) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-border shadow-sm p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-2">Ready to Analyze</h3>
                <p className="text-sm text-muted-foreground">
                  Enter property details and click "Analyze Deal" to get comprehensive investment insights
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap PropertyPage component with AuthGuard
export default function ProtectedPropertyPage() {
  return (
    <AuthGuard>
      <PropertyPage />
    </AuthGuard>
  );
}
