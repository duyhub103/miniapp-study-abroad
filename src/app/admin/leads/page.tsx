"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PROFILE_GROUPS, LEAD_STATUSES, STATUS_LABELS } from "@/lib/enums";
import { POTENTIAL_LEVELS } from "@/lib/potential";

interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  profileGroup: string;
  resultTitle: string;
  status: string;
  targetCountry: string;
  assignedTo: string | null;
  potentialScore: number;
  potentialLevel: string;
  createdAt: string;
}

interface StatsData {
  totalLeads: number;
  contactedCount: number;
  statusCounts: { status: string; _count: { id: number } }[];
  groupCounts: { profileGroup: string; _count: { id: number } }[];
  countryCounts: { targetCountry: string; _count: { id: number } }[];
  assignmentCounts: { assignedTo: string | null; _count: { id: number } }[];
  potentialCounts: { potentialLevel: string; _count: { id: number } }[];
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  consulted: "bg-purple-100 text-purple-700",
  closed: "bg-slate-100 text-slate-500",
};

const GROUP_COLORS: Record<string, string> = {
  A: "bg-emerald-100 text-emerald-700",
  B: "bg-blue-100 text-blue-700",
  C: "bg-amber-100 text-amber-700",
  D: "bg-rose-100 text-rose-700",
};

