import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiTarget,
  FiAward,
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
import { getAboutSections, getAboutStats } from "../../lib/aboutData";

const emptyForm = {
  title: "",
  subtitle: "",
  description: "",
  mission: "",
  vision: "",
  achievements: "",
  image: "",
};

function AboutManagement() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const inputClass = getInputClass("purple");
  const stats = getAboutStats(sections);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSections(getAboutSections());
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
      subtitle: item.subtitle || "",
      description: item.description,
      mission: item.mission || "",
      vision: item.vision || "",
      achievements: item.achievements || "",
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
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-purple-500/10 shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiImage className="w-5 h-5 text-purple-400/40" />
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
          <p className="font-medium text-white/80 truncate max-w-[180px]">
            {item.title}
          </p>
          <p className="text-xs text-white/30 truncate max-w-[180px]">
            {item.subtitle}
          </p>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (val) => (
        <p className="text-xs text-white/40 truncate max-w-[200px]">{val}</p>
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
      <PageBanner pageKey="about" subtitle="Manage your about section content" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FiTarget}
          label="About Sections"
          value={stats.total}
          pageKey="about"
          index={0}
        />
        <StatCard
          icon={FiImage}
          label="Images"
          value={stats.images}
          pageKey="about"
          index={1}
        />
        <StatCard
          icon={FiAward}
          label="Achievements"
          value={stats.achievements}
          pageKey="about"
          index={2}
        />
        <StatCard
          icon={FiClock}
          label="Last Updated"
          value="2h ago"
          pageKey="about"
          index={3}
        />
      </div>

      <DataTable
        data={sections}
        columns={columns}
        accent="purple"
        searchPlaceholder="Search about sections..."
        searchKey="title"
        filterOptions={[
          { value: "active", label: "Active" },
          { value: "draft", label: "Draft" },
        ]}
        filterKey="status"
        rowsPerPage={5}
        onAdd={openAdd}
        addLabel="Add About Section"
        loading={loading}
        actions={(item) => (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewItem(item);
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-purple-400 transition-colors"
              aria-label={`View ${item.title}`}
            >
              <FiEye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEdit(item);
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-purple-400 transition-colors"
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
        title={editing ? "Edit About Section" : "Add About Section"}
        subtitle="Configure your about section content and details"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="Our Story"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, subtitle: e.target.value }))
                  }
                  placeholder="Who We Are"
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
                  placeholder="About section description..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Mission
                </label>
                <textarea
                  value={form.mission}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, mission: e.target.value }))
                  }
                  rows={2}
                  placeholder="Our mission statement..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Vision
                </label>
                <textarea
                  value={form.vision}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, vision: e.target.value }))
                  }
                  rows={2}
                  placeholder="Our vision statement..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Achievements (comma separated)
                </label>
                <input
                  type="text"
                  value={form.achievements}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, achievements: e.target.value }))
                  }
                  placeholder="Founded 2020, 10K+ Members, 50+ Trainers"
                  className={inputClass}
                />
              </div>
              <FileUpload
                label="About Image"
                value={form.image}
                onChange={() => {}}
                color="purple"
              />
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                Preview
              </p>
              <div className="rounded-xl border border-purple-500/10 overflow-hidden bg-[#0f0f15]">
                {form.image ? (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-purple-500/10 to-violet-500/5 flex items-center justify-center">
                    <FiImage className="w-10 h-10 text-purple-400/20" />
                  </div>
                )}
                <div className="p-5 space-y-3">
                  {form.subtitle && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold">
                      {form.subtitle}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-white">
                    {form.title || "Section Title"}
                  </h3>
                  <p className="text-xs text-white/40 line-clamp-2">
                    {form.description || "Description will appear here..."}
                  </p>
                  {form.mission && (
                    <div className="pt-2 border-t border-white/5">
                      <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider mb-1">
                        Mission
                      </p>
                      <p className="text-xs text-white/40 line-clamp-2">
                        {form.mission}
                      </p>
                    </div>
                  )}
                  {form.vision && (
                    <div className="pt-2 border-t border-white/5">
                      <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider mb-1">
                        Vision
                      </p>
                      <p className="text-xs text-white/40 line-clamp-2">
                        {form.vision}
                      </p>
                    </div>
                  )}
                  {form.achievements && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {form.achievements.split(",").map((a, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-medium"
                        >
                          {a.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <Button type="submit" variant="purple" size="md">
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
        title="About Section Preview"
        subtitle={viewItem?.subtitle}
        size="lg"
      >
        {viewItem && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-[#0f0f15] border border-purple-500/10">
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
                {viewItem.mission && (
                  <div className="pt-3 border-t border-white/5">
                    <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-1">
                      Mission
                    </p>
                    <p className="text-sm text-white/50">{viewItem.mission}</p>
                  </div>
                )}
                {viewItem.vision && (
                  <div className="pt-3 border-t border-white/5">
                    <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-1">
                      Vision
                    </p>
                    <p className="text-sm text-white/50">{viewItem.vision}</p>
                  </div>
                )}
                {viewItem.achievements && (
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                    {viewItem.achievements.split(",").map((a, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium"
                      >
                        {a.trim()}
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

export default AboutManagement;
