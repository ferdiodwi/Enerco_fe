interface PaginationProps {
  from: number;
  to: number;
  total: number;
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ from, to, total, currentPage, lastPage, onPageChange }: PaginationProps) {
  if (total === 0) return null;

  // Generate page numbers with ellipsis
  const pages: (number | "...")[] = [];
  if (lastPage <= 7) {
    for (let i = 1; i <= lastPage; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(lastPage - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < lastPage - 2) pages.push("...");
    pages.push(lastPage);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Menampilkan <span className="font-semibold text-gray-800 dark:text-white">{from}</span> sampai <span className="font-semibold text-gray-800 dark:text-white">{to}</span> dari <span className="font-semibold text-gray-800 dark:text-white">{total}</span> data
      </div>
      {lastPage > 1 && (
        <div className="flex gap-1.5 items-center">
          {/* Prev */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors border bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            ‹
          </button>

          {pages.map((page, idx) =>
            page === "..." ? (
              <span key={`dots-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors border ${
                  page === currentPage
                    ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                {page}
              </button>
            )
          )}

          {/* Next */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= lastPage}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors border bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
