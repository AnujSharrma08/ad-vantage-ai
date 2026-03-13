"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  FileSearch,
  History,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useTranslation } from "../context/TranslationContext";
// import { useState, useEffect } from "react";
import Translate from "./Translate";
import { useEffect, useState } from "react";
import { useProfileStore } from "@/src/store/profile_store";
import { LOCAL_STORAGE_KEYS } from "@/src/services/constants";
// import { UsageTracker } from "../utils/usageTracker";

const navItems = [
  { href: "/dashboard", label: "Audit", icon: FileSearch },
  { href: "/history", label: "History", icon: History },
  { href: "", label: "Settings", icon: Settings },
];

// const languages = [
//   { code: "en", name: "English", flag: "🇬🇧" },
//   { code: "de", name: "Deutsch", flag: "🇩🇪" },
// ];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profile = useProfileStore((state) => state.profile);
  const loading = useProfileStore((state) => state.loading);
  // const { locale, setLocale } = useTranslation();
  // const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  // const [usageStats, setUsageStats] = useState({
  //   remaining: 300,
  //   percentage: 0,
  //   totalCost: 0,
  //   charactersToday: 0,
  // });

  // const currentLanguage = languages.find((lang) => lang.code === locale);

  // Update usage stats
  // useEffect(() => {
  //   const updateStats = () => {
  //     const remaining = UsageTracker.getRemainingCredits();
  //     const percentage = UsageTracker.getUsagePercentage();
  //     const usage = UsageTracker.getUsage();

  //     setUsageStats({
  //       remaining,
  //       percentage,
  //       totalCost: usage.totalCost,
  //       charactersToday: usage.charactersToday,
  //     });
  //   };

  //   updateStats();

  //   // Update every 5 seconds
  //   const interval = setInterval(updateStats, 5000);

  //   return () => clearInterval(interval);
  // }, [locale]); // Re-check when locale changes

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_PROFILE);
    window.location.href = "/";
  };

  // Close mobile menu when route changes
  // useEffect(() => {
  //   // eslint-disable-next-line react-hooks/set-state-in-effect
  //   setIsMobileMenuOpen(false);
  // }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 text-white shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Menu className="w-6 h-6" />
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobileMenuOpen ? 0 : "-100%",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="fixed left-0 top-0 h-screen w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 flex flex-col z-50 lg:translate-x-0 lg:!transform-none"
      >
        {/* Close Button (Mobile Only) */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-tight">
                AdVantage
              </h1>
              <span className="text-xs text-indigo-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <Translate text="AI Powered" />
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    transition-colors duration-200
                    ${
                      isActive
                        ? "text-white bg-indigo-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }
                  `}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-indigo-400" : ""}`}
                  />
                  <Translate text={item.label} />
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          {/* User Info */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              {loading ? (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate animate-pulse">
                    Loading...
                  </p>
                  <p className="text-xs text-slate-400 truncate animate-pulse">
                    Fetching credits...
                  </p>
                </div>
              ) : (   
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    <Translate text={`${profile?.name}`} />
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    <Translate
                      text={`Credits Left ${profile?.quota?.remaining}`}
                    />
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <Translate text="Sign Out" />
          </button>
        </div>
      </motion.aside>
    </>
  );
}
