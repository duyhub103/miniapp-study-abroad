"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PROFILE_GROUPS, LEAD_STATUSES } from "@/lib/enums";

interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  profileGroup: string;
  resultTitle: string;
  status: string;
  targetCountry: string;
  createdAt: string;
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

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">📊</span>
          <h1 className="text-lg font-bold">Quản lý Lead</h1>
          <span className="text-sm text-slate-400">({total} leads)</span>
        </div>
        <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-white transition-colors">
          Đăng xuất
        </button>
      </header>

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={filterGroup}
            onChange={(e) => { setFilterGroup(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white outline-none focus:border-teal-500"
          >
            <option value="">Tất cả nhóm</option>
            {PROFILE_GROUPS.map((g) => (
              <option key={g} value={g}>Nhóm {g}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white outline-none focus:border-teal-500"
          >
            <option value="">Tất cả trạng thái</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Đang tải...</div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20 text-slate-500">Chưa có lead nào.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800 text-slate-400 text-left">
                  <th className="px-4 py-3 font-medium">Họ tên</th>
                  <th className="px-4 py-3 font-medium">SĐT</th>
                  <th className="px-4 py-3 font-medium">Nhóm</th>
                  <th className="px-4 py-3 font-medium">Quốc gia</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 font-medium">Ngày tạo</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{lead.fullName}</td>
                    <td className="px-4 py-3 text-slate-300">{lead.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${GROUP_COLORS[lead.profileGroup] || ""}`}>
                        {lead.profileGroup}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{lead.targetCountry}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status] || ""}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="text-teal-400 hover:text-teal-300 text-sm font-medium"
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
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm disabled:opacity-30 hover:bg-slate-700 transition-colors"
            >
              ←
            </button>
            <span className="text-sm text-slate-400">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm disabled:opacity-30 hover:bg-slate-700 transition-colors"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
