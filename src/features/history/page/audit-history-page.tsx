"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Trash2,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { LOCAL_STORAGE_KEYS } from "@/src/services/constants";
import { fetchAuditById, fetchAuditHistory } from "@/src/services/audit/audit";
import Translate from "../../global/components/Translate";
import Pagination from "../components/pagination";
import AuditDetailModal from "../components/models/audit-model";
import { S3_BASE_URL } from "@/src/services/api-key";
import Image from "next/image";

interface AuditItem {
  id: number;
  s3_key: string;
  target_audience: string;
  score: number;
  created_at: string;
}

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

export default function AuditHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [audits, setAudits] = useState<AuditItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedAudit, setSelectedAudit] = useState<AuditDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingAuditId, setLoadingAuditId] = useState<number | null>(null);

  const itemsPerPage = 5;

  // Get user ID from localStorage
  const getUserId = () => {
    try {
      const user = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || "{}"
      );
      return user.id?.toString() || "";
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return "";
    }
  };

  // Fetch audit history
  const loadAuditHistory = async (page: number) => {
    const userId = getUserId();
    if (!userId) {
      console.error("User not found. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchAuditHistory(userId, page, itemsPerPage);
      setAudits(response.items || []);
      setTotalItems(response.total || 0);
    } catch (error) {
      console.error("Error fetching audit history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and page change
  useEffect(() => {
    loadAuditHistory(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle view audit details
  const handleViewAudit = async (auditId: number) => {
    setLoadingAuditId(auditId);
    try {
      const auditDetail = await fetchAuditById(auditId.toString());
      setSelectedAudit(auditDetail);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching audit details:", error);
    } finally {
      setLoadingAuditId(null);
    }
  };

  // Handle delete (coming soon)
  const handleDelete = (auditId: number) => {
    console.log("Delete feature coming soon!", auditId);
  };

  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return "score-excellent";
    if (score >= 60) return "score-good";
    if (score >= 40) return "score-average";
    return "score-poor";
  };

  // Client-side filtering
  const filteredData = audits.filter((item) =>
    item.target_audience.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Translate
              text="Audit History"
              as="h2"
              className="text-2xl font-bold text-white"
            />
            <Translate
              text="Review your past ad audits and performance"
              as="p"
              className="text-slate-400 mt-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-medium">
              {totalItems} <Translate text="audits" />
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by audience..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all text-sm font-medium">
            <Filter className="w-4 h-4" />
            <Translate text="Filters" />
          </button>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl border border-slate-800 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-900/50 border-b border-slate-800 text-sm font-medium text-slate-400">
            <div className="col-span-5 sm:col-span-4">
              <Translate text="Preview & Audience" />
            </div>
            <div className="col-span-3 sm:col-span-3 hidden sm:block">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <Translate text="Date" />
              </div>
            </div>
            <div className="col-span-4 sm:col-span-2 text-center">
              <Translate text="Score" />
            </div>
            <div className="col-span-3 sm:col-span-3 text-right">
              <Translate text="Actions" />
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-800/50">
            {loading ? (
              <div className="px-6 py-12 text-center">
                <Loader2 className="w-8 h-8 mx-auto text-indigo-500 animate-spin" />
                <Translate
                  text="Loading audits..."
                  as="p"
                  className="text-slate-400 mt-3"
                />
              </div>
            ) : filteredData.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                  <Search className="w-6 h-6 text-slate-600" />
                </div>
                <Translate
                  text="No audits found matching your search"
                  as="p"
                  className="text-slate-400"
                />
              </div>
            ) : (
              filteredData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center table-row-hover"
                >
                  {/* Preview & Audience */}
                  <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 ring-1 ring-slate-700">
                      <Image
                        src={`${S3_BASE_URL}${item.s3_key}`}
                        alt={item.target_audience}
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                        priority
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">
                        <Translate text="Ad Audit" /> {index + 1}
                      </p>
                      <Translate
                        text={item.target_audience}
                        as="p"
                        className="text-xs text-slate-500 truncate"
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div className="col-span-3 sm:col-span-3 hidden sm:block">
                    <span className="text-sm text-slate-400">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="col-span-4 sm:col-span-2 flex justify-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBadgeClass(
                        item.score
                      )}`}
                    >
                      {item.score}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 sm:col-span-3 flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleViewAudit(item.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                      title="View"
                      disabled={loadingAuditId === item.id}
                    >
                      {loadingAuditId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors sm:hidden"
                      title="More"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && filteredData.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              showingCount={filteredData.length}
            />
          )}
        </div>
      </motion.div>

      {/* Audit Detail Modal */}
      <AuditDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        audit={selectedAudit}
        s3BaseUrl={S3_BASE_URL}
      />
    </>
  );
}