export default function AdminLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterGroup, setFilterGroup] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [expandedLevel, setExpandedLevel] = useState<"hot" | "warm" | "cold" | null>(null);
  const [potentialLeads, setPotentialLeads] = useState<Record<"hot" | "warm" | "cold", Lead[]>>({
    hot: [],
    warm: [],
    cold: [],
  });
  const [potentialLeadsLoading, setPotentialLeadsLoading] = useState<Record<"hot" | "warm" | "cold", boolean>>({
    hot: false,
    warm: false,
    cold: false,
  });

  const togglePotentialLevel = async (level: "hot" | "warm" | "cold") => {
    if (expandedLevel === level) {
      setExpandedLevel(null);
      return;
    }
    setExpandedLevel(level);
    
    setPotentialLeadsLoading((prev) => ({ ...prev, [level]: true }));
    try {
      const res = await fetch(`/api/admin/leads?potentialLevel=${level}&limit=100`);
      if (res.ok) {
        const data = await res.json();
        setPotentialLeads((prev) => ({ ...prev, [level]: data.leads || [] }));
      }
    } catch { /* ignore */ } finally {
      setPotentialLeadsLoading((prev) => ({ ...prev, [level]: false }));
    }
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [leads, fetchStats]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (filterGroup) params.set("profileGroup", filterGroup);
      if (filterStatus) params.set("status", filterStatus);

      const res = await fetch(`/api/admin/leads?${params}`);
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      setLeads(data.leads || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, [page, filterGroup, filterStatus, router]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const [activeTab, setActiveTab] = useState<"list" | "charts" | "potential">("list");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xl">📊</span>
          <h1 className="text-lg font-bold text-slate-900">Hệ thống Quản lý Đánh giá Đầu vào</h1>
          <span className="text-sm text-slate-500 font-medium">({total} hồ sơ)</span>
        </div>
        <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors">
          Đăng xuất
        </button>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Dashboard */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Card 1: Total Leads */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-450 text-xs font-bold uppercase tracking-wider">Tổng số hồ sơ</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{stats.totalLeads}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center text-lg">
                  👥
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-3">Học sinh đăng ký làm đánh giá</p>
            </div>

            {/* Card 2: Conversion Rate */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-450 text-xs font-bold uppercase tracking-wider">Tỷ lệ liên hệ</p>
                  <h3 className="text-3xl font-extrabold text-teal-600 mt-2">
                    {stats.totalLeads > 0
                      ? Math.round((stats.contactedCount / stats.totalLeads) * 100)
                      : 0}
                    %
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-lg">
                  📈
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4">
                <div
                  className="bg-teal-500 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      stats.totalLeads > 0
                        ? (stats.contactedCount / stats.totalLeads) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Card 3: Status Breakdown */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm md:col-span-2">
              <p className="text-slate-450 text-xs font-bold uppercase tracking-wider mb-3">Trạng thái xử lý dữ liệu</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LEAD_STATUSES.map((status) => {
                  const count = stats.statusCounts.find((s) => s.status === status)?._count.id || 0;
                  const colorMap: Record<string, string> = {
                    new: "text-blue-600 bg-blue-50 border-blue-100",
                    contacted: "text-amber-600 bg-amber-50 border-amber-100",
                    consulted: "text-purple-600 bg-purple-50 border-purple-100",
                    closed: "text-slate-600 bg-slate-50 border-slate-200",
                  };
                  return (
                    <div key={status} className={`border rounded-lg p-2.5 text-center ${colorMap[status] || ""}`}>
                      <p className="text-xs font-bold">{STATUS_LABELS[status] || status}</p>
                      <h4 className="text-lg font-black mt-1">{count}</h4>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Consultant Assignment Breakdown */}
        {stats && (
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm mb-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>🧑‍💼</span> Phân bổ Lead theo Tư vấn viên phụ trách
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Trần Hoàng Duy", dept: "Tuyến Úc/Mỹ/Canada" },
                { name: "Trần Tấn Phúc", dept: "Tuyến Châu Á (Hàn/Nhật)" },
                { name: "Phạm Đăng Hoàng Hiếu", dept: "Tuyến Châu Âu & Khác" }
              ].map((rep) => {
                const count = stats.assignmentCounts.find((a) => a.assignedTo === rep.name)?._count.id || 0;
                const percentage = stats.totalLeads > 0 ? Math.round((count / stats.totalLeads) * 100) : 0;
                return (
                  <div key={rep.name} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{rep.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{rep.dept}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-teal-600">{count} Lead</span>
                      <p className="text-xs text-slate-500 mt-0.5">{percentage}% tổng số</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 mb-6 gap-2">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-all ${
              activeTab === "list"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            📋 Danh sách Lead
          </button>
          <button
            onClick={() => setActiveTab("charts")}
            className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-all ${
              activeTab === "charts"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            📊 Biểu đồ & Phân tích
          </button>
          <button
            onClick={() => setActiveTab("potential")}
            className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-all ${
              activeTab === "potential"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            🔥 Phân loại tiềm năng
          </button>
        </div>

        {/* Tab 1: Leads list */}
        {activeTab === "list" && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <select
                value={filterGroup}
                onChange={(e) => { setFilterGroup(e.target.value); setPage(1); }}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all appearance-none cursor-pointer"
              >
                <option value="">Tất cả nhóm</option>
                {PROFILE_GROUPS.map((g) => (
                  <option key={g} value={g}>Nhóm {g}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all appearance-none cursor-pointer"
              >
                <option value="">Tất cả trạng thái</option>
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-20 text-slate-400">Đang tải dữ liệu...</div>
            ) : leads.length === 0 ? (
              <div className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200">Chưa có lead nào đăng ký.</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-200">
                      <th className="px-4 py-3.5 font-bold">Họ tên</th>
                      <th className="px-4 py-3.5 font-bold">SĐT</th>
                      <th className="px-4 py-3.5 font-bold">Nhóm</th>
                      <th className="px-4 py-3.5 font-bold">Quốc gia</th>
                      <th className="px-4 py-3.5 font-bold">Tư vấn viên</th>
                      <th className="px-4 py-3.5 font-bold">Tiềm năng</th>
                      <th className="px-4 py-3.5 font-bold">Trạng thái</th>
                      <th className="px-4 py-3.5 font-bold">Ngày tạo</th>
                      <th className="px-4 py-3.5 font-bold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-slate-900">{lead.fullName}</td>
                        <td className="px-4 py-3.5 text-slate-600 font-semibold">{lead.phone}</td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${GROUP_COLORS[lead.profileGroup] || ""}`}>
                            {lead.profileGroup}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 font-medium">{lead.targetCountry}</td>
                        <td className="px-4 py-3.5 text-slate-700 font-bold">{lead.assignedTo || "Chưa phân công"}</td>
                        <td className="px-4 py-3.5">
                          {(() => {
                            const pc = POTENTIAL_LEVELS[lead.potentialLevel as keyof typeof POTENTIAL_LEVELS];
                            return pc ? (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${pc.color}`}>
                                {pc.emoji} {pc.label}
                              </span>
                            ) : <span className="text-slate-400 text-xs">—</span>;
                          })()}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[lead.status] || ""}`}>
                            {STATUS_LABELS[lead.status as keyof typeof STATUS_LABELS] || lead.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 font-medium">
                          {new Date(lead.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="text-teal-650 hover:text-teal-750 text-sm font-bold transition-colors"
                          >
                            Chi tiết →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:hover:bg-white"
                >
                  ←
                </button>
                <span className="text-sm text-slate-500 font-semibold">
                  Trang {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:hover:bg-white"
                >
                  →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Charts and Reports */}
        {activeTab === "charts" && stats && (() => {
          // Prepare Pie Chart data
          const groupData = ["A", "B", "C", "D"].map((group) => {
            const count = stats.groupCounts.find((g) => g.profileGroup === group)?._count.id || 0;
            const percentage = stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0;
            const colors: Record<string, string> = {
              A: "#10b981", // emerald-500
              B: "#3b82f6", // blue-500
              C: "#f59e0b", // amber-500
              D: "#ef4444", // rose-500
            };
            const labelMap: Record<string, string> = {
              A: "Nhóm A (Rất tiềm năng)",
              B: "Nhóm B (Tiềm năng)",
              C: "Nhóm C (Trung bình)",
              D: "Nhóm D (Cần cải thiện)",
            };
            return {
              group,
              count,
              percentage,
              color: colors[group],
              label: labelMap[group],
            };
          });

          // Build conic gradient string
          let accum = 0;
          const gradientSlices: string[] = [];
          groupData.forEach((item) => {
            if (item.count > 0) {
              const start = accum;
              accum += item.percentage;
              const end = accum;
              gradientSlices.push(`${item.color} ${start}% ${end}%`);
            }
          });

          const conicGradientString = gradientSlices.length > 0 
            ? `conic-gradient(${gradientSlices.join(", ")})` 
            : `conic-gradient(#cbd5e1 0% 100%)`;

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country breakdown chart (Vertical Columns) */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col h-[380px]">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <span>📊</span> Quốc gia được quan tâm (Biểu đồ Cột)
                </h3>
                <div className="flex-1 flex items-end gap-4 border-b border-slate-100 pb-2 relative min-h-[200px] px-2">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-2">
                    <div className="border-t border-slate-100/70 w-full h-0"></div>
                    <div className="border-t border-slate-100/70 w-full h-0"></div>
                    <div className="border-t border-slate-100/70 w-full h-0"></div>
                    <div className="border-t border-slate-100/70 w-full h-0"></div>
                  </div>

                  {stats.countryCounts.length === 0 ? (
                    <div className="w-full text-center text-slate-400 py-10 z-10">Chưa có dữ liệu quốc gia.</div>
                  ) : (
                    stats.countryCounts
                      .slice()
                      .sort((a, b) => b._count.id - a._count.id)
                      .map((item, index) => {
                        const percentage = stats.totalLeads > 0 ? (item._count.id / stats.totalLeads) * 100 : 0;
                        const colors = [
                          "from-teal-500 to-teal-400",
                          "from-blue-500 to-blue-400",
                          "from-emerald-500 to-emerald-400",
                          "from-indigo-500 to-indigo-400",
                          "from-purple-500 to-purple-400",
                        ];
                        const colorClass = colors[index % colors.length];
                        return (
                          <div key={item.targetCountry} className="flex-1 flex flex-col items-center justify-end h-full z-10 group relative">
                            {/* Tooltip */}
                            <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded shadow-md whitespace-nowrap z-20">
                              {item._count.id} lead ({Math.round(percentage)}%)
                            </div>
                            
                            {/* Vertical Bar */}
                            <div 
                              className={`w-full max-w-[40px] bg-gradient-to-t ${colorClass} rounded-t-md transition-all duration-500 cursor-pointer shadow-sm hover:brightness-105`}
                              style={{ height: `${Math.max(8, percentage)}%` }}
                            />
                            
                            {/* Value badge */}
                            <span className="text-xs font-bold text-slate-800 mt-2">{item._count.id}</span>
                            
                            {/* Label */}
                            <span className="text-xs font-bold text-slate-500 mt-1 truncate w-full text-center" title={item.targetCountry}>
                              {item.targetCountry}
                            </span>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

              {/* Profile group breakdown (Donut Chart) */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col h-[380px]">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <span>🍩</span> Phân loại Nhóm Hồ sơ (Biểu đồ Tròn)
                </h3>
                
                <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8">
                  {/* Donut Chart */}
                  <div 
                    className="w-40 h-40 rounded-full flex items-center justify-center relative shadow-md transition-transform duration-500 hover:scale-105 flex-shrink-0"
                    style={{ background: conicGradientString }}
                  >
                    {/* Inner Circle */}
                    <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                      <span className="text-3xl font-black text-slate-800">{stats.totalLeads}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Hồ sơ</span>
                    </div>
                  </div>

                  {/* Legends */}
                  <div className="flex-1 space-y-3 w-full max-w-[280px]">
                    {groupData.map((item) => (
                      <div key={item.group} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full border border-white shadow-sm flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-bold text-slate-600">{item.label}</span>
                        </div>
                        <div className="text-right font-black text-slate-800">
                          {item.count} <span className="text-slate-400 font-bold text-[10px]">({Math.round(item.percentage)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Tab 3: Potential Classification */}
        {activeTab === "potential" && stats && (() => {
          const levels = ["hot", "warm", "cold"] as const;
          const levelData = levels.map((level) => {
            const count = stats.potentialCounts?.find((p) => p.potentialLevel === level)?._count.id || 0;
            const percentage = stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0;
            const config = POTENTIAL_LEVELS[level];
            return { level, count, percentage, config };
          });

          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {levelData.map((item) => {
                  const isExpanded = expandedLevel === item.level;
                  const bgClass = isExpanded 
                    ? item.config.color 
                    : item.config.color.replace(/bg-\w+-100/, "bg-white");

                  return (
                    <button
                      key={item.level}
                      onClick={() => togglePotentialLevel(item.level)}
                      className={`text-left w-full rounded-xl p-5 border-2 shadow-sm transition-all duration-200 cursor-pointer focus:outline-none ${bgClass} ${
                        isExpanded ? "ring-2 ring-teal-500 ring-offset-1 scale-[1.01]" : "hover:shadow-md hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">{item.config.emoji}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-black">{item.count}</span>
                          <span className="text-xs opacity-60 font-semibold">{isExpanded ? "▲ Đóng" : "▼ Chi tiết"}</span>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold uppercase tracking-wider mb-1">{item.config.label}</h4>
                      <p className="text-xs opacity-80 mb-3">{item.config.description}</p>
                      <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                        <div className={`${item.config.barColor} h-2 rounded-full transition-all duration-700`} style={{ width: `${item.percentage}%` }} />
                      </div>
                      <p className="text-xs font-bold mt-1">{Math.round(item.percentage)}% tổng lead</p>
                    </button>
                  );
                })}
              </div>

              {/* Collapsible Leads list under the cards */}
              {expandedLevel && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
                  <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <span>{POTENTIAL_LEVELS[expandedLevel].emoji}</span>
                      Danh sách Lead: {POTENTIAL_LEVELS[expandedLevel].label}
                      <span className="text-sm font-medium text-slate-500">
                        ({potentialLeads[expandedLevel]?.length || 0} hồ sơ)
                      </span>
                    </h3>
                    <button
                      onClick={() => setExpandedLevel(null)}
                      className="text-slate-400 hover:text-slate-600 text-sm font-bold flex items-center gap-1 cursor-pointer"
                    >
                      Đóng danh sách ✕
                    </button>
                  </div>

                  {potentialLeadsLoading[expandedLevel] ? (
                    <div className="py-12 text-center text-slate-400 font-medium">Đang tải danh sách...</div>
                  ) : !potentialLeads[expandedLevel] || potentialLeads[expandedLevel].length === 0 ? (
                    <div className="py-12 text-center text-slate-500 font-medium">Không có hồ sơ nào thuộc nhóm này.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50/50 text-slate-500 text-left border-b border-slate-200">
                            <th className="px-5 py-3 font-bold">Họ tên</th>
                            <th className="px-5 py-3 font-bold">SĐT</th>
                            <th className="px-5 py-3 font-bold">Nhóm</th>
                            <th className="px-5 py-3 font-bold">Quốc gia</th>
                            <th className="px-5 py-3 font-bold">Tư vấn viên</th>
                            <th className="px-5 py-3 font-bold">Điểm</th>
                            <th className="px-5 py-3 font-bold">Trạng thái</th>
                            <th className="px-5 py-3 font-bold"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {potentialLeads[expandedLevel].map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors">
                              <td className="px-5 py-3.5 font-bold text-slate-900">{lead.fullName}</td>
                              <td className="px-5 py-3.5 text-slate-600 font-semibold">{lead.phone}</td>
                              <td className="px-5 py-3.5">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${GROUP_COLORS[lead.profileGroup] || ""}`}>
                                  {lead.profileGroup}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-slate-600 font-medium">{lead.targetCountry}</td>
                              <td className="px-5 py-3.5 text-slate-700 font-bold">{lead.assignedTo || "Chưa phân công"}</td>
                              <td className="px-5 py-3.5 text-slate-800 font-black">{lead.potentialScore}</td>
                              <td className="px-5 py-3.5">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[lead.status] || ""}`}>
                                  {STATUS_LABELS[lead.status as keyof typeof STATUS_LABELS] || lead.status}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <Link
                                  href={`/admin/leads/${lead.id}`}
                                  className="text-teal-650 hover:text-teal-750 text-sm font-bold transition-colors"
                                >
                                  Chi tiết →
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {levelData.map((item) => (
                  <div key={item.level} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span>{item.config.emoji}</span> Hành động — {item.config.label}
                    </h4>
                    <div className="space-y-2">
                      {item.config.actions.map((action, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                          <span className="text-teal-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                          <span className="font-medium">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
