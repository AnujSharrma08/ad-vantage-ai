import { X, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Translate from "../Translate";
import Image from "next/image";

interface AuditDetail {
  id: number;
  user_id: number;
  s3_key: string;
  target_audience: string;
  score: number;
  analysis_json: {
    risk: string;
    score: number;
    summary: string;
    confidence: number;
  };
  created_at: string;
}

interface AuditDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  audit: AuditDetail | null;
  s3BaseUrl: string;
}

export default function AuditDetailModal({
  isOpen,
  onClose,
  audit,
  s3BaseUrl,
}: AuditDetailModalProps) {
  if (!audit) return null;

  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return "score-excellent";
    if (score >= 60) return "score-good";
    if (score >= 40) return "score-average";
    return "score-poor";
  };

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "medium":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "high":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getRiskBadgeClass = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

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
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass rounded-2xl border border-slate-800 shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  <Translate text="Audit Details" />
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {new Date(audit.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Image Preview */}
              <div className="rounded-xl overflow-hidden bg-slate-900/50 border border-slate-800">
                <Image
                  src={`${s3BaseUrl}${audit.s3_key}`}
                  alt="Audit preview"
                  width={800} // Adjust width as needed
                  height={600} // Adjust height as needed
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>

              {/* Score & Risk */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="glass rounded-xl p-4 border border-slate-800">
                  <p className="text-sm text-slate-400 mb-2">
                    <Translate text="Score" />
                  </p>
                  <span
                    className={`inline-block px-4 py-2 rounded-lg text-lg font-bold ${getScoreBadgeClass(
                      audit.score
                    )}`}
                  >
                    {audit.score}
                  </span>
                </div>

                {/* <div className="glass rounded-xl p-4 border border-slate-800">
                  <p className="text-sm text-slate-400 mb-2">
                    <Translate text="Risk Level" />
                  </p>
                  <div className="flex items-center gap-2">
                    {getRiskIcon(audit.analysis_json.risk)}
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-semibold border capitalize ${getRiskBadgeClass(
                        audit.analysis_json.risk
                      )}`}
                    >
                      {audit.analysis_json.risk}
                    </span>
                  </div>
                </div> */}

                {/* <div className="glass rounded-xl p-4 border border-slate-800">
                  <p className="text-sm text-slate-400 mb-2">
                    <Translate text="Confidence" />
                  </p>
                  <p className="text-lg font-bold text-white">
                    {audit.analysis_json.confidence}%
                  </p>
                </div> */}
              </div>

              {/* Target Audience */}
              <div className="glass rounded-xl p-4 border border-slate-800">
                <p className="text-sm text-slate-400 mb-2">
                  <Translate text="Target Audience" />
                </p>
                <p className="text-white">{audit.target_audience}</p>
              </div>

              {/* Summary */}
              <div className="glass rounded-xl p-4 border border-slate-800">
                <p className="text-sm text-slate-400 mb-3">
                  <Translate text="Analysis Summary" />
                </p>
                <div className="text-white text-sm leading-relaxed space-y-2">
                  {(() => {
                    try {
                      // Remove markdown code blocks if present
                      const cleanedSummary = audit.analysis_json.summary
                        .replace(/```json\n?/g, "")
                        .replace(/```\n?/g, "")
                        .trim();

                      // Try to parse as JSON
                      const parsed = JSON.parse(cleanedSummary);

                      return (
                        <div className="space-y-3">
                          {parsed.summary && (
                            <p className="text-white">{parsed.summary}</p>
                          )}
                          {parsed.risk && (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">Risk:</span>
                              <span className="capitalize font-medium">
                                {parsed.risk}
                              </span>
                            </div>
                          )}
                          {parsed.confidence !== undefined && (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">
                                Confidence:
                              </span>
                              <span className="font-medium">
                                {parsed.confidence}%
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    } catch (e) {
                      // If parsing fails, display as plain text
                      return <p>{audit.analysis_json.summary}</p>;
                    }
                  })()}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
