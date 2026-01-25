"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Upload,
  FileImage,
  ImageIcon,
  Users,
  Sparkles,
  X,
  AlertTriangle,
  CheckCircle2,
  Info,
  TrendingUp,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { fetchS3ImageUrl, processAudit } from "@/src/services/audit/audit";
import { LOCAL_STORAGE_KEYS } from "@/src/services/constants";
import { useProfileStore } from "@/src/store/profile_store";
import QuotaModal from "@/src/components/models/quota-model";
import InfoModal from "@/src/components/models/info-model";

type AppState = "upload" | "uploading" | "processing" | "result";

interface AuditSummary {
  risk: string;
  summary: string;
  confidence: number;
}

interface AuditResult {
  audit_id: number;
  score: number;
  summary: string;
}

export default function DashboardPage() {
  const [appState, setAppState] = useState<AppState>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [targetAudience, setTargetAudience] = useState("");
  const [s3Key, setS3Key] = useState("");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [parsedSummary, setParsedSummary] = useState<AuditSummary | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const refreshProfile = useProfileStore((state) => state.refreshProfile);
  const profile = useProfileStore((state) => state.profile);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
  });

  const handleStartAudit = async () => {
    if (profile && profile.quota && profile.quota.remaining <= 0) {
      setShowQuotaModal(true);
      return;
    }

    if (!uploadedImage || !uploadedFile) {
      toast.error("Please upload an image first");
      return;
    }

    try {
      // Step 1: Get S3 Upload URL
      setAppState("uploading");
      setLoadingMessage("Preparing upload...");

      const fileName = uploadedFile.name;
      const contentType = uploadedFile.type;

      const s3Response = await fetchS3ImageUrl(fileName, contentType);
      const { upload_url, s3_key } = s3Response;

      setS3Key(s3_key);
      setLoadingMessage("Uploading image to cloud...");

      // Step 2: Upload file to S3
      const uploadResponse = await fetch(upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
        },
        body: uploadedFile,
        mode: "cors",
      });

      console.log("Upload response:", uploadResponse);

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image to S3");
      }

      setLoadingMessage("Image uploaded successfully!");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 3: Process Audit
      setAppState("processing");
      setLoadingMessage("Analyzing your ad with AI...");

      const user = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || "{}"
      );
      const userId = user.id;

      if (!userId) {
        throw new Error("User not found. Please login again.");
      }

      const auditData = {
        user_id: userId,
        s3_key: s3_key,
        target_audience: targetAudience || "General audience",
      };

      const auditResponse = await processAudit(auditData);
      setAuditResult(auditResponse);

      // Parse the summary JSON
      try {
        // Extract JSON from markdown code blocks
        const jsonMatch = auditResponse.summary.match(
          /```json\n([\s\S]*?)\n```/
        );
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[1]);
          setParsedSummary(parsed);
        } else {
          // Try parsing directly
          const parsed = JSON.parse(auditResponse.summary);
          setParsedSummary(parsed);
        }
      } catch (parseError) {
        console.error("Failed to parse summary:", parseError);
        toast.warning("Analysis complete, but summary format is unexpected");
      }

      setLoadingMessage("Analysis complete!");
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAppState("result");
      toast.success("Ad audit completed successfully!");

      await refreshProfile();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Audit error:", error);
      toast.error(
        error.message || "Failed to process audit. Please try again."
      );
      setAppState("upload");
      setLoadingMessage("");
    }
  };

  const handleReset = () => {
    setAppState("upload");
    setUploadedImage(null);
    setUploadedFile(null);
    setTargetAudience("");
    setS3Key("");
    setAuditResult(null);
    setParsedSummary(null);
    setLoadingMessage("");
  };

  const removeImage = () => {
    setUploadedImage(null);
    setUploadedFile(null);
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return "text-green-400 bg-green-500/10 border-green-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "high":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      default:
        return "text-blue-400 bg-blue-500/10 border-blue-500/30";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return <CheckCircle2 className="w-5 h-5" />;
      case "medium":
        return <Info className="w-5 h-5" />;
      case "high":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-grid">
      <div className="max-w-6xl mx-auto">
        {/* Quota Warning Banner - Show at top */}
        {profile && profile.quota && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 rounded-xl p-4 border ${
              profile.quota.remaining <= 0
                ? "bg-red-500/10 border-red-500/30"
                : profile.quota.remaining <= 1
                ? "bg-yellow-500/10 border-yellow-500/30"
                : "bg-blue-500/10 border-blue-500/30"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    profile.quota.remaining <= 0
                      ? "bg-red-500/20 border-red-500/30"
                      : profile.quota.remaining <= 1
                      ? "bg-yellow-500/20 border-yellow-500/30"
                      : "bg-blue-500/20 border-blue-500/30"
                  } border`}
                >
                  <Info
                    className={`w-5 h-5 ${
                      profile.quota.remaining <= 0
                        ? "text-red-400"
                        : profile.quota.remaining <= 1
                        ? "text-yellow-400"
                        : "text-blue-400"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {profile.quota.remaining <= 0
                      ? "Free audits exhausted"
                      : `${profile.quota.remaining} free audit${
                          profile.quota.remaining === 1 ? "" : "s"
                        } remaining`}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Free version includes 3 ad audits.{" "}
                    <button
                      onClick={() => setShowInfoModal(true)}
                      className="text-indigo-400 hover:text-indigo-300 underline"
                    >
                      Read more
                    </button>
                  </p>
                </div>
              </div>
              {profile.quota.remaining <= 0 && (
                <button
                  onClick={() => setShowQuotaModal(true)}
                  className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors flex-shrink-0"
                >
                  Upgrade Now
                </button>
              )}
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {appState === "result" && auditResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
                >
                  <ArrowLeft className="w-4 h-4" />
                  New Audit
                </button>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm">
                  <Sparkles className="w-4 h-4" />
                  Audit ID: {auditResult.audit_id}
                </div>
              </motion.div>

              {/* Score Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-8"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Ad Performance Score
                    </h2>
                    <p className="text-slate-400">
                      Based on AI analysis of your creative
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="relative">
                      <svg className="w-32 h-32" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          strokeDasharray={`${auditResult.score * 2.827} 282.7`}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                        <defs>
                          <linearGradient
                            id="gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                          >
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#c084fc" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {auditResult.score}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Image Preview */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-indigo-400" />
                    Analyzed Creative
                  </h3>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                    <Image
                      src={uploadedImage!}
                      alt="Analyzed ad"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  {targetAudience && (
                    <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-sm text-slate-400 mb-1">
                        Target Audience:
                      </p>
                      <p className="text-white">{targetAudience}</p>
                    </div>
                  )}
                </motion.div>

                {/* Analysis Results */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  {parsedSummary && (
                    <>
                      {/* Risk Level */}
                      <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-indigo-400" />
                          Risk Assessment
                        </h3>
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getRiskColor(
                            parsedSummary.risk
                          )}`}
                        >
                          {getRiskIcon(parsedSummary.risk)}
                          <span className="font-semibold capitalize">
                            {parsedSummary.risk} Risk
                          </span>
                        </div>
                      </div>

                      {/* Confidence Score */}
                      <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-indigo-400" />
                          Confidence Level
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${parsedSummary.confidence}%`,
                                }}
                                transition={{ delay: 0.5, duration: 1 }}
                              />
                            </div>
                          </div>
                          <span className="text-2xl font-bold text-white">
                            {parsedSummary.confidence}%
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Detailed Summary */}
              {parsedSummary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm"
                >
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-indigo-400" />
                    Detailed Analysis
                  </h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-slate-300 leading-relaxed text-lg">
                      {parsedSummary.summary}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4"
              >
                <button
                  onClick={handleReset}
                  className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
                >
                  Analyze Another Ad
                </button>
              </motion.div>
            </motion.div>
          ) : appState === "uploading" || appState === "processing" ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <div className="text-center space-y-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto rounded-full border-4 border-indigo-500/30 border-t-indigo-500"
                />
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">
                    {loadingMessage}
                  </h3>
                  <p className="text-slate-400">
                    {appState === "uploading"
                      ? "Uploading your creative to secure storage..."
                      : "Our AI is analyzing your ad creative..."}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto"
            >
              {/* Hero Section */}
              <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Ad Analysis
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                  Optimize Your Ads with
                  <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Intelligent Insights
                  </span>
                </h1>
                <p className="text-lg text-slate-400 max-w-xl mx-auto">
                  Upload your ad creative and get instant AI-powered feedback on
                  visuals, copy effectiveness, and conversion potential.
                </p>
              </motion.div>

              {/* Upload Zone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div
                  {...getRootProps()}
                  className={`
                    relative rounded-2xl p-8 md:p-12 cursor-pointer
                    transition-all duration-300 overflow-hidden
                    bg-white/5 border-2 border-dashed backdrop-blur-sm
                    ${
                      isDragActive
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-white/20 hover:border-indigo-500/50"
                    }
                    ${uploadedImage ? "border-indigo-500/50" : ""}
                  `}
                >
                  <input {...getInputProps()} />

                  {uploadedImage ? (
                    <div className="relative">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 max-w-md mx-auto">
                        <Image
                          src={uploadedImage}
                          alt="Uploaded preview"
                          className="w-full h-full object-contain"
                          layout="fill"
                          objectFit="contain"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-center mt-4 text-slate-400 text-sm">
                        Click or drag to replace image
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <motion.div
                        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30"
                        animate={{
                          y: isDragActive ? -10 : 0,
                          scale: isDragActive ? 1.1 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {isDragActive ? (
                          <FileImage className="w-10 h-10 text-indigo-400" />
                        ) : (
                          <Upload className="w-10 h-10 text-indigo-400" />
                        )}
                      </motion.div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {isDragActive
                          ? "Drop your image here"
                          : "Upload your ad creative"}
                      </h3>
                      <p className="text-slate-400 mb-4">
                        Drag & drop or click to browse
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                        <ImageIcon className="w-4 h-4" />
                        PNG, JPG, WEBP up to 10MB
                      </div>
                    </div>
                  )}

                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl" />
                </div>
              </motion.div>

              {/* Target Audience Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-6"
              >
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Audience (Optional)
                </label>
                <div className="rounded-xl bg-white/5 border border-white/10 p-1 backdrop-blur-sm">
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g., Young professionals aged 25-35 interested in tech"
                      className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-slate-500 focus:outline-none text-base"
                    />
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Describe who you want to reach with this ad
                </p>
              </motion.div>

              {/* Start Audit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8"
              >
                <motion.button
                  onClick={handleStartAudit}
                  disabled={!uploadedImage}
                  className={`
                    w-full py-4 px-8 rounded-xl text-white font-semibold text-lg
                    flex items-center justify-center gap-3
                    bg-gradient-to-r from-indigo-500 to-purple-500
                    hover:shadow-lg hover:shadow-indigo-500/50
                    disabled:opacity-50 disabled:cursor-not-allowed
                    disabled:hover:shadow-none
                    transition-all duration-300
                  `}
                  whileHover={{ scale: uploadedImage ? 1.02 : 1 }}
                  whileTap={{ scale: uploadedImage ? 0.98 : 1 }}
                >
                  <Sparkles className="w-5 h-5" />
                  Start AI Audit
                </motion.button>

                {!uploadedImage && (
                  <p className="text-center mt-3 text-sm text-slate-500">
                    Upload an image to get started
                  </p>
                )}
              </motion.div>

              {/* Features Preview */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-12 grid grid-cols-3 gap-4"
              >
                {[
                  {
                    label: "Visual Analysis",
                    desc: "Color, composition & hierarchy",
                  },
                  {
                    label: "Risk Assessment",
                    desc: "Copyright & compliance check",
                  },
                  {
                    label: "Performance Score",
                    desc: "AI-powered effectiveness rating",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.label}
                    className="rounded-xl bg-white/5 border border-white/10 p-4 text-center backdrop-blur-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <p className="text-sm font-medium text-white">
                      {feature.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Modals */}
      <QuotaModal
        isOpen={showQuotaModal}
        onClose={() => setShowQuotaModal(false)}
        remainingQuota={profile?.quota?.remaining || 0}
      />
      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    </div>
  );
}
