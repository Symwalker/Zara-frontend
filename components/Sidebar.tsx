"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Zap, 
  Home, 
  Building2, 
  Globe2, 
  Mail, 
  Flame, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const mainNav = [
  { name: "Home", href: "/", icon: Home },
  { name: "Live Businesses", href: "/live_businesses", icon: Building2 },
  { name: "All Campaigns/CSVs", href: "/presence_analysis", icon: Globe2 },
];

const auditNav = [
  { name: "Message Log", href: "/messages", icon: Mail },
  { name: "Hot Leads", href: "/hot-leads", icon: Flame },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapse state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("sidebar-collapsed", String(nextState));
  };

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
          fixed top-0 bottom-0 left-0 z-50 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 text-slate-300 transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-auto
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-64 lg:w-20" : "w-64"}
        `}
      >
        <div className="flex flex-col h-full justify-between">
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
            <div className={`bg-slate-800/80 border border-slate-700/60 rounded-xl mb-6 shadow-xs transition-all duration-300 ${isCollapsed ? "p-2 flex justify-center" : "p-3.5"}`}>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white p-2 rounded-lg shadow-md shadow-indigo-500/20 flex-shrink-0">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                {!isCollapsed && (
                  <div className="transition-opacity duration-300">
                    <h2 className="font-bold text-slate-100 text-sm xl:text-base leading-tight">Zara AI</h2>
                    <p className="text-[10px] text-slate-400">Digital Employee v1.0</p>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <div className="mt-3 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  System Active
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="space-y-6">
              <div>
                {!isCollapsed ? (
                  <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-2 transition-opacity duration-300">
                    Main Menu
                  </p>
                ) : (
                  <div className="border-b border-slate-850 my-4" />
                )}
                <nav className="space-y-1">
                  {mainNav.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleNavClick}
                        title={isCollapsed ? item.name : undefined}
                        className={`flex items-center rounded-lg text-sm font-medium transition-all ${
                          isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
                        } ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 font-semibold"
                            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {!isCollapsed && <span>{item.name}</span>}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div>
                {!isCollapsed ? (
                  <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-2 transition-opacity duration-300">
                    Audit & Analytics
                  </p>
                ) : (
                  <div className="border-b border-slate-850 my-4" />
                )}
                <nav className="space-y-1">
                  {auditNav.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleNavClick}
                        title={isCollapsed ? item.name : undefined}
                        className={`flex items-center rounded-lg text-sm font-medium transition-all ${
                          isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
                        } ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 font-semibold"
                            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {!isCollapsed && <span>{item.name}</span>}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {/* Footer info */}
            <div className={`bg-slate-800/40 border border-slate-800/80 rounded-lg text-slate-500 text-center transition-all duration-300 ${isCollapsed ? "p-1.5 text-[9px]" : "p-3 text-xs"}`}>
              {isCollapsed ? "Zara" : "Built with CrewAI & Next.js"}
            </div>

            {/* Collapse toggle button (visible on desktop only) */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex items-center justify-center w-full py-2.5 rounded-lg bg-slate-800/45 border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
              title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4.5 h-4.5 text-indigo-400" />
              ) : (
                <div className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-xs font-semibold">Collapse Menu</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}