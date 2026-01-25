"use client"; // Add this if using Next.js 13+ app directory

import React, { useState } from "react";
import {
  AlertCircle,
  Loader2,
  Mail,
  Sparkles,
  User,
  X,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation"; // or 'next/router' for pages directory
import {
  login,
  signUp,
  verifyOtp,
} from "@/src/services/auth/auth";
import { AnimatePresence, motion } from "framer-motion";
import { OtpResponse } from "@/src/types/auth-type";
import { LOCAL_STORAGE_KEYS } from "@/src/services/constants";

// Types
interface FormData {
  name: string;
  email: string;
}

interface Errors {
  name?: string;
  email?: string;
}

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerify: (otp: string) => Promise<void>;
  isLoading: boolean;
}

// OTP Modal Component
const OTPModal: React.FC<OTPModalProps> = ({
  isOpen,
  onClose,
  email,
  onVerify,
  isLoading,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    setError("");
    await onVerify(otpString);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white rounded-2xl p-8 max-w-md w-full relative shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Verify OTP
              </h2>
              <p className="text-gray-600 text-sm">
                Enter the 6-digit code sent to <br />
                <span className="font-semibold">{email}</span>
              </p>
            </div>

            <div className="flex gap-3 justify-center mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 text-black border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Didn&apos;t receive code?{" "}
              <button className="text-blue-600 font-semibold hover:underline">
                Resend
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Auth Page Component
const AuthScreen: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [formData, setFormData] = useState<FormData>({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (activeTab === "signup" && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGetOtp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (activeTab === "signup") {
        await signUp({ name: formData.name, email: formData.email });
      } else {
        await login({ email: formData.email });
      }

      setShowOtpModal(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      alert(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setIsLoading(true);

    try {
      const result: OtpResponse = await verifyOtp({
        email: formData.email,
        otp,
      });

      console.log("Login successful:", result);

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.USER,
        JSON.stringify(result.user)
      );

      router.push("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("OTP verification failed:", error);
      alert(error.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchTab = (tab: "signin" | "signup") => {
    setActiveTab(tab);
    setFormData({ name: "", email: "" });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AdVantage
            </h1>
          </div>
          <p className="text-slate-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            AI-Powered Marketing Intelligence
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl border border-slate-800 overflow-hidden shadow-2xl"
        >
          {/* Tab Switcher */}
          <div className="flex border-b border-slate-800 bg-slate-900/50">
            <button
              onClick={() => switchTab("signin")}
              className={`relative flex-1 py-4 text-center font-semibold transition-all ${
                activeTab === "signin"
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {activeTab === "signin" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-b-2 border-indigo-500"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Sign In</span>
            </button>
            <button
              onClick={() => switchTab("signup")}
              className={`relative flex-1 py-4 text-center font-semibold transition-all ${
                activeTab === "signup"
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {activeTab === "signup" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-b-2 border-indigo-500"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Sign Up</span>
            </button>
          </div>

          {/* Form */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === "signin" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === "signin" ? 20 : -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Name Field (Only for Sign Up) */}
                {activeTab === "signup" && (
                  <div className="mb-6">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all ${
                          errors.name ? "border-red-500/50" : "border-slate-800"
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </motion.p>
                    )}
                  </div>
                )}

                {/* Email Field */}
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all ${
                        errors.email ? "border-red-500/50" : "border-slate-800"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-2 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Get OTP Button */}
                <motion.button
                  onClick={handleGetOtp}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Get OTP
                    </>
                  )}
                </motion.button>

                {/* Footer Text */}
                <p className="text-center text-sm text-slate-400 mt-6">
                  {activeTab === "signin" ? (
                    <>
                      New to AdVantage?{" "}
                      <button
                        onClick={() => switchTab("signup")}
                        className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
                      >
                        Create account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => switchTab("signin")}
                        className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Privacy Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-slate-500 mt-6"
        >
          By continuing, you agree to our{" "}
          <a
            href="#"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Privacy Policy
          </a>
        </motion.p>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={formData.email}
        onVerify={handleVerifyOtp}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AuthScreen;
