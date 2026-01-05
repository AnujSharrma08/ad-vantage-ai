"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  FileSearch, 
  History, 
  Settings, 
  LogOut,
  Zap 
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Audit", icon: FileSearch },
  { href: "/history", label: "History", icon: History },
  { href: "", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col z-50">
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
              AI Powered
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
                  ${isActive 
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
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : ""}`} />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="glass rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-slate-400 truncate">Pro Plan</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Credits</span>
            <span className="text-indigo-400 font-semibold">47 / 50</span>
          </div>
          <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "94%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
        
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl text-sm font-medium transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

