"use client";

import { motion } from "framer-motion";

interface Props {
  loadingMessage: string;
  appState: "uploading" | "processing";
}

export default function LoadingScreen({ loadingMessage, appState }: Props) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto rounded-full border-4 border-indigo-500/30 border-t-indigo-500"
        />

        <h3 className="text-2xl font-bold text-white">{loadingMessage}</h3>

        <p className="text-slate-400">
          {appState === "uploading"
            ? "Uploading your creative..."
            : "AI analyzing your ad..."}
        </p>
      </div>
    </div>
  );
}
