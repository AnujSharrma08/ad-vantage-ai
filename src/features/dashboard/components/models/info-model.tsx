// src/components/InfoModal.tsx
import { X, AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-2xl border border-slate-800 shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <AlertTriangle className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Free Plan Limitations
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Free Plan */}
              <div className="glass rounded-xl p-5 border border-yellow-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Free Plan (Current)
                  </h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">3 ad audits</strong> per
                      account (lifetime limit)
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>Basic AI analysis and scoring</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>Risk assessment and compliance check</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>Standard processing speed</span>
                  </li>
                </ul>

                <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-sm text-yellow-200">
                    <strong>⚠️ Important:</strong> Once you&apos;ve used all 3
                    audits, you&apos;ll need to upgrade to continue analyzing ads.
                  </p>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="glass rounded-xl p-5 border border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Pro Plan (Upgrade)
                  </h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Unlimited audits</strong> -
                      analyze as many ads as you need
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>
                      Advanced AI insights with detailed recommendations
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>Priority processing (faster results)</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>Export reports as PDF</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>Priority customer support</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>API access for integrations</span>
                  </li>
                </ul>
              </div>

              {/* Warning */}
              <div className="glass rounded-xl p-4 border border-red-500/30 bg-red-500/5">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">
                      Usage Guidelines
                    </h4>
                    <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                      <li>Free audits cannot be restored once used</li>
                      <li>Quota resets are not available for free accounts</li>
                      <li>Contact support for custom enterprise plans</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={onClose}
                className="w-full py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
