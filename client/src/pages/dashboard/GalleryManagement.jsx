import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiGrid,
  FiStar,
  FiFolder,
  FiHardDrive,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { Button, SavedBadge, FileUpload } from "../../components/ui";
import { staggerContainer, fadeUp } from "../../lib/animations";
import PageBanner from "../../components/dashboard/PageBanner";
import StatCard from "../../components/dashboard/StatCard";
import CmsModal from "../../components/dashboard/CmsModal";
import CmsBadge from "../../components/dashboard/CmsBadge";
import ConfirmModal from "../../components/dashboard/ConfirmModal";
import { getInputClass, getSelectClass } from "../../lib/dashboardHelpers";
import { useAuth } from "../../context/AuthContext";
import {
  getGalleryImages,
  getGalleryStats,
  getGalleryCategories,
} from "../../lib/galleryData";

const emptyForm = {
  title: "",
  category: "",
  description: "",
  image: "",
  featured: false,
};

const categoryColors = {
  Facility: "bg-sky-500/80",
  Training: "bg-blue-500/80",
  Strength: "bg-orange-500/80",
  Cardio: "bg-red-500/80",
  CrossFit: "bg-amber-500/80",
  Yoga: "bg-emerald-500/80",
  Classes: "bg-violet-500/80",
  Equipment: "bg-cyan-500/80",
  Wellness: "bg-pink-500/80",
};

