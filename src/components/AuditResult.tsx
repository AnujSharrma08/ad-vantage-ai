"use client";

import { motion } from "framer-motion";
import { 
  Eye, 
  Type, 
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Download,
  Share2,
  RotateCcw
} from "lucide-react";

interface AuditResultProps {
  imageUrl: string;
  score: number;
  onReset: () => void;
}

interface CategoryData {
  name: string;
  icon: React.ReactNode;
  score: number;
  insights: string[];
  color: string;
}

export default function AuditResult({ imageUrl, score, onReset }: AuditResultProps) {
  const categories: CategoryData[] = [
    {
      name: "Visuals",
      icon: <Eye className="w-5 h-5" />,
      score: 85,
      insights: [
        "Strong visual hierarchy draws attention",
        "Color contrast meets accessibility standards",
        "Image quality is optimized for web"
      ],
      color: "from-emerald-500 to-teal-500"
    },
    {
      name: "Copy",
      icon: <Type className="w-5 h-5" />,
      score: 72,
      insights: [
        "Headline could be more compelling",
        "CTA text is clear and action-oriented",
        "Consider adding social proof elements"
      ],
      color: "from-indigo-500 to-purple-500"
    },
    {
      name: "Conversion Strategy",
      icon: <Target className="w-5 h-5" />,
      score: 78,
      insights: [
        "Strong value proposition placement",
        "Add urgency elements to boost conversions",
        "Consider A/B testing button placement"
      ],
      color: "from-amber-500 to-orange-500"
    }
  ];

  const getScoreColor = (s: number) => {
    if (s >= 80) return "#22c55e";
    if (s >= 60) return "#6366f1";
    if (s >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Average";
    return "Needs Work";
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h2 
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Audit Complete
          </motion.h2>
          <motion.p 
            className="text-slate-400 mt-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Here&apos;s your detailed performance analysis
          </motion.p>
        </div>
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all">
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            New Audit
          </button>
        </motion.div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Image Preview */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass rounded-2xl p-4 border border-slate-800"
        >
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
            <img 
              src={imageUrl} 
              alt="Uploaded ad creative" 
              className="w-full h-full object-contain"
            />
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-xs font-medium text-white flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Analyzed
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-400">Your Ad Creative</span>
            <span className="text-slate-500">Uploaded just now</span>
          </div>
        </motion.div>

        {/* Right: Score */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass rounded-2xl p-6 border border-slate-800"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Performance Score</h3>
          
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="45"
                  stroke="#1e293b"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="80"
                  cy="80"
                  r="45"
                  stroke={getScoreColor(score)}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  className="text-4xl font-bold text-white"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  {score}
                </motion.span>
                <motion.span 
                  className="text-sm text-slate-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  out of 100
                </motion.span>
              </div>
            </div>
          </div>

          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <span 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: `${getScoreColor(score)}20`,
                color: getScoreColor(score)
              }}
            >
              {score >= 60 ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {getScoreLabel(score)}
            </span>
          </motion.div>

          <motion.div 
            className="mt-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">
                Your ad scores higher than <strong className="text-white">73%</strong> of similar ads
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
            className="glass rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg`}>
                {category.icon}
              </div>
              <span className="text-2xl font-bold text-white">{category.score}</span>
            </div>
            
            <h4 className="font-semibold text-white mb-3">{category.name}</h4>
            
            <ul className="space-y-2">
              {category.insights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5 mt-0.5 text-slate-500 flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

