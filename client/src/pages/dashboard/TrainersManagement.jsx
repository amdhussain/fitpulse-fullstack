import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiUser,
  FiAward,
  FiStar,
  FiPhone,
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
  getTrainers,
  getTrainerStats,
  getSpecializations,
} from "../../lib/trainersData";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  experience: "",
  workingDays: "",
  workingHours: "",
  bio: "",
  certificates: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  image: "",
};

function TrainersManagement() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const inputClass = getInputClass("cyan");
  const stats = getTrainerStats(trainers);
  const specializations = getSpecializations();

  useEffect(() => {
    const timer = setTimeout(() => {
      setTrainers(getTrainers());
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
      email: item.email,
      phone: item.phone,
      specialization: item.specialization,
      experience: item.experience,
      workingDays: item.workingDays,
      workingHours: item.workingHours,
      bio: item.bio,
      certificates: item.certificates || "",
      facebook: item.facebook || "",
      instagram: item.instagram || "",
      linkedin: item.linkedin || "",
      image: item.image || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setTrainers((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleStatus = (id) => {
    setTrainers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "active" ? "draft" : "active" }
          : t
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editing) {
      setTrainers((prev) =>
        prev.map((t) =>
          t.id === editing ? { ...t, ...form, updatedAt: "Just now" } : t
        )
      );
    } else {
      setTrainers((prev) => [
        {
          id: Date.now(),
          ...form,
          status: "draft",
          rating: 0,
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
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-cyan-500/10 shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiUser className="w-5 h-5 text-cyan-400/40" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Trainer Name",
      render: (_, item) => (
        <div>
          <p className="font-medium text-white/80">{item.name}</p>
          <p className="text-xs text-white/30">{item.specialization}</p>
        </div>
      ),
    },
    {
      key: "specialization",
      label: "Specialization",
      render: (val) => <span className="text-sm text-white/60">{val}</span>,
    },
    {
      key: "experience",
      label: "Experience",
      render: (val) => <span className="text-xs text-white/50">{val}</span>,
    },
    {
      key: "phone",
      label: "Phone",
      render: (val) => (
        <div className="flex items-center gap-1.5 text-white/40">
          <FiPhone className="w-3 h-3" />
          <span className="text-xs">{val}</span>
        </div>
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
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageBanner
        pageKey="trainers"
        subtitle="Manage your fitness trainers"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FiUser}
          label="Total Trainers"
          value={stats.total}
          pageKey="trainers"
          index={0}
        />
        <StatCard
          icon={FiAward}
          label="Active Trainers"
          value={stats.active}
          pageKey="trainers"
          index={1}
        />
        <StatCard
          icon={FiStar}
          label="Specializations"
          value={stats.specializations}
          pageKey="trainers"
          index={2}
        />
        <StatCard
          icon={FiPhone}
          label="Avg Rating"
          value={stats.avgRating}
          pageKey="trainers"
          index={3}
        />
      </div>

      <DataTable
        data={trainers}
        columns={columns}
        accent="cyan"
        searchPlaceholder="Search trainers..."
        searchKey="name"
        filterOptions={[
          { value: "active", label: "Active" },
          { value: "draft", label: "Draft" },
        ]}
        filterKey="status"
        rowsPerPage={5}
        onAdd={openAdd}
        addLabel="Add Trainer"
        loading={loading}
        actions={(item) => (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewItem(item);
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-cyan-400 transition-colors"
              aria-label={`View ${item.name}`}
            >
              <FiEye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEdit(item);
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-cyan-400 transition-colors"
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
        title={editing ? "Edit Trainer" : "Add Trainer"}
        subtitle="Configure trainer profile and schedule"
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FileUpload
                label="Trainer Photo"
                value={form.image}
                onChange={() => {}}
                color="cyan"
              />
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="John Doe"
                  className={inputClass}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="trainer@email.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="+1 (555) 000-0000"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Specialization
                  </label>
                  <select
                    value={form.specialization}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        specialization: e.target.value,
                      }))
                    }
                    className={inputClass}
                  >
                    <option value="">Select specialization</option>
                    {specializations.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Experience
                  </label>
                  <select
                    value={form.experience}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, experience: e.target.value }))
                    }
                    className={inputClass}
                  >
                    <option value="">Select experience</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Working Days
                  </label>
                  <input
                    type="text"
                    value={form.workingDays}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, workingDays: e.target.value }))
                    }
                    placeholder="Mon, Tue, Wed, Thu, Fri"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Working Hours
                  </label>
                  <input
                    type="text"
                    value={form.workingHours}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, workingHours: e.target.value }))
                    }
                    placeholder="6:00 AM - 2:00 PM"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Short Biography
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, bio: e.target.value }))
                  }
                  rows={3}
                  placeholder="Tell us about this trainer..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Certificates (comma separated)
                </label>
                <input
                  type="text"
                  value={form.certificates}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, certificates: e.target.value }))
                  }
                  placeholder="CSCS, NSCA-CPT, USAW Level 2"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Facebook
                  </label>
                  <input
                    type="text"
                    value={form.facebook}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, facebook: e.target.value }))
                    }
                    placeholder="Facebook URL"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={form.instagram}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, instagram: e.target.value }))
                    }
                    placeholder="Instagram URL"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    value={form.linkedin}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, linkedin: e.target.value }))
                    }
                    placeholder="LinkedIn URL"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                Preview
              </p>
              <div className="rounded-xl border border-cyan-500/10 overflow-hidden bg-[#0f0f15]">
                {form.image ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 flex items-center justify-center">
                    <FiImage className="w-10 h-10 text-cyan-400/20" />
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold text-white">
                    {form.name || "Trainer Name"}
                  </h3>
                  <p className="text-xs text-cyan-400/70">
                    {form.specialization || "Specialization"}
                  </p>
                  <p className="text-xs text-white/40">
                    {form.experience || "Experience"}
                  </p>
                  {form.workingHours && (
                    <div className="flex items-center gap-1.5 text-white/40">
                      <FiPhone className="w-3 h-3" />
                      <span className="text-xs">{form.workingHours}</span>
                    </div>
                  )}
                  <p className="text-xs text-white/40 line-clamp-3">
                    {form.bio || "Biography will appear here..."}
                  </p>
                  {form.certificates && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {form.certificates.split(",").map((c, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-medium"
                        >
                          {c.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-2">
                    {form.facebook && (
                      <span className="text-xs text-cyan-400/60 underline">
                        Facebook
                      </span>
                    )}
                    {form.instagram && (
                      <span className="text-xs text-cyan-400/60 underline">
                        Instagram
                      </span>
                    )}
                    {form.linkedin && (
                      <span className="text-xs text-cyan-400/60 underline">
                        LinkedIn
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <Button type="submit" variant="cyan" size="md">
              {editing ? "Update Trainer" : "Save Trainer"}
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
        title="Trainer Profile"
        subtitle={viewItem?.specialization}
        size="lg"
      >
        {viewItem && (
          <div className="rounded-xl border border-cyan-500/10 overflow-hidden bg-[#0f0f15]">
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
                <CmsBadge status={viewItem.status} />
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">
                  {viewItem.specialization}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{viewItem.name}</h3>
              <div className="flex items-center gap-4 text-sm text-white/40">
                <div className="flex items-center gap-1.5">
                  <FiUser className="w-3.5 h-3.5" />
                  <span>{viewItem.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiPhone className="w-3.5 h-3.5" />
                  <span>{viewItem.phone}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/5">
                <div>
                  <p className="text-xs text-white/30">Experience</p>
                  <p className="text-sm font-medium text-white/70">
                    {viewItem.experience}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/30">Working Days</p>
                  <p className="text-sm font-medium text-white/70">
                    {viewItem.workingDays}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/30">Working Hours</p>
                  <p className="text-sm font-medium text-white/70">
                    {viewItem.workingHours}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5">
                <p className="text-xs text-white/30 mb-1.5">About</p>
                <p className="text-sm text-white/50 leading-relaxed">
                  {viewItem.bio}
                </p>
              </div>
              {viewItem.certificates && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                  {viewItem.certificates.split(",").map((c, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium"
                    >
                      {c.trim()}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                {viewItem.facebook && (
                  <a
                    href={viewItem.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400/60 hover:text-cyan-400 underline transition-colors"
                  >
                    Facebook
                  </a>
                )}
                {viewItem.instagram && (
                  <a
                    href={viewItem.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400/60 hover:text-cyan-400 underline transition-colors"
                  >
                    Instagram
                  </a>
                )}
                {viewItem.linkedin && (
                  <a
                    href={viewItem.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400/60 hover:text-cyan-400 underline transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </CmsModal>
    </motion.div>
  );
}

export default TrainersManagement;
