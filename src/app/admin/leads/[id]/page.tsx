"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LEAD_STATUSES } from "@/lib/enums";

interface LeadDetail {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  currentRole: string;
  currentEducationLevel: string;
  academicLevel: string;
  currentMajor: string | null;
  graduationPlan: string | null;
  targetCountry: string;
  targetMajor: string;
  studyType: string;
  departureTime: string;
  budget: string;
  language: string;
  certificate: string;
  certificateScore: string | null;
  languageLevel: string;
  weakSkill: string;
  languageGroup: number;
  profileGroup: string;
  resultTitle: string;
  resultNote: string;
  aiEvaluation: string | null;
  status: string;
  sourcePage: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  createdAt: string;
  updatedAt: string;
}

const GROUP_COLORS: Record<string, string> = {
  A: "bg-emerald-500", B: "bg-blue-500", C: "bg-amber-500", D: "bg-rose-500",
};

export default function AdminLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/leads/${id}`);
        if (res.status === 401) { router.push("/admin"); return; }
        const data = await res.json();
        setLead(data.lead);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setLead(data.lead);
      }
    } catch { /* ignore */ } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">Đang tải...</div>;
  if (!lead) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">Không tìm thấy lead.</div>;

  const fields = [
    ["Họ tên", lead.fullName],
    ["SĐT", lead.phone],
    ["Email", lead.email || "—"],
    ["Vai trò", lead.currentRole],
    ["Trình độ", lead.currentEducationLevel],
    ["Học lực", lead.academicLevel],
    ["Ngành hiện tại", lead.currentMajor || "—"],
    ["Dự kiến tốt nghiệp", lead.graduationPlan || "—"],
    ["Quốc gia", lead.targetCountry],
    ["Ngành mục tiêu", lead.targetMajor],
    ["Bậc học", lead.studyType],
    ["Thời gian", lead.departureTime],
    ["Ngân sách", lead.budget],
    ["Ngoại ngữ", lead.language],
    ["Chứng chỉ", lead.certificate],
    ["Điểm chứng chỉ", lead.certificateScore || "—"],
    ["Trình độ NNG", lead.languageLevel],
    ["Kỹ năng yếu", lead.weakSkill],
    ["Nhóm NNG", `Group ${lead.languageGroup}`],
    ["Source", lead.sourcePage || "—"],
    ["UTM Source", lead.utmSource || "—"],
    ["UTM Medium", lead.utmMedium || "—"],
    ["UTM Campaign", lead.utmCampaign || "—"],
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/leads" className="text-teal-400 hover:text-teal-300">← Danh sách</Link>
          <span className="text-slate-600">|</span>
          <h1 className="text-lg font-bold">{lead.fullName}</h1>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Profile group badge */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-xl ${GROUP_COLORS[lead.profileGroup]} flex items-center justify-center text-white text-xl font-bold`}>
            {lead.profileGroup}
          </div>
          <div>
            <h2 className="text-xl font-bold">{lead.resultTitle}</h2>
            <p className="text-slate-400 text-sm">
              Tạo: {new Date(lead.createdAt).toLocaleString("vi-VN")} · 
              Cập nhật: {new Date(lead.updatedAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Status update */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 mb-6">
          <h3 className="text-sm font-semibold text-slate-400 mb-3">Trạng thái</h3>
          <div className="flex flex-wrap gap-2">
            {LEAD_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={updating}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  lead.status === s
                    ? "bg-teal-500 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                } disabled:opacity-50`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* AI Evaluation */}
        {lead.aiEvaluation && (
          <div className="bg-slate-800 rounded-xl p-5 border border-purple-500/30 mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500" />
            <h3 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
              <span>✨</span> Nhận xét từ AI (Gemini)
            </h3>
            <pre className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{lead.aiEvaluation}</pre>
          </div>
        )}

        {/* Rule-based result note */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 mb-6">
          <h3 className="text-sm font-semibold text-slate-400 mb-3">Kết quả đánh giá (Rule-based)</h3>
          <pre className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{lead.resultNote}</pre>
        </div>

        {/* All fields */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <h3 className="text-sm font-semibold text-slate-400 px-5 py-3 border-b border-slate-700">Thông tin chi tiết</h3>
          <div className="divide-y divide-slate-700/50">
            {fields.map(([label, value]) => (
              <div key={label} className="flex px-5 py-3">
                <span className="w-40 text-sm text-slate-500 flex-shrink-0">{label}</span>
                <span className="text-sm text-slate-200">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
