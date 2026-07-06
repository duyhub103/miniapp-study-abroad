"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LEAD_STATUSES, STATUS_LABELS } from "@/lib/enums";
import { POTENTIAL_LEVELS } from "@/lib/potential";

interface WebhookLog {
  id: string;
  target: string;
  status: string;
  attempts: number;
  lastError: string | null;
  createdAt: string;
}

interface RoadmapFeedback {
  id: string;
  content: string;
  sentViaEmail: boolean;
  createdBy: string;
  createdAt: string;
}

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
  assignedTo: string | null;
  potentialScore: number;
  potentialLevel: string;
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
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Roadmap state
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [roadmapDraft, setRoadmapDraft] = useState("");
  const [showRoadmapEditor, setShowRoadmapEditor] = useState(false);
  const [sendEmailWithRoadmap, setSendEmailWithRoadmap] = useState(true);
  const [roadmapMessage, setRoadmapMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/leads/${id}`);
        if (res.status === 401) { router.push("/admin"); return; }
        const data = await res.json();
        setLead(data.lead);
        setWebhookLogs(data.webhookLogs || []);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  // Fetch roadmap history
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/leads/${id}/roadmap`);
        if (res.ok) {
          const data = await res.json();
          setRoadmaps(data.roadmaps || []);
        }
      } catch { /* ignore */ }
    })();
  }, [id]);

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

  const handleGenerateRoadmap = async () => {
    setGeneratingRoadmap(true);
    setRoadmapMessage(null);
    try {
      const res = await fetch(`/api/admin/leads/${id}/roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sendEmail: false }),
      });
      const data = await res.json();
      if (res.ok && data.roadmap) {
        setRoadmapDraft(data.roadmap.content);
        setShowRoadmapEditor(true);
      } else {
        setRoadmapMessage({ type: "error", text: data.error || "Lỗi tạo lộ trình" });
      }
    } catch {
      setRoadmapMessage({ type: "error", text: "Không thể kết nối server" });
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  const handleSaveAndSendRoadmap = async () => {
    if (!roadmapDraft.trim()) return;
    setGeneratingRoadmap(true);
    setRoadmapMessage(null);
    try {
      const res = await fetch(`/api/admin/leads/${id}/roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customContent: roadmapDraft,
          sendEmail: sendEmailWithRoadmap && !!lead?.email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRoadmaps((prev) => [data.roadmap, ...prev]);
        setShowRoadmapEditor(false);
        setRoadmapDraft("");
        setRoadmapMessage({
          type: "success",
          text: data.emailSent
            ? "Đã lưu lộ trình và gửi email cho khách hàng!"
            : "Đã lưu lộ trình thành công!",
        });
      } else {
        setRoadmapMessage({ type: "error", text: data.error || "Lỗi lưu lộ trình" });
      }
    } catch {
      setRoadmapMessage({ type: "error", text: "Không thể kết nối server" });
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-semibold">Đang tải...</div>;
  if (!lead) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-semibold">Không tìm thấy lead.</div>;

  const potentialConfig = POTENTIAL_LEVELS[lead.potentialLevel as keyof typeof POTENTIAL_LEVELS] || POTENTIAL_LEVELS.cold;

  const fields = [
    ["Họ tên", lead.fullName],
    ["SĐT", lead.phone],
    ["Email", lead.email || "—"],
    ["Tư vấn viên phụ trách", lead.assignedTo || "Chưa phân công"],
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
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/leads" className="text-teal-600 hover:text-teal-700 font-bold transition-colors">← Danh sách</Link>
          <span className="text-slate-300">|</span>
          <h1 className="text-lg font-bold text-slate-900">{lead.fullName}</h1>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Profile group badge + Potential badge */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className={`w-12 h-12 rounded-xl ${GROUP_COLORS[lead.profileGroup]} flex items-center justify-center text-xl font-bold text-white`}>
            {lead.profileGroup}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-slate-900">{lead.resultTitle}</h2>
            <p className="text-slate-500 text-sm font-medium">
              Tạo: {new Date(lead.createdAt).toLocaleString("vi-VN")} · 
              Cập nhật: {new Date(lead.updatedAt).toLocaleString("vi-VN")}
            </p>
          </div>
          {/* Potential Badge */}
          <div className={`px-4 py-2 rounded-xl border-2 ${potentialConfig.color} flex items-center gap-2`}>
            <span className="text-xl">{potentialConfig.emoji}</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">{potentialConfig.label}</p>
              <p className="text-lg font-black">{lead.potentialScore}/100</p>
            </div>
          </div>
        </div>

        {/* ═══════════ Potential Classification Card ═══════════ */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm mb-6 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${potentialConfig.gradientFrom} ${potentialConfig.gradientTo}`} />
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 uppercase tracking-wider">
            <span>{potentialConfig.emoji}</span> Phân loại tiềm năng — {potentialConfig.label}
          </h3>
          <p className="text-sm text-slate-600 mb-4">{potentialConfig.description}</p>

          {/* Score bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-500">Điểm tiềm năng</span>
              <span className="text-slate-800">{lead.potentialScore}/100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className={`${potentialConfig.barColor} h-3 rounded-full transition-all duration-1000`}
                style={{ width: `${lead.potentialScore}%` }}
              />
            </div>
          </div>

          {/* Recommended actions */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hành động đề xuất</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {potentialConfig.actions.map((action, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                  <span className="text-teal-500 font-bold mt-0.5">✓</span>
                  <span className="font-medium">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status update */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm mb-6">
          <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Trạng thái</h3>
          <div className="flex flex-wrap gap-2">
            {LEAD_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={updating}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  lead.status === s
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                } disabled:opacity-50`}
              >
                {STATUS_LABELS[s as keyof typeof STATUS_LABELS] || s}
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════ Roadmap Feedback Section ═══════════ */}
        <div className="bg-white rounded-xl p-5 border border-teal-200 shadow-sm mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-cyan-500" />
          <h3 className="text-sm font-bold text-teal-700 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <span>🗺️</span> Phản hồi lộ trình cho khách hàng
          </h3>

          {/* Message */}
          {roadmapMessage && (
            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              roadmapMessage.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {roadmapMessage.text}
            </div>
          )}

          {!showRoadmapEditor ? (
            <div className="flex gap-3">
              <button
                onClick={handleGenerateRoadmap}
                disabled={generatingRoadmap}
                className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {generatingRoadmap ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Đang tạo lộ trình AI...
                  </>
                ) : (
                  <>✨ Tạo lộ trình bằng AI</>
                )}
              </button>
              <button
                onClick={() => setShowRoadmapEditor(true)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                ✏️ Viết thủ công
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={roadmapDraft}
                onChange={(e) => setRoadmapDraft(e.target.value)}
                rows={12}
                className="w-full p-4 border border-slate-200 rounded-xl text-sm text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 outline-none resize-y leading-relaxed"
                placeholder="Nhập nội dung lộ trình du học cho khách hàng..."
              />

              {lead.email && (
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendEmailWithRoadmap}
                    onChange={(e) => setSendEmailWithRoadmap(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="font-medium">Gửi email lộ trình cho khách hàng ({lead.email})</span>
                </label>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleSaveAndSendRoadmap}
                  disabled={generatingRoadmap || !roadmapDraft.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {generatingRoadmap ? "Đang lưu..." : "💾 Lưu & Gửi lộ trình"}
                </button>
                <button
                  onClick={() => { setShowRoadmapEditor(false); setRoadmapDraft(""); }}
                  className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Roadmap History */}
          {roadmaps.length > 0 && (
            <div className="mt-6 pt-4 border-t border-teal-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Lịch sử lộ trình ({roadmaps.length})
              </h4>
              <div className="space-y-3">
                {roadmaps.map((rm) => (
                  <div key={rm.id} className="bg-teal-50/50 border border-teal-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500 font-medium">
                        {new Date(rm.createdAt).toLocaleString("vi-VN")}
                      </span>
                      <div className="flex items-center gap-2">
                        {rm.sentViaEmail && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                            ✅ Đã gửi email
                          </span>
                        )}
                      </div>
                    </div>
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">
                      {rm.content}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Evaluation */}
        {lead.aiEvaluation && (
          <div className="bg-white rounded-xl p-5 border border-purple-200 mb-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500" />
            <h3 className="text-sm font-bold text-purple-600 mb-3 flex items-center gap-2 uppercase tracking-wider">
              <span>✨</span> Nhận xét từ AI (Gemini)
            </h3>
            <pre className="text-slate-750 text-sm font-medium whitespace-pre-wrap leading-relaxed">{lead.aiEvaluation}</pre>
          </div>
        )}

        {/* CRM Webhook Logs */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm mb-6">
          <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <span>🔌</span> Trạng thái Đồng bộ CRM & Webhooks
          </h3>
          {webhookLogs.length === 0 ? (
            <p className="text-slate-500 text-sm">Chưa có lịch sử đồng bộ.</p>
          ) : (
            <div className="space-y-3">
              {webhookLogs.map((log) => {
                const targetLabels: Record<string, string> = {
                  google_sheet: "Google Sheets",
                  zalo: "Zalo Notification",
                  email: "Email Notify",
                  hubspot: "HubSpot CRM",
                  salesforce: "Salesforce CRM",
                };
                const statusColors: Record<string, string> = {
                  sent: "bg-emerald-50 text-emerald-700 border-emerald-250",
                  pending: "bg-blue-50 text-blue-700 border-blue-250",
                  failed: "bg-rose-50 text-rose-700 border-rose-250",
                  dead: "bg-red-50 text-red-700 border-red-250",
                };
                const statusTexts: Record<string, string> = {
                  sent: "Đã đồng bộ",
                  pending: "Đang chờ",
                  failed: "Lỗi (Sẽ thử lại)",
                  dead: "Thất bại hoàn toàn",
                };
                return (
                  <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-xl gap-2">
                    <span className="text-slate-800 text-sm font-bold">
                      {targetLabels[log.target] || log.target}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${statusColors[log.status] || ""}`}>
                        {statusTexts[log.status] || log.status}
                      </span>
                      {log.lastError && (
                        <span className="text-xs text-rose-600 max-w-xs truncate" title={log.lastError}>
                          ({log.lastError})
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-medium">
                        {new Date(log.createdAt).toLocaleTimeString("vi-VN")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rule-based result note */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm mb-6">
          <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Kết quả đánh giá (Rule-based)</h3>
          <pre className="text-slate-705 text-sm font-medium whitespace-pre-wrap leading-relaxed">{lead.resultNote}</pre>
        </div>

        {/* All fields */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 px-5 py-3 bg-slate-50/80 border-b border-slate-200 uppercase tracking-wider">Thông tin chi tiết</h3>
          <div className="divide-y divide-slate-100">
            {fields.map(([label, value]) => (
              <div key={label} className="flex px-5 py-3">
                <span className="w-40 text-sm text-slate-400 flex-shrink-0 font-medium">{label}</span>
                <span className="text-sm text-slate-800 font-bold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
