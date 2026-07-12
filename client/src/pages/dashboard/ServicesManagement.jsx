import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiPackage,
  FiStar,
  FiGrid,
  FiClock,
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
  getServices,
  getServiceStats,
  getServiceCategories,
} from "../../lib/servicesData";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  duration: "",
  trainer: "",
  description: "",
  benefits: "",
  featured: false,
  image: "",
};

function ServicesManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const inputClass = getInputClass("emerald");
  const stats = getServiceStats(services);
  const categories = getServiceCategories();

  useEffect(() => {
    const timer = setTimeout(() => {
      setServices(getServices());
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
      name: item.name,
      category: item.category,
      price: item.price,
      duration: item.duration,
      trainer: item.trainer,
      description: item.description,
      benefits: item.benefits || "",
      featured: item.featured,
      image: item.image || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleStatus = (id) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "draft" : "active" }
          : s
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editing) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editing ? { ...s, ...form, updatedAt: "Just now" } : s
        )
      );
    } else {
      setServices((prev) => [
        {
          id: Date.now(),
          ...form,
          status: "draft",
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
      key: "image",
      label: "Image",
      width: "w-16",
      render: (_, item) => (
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-emerald-500/10 shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiImage className="w-5 h-5 text-emerald-400/40" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Service Name",
      render: (_, item) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-white/80">{item.name}</p>
            {item.featured && (
              <FiStar className="w-3 h-3 text-amber-400 fill-amber-400" />
            )}
          </div>
          <p className="text-xs text-white/30">{item.category}</p>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (val) => (
        <span className="text-sm font-semibold text-emerald-400">{val}</span>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (val) => (
        <div className="flex items-center gap-1.5 text-white/40">
          <FiClock className="w-3 h-3" />
          <span className="text-xs">{val}</span>
        </div>
      ),
    },
    {
      key: "trainer",
      label: "Trainer",
      render: (val) => <span className="text-xs text-white/50">{val}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (val, item) => (
        <CmsBadge
          status={val}
          onToggle={() => toggleStatus(item.id)}
          label={val}
        />
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
      <PageBanner pageKey="services" subtitle="Manage your fitness services" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FiPackage}
          label="Total Services"
          value={stats.total}
          pageKey="services"
          index={0}
        />
        <StatCard
          icon={FiGrid}
          label="Active Services"
          value={stats.active}
          pageKey="services"
          index={1}
        />
        <StatCard
          icon={FiStar}
          label="Featured"
          value={stats.featured}
          pageKey="services"
          index={2}
        />
        <StatCard
          icon={FiClock}
          label="Categories"
          value={stats.categories}
          pageKey="services"
          index={3}
        />
      </div>

      <DataTable
        data={services}
        columns={columns}
        accent="emerald"
        searchPlaceholder="Search services..."
        searchKey="name"
        filterOptions={[
          { value: "active", label: "Active" },
          { value: "draft", label: "Draft" },
        ]}
        filterKey="status"
        rowsPerPage={5}
        onAdd={openAdd}
        addLabel="Add Service"
        loading={loading}
        actions={(item) => (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewItem(item);
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-emerald-400 transition-colors"
              aria-label={`View ${item.name}`}
            >
              <FiEye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEdit(item);
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-emerald-400 transition-colors"
              aria-label={`Edit ${item.name}`}
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-red-400 transition-colors"
              aria-label={`Delete ${item.name}`}
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </>
        )}
      />

      <CmsModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
          setForm(emptyForm);
        }}
        title={editing ? "Edit Service" : "Add Service"}
        subtitle="Configure your service details and pricing"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Personal Training"
                  className={inputClass}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, category: e.target.value }))
                    }
                    className={inputClass}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Trainer
                  </label>
                  <input
                    type="text"
                    value={form.trainer}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, trainer: e.target.value }))
                    }
                    placeholder="Trainer name"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Price
                  </label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price: e.target.value }))
                    }
                    placeholder="$49"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, duration: e.target.value }))
                    }
                    placeholder="60 min"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={3}
                  placeholder="Service description..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Benefits (comma separated)
                </label>
                <input
                  type="text"
                  value={form.benefits}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, benefits: e.target.value }))
                  }
                  placeholder="Customized plan, Progress tracking"
                  className={inputClass}
                />
              </div>
              <FileUpload
                label="Service Image"
                value={form.image}
                onChange={() => {}}
                color="emerald"
              />
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, featured: e.target.checked }))
                  }
                  className="w-4 h-4 rounded-md border border-white/20 bg-white/5 checked:bg-emerald-500 checked:border-emerald-500 transition-all duration-200 cursor-pointer accent-emerald-500"
                />
                <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                  Featured Service
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                Preview
              </p>
              <div className="rounded-xl border border-emerald-500/10 overflow-hidden bg-[#0f0f15]">
                {form.image ? (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-emerald-500/10 to-green-500/5 flex items-center justify-center">
                    <FiImage className="w-10 h-10 text-emerald-400/20" />
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    {form.category && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                        {form.category}
                      </span>
                    )}
                    {form.featured && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                        <FiStar className="w-2.5 h-2.5 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {form.name || "Service Name"}
                  </h3>
                  <p className="text-xs text-white/40 line-clamp-2">
                    {form.description || "Service description will appear here..."}
                  </p>
                  <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                    {form.price && (
                      <div>
                        <p className="text-xs text-white/30">Price</p>
                        <p className="text-sm font-bold text-emerald-400">
                          {form.price}
                        </p>
                      </div>
                    )}
                    {form.duration && (
                      <div>
                        <p className="text-xs text-white/30">Duration</p>
                        <p className="text-sm font-medium text-white/70">
                          {form.duration}
                        </p>
                      </div>
                    )}
                    {form.trainer && (
                      <div>
                        <p className="text-xs text-white/30">Trainer</p>
                        <p className="text-sm font-medium text-white/70">
                          {form.trainer}
                        </p>
                      </div>
                    )}
                  </div>
                  {form.benefits && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {form.benefits.split(",").map((b, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium"
                        >
                          {b.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <Button type="submit" variant="emerald" size="md">
              {editing ? "Update Service" : "Save Service"}
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

      <CmsModal
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        title="Service Preview"
        subtitle={viewItem?.category}
        size="lg"
      >
        {viewItem && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-[#0f0f15] border border-emerald-500/10">
              {viewItem.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={viewItem.image}
                    alt={viewItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <CmsBadge status={viewItem.status} />
                  {viewItem.featured && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                      <FiStar className="w-2.5 h-2.5 fill-current" />
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white">{viewItem.name}</h3>
                <p className="text-sm text-white/40">{viewItem.description}</p>
                <div className="flex items-center gap-6 pt-3 border-t border-white/5">
                  <div>
                    <p className="text-xs text-white/30">Price</p>
                    <p className="text-lg font-bold text-emerald-400">
                      {viewItem.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/30">Duration</p>
                    <p className="text-sm font-medium text-white/70">
                      {viewItem.duration}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/30">Trainer</p>
                    <p className="text-sm font-medium text-white/70">
                      {viewItem.trainer}
                    </p>
                  </div>
                </div>
                {viewItem.benefits && (
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                    {viewItem.benefits.split(",").map((b, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium"
                      >
                        {b.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CmsModal>
    </motion.div>
  );
}

export default ServicesManagement;
