import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiChevronLeft, FiChevronRight, FiInbox, FiDownload, FiRefreshCw, FiCheckSquare, FiSquare, FiX } from "react-icons/fi";
import { fadeUp } from "../../lib/animations";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";

const accentStyles = {
  orange: { header: "bg-gray-50/80 dark:bg-white/[0.03] border-gray-100 dark:border-white/5", rowHover: "hover:bg-orange-50/50 dark:hover:bg-orange-500/5", searchBorder: "border-gray-200 dark:border-white/10", searchFocus: "focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-500/20", pagination: "text-orange-600 dark:text-orange-400", activePage: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20", filterBg: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20", emptyIcon: "text-orange-200 dark:text-orange-800", selectBg: "bg-orange-50 dark:bg-orange-500/5 border-orange-200 dark:border-orange-500/20" },
  purple: { header: "bg-gray-50/80 dark:bg-white/[0.03] border-gray-100 dark:border-white/5", rowHover: "hover:bg-purple-50/50 dark:hover:bg-purple-500/5", searchBorder: "border-gray-200 dark:border-white/10", searchFocus: "focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-500/20", pagination: "text-purple-600 dark:text-purple-400", activePage: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20", filterBg: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20", emptyIcon: "text-purple-200 dark:text-purple-800", selectBg: "bg-purple-50 dark:bg-purple-500/5 border-purple-200 dark:border-purple-500/20" },
  emerald: { header: "bg-gray-50/80 dark:bg-white/[0.03] border-gray-100 dark:border-white/5", rowHover: "hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5", searchBorder: "border-gray-200 dark:border-white/10", searchFocus: "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-500/20", pagination: "text-emerald-600 dark:text-emerald-400", activePage: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20", filterBg: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20", emptyIcon: "text-emerald-200 dark:text-emerald-800", selectBg: "bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20" },
  cyan: { header: "bg-gray-50/80 dark:bg-white/[0.03] border-gray-100 dark:border-white/5", rowHover: "hover:bg-cyan-50/50 dark:hover:bg-cyan-500/5", searchBorder: "border-gray-200 dark:border-white/10", searchFocus: "focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-500/20", pagination: "text-cyan-600 dark:text-cyan-400", activePage: "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20", filterBg: "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20", emptyIcon: "text-cyan-200 dark:text-cyan-800", selectBg: "bg-cyan-50 dark:bg-cyan-500/5 border-cyan-200 dark:border-cyan-500/20" },
  yellow: { header: "bg-gray-50/80 dark:bg-white/[0.03] border-gray-100 dark:border-white/5", rowHover: "hover:bg-yellow-50/50 dark:hover:bg-yellow-500/5", searchBorder: "border-gray-200 dark:border-white/10", searchFocus: "focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 dark:focus:ring-yellow-500/20", pagination: "text-yellow-600 dark:text-yellow-400", activePage: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20", filterBg: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20", emptyIcon: "text-yellow-200 dark:text-yellow-800", selectBg: "bg-yellow-50 dark:bg-yellow-500/5 border-yellow-200 dark:border-yellow-500/20" },
  sky: { header: "bg-gray-50/80 dark:bg-white/[0.03] border-gray-100 dark:border-white/5", rowHover: "hover:bg-sky-50/50 dark:hover:bg-sky-500/5", searchBorder: "border-gray-200 dark:border-white/10", searchFocus: "focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-500/20", pagination: "text-sky-600 dark:text-sky-400", activePage: "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-500/20", filterBg: "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-500/20", emptyIcon: "text-sky-200 dark:text-sky-800", selectBg: "bg-sky-50 dark:bg-sky-500/5 border-sky-200 dark:border-sky-500/20" },
  pink: { header: "bg-gray-50/80 dark:bg-white/[0.03] border-gray-100 dark:border-white/5", rowHover: "hover:bg-pink-50/50 dark:hover:bg-pink-500/5", searchBorder: "border-gray-200 dark:border-white/10", searchFocus: "focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:focus:ring-pink-500/20", pagination: "text-pink-600 dark:text-pink-400", activePage: "bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-500/20", filterBg: "bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-500/20", emptyIcon: "text-pink-200 dark:text-pink-800", selectBg: "bg-pink-50 dark:bg-pink-500/5 border-pink-200 dark:border-pink-500/20" },
  red: { header: "bg-gray-50/80 dark:bg-white/[0.03] border-gray-100 dark:border-white/5", rowHover: "hover:bg-red-50/50 dark:hover:bg-red-500/5", searchBorder: "border-gray-200 dark:border-white/10", searchFocus: "focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-500/20", pagination: "text-red-600 dark:text-red-400", activePage: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20", filterBg: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20", emptyIcon: "text-red-200 dark:text-red-800", selectBg: "bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20" },
  royal: { header: "bg-gray-50/80 dark:bg-white/[0.03] border-gray-100 dark:border-white/5", rowHover: "hover:bg-blue-50/50 dark:hover:bg-blue-500/5", searchBorder: "border-gray-200 dark:border-white/10", searchFocus: "focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20", pagination: "text-blue-600 dark:text-blue-400", activePage: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20", filterBg: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20", emptyIcon: "text-blue-200 dark:text-blue-800", selectBg: "bg-blue-50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20" },
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
        <div key={i} className="px-6 py-4 border-b border-gray-50 dark:border-gray-700/50 flex gap-4 items-center">
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
  data = [], columns = [], accent = "orange", searchPlaceholder = "Search...",
  searchKey = "name", filterOptions = [], filterKey = "status", rowsPerPage = 5,
  onAdd, addLabel = "Add New", addAction, onRowClick, actions,
  emptyMessage = "No items found", emptyIcon, loading = false, headerExtra,
  onRefresh, onExport, exportLabel = "Export",
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const styles = accentStyles[accent] || accentStyles.orange;

  const filtered = useMemo(() => {
    let result = data;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) => String(item[searchKey] || "").toLowerCase().includes(q));
    }
    if (filter !== "all" && filterKey) {
      result = result.filter((item) => item[filterKey] === filter);
    }
    return result;
  }, [data, search, filter, searchKey, filterKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const handleFilterToggle = (value) => { setFilter((prev) => (prev === value ? "all" : value)); setPage(1); setSelected(new Set()); };

  const allPageSelected = paginated.length > 0 && paginated.every((item) => selected.has(item.id));
  const someSelected = paginated.some((item) => selected.has(item.id));

  const toggleSelectAll = useCallback(() => {
    if (allPageSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        paginated.forEach((item) => next.delete(item.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        paginated.forEach((item) => next.add(item.id));
        return next;
      });
    }
  }, [allPageSelected, paginated]);

  const toggleSelect = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    onRefresh?.();
    setTimeout(() => setRefreshing(false), 800);
  }, [onRefresh]);

  const handleExport = useCallback(() => {
    const exportData = selected.size > 0
      ? filtered.filter((item) => selected.has(item.id))
      : filtered;
    const headers = columns.filter((c) => c.key !== "image").map((c) => c.label);
    const rows = exportData.map((item) =>
      columns.filter((c) => c.key !== "image").map((c) => {
        const val = item[c.key];
        return typeof val === "string" ? val.replace(/,/g, ";") : val ?? "";
      })
    );
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${searchKey}-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onExport?.();
  }, [selected, filtered, columns, searchKey, onExport]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
          <Skeleton variant="shimmer" className="h-10 w-64 rounded-xl" />
          <Skeleton variant="shimmer" className="h-10 w-24 rounded-xl" />
        </div>
        <TableSkeleton columns={columns.length} accent={accent} />
      </div>
    );
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border ${styles.searchBorder} transition-all duration-300 w-full sm:w-72 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-500/20 focus-within:border-blue-300 dark:focus-within:border-blue-500/30`}>
          <FiSearch className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
          <input type="text" placeholder={searchPlaceholder} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); setSelected(new Set()); }} className="bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none w-full" />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {filterOptions.map((opt) => (
            <button key={opt.value} onClick={() => handleFilterToggle(opt.value)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${filter === opt.value ? styles.filterBg : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10"}`}>
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
          {selected.size > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${styles.selectBg} border`}>
                {selected.size} selected
              </span>
              <button onClick={clearSelection} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Clear selection">
                <FiX className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
          {onRefresh && (
            <button onClick={handleRefresh} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200" title="Refresh" disabled={refreshing}>
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          )}
          {onExport && (
            <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-all duration-200" title="Export data">
              <FiDownload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{exportLabel}</span>
            </button>
          )}
          {headerExtra}
          {addAction}
          {onAdd && <Button variant={accent} size="sm" onClick={onAdd}>{addLabel}</Button>}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className={`p-5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 mb-4 ${styles.emptyIcon}`}>
            {emptyIcon || <FiInbox className="w-10 h-10" />}
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${styles.header} border-b`}>
                  {actions && (
                    <th className="w-12 px-4 py-3">
                      <button onClick={toggleSelectAll} className="flex items-center justify-center" aria-label="Select all">
                        {allPageSelected ? (
                          <FiCheckSquare className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        ) : (
                          <FiSquare className={`w-4 h-4 ${someSelected ? "text-gray-400" : "text-gray-300 dark:text-gray-600"}`} />
                        )}
                      </button>
                    </th>
                  )}
                  {columns.map((col) => (
                    <th key={col.key} className={`text-left text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-6 py-3 ${col.align === "right" ? "text-right" : ""} ${col.width || ""}`}>
                      {col.label}
                    </th>
                  ))}
                  {actions && <th className="text-right text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-6 py-3 w-28">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                <AnimatePresence>
                  {paginated.map((item, i) => (
                    <motion.tr key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.02 }} className={`${styles.rowHover} transition-colors ${selected.has(item.id) ? styles.selectBg : ""}`}>
                      {actions && (
                        <td className="w-12 px-4 py-3.5">
                          <button onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }} className="flex items-center justify-center" aria-label={`Select ${item.id}`}>
                            {selected.has(item.id) ? (
                              <FiCheckSquare className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            ) : (
                              <FiSquare className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                            )}
                          </button>
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className="px-6 py-3.5 text-sm text-gray-700 dark:text-gray-200" onClick={onRowClick ? () => onRowClick(item) : undefined}>
                          {col.render ? col.render(item[col.key], item) : item[col.key]}
                        </td>
                      ))}
                      {actions && (
                        <td className="px-6 py-3.5">
                          <div className="flex items-center justify-end gap-1">{actions(item)}</div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-gray-50 dark:divide-gray-700/50">
            {paginated.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} className={`p-4 ${styles.rowHover} transition-colors ${selected.has(item.id) ? styles.selectBg : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1" onClick={onRowClick ? () => onRowClick(item) : undefined}>
                    {columns.slice(0, 3).map((col) => (
                      <div key={col.key} className="mb-1">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-2">{col.label}:</span>
                        <span className="text-sm text-gray-700 dark:text-gray-200">{col.render ? col.render(item[col.key], item) : item[col.key]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {actions && (
                      <button onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors">
                        {selected.has(item.id) ? <FiCheckSquare className="w-4 h-4 text-gray-600 dark:text-gray-300" /> : <FiSquare className="w-4 h-4" />}
                      </button>
                    )}
                    {actions && actions(item)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="px-5 py-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
              <p className="text-xs text-gray-400 dark:text-gray-500">Showing {(safePage - 1) * rowsPerPage + 1}-{Math.min(safePage * rowsPerPage, filtered.length)} of {filtered.length}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                  .reduce((acc, p, i, arr) => { if (i > 0 && p - arr[i - 1] > 1) acc.push(`dots-${p}`); acc.push(p); return acc; }, [])
                  .map((p) => typeof p === "string" ? (
                    <span key={p} className="w-8 h-8 flex items-center text-xs text-gray-300 dark:text-gray-600">...</span>
                  ) : (
                    <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium border transition-all duration-200 ${safePage === p ? styles.activePage : "border-gray-200 dark:border-gray-600 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>{p}</button>
                  ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
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
