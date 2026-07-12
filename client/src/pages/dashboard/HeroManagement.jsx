import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiGlobe,
  FiLayers,
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
import { getHeroSections, getHeroStats } from "../../lib/heroData";

const emptyForm = {
  title: "",
  subtitle: "",
  description: "",
  buttonText: "",
  buttonLink: "",
  secondaryText: "",
  secondaryLink: "",
  image: "",
};

function HeroManagement() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const inputClass = getInputClass("orange");
  const stats = getHeroStats(sections);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSections(getHeroSections());
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
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      buttonText: item.buttonText,
      buttonLink: item.buttonLink,
      secondaryText: item.secondaryText || "",
      secondaryLink: item.secondaryLink || "",
      image: item.image || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleStatus = (id) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "draft" : "active" }
          : s
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editing) {
      setSections((prev) =>
        prev.map((s) =>
          s.id === editing ? { ...s, ...form, updatedAt: "Just now" } : s
        )
      );
    } else {
      setSections((prev) => [
        {
          id: Date.now(),
          ...form,
          status: "draft",
          members: "2,847",
          trainers: "24",
          classes: "50+",
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
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-orange-500/10 shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiImage className="w-5 h-5 text-orange-400/40" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      render: (_, item) => (
        <div>
          <p className="font-medium text-white/80 truncate max-w-[200px]">
            {item.title}
          </p>
          <p className="text-xs text-white/30 truncate max-w-[200px]">
            {item.subtitle}
          </p>
        </div>
      ),
    },
    {
      key: "buttonText",
      label: "Button",
      render: (val) => (
        <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 text-xs font-medium">
          {val}
        </span>
      ),
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
    {
      key: "updatedAt",
      label: "Updated",
      render: (val) => (
        <div className="flex items-center gap-1.5 text-white/30">
          <FiClock className="w-3 h-3" />
          <span className="text-xs">{val}</span>
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
      <PageBanner pageKey="hero" subtitle="Manage your homepage hero sections" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FiLayers}
          label="Total Sections"
          value={stats.total}
          pageKey="hero"
          index={0}
        />
        <StatCard
          icon={FiGlobe}
          label="Active"
          value={stats.active}
          pageKey="hero"
          index={1}
        />
        <StatCard
          icon={FiEdit2}
          label="Drafts"
          value={stats.draft}
          pageKey="hero"
          index={2}
        />
        <StatCard
          icon={FiClock}
          label="Last Updated"
          value="2h ago"
          pageKey="hero"
          index={3}
        />
      </div>

      <DataTable
        data={sections}
        columns={columns}
        accent="orange"
        searchPlaceholder="Search hero sections..."
        searchKey="title"
        filterOptions={[
          { value: "active", label: "Active" },
          { value: "draft", label: "Draft" },
        ]}
        filterKey="status"
        rowsPerPage={5}
        onAdd={openAdd}
        addLabel="Add Hero Section"
        loading={loading}
        actions={(item) => (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewItem(item);
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-orange-400 transition-colors"
              aria-label={`View ${item.title}`}
            >
              <FiEye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEdit(item);
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-orange-400 transition-colors"
              aria-label={`Edit ${item.title}`}
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-red-400 transition-colors"
              aria-label={`Delete ${item.title}`}
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
        title={editing ? "Edit Hero Section" : "Add Hero Section"}
        subtitle="Configure your hero section content and appearance"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Hero Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="Train Smarter. Live Stronger."
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Subtitle / Badge
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, subtitle: e.target.value }))
                  }
                  placeholder="Transform Your Body"
                  className={inputClass}
                />
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
                  placeholder="Hero section description..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={form.buttonText}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, buttonText: e.target.value }))
                    }
                    placeholder="Book Now"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={form.buttonLink}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, buttonLink: e.target.value }))
                    }
                    placeholder="/booking"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={form.secondaryText}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, secondaryText: e.target.value }))
                    }
                    placeholder="Learn More"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={form.secondaryLink}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, secondaryLink: e.target.value }))
                    }
                    placeholder="/about"
                    className={inputClass}
                  />
                </div>
              </div>
              <FileUpload
                label="Hero Image"
                value={form.image}
                onChange={() => {}}
                color="orange"
              />
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                Preview
              </p>
              <div className="rounded-xl border border-orange-500/10 overflow-hidden bg-[#0f0f15]">
                {form.image ? (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-orange-500/10 to-amber-500/5 flex items-center justify-center">
                    <FiImage className="w-10 h-10 text-orange-400/20" />
                  </div>
                )}
                <div className="p-5 space-y-3">
                  {form.subtitle && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-bold">
                      {form.subtitle}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-white">
                    {form.title || "Hero Title"}
                  </h3>
                  <p className="text-xs text-white/40 line-clamp-2">
                    {form.description || "Hero description will appear here..."}
                  </p>
                  <div className="flex gap-2">
                    {form.buttonText && (
                      <span className="px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-medium">
                        {form.buttonText}
                      </span>
                    )}
                    {form.secondaryText && (
                      <span className="px-3 py-1.5 rounded-lg border border-white/10 text-white/60 text-xs font-medium">
                        {form.secondaryText}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 text-center">
                  <p className="text-lg font-bold text-orange-400">2,847</p>
                  <p className="text-[10px] text-white/30">Members</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 text-center">
                  <p className="text-lg font-bold text-orange-400">24</p>
                  <p className="text-[10px] text-white/30">Trainers</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 text-center">
                  <p className="text-lg font-bold text-orange-400">50+</p>
                  <p className="text-[10px] text-white/30">Classes</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <Button type="submit" variant="orange" size="md">
              {editing ? "Update Section" : "Save Section"}
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
        title="Hero Section Preview"
        subtitle={viewItem?.subtitle}
        size="lg"
      >
        {viewItem && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-[#0f0f15] border border-orange-500/10">
              {viewItem.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={viewItem.image}
                    alt={viewItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 space-y-3">
                <CmsBadge status={viewItem.status} />
                <h3 className="text-xl font-bold text-white">{viewItem.title}</h3>
                <p className="text-sm text-white/40">{viewItem.description}</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-medium">
                    {viewItem.buttonText}
                  </span>
                  {viewItem.secondaryText && (
                    <span className="px-3 py-1.5 rounded-lg border border-white/10 text-white/60 text-xs font-medium">
                      {viewItem.secondaryText}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CmsModal>
    </motion.div>
  );
}

export default HeroManagement;
