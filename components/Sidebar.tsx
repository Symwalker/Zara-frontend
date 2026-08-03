"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Zap, 
  Home, 
  UploadCloud, 
  Building2, 
  Globe2, 
  Mail, 
  Flame, 
  Menu, 
  X 
} from "lucide-react";

const mainNav = [
  { name: "Home", href: "/", icon: Home },
  { name: "Live Businesses", href: "/live_businesses", icon: Building2 },
  { name: "Presence Analysis", href: "/presence_analysis", icon: Globe2 },
];

const auditNav = [
  { name: "Message Log", href: "/messages", icon: Mail },
  { name: "Hot Leads", href: "/hot-leads", icon: Flame },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar automatically on screen resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when navigating to a new route
  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      {/* 1. Mobile Top Bar & Hamburger Button (Visible only on screens < lg) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <span className="font-bold text-slate-100 text-base">Zara AI</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 2. Backdrop Overlay for Mobile Drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* 3. Main Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 text-slate-300 transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-auto
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div>
          {/* Mobile Close Button inside Drawer Header */}
          <div className="flex items-center justify-between lg:hidden mb-4 pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Card Header */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 mb-6 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white p-2 rounded-lg shadow-md shadow-indigo-500/20">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="font-bold text-slate-100 text-base leading-tight">Zara AI</h2>
                <p className="text-xs text-slate-400">Digital Employee v1.0</p>
              </div>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              System Active
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-2">
                Main Menu
              </p>
              <nav className="space-y-1">
                {mainNav.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavClick}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 font-semibold"
                          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-2">
                Audit & Analytics
              </p>
              <nav className="space-y-1">
                {auditNav.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavClick}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 font-semibold"
                          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-lg p-3 text-xs text-slate-500 text-center mt-6">
          Built with CrewAI & Next.js
        </div>
      </aside>
    </>
  );
}