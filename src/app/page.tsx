"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Users,
  Loader2,
  X,
  FileImage
} from "lucide-react";
import AuditResult from "../components/AuditResult";

type AppState = "upload" | "processing" | "result";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [targetAudience, setTargetAudience] = useState("");
  const [score, setScore] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
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
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1
  });

  const handleStartAudit = async () => {
    if (!uploadedImage) return;
    
    setAppState("processing");
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate a realistic score
    const generatedScore = Math.floor(Math.random() * 30) + 65; // 65-95 range
    setScore(generatedScore);
    setAppState("result");
  };

  const handleReset = () => {
    setAppState("upload");
    setUploadedImage(null);
    setTargetAudience("");
    setScore(0);
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  return (
    <div className="min-h-screen bg-grid">
      <AnimatePresence mode="wait">
        {appState === "result" ? (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AuditResult 
              imageUrl={uploadedImage!} 
              score={score}
              onReset={handleReset}
            />
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
                Upload your ad creative and get instant AI-powered feedback on visuals, 
                copy effectiveness, and conversion potential.
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
                  dropzone relative rounded-2xl p-8 md:p-12 cursor-pointer
                  transition-all duration-300 overflow-hidden
                  ${isDragActive ? "dropzone-active" : ""}
                  ${uploadedImage ? "border-indigo-500/50" : ""}
                `}
              >
                <input {...getInputProps()} />
                
                {uploadedImage ? (
                  <div className="relative">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 max-w-md mx-auto">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded preview" 
                        className="w-full h-full object-contain"
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
                        scale: isDragActive ? 1.1 : 1
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
                      {isDragActive ? "Drop your image here" : "Upload your ad creative"}
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

                {/* Decorative elements */}
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
                Target Audience
              </label>
              <div className="glass rounded-xl p-1">
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
                disabled={!uploadedImage || appState === "processing"}
                className={`
                  btn-glow w-full py-4 px-8 rounded-xl text-white font-semibold text-lg
                  flex items-center justify-center gap-3
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  disabled:shadow-none
                `}
                whileHover={{ scale: uploadedImage ? 1.02 : 1 }}
                whileTap={{ scale: uploadedImage ? 0.98 : 1 }}
              >
                {appState === "processing" ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-5 h-5" />
                    </motion.div>
                    Analyzing your ad...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Start Audit
                  </>
                )}
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
                { label: "Visual Analysis", desc: "Color, composition & hierarchy" },
                { label: "Copy Review", desc: "Headlines, CTAs & messaging" },
                { label: "Conversion Tips", desc: "Optimization suggestions" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.label}
                  className="glass rounded-xl p-4 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <p className="text-sm font-medium text-white">{feature.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
