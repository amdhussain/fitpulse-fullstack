import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Image, Info, Package, Award, CreditCard, MessageSquare,
  Camera, Mail, MapPin, Settings2, Check, X, Plus, Trash2,
  Eye, EyeOff, GripVertical, Search, AlertTriangle, Sparkles,
  Layout, Edit3, RefreshCw, Save, Activity
} from "lucide-react";
import { Button, Skeleton } from "../../components/ui";
import { staggerContainer, fadeUp } from "../../lib/animations";
import { PageBanner, CmsModal, ConfirmModal, CmsBadge } from "../../components/dashboard";
import { getInputClass } from "../../lib/dashboardHelpers";
import { useToast } from "../../components/ui/Toast";

const API_URL = import.meta.env.API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

const SECTION_META = {
  HERO: { icon: Globe, label: "Hero Section", color: "from-orange-500 to-amber-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
  ABOUT: { icon: Info, label: "About", color: "from-purple-500 to-violet-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
  FEATURES: { icon: Sparkles, label: "Features", color: "from-emerald-500 to-green-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  SERVICES: { icon: Package, label: "Services", color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  TRAINERS: { icon: Award, label: "Trainers", color: "from-cyan-500 to-teal-500", bg: "bg-cyan-50 dark:bg-cyan-500/10" },
  PRICING: { icon: CreditCard, label: "Membership", color: "from-amber-500 to-yellow-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
  TESTIMONIALS: { icon: MessageSquare, label: "Testimonials", color: "from-pink-500 to-rose-500", bg: "bg-pink-50 dark:bg-pink-500/10" },
  FAQ: { icon: Layout, label: "FAQ", color: "from-indigo-500 to-purple-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
  CONTACT: { icon: Mail, label: "Contact", color: "from-red-500 to-rose-500", bg: "bg-red-50 dark:bg-red-500/10" },
  FOOTER: { icon: MapPin, label: "Footer", color: "from-slate-500 to-gray-500", bg: "bg-slate-50 dark:bg-slate-500/10" },
  GALLERY: { icon: Camera, label: "Gallery", color: "from-sky-500 to-blue-500", bg: "bg-sky-50 dark:bg-sky-500/10" },
  CLASSES: { icon: Package, label: "Classes", color: "from-violet-500 to-indigo-500", bg: "bg-violet-50 dark:bg-violet-500/10" },
  BMI: { icon: Activity, label: "BMI Calculator", color: "from-green-500 to-emerald-500", bg: "bg-green-50 dark:bg-green-500/10" },
  TOOLS: { icon: Settings2, label: "Fitness Tools", color: "from-teal-500 to-cyan-500", bg: "bg-teal-50 dark:bg-teal-500/10" },
};

function SectionCard({ section, meta, onEdit, onToggle, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const Icon = meta.icon;
  const content = section.content || {};
  const itemCount = Array.isArray(content.items) ? content.items.length
    : Array.isArray(content.features) ? content.features.length
    : Array.isArray(content.faqs) ? content.faqs.length
    : Array.isArray(content.plans) ? content.plans.length
    : Array.isArray(content.services) ? content.services.length
    : Array.isArray(content.trainers) ? content.trainers.length
    : Array.isArray(content.testimonials) ? content.testimonials.length
    : content.items ? (typeof content.items === 'object' ? Object.keys(content.items).length : 0)
    : 0;

  return (
    <motion.div
      layout
      variants={fadeUp}
      className="group relative rounded-2xl border border-gray-100/80 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] shadow-sm hover:shadow-lg hover:border-violet-200/50 dark:hover:border-violet-500/20 transition-all duration-300"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2.5 rounded-xl ${meta.bg} border border-gray-100/50 dark:border-white/5 shrink-0`}>
              <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {section.title || meta.label}
              </h3>
              {section.subtitle && (
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                  {section.subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onMoveUp(section.type)}
              disabled={isFirst}
              className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              title="Move up"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            </button>
            <button
              onClick={() => onMoveDown(section.type)}
              disabled={isLast}
              className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              title="Move down"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3 text-xs text-gray-400 dark:text-gray-500">
          <CmsBadge status={section.status === 'ACTIVE' ? 'active' : 'draft'} />
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
          {section.updatedAt && (
            <>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span>Updated {new Date(section.updatedAt).toLocaleDateString()}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-white/5">
          <button
            onClick={() => onEdit(section)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onToggle(section)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              section.status === 'ACTIVE'
                ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
            }`}
          >
            {section.status === 'ACTIVE' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {section.status === 'ACTIVE' ? 'Disable' : 'Enable'}
          </button>
          <button
            onClick={() => onDelete(section)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SectionForm({ section, formData, setFormData }) {
  const inputClass = getInputClass("violet");

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateContentField = (path, value) => {
    setFormData((prev) => {
      const content = { ...(prev.content || {}) };
      const keys = path.split(".");
      let obj = content;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return { ...prev, content };
    });
  };

  const addArrayItem = (field) => {
    setFormData((prev) => {
      const content = { ...(prev.content || {}) };
      const arr = [...(content[field] || [])];
      arr.push({ title: "", description: "" });
      content[field] = arr;
      return { ...prev, content };
    });
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => {
      const content = { ...(prev.content || {}) };
      const arr = [...(content[field] || [])];
      arr.splice(index, 1);
      content[field] = arr;
      return { ...prev, content };
    });
  };

  const updateArrayItem = (field, index, key, value) => {
    setFormData((prev) => {
      const content = { ...(prev.content || {}) };
      const arr = [...(content[field] || [])];
      arr[index] = { ...arr[index], [key]: value };
      content[field] = arr;
      return { ...prev, content };
    });
  };

  const sectionType = section?.type;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
          <input
            type="text"
            value={formData.title || ""}
            onChange={(e) => updateField("title", e.target.value)}
            className={inputClass}
            placeholder="Section title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subtitle</label>
          <input
            type="text"
            value={formData.subtitle || ""}
            onChange={(e) => updateField("subtitle", e.target.value)}
            className={inputClass}
            placeholder="Section subtitle"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              checked={formData.status === "ACTIVE"}
              onChange={() => updateField("status", "ACTIVE")}
              className="w-4 h-4 text-violet-600 border-gray-300 focus:ring-violet-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              checked={formData.status === "DRAFT"}
              onChange={() => updateField("status", "DRAFT")}
              className="w-4 h-4 text-violet-600 border-gray-300 focus:ring-violet-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Draft</span>
          </label>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-white/5 pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Content Items</label>
          <button
            type="button"
            onClick={() => addArrayItem("items")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Item
          </button>
        </div>

        {(formData.content?.items || []).map((item, idx) => (
          <div key={idx} className="relative p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] mb-2">
            <button
              type="button"
              onClick={() => removeArrayItem("items", idx)}
              className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={item.title || ""}
                onChange={(e) => updateArrayItem("items", idx, "title", e.target.value)}
                className={inputClass}
                placeholder="Item title"
              />
              <input
                type="text"
                value={item.description || ""}
                onChange={(e) => updateArrayItem("items", idx, "description", e.target.value)}
                className={inputClass}
                placeholder="Item description"
              />
            </div>
          </div>
        ))}

        {(formData.content?.items || []).length === 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 italic">No content items yet. Add one above.</p>
        )}
      </div>

      <div className="border-t border-gray-100 dark:border-white/5 pt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Raw JSON Content <span className="text-gray-400 font-normal">(advanced)</span>
        </label>
        <textarea
          value={JSON.stringify(formData.content || {}, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              updateField("content", parsed);
            } catch {
            }
          }}
          rows={6}
          className={`${inputClass} font-mono text-xs resize-none`}
          placeholder='{"key": "value"}'
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Edit the JSON directly for advanced content structure.
        </p>
      </div>
    </div>
  );
}

function CmsDashboard() {
  const { toast } = useToast();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [editModal, setEditModal] = useState({ open: false, section: null });
  const [formData, setFormData] = useState({ title: "", subtitle: "", content: {}, status: "ACTIVE" });

  const [deleteModal, setDeleteModal] = useState({ open: false, section: null });

  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/cms/sections`, { headers: getAuthHeaders() });
      const json = await res.json();
      if (json.success) {
        setSections(json.data || []);
      } else {
        toast("Failed to load CMS sections", "error");
      }
    } catch {
      toast("Network error loading CMS sections", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const filteredSections = useMemo(() => {
    return sections.filter((s) => {
      const meta = SECTION_META[s.type];
      const label = (meta?.label || s.type).toLowerCase();
      const titleMatch = (s.title || "").toLowerCase().includes(search.toLowerCase());
      const typeMatch = label.includes(search.toLowerCase());
      const statusMatch = statusFilter === "all" || s.status === statusFilter;
      return (titleMatch || typeMatch) && statusMatch;
    });
  }, [sections, search, statusFilter]);

  const stats = useMemo(() => {
    const total = sections.length;
    const active = sections.filter((s) => s.status === "ACTIVE").length;
    const draft = sections.filter((s) => s.status === "DRAFT").length;
    return { total, active, draft };
  }, [sections]);

  const openEdit = (section) => {
    setEditModal({ open: true, section });
    setFormData({
      title: section.title || "",
      subtitle: section.subtitle || "",
      content: section.content || {},
      status: section.status || "DRAFT",
    });
  };

  const handleSave = async () => {
    if (!editModal.section) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/cms/sections/${editModal.section.type}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: formData.title || null,
          subtitle: formData.subtitle || null,
          content: formData.content || {},
          status: formData.status,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast("Section updated successfully", "success");
        setEditModal({ open: false, section: null });
        fetchSections();
      } else {
        toast(json.message || "Failed to update section", "error");
      }
    } catch {
      toast("Network error updating section", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggle = async (section) => {
    const newStatus = section.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
    try {
      const res = await fetch(`${API_URL}/api/v1/cms/sections/${section.type}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        toast(`Section ${newStatus === "ACTIVE" ? "enabled" : "disabled"}`, "success");
        fetchSections();
      } else {
        toast(json.message || "Failed to toggle section", "error");
      }
    } catch {
      toast("Network error toggling section", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.section) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/cms/sections/${deleteModal.section.type}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        toast("Section deleted successfully", "success");
        setDeleteModal({ open: false, section: null });
        fetchSections();
      } else {
        toast(json.message || "Failed to delete section", "error");
      }
    } catch {
      toast("Network error deleting section", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMove = async (type, direction) => {
    const sorted = [...sections].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const idx = sorted.findIndex((s) => s.type === type);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const newOrder = [...sorted];
    [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];
    const items = newOrder.map((s, i) => ({ type: s.type, sortOrder: i }));

    try {
      const res = await fetch(`${API_URL}/api/v1/cms/sections/reorder`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ items }),
      });
      const json = await res.json();
      if (json.success) {
        toast("Section reordered", "success");
        fetchSections();
      }
    } catch {
      toast("Failed to reorder", "error");
    }
  };

  if (loading) {
    return (
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <Skeleton variant="shimmer" className="h-28 rounded-2xl w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="shimmer" className="h-24 rounded-2xl w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="shimmer" className="h-48 rounded-2xl w-full" />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <PageBanner pageKey="settings" subtitle="Manage all website content from one place" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Sections", value: stats.total, color: "from-violet-500 to-indigo-500", bg: "bg-violet-50 dark:bg-violet-500/10" },
          { label: "Active", value: stats.active, color: "from-emerald-500 to-green-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Drafts", value: stats.draft, color: "from-amber-500 to-yellow-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
        ].map((stat, i) => (
          <motion.div key={stat.label} variants={fadeUp} custom={i}
            className="rounded-2xl border border-gray-100/80 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] shadow-sm p-5"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sections..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 dark:focus:ring-violet-500/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "ACTIVE", "DRAFT"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                statusFilter === filter
                  ? "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30"
                  : "bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
              }`}
            >
              {filter === "all" ? "All" : filter === "ACTIVE" ? "Active" : "Draft"}
            </button>
          ))}
        </div>
        <Button variant="violet" size="sm" onClick={fetchSections}>
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      </div>

      {filteredSections.length === 0 ? (
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-16 text-center">
          <Layout className="w-12 h-12 text-gray-200 dark:text-gray-700 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">No sections found</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm">
            {search || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "No CMS sections exist yet. Initialize default sections to get started."}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSections.map((section, index) => {
            const meta = SECTION_META[section.type] || { icon: Layout, label: section.type, color: "from-gray-500 to-gray-500", bg: "bg-gray-50 dark:bg-gray-500/10" };
            const sorted = [...filteredSections].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
            const realIdx = sorted.findIndex((s) => s.type === section.type);
            return (
              <SectionCard
                key={section.type}
                section={section}
                meta={meta}
                onEdit={openEdit}
                onToggle={handleToggle}
                onDelete={(s) => setDeleteModal({ open: true, section: s })}
                onMoveUp={(t) => handleMove(t, "up")}
                onMoveDown={(t) => handleMove(t, "down")}
                isFirst={realIdx === 0}
                isLast={realIdx === sorted.length - 1}
              />
            );
          })}
        </div>
      )}

      <CmsModal
        isOpen={editModal.open}
        onClose={() => { if (!actionLoading) setEditModal({ open: false, section: null }); }}
        title={`Edit ${editModal.section ? (SECTION_META[editModal.section.type]?.label || editModal.section.type) : "Section"}`}
        subtitle={editModal.section?.type || ""}
        size="lg"
      >
        {editModal.section && (
          <div className="space-y-6">
            <SectionForm section={editModal.section} formData={formData} setFormData={setFormData} />
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
              <button
                onClick={() => setEditModal({ open: false, section: null })}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <Button variant="violet" onClick={handleSave} loading={actionLoading}>
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </CmsModal>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => { if (!actionLoading) setDeleteModal({ open: false, section: null }); }}
        onConfirm={handleDelete}
        title="Delete Section"
        message={`Are you sure you want to delete the "${deleteModal.section ? (SECTION_META[deleteModal.section.type]?.label || deleteModal.section.type) : ""}" section? This action cannot be undone.`}
        confirmText={actionLoading ? "Deleting..." : "Delete"}
        type="danger"
        loading={actionLoading}
      />
    </motion.div>
  );
}

export default CmsDashboard;
