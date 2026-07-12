import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiDollarSign,
  FiTrendingUp,
  FiStar,
  FiCalendar,
} from "react-icons/fi";
import { Button, SavedBadge } from "../../components/ui";
import { staggerContainer } from "../../lib/animations";
import PageBanner from "../../components/dashboard/PageBanner";
import StatCard from "../../components/dashboard/StatCard";
import DataTable from "../../components/dashboard/DataTable";
import CmsModal from "../../components/dashboard/CmsModal";
import CmsBadge from "../../components/dashboard/CmsBadge";
import { getInputClass } from "../../lib/dashboardHelpers";
import {
  getMembershipPlans,
  getMembershipStats,
} from "../../lib/membershipData";

const emptyForm = {
  name: "",
  monthlyPrice: "",
  yearlyPrice: "",
  duration: "Monthly",
  description: "",
  features: "",
  popular: false,
  color: "#eab308",
};

const colorOptions = [
  "#eab308",
  "#f97316",
  "#10b981",
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
];

function MembershipManagement() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const inputClass = getInputClass("yellow");
  const stats = getMembershipStats(plans);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPlans(getMembershipPlans());
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
      monthlyPrice: item.monthlyPrice,
      yearlyPrice: item.yearlyPrice,
      duration: item.duration,
      description: item.description,
      features: item.features || "",
      popular: item.popular,
      color: item.color || "#eab308",
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleStatus = (id) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "draft" : "active" }
          : p
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editing) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editing ? { ...p, ...form, updatedAt: "Just now" } : p
        )
      );
    } else {
      setPlans((prev) => [
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

  const parseFeatures = (features) => {
    if (!features) return [];
    return features.split(",").map((f) => f.trim()).filter(Boolean);
  };

  const columns = [
    {
      key: "name",
      label: "Plan Name",
      render: (_, item) => (
        <div>
          <div className="flex items-center gap-2">
            <p
              className="font-semibold"
              style={{ color: item.color || "#eab308" }}
            >
              {item.name}
            </p>
            {item.popular && (
              <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            )}
          </div>
        </div>
      ),
    },
    {
      key: "monthlyPrice",
      label: "Monthly",
      render: (val) => (
        <span className="text-sm font-semibold text-yellow-400">{val}</span>
      ),
    },
    {
      key: "yearlyPrice",
      label: "Yearly",
      render: (val) => (
        <span className="text-sm text-amber-400 text-sm">{val}</span>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (val) => (
        <div className="flex items-center gap-1.5 text-white/40">
          <FiCalendar className="w-3 h-3" />
          <span className="text-xs">{val}</span>
        </div>
      ),
    },
    {
      key: "features",
      label: "Features",
      render: (val) => {
        const items = parseFeatures(val);
        const shown = items.slice(0, 2);
        const remaining = items.length - 2;
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            {shown.map((f, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-medium"
              >
                {f}
              </span>
            ))}
            {remaining > 0 && (
              <span className="text-[10px] text-white/30">
                +{remaining} more
              </span>
            )}
          </div>
        );
      },
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
        pageKey="membership"
        subtitle="Manage your membership plans"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FiDollarSign}
          label="Total Plans"
          value={stats.total}
          pageKey="membership"
          index={0}
        />
        <StatCard
          icon={FiStar}
          label="Popular Plans"
          value={stats.popular}
          pageKey="membership"
          index={1}
        />
        <StatCard
          icon={FiTrendingUp}
          label="Monthly Plans"
          value={stats.monthly}
          pageKey="membership"
          index={2}
        />
        <StatCard
          icon={FiCalendar}
          label="Yearly Plans"
          value={stats.yearly}
          pageKey="membership"
          index={3}
        />
      </div>

      <DataTable
        data={plans}
        columns={columns}
        accent="yellow"
        searchPlaceholder="Search plans..."
        searchKey="name"
        filterOptions={[
          { value: "active", label: "Active" },
          { value: "draft", label: "Draft" },
        ]}
        filterKey="status"
        rowsPerPage={5}
        onAdd={openAdd}
        addLabel="Add Plan"
        loading={loading}
        actions={(item) => (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewItem(item);
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-yellow-400 transition-colors"
              aria-label={`View ${item.name}`}
            >
              <FiEye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEdit(item);
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-yellow-400 transition-colors"
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
        title={editing ? "Edit Plan" : "Add Plan"}
        subtitle="Configure your membership plan details and pricing"
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Plan Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Premium Active"
                  className={inputClass}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Monthly Price
                  </label>
                  <input
                    type="text"
                    value={form.monthlyPrice}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, monthlyPrice: e.target.value }))
                    }
                    placeholder="$59"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Yearly Price
                  </label>
                  <input
                    type="text"
                    value={form.yearlyPrice}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, yearlyPrice: e.target.value }))
                    }
                    placeholder="$599"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Duration
                </label>
                <select
                  value={form.duration}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, duration: e.target.value }))
                  }
                  className={inputClass}
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
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
                  placeholder="Plan description..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Features (comma separated)
                </label>
                <textarea
                  value={form.features}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, features: e.target.value }))
                  }
                  rows={3}
                  placeholder="Gym Access, Personal Training, Sauna"
                  className={`${inputClass} resize-none`}
                />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.popular}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, popular: e.target.checked }))
                  }
                  className="w-4 h-4 rounded-md border border-white/20 bg-white/5 checked:bg-yellow-500 checked:border-yellow-500 transition-all duration-200 cursor-pointer accent-yellow-500"
                />
                <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                  Popular Plan
                </span>
              </label>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  Color Theme
                </label>
                <div className="flex items-center gap-2.5">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, color: c }))}
                      className={`w-7 h-7 rounded-full transition-all duration-200 ${
                        form.color === c
                          ? "ring-2 ring-offset-2 ring-offset-[#12121a]"
                          : "hover:scale-110"
                      }`}
                      style={{
                        backgroundColor: c,
                        ringColor: form.color === c ? c : undefined,
                        borderColor:
                          form.color === c ? c : "transparent",
                        boxShadow:
                          form.color === c
                            ? `0 0 0 2px #12121a, 0 0 0 4px ${c}`
                            : "none",
                      }}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                Preview
              </p>
              <div className="rounded-xl border border-yellow-500/10 overflow-hidden bg-[#0f0f15]">
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: form.color || "#eab308" }}
                />
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">
                      {form.name || "Plan Name"}
                    </h3>
                    {form.popular && (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-bold flex items-center gap-1">
                        <FiStar className="w-2.5 h-2.5 fill-current" />
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="flex items-end gap-4">
                    {form.monthlyPrice && (
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider">
                          Monthly
                        </p>
                        <p className="text-xl font-bold text-yellow-400">
                          {form.monthlyPrice}
                        </p>
                      </div>
                    )}
                    {form.yearlyPrice && (
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider">
                          Yearly
                        </p>
                        <p className="text-lg font-semibold text-amber-400">
                          {form.yearlyPrice}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: `${form.color || "#eab308"}15`,
                        color: form.color || "#eab308",
                      }}
                    >
                      <FiCalendar className="w-2.5 h-2.5" />
                      {form.duration || "Monthly"}
                    </span>
                  </div>
                  {form.description && (
                    <p className="text-xs text-white/40 line-clamp-2">
                      {form.description}
                    </p>
                  )}
                  {form.features && (
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      {parseFeatures(form.features).map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs text-white/50"
                        >
                          <FiStar
                            className="w-3 h-3 shrink-0"
                            style={{
                              color: form.color || "#eab308",
                            }}
                          />
                          {f}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <Button type="submit" variant="yellow" size="md">
              {editing ? "Update Plan" : "Save Plan"}
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
        title="Plan Details"
        subtitle={viewItem?.duration}
        size="lg"
      >
        {viewItem && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-[#0f0f15] border border-yellow-500/10">
              <div
                className="h-2 w-full"
                style={{ backgroundColor: viewItem.color || "#eab308" }}
              />
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <CmsBadge status={viewItem.status} />
                  {viewItem.popular && (
                    <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-bold flex items-center gap-1">
                      <FiStar className="w-2.5 h-2.5 fill-current" />
                      Popular
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {viewItem.name}
                </h3>
                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/5">
                  <div>
                    <p className="text-xs text-white/30">Monthly</p>
                    <p className="text-lg font-bold text-yellow-400">
                      {viewItem.monthlyPrice}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/30">Yearly</p>
                    <p className="text-lg font-semibold text-amber-400">
                      {viewItem.yearlyPrice}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/30">Duration</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <FiCalendar className="w-3.5 h-3.5 text-white/40" />
                      <p className="text-sm font-medium text-white/70">
                        {viewItem.duration}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-white/40">{viewItem.description}</p>
                {viewItem.features && (
                  <div className="space-y-2 pt-3 border-t border-white/5">
                    {parseFeatures(viewItem.features).map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 text-sm text-white/60"
                      >
                        <FiStar
                          className="w-3.5 h-3.5 shrink-0"
                          style={{
                            color: viewItem.color || "#eab308",
                          }}
                        />
                        {f}
                      </div>
                    ))}
                  </div>
                )}
                <div className="pt-3 border-t border-white/5">
                  <p className="text-[11px] text-white/20">
                    Updated {viewItem.updatedAt}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CmsModal>
    </motion.div>
  );
}

export default MembershipManagement;