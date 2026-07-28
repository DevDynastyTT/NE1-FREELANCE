'use client'

type Props = {
  currentPage: number;       // 1-based overall page
  totalPages: number;        // total pages across all batches
  onPageChange: (page: number) => void;
  pageSize?: number;         // items per page (default 20)
  totalItems?: number;
};

const GROUP_SIZE = 5; // pages shown at once

export default function Pagination({ currentPage, totalPages, onPageChange, pageSize = 20, totalItems }: Props) {
  if (totalPages <= 1) return null;

  // Which group of 5 pages are we in? (0-based)
  const groupIndex = Math.floor((currentPage - 1) / GROUP_SIZE);
  const groupStart = groupIndex * GROUP_SIZE + 1;          // first page in this group
  const groupEnd = Math.min(groupStart + GROUP_SIZE - 1, totalPages); // last page in this group
  const pageInGroup = currentPage - groupStart + 1;        // 1-5 within the group
  const pagesInGroup = groupEnd - groupStart + 1;

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  // Range of items currently shown
  const fromItem = (currentPage - 1) * pageSize + 1;
  const toItem = Math.min(currentPage * pageSize, totalItems ?? currentPage * pageSize);

  return (
    <div className="flex items-center justify-between px-2 py-3 border-t border-gray-100">
      {/* Item count */}
      <p className="text-xs text-muted-foreground">
        {totalItems !== undefined
          ? `Showing ${fromItem}–${toItem} of ${totalItems}`
          : `Page ${currentPage} of ${totalPages}`}
      </p>

      <div className="flex items-center gap-1">
        {/* Left arrow — previous page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPrev}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Group indicator — X of 5 */}
        <div className="flex items-center gap-1 mx-1">
          {Array.from({ length: pagesInGroup }, (_, idx) => {
            const pageNum = groupStart + idx;
            const active = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${active
                  ? 'bg-[#fd8700] text-white shadow-sm'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Right arrow — next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNext}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Group / batch info */}
      <p className="text-xs text-muted-foreground tabular-nums">
        {pageInGroup} of {pagesInGroup}
      </p>
    </div>
  );
}
