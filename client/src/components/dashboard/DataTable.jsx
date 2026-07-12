import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiInbox,
  FiFilter,
} from "react-icons/fi";
import { fadeUp } from "../../lib/animations";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";

const accentStyles = {
  orange: {
    header: "bg-orange-500/5 border-orange-500/10",
    rowHover: "hover:bg-orange-500/5",
    searchBorder: "border-orange-500/20",
    searchFocus: "focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/10",
    pagination: "text-orange-400",
    activePage: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    filterBg: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    emptyIcon: "text-orange-500/20",
  },
  purple: {
    header: "bg-purple-500/5 border-purple-500/10",
    rowHover: "hover:bg-purple-500/5",
    searchBorder: "border-purple-500/20",
    searchFocus: "focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/10",
    pagination: "text-purple-400",
    activePage: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    filterBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    emptyIcon: "text-purple-500/20",
  },
  emerald: {
    header: "bg-emerald-500/5 border-emerald-500/10",
    rowHover: "hover:bg-emerald-500/5",
    searchBorder: "border-emerald-500/20",
    searchFocus: "focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10",
    pagination: "text-emerald-400",
    activePage: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    filterBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    emptyIcon: "text-emerald-500/20",
  },
  cyan: {
    header: "bg-cyan-500/5 border-cyan-500/10",
    rowHover: "hover:bg-cyan-500/5",
    searchBorder: "border-cyan-500/20",
    searchFocus: "focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-500/10",
    pagination: "text-cyan-400",
    activePage: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    filterBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    emptyIcon: "text-cyan-500/20",
  },
  yellow: {
    header: "bg-yellow-500/5 border-yellow-500/10",
    rowHover: "hover:bg-yellow-500/5",
    searchBorder: "border-yellow-500/20",
    searchFocus: "focus:border-yellow-500/40 focus:ring-2 focus:ring-yellow-500/10",
    pagination: "text-yellow-400",
    activePage: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    filterBg: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    emptyIcon: "text-yellow-500/20",
  },
  sky: {
    header: "bg-sky-500/5 border-sky-500/10",
    rowHover: "hover:bg-sky-500/5",
    searchBorder: "border-sky-500/20",
    searchFocus: "focus:border-sky-500/40 focus:ring-2 focus:ring-sky-500/10",
    pagination: "text-sky-400",
    activePage: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    filterBg: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    emptyIcon: "text-sky-500/20",
  },
  pink: {
    header: "bg-pink-500/5 border-pink-500/10",
    rowHover: "hover:bg-pink-500/5",
    searchBorder: "border-pink-500/20",
    searchFocus: "focus:border-pink-500/40 focus:ring-2 focus:ring-pink-500/10",
    pagination: "text-pink-400",
    activePage: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    filterBg: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    emptyIcon: "text-pink-500/20",
  },
  red: {
    header: "bg-red-500/5 border-red-500/10",
    rowHover: "hover:bg-red-500/5",
    searchBorder: "border-red-500/20",
    searchFocus: "focus:border-red-500/40 focus:ring-2 focus:ring-red-500/10",
    pagination: "text-red-400",
    activePage: "bg-red-500/15 text-red-400 border-red-500/30",
    filterBg: "bg-red-500/10 text-red-400 border-red-500/20",
    emptyIcon: "text-red-500/20",
  },
  royal: {
    header: "bg-blue-600/5 border-blue-600/10",
    rowHover: "hover:bg-blue-600/5",
    searchBorder: "border-blue-600/20",
    searchFocus: "focus:border-blue-600/40 focus:ring-2 focus:ring-blue-600/10",
    pagination: "text-blue-500",
    activePage: "bg-blue-600/15 text-blue-500 border-blue-600/30",
    filterBg: "bg-blue-600/10 text-blue-500 border-blue-600/20",
    emptyIcon: "text-blue-600/20",
  },
};

function TableSkeleton({ columns, accent = "orange" }) {
  const styles = accentStyles[accent] || accentStyles.orange;
  return (
    <div className="overflow-hidden">
      <div className={`${styles.header} px-6 py-3 border-b flex gap-4`}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="shimmer" className="h-3 flex-1 rounded" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="px-6 py-4 border-b border-white/[0.03] flex gap-4 items-center"
        >
          <Skeleton variant="shimmer" className="h-4 flex-1 rounded" />
          <Skeleton variant="shimmer" className="h-4 flex-1 rounded" />
          <Skeleton variant="shimmer" className="h-4 w-20 rounded" />
          <Skeleton variant="shimmer" className="h-6 w-16 rounded-full" />
          <Skeleton variant="shimmer" className="h-4 w-24 rounded" />
        </div>
      ))}
    </div>
  );
}

