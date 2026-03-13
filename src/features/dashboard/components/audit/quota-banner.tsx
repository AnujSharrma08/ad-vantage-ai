"use client";

import { Info } from "lucide-react";
import { motion } from "framer-motion";

interface Quota {
  remaining: number;
}

interface Profile {
  quota?: Quota;
}

interface Props {
  profile: Profile | null;
  setShowQuotaModal: (value: boolean) => void;
  setShowInfoModal: (value: boolean) => void;
}

export default function QuotaBanner({
  profile,
  setShowQuotaModal,
  setShowInfoModal,
}: Props) {
  if (!profile?.quota) return null;

  const remaining = profile.quota.remaining;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-6 rounded-xl p-4 border ${
        remaining <= 0
          ? "bg-red-500/10 border-red-500/30"
          : remaining <= 1
          ? "bg-yellow-500/10 border-yellow-500/30"
          : "bg-blue-500/10 border-blue-500/30"
      }`}
    >
      <div className="flex justify-between">
        <div className="flex gap-3">
          <Info className="text-indigo-400" />

          <div>
            <p className="text-white font-medium">
              {remaining <= 0
                ? "Free audits exhausted"
                : `${remaining} free audits remaining`}
            </p>

            <button
              onClick={() => setShowInfoModal(true)}
              className="text-indigo-400 underline text-sm"
            >
              Read more
            </button>
          </div>
        </div>

        {remaining <= 0 && (
          <button
            onClick={() => setShowQuotaModal(true)}
            className="px-4 py-2 bg-indigo-500 rounded-lg text-white"
          >
            Upgrade
          </button>
        )}
      </div>
    </motion.div>
  );
}
