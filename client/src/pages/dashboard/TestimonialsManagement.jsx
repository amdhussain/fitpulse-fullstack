import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiStar,
  FiMessageCircle,
  FiAward,
  FiClock,
  FiUser,
} from "react-icons/fi";
import { Button, SavedBadge, FileUpload } from "../../components/ui";
import { staggerContainer } from "../../lib/animations";
import PageBanner from "../../components/dashboard/PageBanner";
import StatCard from "../../components/dashboard/StatCard";
import DataTable from "../../components/dashboard/DataTable";
import CmsModal from "../../components/dashboard/CmsModal";
import CmsBadge from "../../components/dashboard/CmsBadge";
import { getInputClass } from "../../lib/dashboardHelpers";
import {
  getTestimonials,
  getTestimonialStats,
} from "../../lib/testimonialsData";

const membershipOptions = [
  "Basic Fit",
  "Premium Active",
  "Elite Pro",
  "Student Saver",
  "Couple Combo",
];

const emptyForm = {
  customerName: "",
  customerPhoto: "",
  profession: "",
  rating: 5,
  review: "",
  membership: "",
  featured: false,
};

function StarRating({ rating, size = "w-3.5 h-3.5", interactive = false, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = interactive ? star <= (hovered || rating) : star <= rating;
        return (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            disabled={!interactive}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-all duration-150`}
            onClick={() => interactive && onChange && onChange(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
          >
            <FiStar
              className={`${size} transition-colors duration-150 ${
                filled ? "text-yellow-400 fill-yellow-400" : "text-white/15"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const inputClass = getInputClass("pink");
  const stats = getTestimonialStats(testimonials);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTestimonials(getTestimonials());
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({
      customerName: item.customerName,
      customerPhoto: item.customerPhoto || "",
      profession: item.profession || "",
      rating: item.rating,
      review: item.review,
      membership: item.membership || "",
      featured: item.featured,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleFeatured = (id) => {
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, featured: !t.featured } : t
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.review.trim()) return;

    if (editing) {
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === editing
            ? { ...t, ...form, updatedAt: "Just now" }
            : t
        )
      );
    } else {
      setTestimonials((prev) => [
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

  const columns = [
    {
      key: "customerPhoto",
      label: "Photo",
      width: "w-16",
      render: (_, item) => (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-pink-500/10 shrink-0">
          {item.customerPhoto ? (
            <img
              src={item.customerPhoto}
              alt={item.customerName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiUser className="w-4 h-4 text-pink-400/40" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "customerName",
      label: "Customer",
      render: (_, item) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-white/80">{item.customerName}</p>
            {item.featured && (
              <FiStar className="w-3 h-3 text-amber-400 fill-amber-400" />
            )}
          </div>
          <p className="text-xs text-white/30">{item.profession}</p>
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (val) => <StarRating rating={val} />,
    },
    {
      key: "review",
      label: "Review",
      render: (val) => (
        <p className="text-xs text-white/50 line-clamp-2 max-w-[220px]">
          &ldquo;{val}&rdquo;
        </p>
      ),
    },
    {
      key: "membership",
      label: "Membership",
      render: (val) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-[11px] font-semibold">
          {val}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val, item) => (
        <div className="flex items-center gap-2">
          <CmsBadge status={val} label={val} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFeatured(item.id);
            }}
            className={`p-1 rounded-md transition-colors ${
              item.featured
                ? "bg-amber-500/10 text-amber-400"
                : "bg-white/5 text-white/20 hover:text-white/40"
            }`}
            title={item.featured ? "Remove from featured" : "Mark as featured"}
          >
            <FiStar className={`w-3.5 h-3.5 ${item.featured ? "fill-amber-400" : ""}`} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageBanner
        pageKey="testimonials"
        subtitle="Manage customer reviews and testimonials"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FiMessageCircle}
          label="Total Reviews"
          value={stats.total}
          pageKey="testimonials"
          index={0}
        />
        <StatCard
          icon={FiStar}
          label="Avg Rating"
          value={stats.avgRating}
          pageKey="testimonials"
          index={1}
        />
        <StatCard
          icon={FiAward}
          label="Featured Reviews"
          value={stats.featured}
          pageKey="testimonials"
          index={2}
        />
        <StatCard
          icon={FiClock}
          label="Pending Reviews"
          value={stats.pending}
          pageKey="testimonials"
          index={3}
        />
      </div>

      <DataTable
        data={testimonials}
        columns={columns}
        accent="pink"
        searchPlaceholder="Search testimonials..."
        searchKey="customerName"
        filterOptions={[
          { value: "active", label: "Active" },
          { value: "draft", label: "Draft" },
        ]}
        filterKey="status"
        rowsPerPage={5}
        onAdd={openAdd}
        addLabel="Add Testimonial"
        loading={loading}
        actions={(item) => (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewItem(item);
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-pink-400 transition-colors"
              aria-label={`View ${item.customerName}`}
            >
              <FiEye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEdit(item);
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-pink-400 transition-colors"
              aria-label={`Edit ${item.customerName}`}
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-red-400 transition-colors"
              aria-label={`Delete ${item.customerName}`}
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </>
        )}
      />

      {/* Edit / Add Modal */}
      <CmsModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
          setForm(emptyForm);
        }}
        title={editing ? "Edit Testimonial" : "Add Testimonial"}
        subtitle="Share a customer success story"
        size="xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Form Fields */}
            <div className="space-y-4">
              <FileUpload
                label="Customer Photo"
                value={form.customerPhoto}
                onChange={() => {}}
                color="pink"
              />

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, customerName: e.target.value }))
                  }
                  placeholder="Jane Smith"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Profession
                </label>
                <input
                  type="text"
                  value={form.profession}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, profession: e.target.value }))
                  }
                  placeholder="Marketing Director"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Rating
                </label>
                <StarRating
                  rating={form.rating}
                  size="w-6 h-6"
                  interactive
                  onChange={(val) => setForm((p) => ({ ...p, rating: val }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Review *
                </label>
                <textarea
                  value={form.review}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, review: e.target.value }))
                  }
                  rows={4}
                  placeholder="Share the customer's experience..."
                  className={`${inputClass} resize-none`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Membership
                </label>
                <select
                  value={form.membership}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, membership: e.target.value }))
                  }
                  className={inputClass}
                >
                  <option value="">Select membership</option>
                  {membershipOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, featured: e.target.checked }))
                  }
                  className="w-4 h-4 rounded-md border border-white/20 bg-white/5 checked:bg-pink-500 checked:border-pink-500 transition-all duration-200 cursor-pointer accent-pink-500"
                />
                <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                  Featured Review
                </span>
              </label>
            </div>

            {/* RIGHT: Preview */}
            <div className="space-y-4">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                Preview
              </p>
              <div className="rounded-xl border border-pink-500/10 bg-[#0f0f15] p-5 space-y-4">
                <StarRating rating={form.rating} size="w-4 h-4" />

                <p className="text-sm text-white/60 italic leading-relaxed">
                  &ldquo;{form.review || "The customer review will appear here..."}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-pink-500/10 shrink-0">
                    {form.customerPhoto ? (
                      <img
                        src={form.customerPhoto}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiUser className="w-4 h-4 text-pink-400/40" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/80">
                      {form.customerName || "Customer Name"}
                    </p>
                    <p className="text-xs text-white/30">
                      {form.profession || "Profession"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {form.membership && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-[11px] font-semibold">
                      {form.membership}
                    </span>
                  )}
                  {form.featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                      <FiStar className="w-2.5 h-2.5 fill-current" />
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-5 mt-5 border-t border-white/5">
            <Button type="submit" variant="pink" size="md">
              {editing ? "Update Testimonial" : "Save Testimonial"}
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

      {/* View Modal */}
      <CmsModal
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        title="Review Details"
        subtitle={viewItem?.customerName}
        size="lg"
      >
        {viewItem && (
          <div className="space-y-5">
            <StarRating rating={viewItem.rating} size="w-5 h-5" />

            <blockquote className="text-base text-white/60 italic leading-relaxed border-l-2 border-pink-500/30 pl-4">
              &ldquo;{viewItem.review}&rdquo;
            </blockquote>

            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-pink-500/10 shrink-0">
                {viewItem.customerPhoto ? (
                  <img
                    src={viewItem.customerPhoto}
                    alt={viewItem.customerName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-pink-400/40" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-base font-bold text-white/80">
                  {viewItem.customerName}
                </p>
                <p className="text-xs text-white/40">{viewItem.profession}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-white/5">
              {viewItem.membership && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-[11px] font-semibold">
                  {viewItem.membership}
                </span>
              )}
              <CmsBadge status={viewItem.status} label={viewItem.status} />
              {viewItem.featured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                  <FiStar className="w-2.5 h-2.5 fill-current" />
                  Featured
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-white/30 pt-3 border-t border-white/5">
              <FiClock className="w-3 h-3" />
              <span className="text-xs">Updated {viewItem.updatedAt}</span>
            </div>
          </div>
        )}
      </CmsModal>
    </motion.div>
  );
}

export default TestimonialsManagement;