function GallerySkeleton() {
  const heights = ["h-52", "h-64", "h-72", "h-80"];
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <div
          key={i}
          className="break-inside-avoid rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <div
            className={`animate-pulse bg-gray-100 dark:bg-gray-700/50 ${heights[i % 4]}`}
          />
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="animate-pulse rounded-full bg-gray-100 dark:bg-gray-700/50 h-5 w-16" />
            </div>
            <div className="animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700/50 h-4 w-3/4" />
            <div className="animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700/50 h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function GalleryCard({ image, index, onView, onEdit, onDelete }) {
  const { isAdmin } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const heights = ["h-52", "h-64", "h-72", "h-80"];
  const heightClass = heights[index % heights.length];

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="break-inside-avoid mb-4 group"
    >
      <div className="relative rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg shadow-gray-100 dark:shadow-gray-900 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-500">
        <div className={`relative ${heightClass} overflow-hidden cursor-pointer`} onClick={() => onView(image)}>
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 animate-pulse bg-gray-100" />
          )}

          {hasError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 gap-2">
              <FiImage className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              <span className="text-xs text-gray-400 dark:text-gray-500">Failed to load</span>
            </div>
          ) : (
            <img
              src={image.image}
              alt={image.title}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute top-3 left-3 z-10">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold text-white backdrop-blur-sm ${
                categoryColors[image.category] || "bg-sky-500/80"
              }`}
            >
              {image.category}
            </span>
          </div>

          {image.featured && (
            <div className="absolute top-3 right-3 z-10">
              <span className="w-8 h-8 rounded-full bg-amber-500/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <FiStar className="w-4 h-4 text-white fill-white" />
              </span>
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100 z-10">
            <button
              onClick={(e) => { e.stopPropagation(); onView(image); }}
              className="w-10 h-10 rounded-full bg-sky-500/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-sky-500 transition-colors shadow-lg"
              aria-label={`View ${image.title}`}
            >
              <FiEye className="w-4 h-4" />
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(image); }}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-600 backdrop-blur-sm flex items-center justify-center text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors shadow-lg border border-gray-200 dark:border-gray-500"
                  aria-label={`Edit ${image.title}`}
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(image); }}
                  className="w-10 h-10 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
                  aria-label={`Delete ${image.title}`}
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">
            {image.title}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{image.category}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-[11px] text-gray-400 dark:text-gray-500">{image.updatedAt}</p>
            <button
              onClick={(e) => { e.stopPropagation(); onView(image); }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-colors"
            >
              <FiEye className="w-3 h-3" />
              View
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GalleryManagement() {
  const { isAdmin } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [page, setPage] = useState(1);
  const inputClass = getInputClass("sky");
  const categories = getGalleryCategories();
  const perPage = 9;

  useEffect(() => {
    setImages(getGalleryImages());
    setLoading(false);
  }, []);

  const stats = getGalleryStats(images);

  const filtered = images.filter((img) => {
    const matchesSearch = img.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || img.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({
      title: item.title || "",
      category: item.category || "",
      description: item.description || "",
      image: item.image || "",
      featured: item.featured || false,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setDeleteTarget(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editing) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === editing ? { ...img, ...form, updatedAt: "Just now" } : img
        )
      );
    } else {
      setImages((prev) => [
        {
          id: Date.now(),
          ...form,
          status: "active",
          updatedAt: "Just now",
        },
        ...prev,
      ]);
    }
    setShowModal(false);
    setForm(emptyForm);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFilterChange = (cat) => {
    setFilterCategory(cat);
    setPage(1);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const openLightbox = useCallback((image) => {
    const idx = filtered.findIndex((img) => img.id === image.id);
    setViewItem(image);
    setLightboxIndex(idx >= 0 ? idx : 0);
  }, [filtered]);

  const closeLightbox = useCallback(() => {
    setViewItem(null);
    setLightboxIndex(-1);
  }, []);

  const prevImage = useCallback(() => {
    if (filtered.length === 0) return;
    const newIdx = (lightboxIndex - 1 + filtered.length) % filtered.length;
    setLightboxIndex(newIdx);
    setViewItem(filtered[newIdx]);
  }, [lightboxIndex, filtered]);

  const nextImage = useCallback(() => {
    if (filtered.length === 0) return;
    const newIdx = (lightboxIndex + 1) % filtered.length;
    setLightboxIndex(newIdx);
    setViewItem(filtered[newIdx]);
  }, [lightboxIndex, filtered]);

  useEffect(() => {
    if (!viewItem) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [viewItem, closeLightbox, prevImage, nextImage]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageBanner pageKey="gallery" subtitle="Manage your fitness gallery images" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FiImage}
          label="Total Images"
          value={stats.total}
          pageKey="gallery"
          index={0}
        />
        <StatCard
          icon={FiStar}
          label="Featured Images"
          value={stats.featured}
          pageKey="gallery"
          index={1}
        />
        <StatCard
          icon={FiFolder}
          label="Albums"
          value={stats.albums}
          pageKey="gallery"
          index={2}
        />
        <StatCard
          icon={FiHardDrive}
          label="Storage Used"
          value={stats.storage}
          pageKey="gallery"
          index={3}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <FiGrid className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hidden" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search images..."
              className={`${inputClass} !pl-10`}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleFilterChange("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                filterCategory === "All"
                  ? "bg-sky-100 text-sky-600 border border-sky-200"
                    : "bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleFilterChange(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  filterCategory === cat.value
                    ? "bg-sky-100 text-sky-600 border border-sky-200"
                  : "bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        {isAdmin && (
          <Button variant="sky" size="sm" onClick={openAdd}>
            <FiImage className="w-4 h-4" />
            Add Image
          </Button>
        )}
      </div>

      {loading ? (
        <GallerySkeleton />
      ) : paged.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <FiImage className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">No images found</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="columns-1 sm:columns-2 lg:columns-3 gap-4"
        >
          {paged.map((img, i) => (
            <GalleryCard
              key={img.id}
              image={img}
              index={i}
              onView={openLightbox}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </motion.div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all duration-200 ${
                page === p
                  ? "bg-sky-100 text-sky-600 border border-sky-200"
                  : "text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {p}
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {isAdmin && (
        <CmsModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
            setForm(emptyForm);
          }}
          title={editing ? "Edit Image" : "Add Image"}
          subtitle="Configure your gallery image details"
          size="lg"
        >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FileUpload
                label="Upload Image"
                value={form.image}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setForm((p) => ({ ...p, image: URL.createObjectURL(file) }));
                  }
                }}
                color="sky"
              />
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="Image title"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5">
                  Category
                </label>
                <div className="select-wrapper">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  className={getSelectClass("sky")}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={3}
                  placeholder="Image description..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, featured: e.target.checked }))
                  }
                  className="w-4 h-4 rounded-md border border-gray-200 bg-gray-50 checked:bg-sky-500 checked:border-sky-500 transition-all duration-200 cursor-pointer accent-sky-500"
                />
                <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                  Featured Image
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Preview
              </p>
              <div className="rounded-xl border border-sky-100 dark:border-sky-800/50 overflow-hidden bg-gray-50 dark:bg-gray-700/50">
                {form.image ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-sky-50 to-cyan-50/50 dark:from-sky-900/20 dark:to-cyan-900/20 flex items-center justify-center">
                    <FiImage className="w-10 h-10 text-sky-200 dark:text-sky-700" />
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    {form.category && (
                      <span className="px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-[10px] font-bold">
                        {form.category}
                      </span>
                    )}
                    {form.featured && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold flex items-center gap-1">
                        <FiStar className="w-2.5 h-2.5 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {form.title || "Image Title"}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2">
                    {form.description ||
                      "Image description will appear here..."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button type="submit" variant="sky" size="md">
              {editing ? "Update Image" : "Save Image"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => {
                setShowModal(false);
                setEditing(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </Button>
            <SavedBadge show={saved} />
          </div>
        </form>
      </CmsModal>
      )}

      <AnimatePresence>
        {viewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Close"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 z-50 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
              {lightboxIndex + 1} / {filtered.length}
            </div>

            {/* Previous button */}
            {filtered.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Previous image"
              >
                <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Next button */}
            {filtered.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Next image"
              >
                <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Image container */}
            <motion.div
              key={viewItem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={viewItem.image}
                alt={viewItem.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
              />

              {/* Image info */}
              <div className="mt-4 text-center px-4 max-w-2xl">
                <div className="flex items-center justify-center gap-2 flex-wrap mb-2">
                  {viewItem.category && (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white ${
                        categoryColors[viewItem.category] || "bg-sky-500/80"
                      }`}
                    >
                      {viewItem.category}
                    </span>
                  )}
                  {viewItem.featured && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/80 text-white text-[11px] font-bold flex items-center gap-1">
                      <FiStar className="w-2.5 h-2.5 fill-current" />
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {viewItem.title}
                </h3>
                {viewItem.description && (
                  <p className="text-sm text-gray-300 mt-1 max-w-lg mx-auto">
                    {viewItem.description}
                  </p>
                )}
                {viewItem.updatedAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    Updated {viewItem.updatedAt}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isAdmin && (
        <ConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget?.id)}
          title="Delete Image"
          message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
          confirmText="Delete Image"
          type="danger"
        />
      )}
    </motion.div>
  );
}

export default GalleryManagement;
