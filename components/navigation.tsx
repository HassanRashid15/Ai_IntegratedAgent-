'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import { getBrowserSupabase } from "@/lib/supabaseClient";
import { Menu, X, User, Home, FileText, Calculator, LogOut, Crown } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface User {
  id: string;
  email?: string;
}

interface NavigationProps {
  onUpgradeClick?: () => void;
}

export default function Navigation({ onUpgradeClick }: NavigationProps) {
  const [user, setUser] = useState<User | null>(null);
  const [demoKey, setDemoKey] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const sb = getBrowserSupabase();
    const dk = localStorage.getItem("demo_user") || null;
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

  const handleUpgradeClick = async () => {
    // Check if user is logged in using Supabase
    const sb = getBrowserSupabase();
    if (!sb) {
      alert('Authentication not available');
      return;
    }

    try {
      const { data: { session }, error } = await sb.auth.getSession();
      
      if (error || !session?.user) {
        alert('Please sign in to upgrade to Pro');
        return;
      }

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_pro_monthly',
          userId: session.user.id,
          email: session.user.email,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Stripe error:', error);
      alert('An error occurred while processing your upgrade');
    }
  };

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/immigration", label: "Immigration", icon: FileText },
    { href: "/property", label: "Property", icon: Calculator },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI Agents
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {demoKey && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border border-border bg-secondary/50">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Demo Mode
              </span>
            )}
            
            <ThemeSwitcher />
            
            <button
              onClick={handleUpgradeClick}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Crown className="w-4 h-4" />
              <span className="font-medium">Upgrade</span>
            </button>

            <Link
              href={user ? "/account" : "/login"}
              className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="font-medium">{user ? "Account" : "Login"}</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/40">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              <div className="pt-3 border-t border-border/40 space-y-3">
                {demoKey && (
                  <div className="px-3 py-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border border-border bg-secondary/50">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Demo Mode
                    </span>
                  </div>
                )}
                
                <div className="px-3 py-2">
                  <ThemeSwitcher />
                </div>
                
                <button
                  onClick={() => {
                    handleUpgradeClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <Crown className="w-5 h-5" />
                  <span className="font-medium">Upgrade</span>
                </button>

                <Link
                  href={user ? "/account" : "/login"}
                  className="flex items-center space-x-3 px-3 py-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user ? "Account" : "Login"}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
