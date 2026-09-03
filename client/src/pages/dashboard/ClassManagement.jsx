import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { Button, SavedBadge } from "../../components/ui";
import { staggerContainer } from "../../lib/animations";
import PageBanner from "../../components/dashboard/PageBanner";
import StatCard from "../../components/dashboard/StatCard";
import DataTable from "../../components/dashboard/DataTable";
import CmsModal from "../../components/dashboard/CmsModal";
import CmsBadge from "../../components/dashboard/CmsBadge";
import ConfirmModal from "../../components/dashboard/ConfirmModal";
import { getInputClass, getSelectClass } from "../../lib/dashboardHelpers";
import { apiClient } from "../../lib/api";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  difficulty: "BEGINNER",
  capacity: "",
  duration: "",
  price: "",
  image: "",
  trainerId: "",
  status: "ACTIVE",
  schedule: [],
};

const CATEGORIES = [
  "Yoga",
  "Cardio",
  "Strength",
  "HIIT",
  "Pilates",
  "Dance",
  "Martial Arts",
  "Swimming",
  "Cycling",
  "CrossFit",
  "Stretching",
  "Other",
];

const DIFFICULTIES = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");
  const inputClass = getInputClass("emerald");

  const stats = {
    total: classes.length,
    active: classes.filter((c) => c.status === "ACTIVE").length,
    draft: classes.filter((c) => c.status === "DRAFT").length,
    avgPrice:
      classes.length > 0
        ? Math.round(
            classes.reduce((sum, c) => sum + (c.price || 0), 0) / classes.length
          )
        : 0,
  };

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/v1/class/?limit=100");
      const data = await res.json();
      if (data.success) {
        setClasses(data.data || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrainers = useCallback(async () => {
    try {
      const res = await apiClient.get("/api/v1/trainer/?limit=100");
      const data = await res.json();
      if (data.success) {
        setTrainers(data.data || []);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchClasses();
    fetchTrainers();
  }, [fetchClasses, fetchTrainers]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item._id || item.id);
    let schedule = [];
    if (item.schedule) {
      schedule = typeof item.schedule === "string" ? JSON.parse(item.schedule) : item.schedule;
    }
    setForm({
      name: item.name || "",
      description: item.description || "",
      category: item.category || "",
      difficulty: item.difficulty || "BEGINNER",
      capacity: item.capacity || "",
      duration: item.duration || "",
      price: item.price || "",
      image: item.image || "",
      trainerId: item.trainerId || "",
      status: item.status || "ACTIVE",
      schedule,
    });
    setError("");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await apiClient.delete(`/api/v1/class/${id}`);
      const data = await res.json();
      if (data.success) {
        setClasses((prev) => prev.filter((c) => (c._id || c.id) !== id));
        setDeleteTarget(null);
      }
    } catch {
      // silent
    }
  };

  const toggleStatus = async (item) => {
    const id = item._id || item.id;
    const newStatus = item.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
    try {
      const res = await apiClient.put(`/api/v1/class/${id}`, { status: newStatus });
      const data = await res.json();
      if (data.success) {
        setClasses((prev) =>
          prev.map((c) =>
            (c._id || c.id) === id ? { ...c, status: newStatus } : c
          )
        );
      }
    } catch {
      // silent
    }
  };

  const addScheduleSlot = () => {
    setForm((prev) => ({
      ...prev,
      schedule: [
        ...prev.schedule,
        { day: "Monday", startTime: "09:00", endTime: "10:00" },
      ],
    }));
  };

  const updateScheduleSlot = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      schedule: prev.schedule.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
  };

  const removeScheduleSlot = (index) => {
    setForm((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (!form.trainerId) {
      setError("Please select a trainer");
      return;
    }

    const body = {
      ...form,
      capacity: form.capacity ? parseInt(form.capacity, 10) : 0,
      duration: form.duration ? parseInt(form.duration, 10) : null,
      price: form.price ? parseFloat(form.price) : null,
      schedule: form.schedule.length > 0 ? form.schedule : undefined,
    };

    try {
      const url = editing
        ? `/api/v1/class/${editing}`
        : `/api/v1/class/`;

      const res = editing
        ? await apiClient.put(url, body)
        : await apiClient.post(url, body);
      const data = await res.json();

      if (data.success) {
        if (editing) {
          setClasses((prev) =>
            prev.map((c) =>
              (c._id || c.id) === editing ? { ...c, ...data.data } : c
            )
          );
        } else {
          setClasses((prev) => [data.data, ...prev]);
        }
        setShowModal(false);
        setForm(emptyForm);
        setEditing(null);
        setError("");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch {
      setError("Failed to save class");
    }
  };

  const getTrainerName = (trainerId) => {
    const t = trainers.find((tr) => (tr._id || tr.id) === trainerId);
    if (t) return t.user ? `${t.user.firstName} ${t.user.lastName}` : t.name;
    return "Unknown";
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      width: "w-16",
      render: (_, item) => (
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-emerald-50 dark:bg-emerald-900/30 shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiActivity className="w-5 h-5 text-emerald-600" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Class Name",
      render: (_, item) => (
        <div>
          <p className="font-medium text-gray-700 dark:text-gray-200">{item.name}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {item.category || "General"}
          </p>
        </div>
      ),
    },
    {
      key: "trainerId",
      label: "Trainer",
      render: (val) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {getTrainerName(val)}
        </span>
      ),
    },
    {
      key: "difficulty",
      label: "Difficulty",
      render: (val) => (
        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
          {val}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (val) => (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {val != null ? `$${val}` : "Free"}
        </span>
      ),
    },
    {
      key: "capacity",
      label: "Capacity",
      render: (val) => (
        <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
          <FiUsers className="w-3 h-3" />
          <span className="text-xs">{val || 0}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val, item) => (
        <CmsBadge
          status={val === "ACTIVE" ? "active" : "draft"}
          onToggle={() => toggleStatus(item)}
          label={val === "ACTIVE" ? "active" : "draft"}
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
      <PageBanner
        pageKey="classes"
        subtitle="Manage fitness classes and schedules"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FiActivity}
          label="Total Classes"
          value={stats.total}
          pageKey="classes"
          index={0}
        />
        <StatCard
          icon={FiActivity}
          label="Active Classes"
          value={stats.active}
          pageKey="classes"
          index={1}
        />
        <StatCard
          icon={FiClock}
          label="Draft Classes"
          value={stats.draft}
          pageKey="classes"
          index={2}
        />
        <StatCard
          icon={FiDollarSign}
          label="Avg Price"
          value={`$${stats.avgPrice}`}
          pageKey="classes"
          index={3}
        />
      </div>

      <DataTable
        data={classes}
        columns={columns}
        accent="emerald"
        searchPlaceholder="Search classes..."
        searchKey="name"
        filterOptions={[
          { value: "ACTIVE", label: "Active" },
          { value: "DRAFT", label: "Draft" },
        ]}
        filterKey="status"
        rowsPerPage={5}
        onAdd={openAdd}
        addLabel="Add Class"
        loading={loading}
        onRefresh={fetchClasses}
        onExport={() => {}}
        actions={(item) => (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewItem(item);
              }}
              className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-400 hover:text-emerald-600 transition-colors"
              aria-label={`View ${item.name}`}
            >
              <FiEye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEdit(item);
              }}
              className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-400 hover:text-emerald-600 transition-colors"
              aria-label={`Edit ${item.name}`}
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(item);
              }}
              className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-400 hover:text-red-400 transition-colors"
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
          setError("");
        }}
        title={editing ? "Edit Class" : "Add Class"}
        subtitle="Configure class details and schedule"
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Class Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g., Morning Yoga Flow"
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    Category
                  </label>
                  <div className="select-wrapper">
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, category: e.target.value }))
                    }
                    className={getSelectClass("emerald")}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    Difficulty
                  </label>
                  <div className="select-wrapper">
                  <select
                    value={form.difficulty}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, difficulty: e.target.value }))
                    }
                    className={getSelectClass("emerald")}
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Trainer *
                </label>
                <div className="select-wrapper">
                <select
                  value={form.trainerId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, trainerId: e.target.value }))
                  }
                  className={getSelectClass("emerald")}
                  required
                >
                  <option value="">Select trainer</option>
                  {trainers.map((t) => (
                    <option key={t._id || t.id} value={t._id || t.id}>
                      {t.user
                        ? `${t.user.firstName} ${t.user.lastName}`
                        : t.name}
                    </option>
                  ))}
                </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price: e.target.value }))
                    }
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={form.duration}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, duration: e.target.value }))
                    }
                    placeholder="60"
                    min="1"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, capacity: e.target.value }))
                    }
                    placeholder="20"
                    min="0"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={3}
                  placeholder="Describe this class..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Image URL
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, image: e.target.value }))
                  }
                  placeholder="https://example.com/image.jpg"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Status
                </label>
                <div className="select-wrapper">
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, status: e.target.value }))
                  }
                  className={getSelectClass("emerald")}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="DRAFT">Draft</option>
                </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Schedule
                  </label>
                  <button
                    type="button"
                    onClick={addScheduleSlot}
                    className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    <FiPlus className="w-3 h-3" /> Add Slot
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {form.schedule.length === 0 && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">
                      No schedule slots added yet
                    </p>
                  )}
                  {form.schedule.map((slot, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="select-wrapper">
                      <select
                        value={slot.day}
                        onChange={(e) =>
                          updateScheduleSlot(i, "day", e.target.value)
                        }
                        className={`${getSelectClass("emerald")} !py-1.5 !text-xs flex-shrink-0 w-28`}
                      >
                        {DAYS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      </div>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          updateScheduleSlot(i, "startTime", e.target.value)
                        }
                        className={`${inputClass} !py-1.5 !text-xs flex-shrink-0 w-24`}
                      />
                      <span className="text-gray-400 text-xs">to</span>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          updateScheduleSlot(i, "endTime", e.target.value)
                        }
                        className={`${inputClass} !py-1.5 !text-xs flex-shrink-0 w-24`}
                      />
                      <button
                        type="button"
                        onClick={() => removeScheduleSlot(i)}
                        className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FiX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-700/50 p-4">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  Preview
                </p>
                {form.image ? (
                  <div className="h-32 overflow-hidden rounded-lg mb-3">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-br from-emerald-50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20 flex items-center justify-center rounded-lg mb-3">
                    <FiImage className="w-8 h-8 text-emerald-600" />
                  </div>
                )}
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {form.name || "Class Name"}
                </h3>
                <p className="text-xs text-emerald-600/70">
                  {form.category || "Category"} • {form.difficulty}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {form.price ? `$${form.price}` : "Free"}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {form.duration ? `${form.duration} min` : "TBD"}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {form.capacity || 0} seats
                  </span>
                </div>
                {form.schedule.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.schedule.map((s, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-medium"
                      >
                        {s.day.slice(0, 3)} {s.startTime}-{s.endTime}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button type="submit" variant="emerald" size="md">
              {editing ? "Update Class" : "Save Class"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => {
                setShowModal(false);
                setEditing(null);
                setForm(emptyForm);
                setError("");
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
        title="Class Details"
        subtitle={viewItem?.category}
        size="lg"
      >
        {viewItem && (
          <div className="rounded-xl border border-emerald-100 dark:border-emerald-800/50 overflow-hidden bg-gray-50 dark:bg-gray-700/50">
            {viewItem.image && (
              <div className="h-48 overflow-hidden">
                <img
                  src={viewItem.image}
                  alt={viewItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <CmsBadge
                  status={viewItem.status === "ACTIVE" ? "active" : "draft"}
                />
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  {viewItem.difficulty}
                </span>
                {viewItem.category && (
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] font-bold">
                    {viewItem.category}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {viewItem.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {viewItem.description}
              </p>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Trainer
                  </p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {getTrainerName(viewItem.trainerId)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Price
                  </p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {viewItem.price != null ? `$${viewItem.price}` : "Free"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Capacity
                  </p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {viewItem.capacity || 0} seats
                  </p>
                </div>
              </div>
              {viewItem.schedule && viewItem.schedule.length > 0 && (
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                    Schedule
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {viewItem.schedule.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium"
                      >
                        {s.day} {s.startTime}-{s.endTime}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CmsModal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?._id || deleteTarget?.id)}
        title="Delete Class"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete Class"
        type="danger"
      />
    </motion.div>
  );
}

export default ClassManagement;
