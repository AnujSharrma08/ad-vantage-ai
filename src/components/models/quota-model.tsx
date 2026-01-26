import { X, AlertCircle, Phone, Mail, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingQuota: number;
}

export default function QuotaModal({
  isOpen,
  onClose,
  remainingQuota,
}: QuotaModalProps) {
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
            className="relative w-full max-w-md glass rounded-2xl border border-red-500/30 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 p-6 border-b border-red-500/30">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Quota Limit Reached
                    </h2>
                    <p className="text-sm text-red-300 mt-1">
                      Free tier: {remainingQuota} audits remaining
                    </p>
                  </div>
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
              {/* Message */}
              <div className="space-y-3">
                <p className="text-white text-base leading-relaxed">
                  You&apos;ve used all your free audits for this period. Upgrade to
                  our{" "}
                  <span className="font-semibold text-indigo-400">
                    Pro Plan
                  </span>{" "}
                  to continue analyzing your ads with AI-powered insights.
                </p>

                {/* Features */}
                <div className="glass rounded-xl p-4 border border-indigo-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <span>Unlimited ad audits</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <span>Advanced AI analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <span>Priority support</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-white">
                  Contact us to upgrade:
                </p>

                <div className="space-y-2">
                  <a
                    href="tel:+917498095819"
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 group-hover:bg-indigo-500/30 transition-colors">
                      <Phone className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Call us</p>
                      <p className="text-white font-medium">+91 74980 95819</p>
                    </div>
                  </a>
                  <a
                    href="mailto:support@advantage.com"
                    className="flex
                    items-center gap-3 p-3 rounded-xl bg-slate-800/50
                    hover:bg-slate-800 border border-slate-700 transition-colors
                    group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30 group-hover:bg-purple-500/30 transition-colors">
                      <Mail className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Email us</p>
                      <p className="text-white font-medium">
                        sharrma26@gmail.com
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onClose}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
