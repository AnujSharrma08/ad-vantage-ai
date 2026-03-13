"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { Sparkles, Users } from "lucide-react";

import { LOCAL_STORAGE_KEYS } from "@/src/services/constants";
import { useProfileStore } from "@/src/store/profile_store";

import QuotaModal from "@/src/features/dashboard/components/models/quota-model";
import InfoModal from "@/src/features/dashboard/components/models/info-model";
import AnalysisResult from "../components/audit/analysis-result";
import ScoreCard from "../components/audit/score-card";
import LoadingScreen from "../components/audit/loading-screen";
import QuotaBanner from "../components/audit/quota-banner";
import UploadZone from "../components/audit/upload-zone";
import { fetchS3ImageUrl, processAudit } from "../../../services/audit/audit";

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

export default function AuditPage() {
  const [appState, setAppState] = useState<AppState>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [targetAudience, setTargetAudience] = useState("");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [parsedSummary, setParsedSummary] = useState<AuditSummary | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const refreshProfile = useProfileStore((state) => state.refreshProfile);
  const profile = useProfileStore((state) => state.profile);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) return;

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const removeImage = () => {
    setUploadedImage(null);
    setUploadedFile(null);
  };

  const handleReset = () => {
    setAppState("upload");
    setUploadedImage(null);
    setUploadedFile(null);
    setTargetAudience("");
    setAuditResult(null);
    setParsedSummary(null);
    setLoadingMessage("");
  };

  const handleStartAudit = async () => {
    if ((profile?.quota?.remaining ?? 0) <= 0) {
      setShowQuotaModal(true);
      return;
    }

    if (!uploadedFile) {
      toast.error("Please upload an image first");
      return;
    }

    try {
      setAppState("uploading");
      setLoadingMessage("Preparing upload...");

      const { upload_url, s3_key } = await fetchS3ImageUrl(
        uploadedFile.name,
        uploadedFile.type
      );

      setLoadingMessage("Uploading image...");

      const uploadResponse = await fetch(upload_url, {
        method: "PUT",
        headers: { "Content-Type": uploadedFile.type },
        body: uploadedFile,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      setAppState("processing");
      setLoadingMessage("AI analyzing your ad...");

      const user = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || "{}"
      );

      const auditData = {
        user_id: user.id,
        s3_key,
        target_audience: targetAudience || "General audience",
      };

      const auditResponse = await processAudit(auditData);

      setAuditResult(auditResponse);

      try {
        const parsed = JSON.parse(auditResponse.summary);
        setParsedSummary(parsed);
      } catch {
        toast.warning("Summary format unexpected");
      }

      setAppState("result");
      toast.success("Audit completed!");

      await refreshProfile();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
      setAppState("upload");
    }
  };

  return (
    <div className="min-h-screen bg-grid">
      <div className="max-w-6xl mx-auto">
        <QuotaBanner
          profile={profile}
          setShowQuotaModal={setShowQuotaModal}
          setShowInfoModal={setShowInfoModal}
        />

        {(appState === "uploading" || appState === "processing") && (
          <LoadingScreen loadingMessage={loadingMessage} appState={appState} />
        )}

        {appState === "result" && auditResult && (
          <div className="space-y-6">
            <ScoreCard score={auditResult.score} />

            <AnalysisResult parsedSummary={parsedSummary} />

            <button
              onClick={handleReset}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold"
            >
              Analyze Another Ad
            </button>
          </div>
        )}

        {appState === "upload" && (
          <div className="max-w-3xl mx-auto">

            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI Powered Ad Analysis
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">
                Optimize Your Ads with
                <span className="block text-indigo-400">
                  Intelligent Insights
                </span>
              </h1>
            </div>

            <UploadZone
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
              uploadedImage={uploadedImage}
              removeImage={removeImage}
            />

            <div className="mt-6">
              <label className="text-sm text-slate-300">
                Target Audience (optional)
              </label>

              <div className="mt-2 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <Users className="text-slate-400 w-5 h-5" />

                <input
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Young professionals interested in tech"
                  className="bg-transparent outline-none w-full text-white"
                />
              </div>
            </div>

            <button
              onClick={handleStartAudit}
              disabled={!uploadedImage}
              className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              Start AI Audit
            </button>
          </div>
        )}
      </div>

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