function DataTable({
  data = [],
  columns = [],
  accent = "orange",
  searchPlaceholder = "Search...",
  searchKey = "name",
  filterOptions = [],
  filterKey = "status",
  rowsPerPage = 5,
  onAdd,
  addLabel = "Add New",
  addAction,
  onRowClick,
  actions,
  emptyMessage = "No items found",
  emptyIcon,
  loading = false,
  headerExtra,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const styles = accentStyles[accent] || accentStyles.orange;

  const filtered = useMemo(() => {
    let result = data;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        String(item[searchKey] || "")
          .toLowerCase()
          .includes(q)
      );
    }
    if (filter !== "all" && filterKey) {
      result = result.filter((item) => item[filterKey] === filter);
    }
    return result;
  }, [data, search, filter, searchKey, filterKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  const handleFilterToggle = (value) => {
    setFilter((prev) => (prev === value ? "all" : value));
    setPage(1);
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
          <Skeleton variant="shimmer" className="h-10 w-64 rounded-xl" />
          <Skeleton variant="shimmer" className="h-10 w-24 rounded-xl" />
        </div>
        <TableSkeleton columns={columns.length} accent={accent} />
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-white/5 overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border ${styles.searchBorder} transition-all duration-300 w-full sm:w-72`}
        >
          <FiSearch className="w-4 h-4 text-white/25 shrink-0" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="bg-transparent text-sm text-white/70 placeholder:text-white/20 outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleFilterToggle(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                filter === opt.value
                  ? styles.filterBg
                  : "bg-white/[0.03] border-white/5 text-white/40 hover:text-white/60 hover:bg-white/[0.05]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          {headerExtra}
          {addAction}
          {onAdd && (
            <Button variant={accent} size="sm" onClick={onAdd}>
              <FiFilter className="w-3.5 h-3.5 sm:hidden" />
              {addLabel}
            </Button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className={`p-5 rounded-2xl bg-white/[0.03] mb-4 ${styles.emptyIcon}`}>
            {emptyIcon || <FiInbox className="w-10 h-10" />}
          </div>
          <p className="text-white/60 font-medium">{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${styles.header} border-b`}>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`text-left text-[10px] font-semibold text-white/30 uppercase tracking-wider px-6 py-3 ${
                        col.align === "right" ? "text-right" : ""
                      } ${col.width || ""}`}
                    >
                      {col.label}
                    </th>
                  ))}
                  {actions && (
                    <th className="text-right text-[10px] font-semibold text-white/30 uppercase tracking-wider px-6 py-3 w-28">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                <AnimatePresence>
                  {paginated.map((item, i) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: i * 0.03 }}
                      className={`${styles.rowHover} transition-colors cursor-pointer`}
                      onClick={() => onRowClick?.(item)}
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="px-6 py-3.5 text-sm text-white/60"
                        >
                          {col.render
                            ? col.render(item[col.key], item)
                            : item[col.key]}
                        </td>
                      ))}
                      {actions && (
                        <td className="px-6 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            {actions(item)}
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-white/[0.03]">
            {paginated.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`p-4 ${styles.rowHover} transition-colors`}
                onClick={() => onRowClick?.(item)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {columns.slice(0, 3).map((col) => (
                      <div key={col.key} className="mb-1">
                        <span className="text-[10px] text-white/25 uppercase tracking-wider mr-2">
                          {col.label}:
                        </span>
                        <span className="text-sm text-white/70">
                          {col.render
                            ? col.render(item[col.key], item)
                            : item[col.key]}
                        </span>
                      </div>
                    ))}
                  </div>
                  {actions && (
                    <div className="flex items-center gap-1 shrink-0">
                      {actions(item)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
              <p className="text-xs text-white/25">
                Showing {(safePage - 1) * rowsPerPage + 1}-
                {Math.min(safePage * rowsPerPage, filtered.length)} of{" "}
                {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1
                  )
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1)
                      acc.push(`dots-${p}`);
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p) =>
                    typeof p === "string" ? (
                      <span
                        key={p}
                        className="w-8 h-8 flex items-center text-xs text-white/20"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium border transition-all duration-200 ${
                          safePage === p
                            ? styles.activePage
                            : "border-transparent text-white/30 hover:text-white/60 hover:bg-white/5"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

export default DataTable;
