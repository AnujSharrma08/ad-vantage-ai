"use client";

import { Upload, FileImage, ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface UploadZoneProps {
  getRootProps: () => React.HTMLAttributes<HTMLDivElement>;
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
  isDragActive: boolean;
  uploadedImage: string | null;
  removeImage: () => void;
}

export default function UploadZone({
  getRootProps,
  getInputProps,
  isDragActive,
  uploadedImage,
  removeImage,
}: UploadZoneProps) {
  return (
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
              fill
              className="object-contain"
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white"
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
          <motion.div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30">
            {isDragActive ? (
              <FileImage className="w-10 h-10 text-indigo-400" />
            ) : (
              <Upload className="w-10 h-10 text-indigo-400" />
            )}
          </motion.div>

          <h3 className="text-xl font-semibold text-white mb-2">
            {isDragActive ? "Drop your image here" : "Upload your ad creative"}
          </h3>

          <p className="text-slate-400 mb-4">Drag & drop or click to browse</p>

          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <ImageIcon className="w-4 h-4" />
            PNG, JPG, WEBP up to 10MB
          </div>
        </div>
      )}
    </div>
  );
}
