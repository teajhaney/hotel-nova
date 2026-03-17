'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Room listing pagination" className="flex items-center justify-center gap-2 mt-10">
      {/* Previous */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-sm flex items-center justify-center
                   border border-[#E2E8F0] text-[#64748B]
                   hover:border-[#020887] hover:text-[#020887]
                   disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors duration-150 cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-sm flex items-center justify-center
                     text-[14px] font-medium transition-colors duration-150 cursor-pointer
                     ${page === currentPage
                       ? 'bg-[#020887] text-white border border-[#020887]'
                       : 'border border-[#E2E8F0] text-[#64748B] hover:border-[#020887] hover:text-[#020887]'
                     }`}
          aria-current={page === currentPage ? 'page' : undefined}
          aria-label={`Page ${page}`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-sm flex items-center justify-center
                   border border-[#E2E8F0] text-[#64748B]
                   hover:border-[#020887] hover:text-[#020887]
                   disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors duration-150 cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}
