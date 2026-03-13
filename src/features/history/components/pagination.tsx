import { ChevronLeft, ChevronRight } from "lucide-react";
import Translate from "../../global/components/Translate";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showingCount: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showingCount,
}: PaginationProps) {
  return (
    <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-800 flex items-center justify-between">
      <span className="text-sm text-slate-500">
        <Translate text="Showing" /> {showingCount} <Translate text="of" />{" "}
        {totalItems} <Translate text="audits" />
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-sm font-medium">
          {currentPage}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}