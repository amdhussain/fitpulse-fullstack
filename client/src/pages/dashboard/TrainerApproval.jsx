import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiUserCheck,
  FiUser,
  FiSearch,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiMail,
  FiPhone,
  FiAward,
  FiClock,
  FiEye,
  FiArrowRight,
} from "react-icons/fi";
import { staggerContainer } from "../../lib/animations";
import PageBanner from "../../components/dashboard/PageBanner";
import StatCard from "../../components/dashboard/StatCard";
import DataTable from "../../components/dashboard/DataTable";
import CmsBadge from "../../components/dashboard/CmsBadge";
import CmsModal from "../../components/dashboard/CmsModal";

const API_URL = import.meta.env.API_URL;

function getAuthToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAuthToken()}`,
  };
};

function TrainerApprovalSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-20 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function TrainerApproval() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const fetchTrainers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/v1/trainer/`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const list = data.data?.trainers || data.data || [];
        setTrainers(list);
        setStats({
          total: list.length,
          active: list.filter((t) => t.status === "active" || t.isActive).length,
          pending: list.filter((t) => t.status === "pending" || !t.isActive).length,
        });
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  const filtered = trainers.filter((t) => {
    const fullName = `${t.user?.firstName || t.firstName || ""} ${t.user?.lastName || t.lastName || ""}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      t.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.specializations?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const columns = [
    {
      key: "user",
      label: "Trainer",
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-500/20 dark:to-teal-500/10 flex items-center justify-center">
            <FiUser className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {v?.firstName || row.firstName} {v?.lastName || row.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{v?.email || row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "specializations",
      label: "Specializations",
      render: (v) => (
        <div className="flex flex-wrap gap-1">
          {(v || []).slice(0, 2).map((spec, i) => (
            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
              {spec}
            </span>
          ))}
          {v?.length > 2 && (
            <span className="text-xs text-gray-400">+{v.length - 2}</span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (v, row) => {
        const isActive = v === "active" || row.isActive;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            isActive
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
              : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
          }`}>
            {isActive ? "Active" : "Pending"}
          </span>
        );
      },
    },
    {
      key: "experience",
      label: "Experience",
      render: (v) => <span className="text-sm text-gray-600 dark:text-gray-300">{v || "N/A"}</span>,
    },
    {
      key: "_id",
      label: "",
      render: (v, row) => (
        <button
          onClick={() => { setSelectedTrainer(row); setShowDetail(true); }}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <FiEye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <PageBanner pageKey="trainerApproval" icon={FiUserCheck} subtitle="Review and manage trainer approvals" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={FiUserCheck} label="Total Trainers" value={stats.total} color="cyan" />
        <StatCard icon={FiCheck} label="Active" value={stats.active} color="emerald" />
        <StatCard icon={FiClock} label="Pending Review" value={stats.pending} color="amber" />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search trainers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15 transition-all"
          />
        </div>
        <button
          onClick={fetchTrainers}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
        >
          <FiRefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>
      {loading ? (
        <TrainerApprovalSkeleton />
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="No trainers found" />
      )}

      {showDetail && selectedTrainer && (
        <CmsModal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Trainer Details" size="lg">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-500/20 dark:to-teal-500/10 flex items-center justify-center">
                <FiUser className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedTrainer.user?.firstName || selectedTrainer.firstName} {selectedTrainer.user?.lastName || selectedTrainer.lastName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedTrainer.user?.email || selectedTrainer.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Experience</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedTrainer.experience || "N/A"}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {selectedTrainer.status === "active" || selectedTrainer.isActive ? "Active" : "Pending"}
                </p>
              </div>
            </div>
            {selectedTrainer.specializations?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTrainer.specializations.map((spec, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {selectedTrainer.certifications?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Certifications</p>
                <div className="space-y-2">
                  {selectedTrainer.certifications.map((cert, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <FiAward className="w-4 h-4 text-amber-500" />
                      {cert.name || cert}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CmsModal>
      )}
    </motion.div>
  );
}

export default TrainerApproval;
