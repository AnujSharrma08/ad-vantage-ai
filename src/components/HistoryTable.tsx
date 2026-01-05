"use client";

import { motion } from "framer-motion";
import { 
  Eye, 
  Trash2, 
  Download,
  Calendar,
  MoreHorizontal,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface AuditRecord {
  id: string;
  thumbnail: string;
  name: string;
  date: string;
  score: number;
  audience: string;
}

const mockData: AuditRecord[] = [
  {
    id: "1",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop",
    name: "Summer Sale Banner",
    date: "2026-01-06",
    score: 87,
    audience: "Young Adults 18-35"
  },
  {
    id: "2",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop",
    name: "Product Launch Ad",
    date: "2026-01-05",
    score: 72,
    audience: "Tech Enthusiasts"
  },
  {
    id: "3",
    thumbnail: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=100&h=100&fit=crop",
    name: "Holiday Campaign",
    date: "2026-01-04",
    score: 45,
    audience: "Families"
  },
  {
    id: "4",
    thumbnail: "https://images.unsplash.com/photo-1553484771-047a44eee27a?w=100&h=100&fit=crop",
    name: "Brand Awareness",
    date: "2026-01-03",
    score: 91,
    audience: "General Audience"
  },
  {
    id: "5",
    thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&h=100&fit=crop",
    name: "Retargeting Creative",
    date: "2026-01-02",
    score: 68,
    audience: "Previous Visitors"
  },
];

export default function HistoryTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return "score-excellent";
    if (score >= 60) return "score-good";
    if (score >= 40) return "score-average";
    return "score-poor";
  };

  const filteredData = mockData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.audience.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Audit History</h2>
          <p className="text-slate-400 mt-1">Review your past ad audits and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-medium">
            {mockData.length} audits
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or audience..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all text-sm font-medium">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-slate-800 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-900/50 border-b border-slate-800 text-sm font-medium text-slate-400">
          <div className="col-span-5 sm:col-span-4">Preview & Name</div>
          <div className="col-span-3 sm:col-span-3 hidden sm:block">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Date
            </div>
          </div>
          <div className="col-span-4 sm:col-span-2 text-center">Score</div>
          <div className="col-span-3 sm:col-span-3 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-800/50">
          {filteredData.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                <Search className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-slate-400">No audits found matching your search</p>
            </div>
          ) : (
            filteredData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center table-row-hover cursor-pointer"
              >
                {/* Preview & Name */}
                <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 ring-1 ring-slate-700">
                    <img 
                      src={item.thumbnail} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{item.name}</p>
                    <p className="text-xs text-slate-500 truncate">{item.audience}</p>
                  </div>
                </div>

                {/* Date */}
                <div className="col-span-3 sm:col-span-3 hidden sm:block">
                  <span className="text-sm text-slate-400">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {/* Score */}
                <div className="col-span-4 sm:col-span-2 flex justify-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBadgeClass(item.score)}`}>
                    {item.score}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-3 sm:col-span-3 flex items-center justify-end gap-1">
                  <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors sm:hidden" title="More">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-800 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Showing {filteredData.length} of {mockData.length} audits
          </span>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-sm font-medium">
              {currentPage}
            </span>
            <button 
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage >= Math.ceil(mockData.length / 5)}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

