"use client";

import { useState, useEffect } from "react";
import RadarChart from "./RadarChart";

interface ResultData {
  profileGroup: string;
  resultTitle: string;
  overview: string;
  suggestion: string;
  languageAssessment: string;
  aiEvaluation?: string | null;
  aiRoadmap?: string | null;
  radarScores?: {
    academics: number;
    language: number;
    finance: number;
    timeline: number;
    direction: number;
  };
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

interface ResultDisplayProps {
  result: ResultData;
  emailStatus?: string | null;
  onReset: () => void;
}

const GROUP_STYLES: Record<string, { gradient: string; icon: string; badge: string }> = {
  A: { gradient: "from-emerald-500 to-teal-500", icon: "🌟", badge: "bg-emerald-100 text-emerald-700" },
  B: { gradient: "from-blue-500 to-cyan-500", icon: "📋", badge: "bg-blue-100 text-blue-700" },
  C: { gradient: "from-amber-500 to-orange-500", icon: "🧭", badge: "bg-amber-100 text-amber-700" },
  D: { gradient: "from-rose-500 to-pink-500", icon: "📚", badge: "bg-rose-100 text-rose-700" },
};

const EMAIL_NOTIFICATIONS: Record<string, { icon: string; text: string; style: string }> = {
  sent: {
    icon: "✅",
    text: "Kết quả đánh giá đã được gửi về email của bạn.",
    style: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  failed: {
    icon: "⚠️",
    text: "Không thể gửi email kết quả. Vui lòng chụp màn hình hoặc xuất PDF để lưu lại.",
    style: "bg-amber-50 border-amber-200 text-amber-700",
  },
  not_configured: {
    icon: "📧",
    text: "Hệ thống email chưa được cấu hình. Vui lòng xuất PDF để lưu kết quả.",
    style: "bg-slate-50 border-slate-200 text-slate-600",
  },
  no_email: {
    icon: "💡",
    text: "Bạn chưa cung cấp email. Hãy xuất PDF để lưu kết quả đánh giá.",
    style: "bg-blue-50 border-blue-200 text-blue-600",
  },
};

const DIMENSION_DETAILS: Record<string, {
  label: string;
  icon: string;
  strengthDesc: string;
  improvementDesc: string;
}> = {
  academics: {
    label: "Học lực",
    icon: "🎓",
    strengthDesc: "Học bạ/GPA tốt, đủ điều kiện xét tuyển vào các trường đại học chất lượng cao và có cơ hội săn học bổng.",
    improvementDesc: "Kết quả học tập chưa thực sự nổi bật. Cần tập trung nâng cao điểm số hoặc chuẩn bị thêm các chứng chỉ học thuật bổ trợ.",
  },
  language: {
    label: "Ngoại ngữ",
    icon: "🗣️",
    strengthDesc: "Khả năng ngoại ngữ tốt (IELTS/TOEFL hoặc tương đương). Sẵn sàng học thẳng chương trình chuyên ngành mà không cần học khóa dự bị tiếng.",
    improvementDesc: "Trình độ ngoại ngữ cần được cải thiện. Nên tham gia các khóa học tiếng Anh cấp tốc hoặc đăng ký khóa học ngôn ngữ bổ trợ tại nước ngoài.",
  },
  finance: {
    label: "Tài chính",
    icon: "💰",
    strengthDesc: "Ngân sách gia đình vững vàng, đủ chi trả học phí và sinh hoạt phí. Hồ sơ chứng minh tài chính thuận lợi.",
    improvementDesc: "Tài chính còn hạn chế hoặc chưa chuẩn bị kỹ kế hoạch chứng minh thu nhập. Nên tìm hiểu các nước học phí rẻ, các học bổng bán phần, hoặc vay du học.",
  },
  timeline: {
    label: "Thời gian",
    icon: "⏳",
    strengthDesc: "Kế hoạch thời gian chuẩn bị rất chủ động, có nhiều thời gian để hoàn thiện hồ sơ, xin visa và chuẩn bị tâm lý.",
    improvementDesc: "Thời gian chuẩn bị khá gấp gáp. Cần đẩy nhanh tiến độ dịch thuật, công chuyên hồ sơ và chuẩn bị hồ sơ visa để tránh trễ hạn nhập học.",
  },
  direction: {
    label: "Định hướng",
    icon: "🎯",
    strengthDesc: "Định hướng ngành học và quốc gia rõ ràng, phù hợp với năng lực bản thân và xu hướng việc làm. Có động cơ du học thuyết phục.",
    improvementDesc: "Chưa xác định rõ ngành học hoặc quốc gia du học phù hợp. Cần làm trắc nghiệm hướng nghiệp nâng cao hoặc nhận tư vấn 1-1 để làm rõ lộ trình.",
  },
};

export default function ResultDisplay({ result, emailStatus, onReset }: ResultDisplayProps) {
  const [activeTab, setActiveTab] = useState<"result" | "radar">("result");
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("https://duhocbinhduong.vn");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.origin);
    }
  }, []);

  const style = GROUP_STYLES[result.profileGroup] || GROUP_STYLES.C;
  const hasAI = result.aiEvaluation && result.aiEvaluation.length > 0;
  const emailNotif = emailStatus ? EMAIL_NOTIFICATIONS[emailStatus] : null;

  // Custom PDF print file naming
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Bao_Cao_Danh_Gia_Du_Hoc_Nhom_${result.profileGroup}`;
    window.print();
    // Restore title after print dialog closes
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleCopyLink = () => {
    const shareText = `Mình vừa hoàn thành bài Đánh giá năng lực du học tại Du Học Bình Dương và đạt Nhóm ${result.profileGroup} - ${result.resultTitle}! Hãy tự đánh giá hồ sơ của bạn tại đây: ${shareUrl}`;
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const zaloShareUrl = `https://zalo.me/share?url=${encodeURIComponent(shareUrl)}`;

  // Parse strengths and weaknesses
  const scores = result.radarScores || { academics: 3, language: 3, finance: 3, timeline: 3, direction: 3 };
  const dimsList = [
    { key: "academics", score: scores.academics },
    { key: "language", score: scores.language },
    { key: "finance", score: scores.finance },
    { key: "timeline", score: scores.timeline },
    { key: "direction", score: scores.direction },
  ].map((d) => {
    const detail = DIMENSION_DETAILS[d.key];
    return {
      ...d,
      label: detail.label,
      icon: detail.icon,
      isStrength: d.score >= 3.5,
      desc: d.score >= 3.5 ? detail.strengthDesc : detail.improvementDesc,
    };
  });

  const strengths = dimsList.filter((d) => d.isStrength);
  const improvements = dimsList.filter((d) => !d.isStrength);

  return (
    <div className="animate-fadeIn">
      {/* Print-Only Header Block */}
      <div className="hidden print:block border-b-2 border-slate-200 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-0.5">Du Học Bình Dương</div>
            <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">BÁO CÁO ĐÁNH GIÁ NĂNG LỰC DU HỌC</h1>
            <p className="text-[10px] text-slate-400">Được tạo tự động dựa trên thông tin ứng viên cung cấp</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-medium text-slate-500 uppercase block">Ngày đánh giá</span>
            <span className="text-xs font-semibold text-slate-700">{new Date().toLocaleDateString("vi-VN")}</span>
          </div>
        </div>
      </div>

      {/* Header card */}
      <div className={`bg-gradient-to-br ${style.gradient} rounded-3xl p-8 text-white mb-6 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-6 -translate-x-6" />
        <div className="relative z-10">
          <div className="text-4xl mb-3">{style.icon}</div>
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-3">
            Nhóm {result.profileGroup}
          </span>
          <h2 className="text-2xl font-bold mb-2">{result.resultTitle}</h2>
          <p className="text-white/90 leading-relaxed text-sm sm:text-base">{result.overview}</p>
        </div>
      </div>

      {/* Email status notification */}
      {emailNotif && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl border mb-6 no-print ${emailNotif.style}`}>
          <span className="text-lg flex-shrink-0">{emailNotif.icon}</span>
          <p className="text-sm font-medium leading-relaxed">{emailNotif.text}</p>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex bg-slate-100/80 p-1.5 rounded-2xl mb-6 no-print border border-slate-200/50">
        <button
          onClick={() => setActiveTab("result")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
            activeTab === "result"
              ? "bg-white text-teal-600 shadow-md shadow-slate-200/80 scale-[1.02]"
              : "text-slate-500 hover:text-slate-850 hover:bg-white/40"
          }`}
        >
          📋 Kết quả chi tiết
        </button>
        <button
          onClick={() => setActiveTab("radar")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
            activeTab === "radar"
              ? "bg-white text-teal-600 shadow-md shadow-slate-200/80 scale-[1.02]"
              : "text-slate-500 hover:text-slate-850 hover:bg-white/40"
          }`}
        >
          📊 Phân tích điểm mạnh/yếu
        </button>
      </div>

      {/* Tab Contents */}
      <div>
        {/* Tab 1: Detailed Result */}
        <div className={activeTab === "result" ? "block" : "hidden print:block"}>
          {/* AI Personalized Evaluation — only shown when available */}
          {hasAI && (
            <div className="relative bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 rounded-2xl border border-purple-200 p-6 mb-4 shadow-sm overflow-hidden">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-purple-200/40 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-fuchsia-200/30 rounded-full blur-xl" />

              <div className="relative z-10">
                <h3 className="text-sm font-bold text-purple-650 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className="text-base animate-pulse">✨</span>
                  Nhận xét cá nhân hóa từ AI
                </h3>
                <div className="text-slate-700 leading-relaxed whitespace-pre-line text-sm max-h-[320px] overflow-y-auto pr-3 evaluation-scrollbar print:max-h-none print:overflow-y-visible print:pr-0">
                  {result.aiEvaluation}
                </div>
              </div>
            </div>
          )}

          {/* AI Roadmap Feedback — only shown when available */}
          {result.aiRoadmap && (
            <div className="relative bg-gradient-to-br from-teal-50/70 via-cyan-50/70 to-emerald-50/70 rounded-2xl border border-teal-200 p-6 mb-4 shadow-sm overflow-hidden">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-teal-200/40 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-emerald-200/30 rounded-full blur-xl" />

              <div className="relative z-10">
                <h3 className="text-sm font-bold text-teal-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span>🗺️</span>
                  Lộ trình du học đề xuất cho bạn
                </h3>
                <div className="text-slate-700 leading-relaxed whitespace-pre-line text-sm max-h-[360px] overflow-y-auto pr-3 evaluation-scrollbar print:max-h-none print:overflow-y-visible print:pr-0">
                  {result.aiRoadmap}
                </div>
              </div>
            </div>
          )}

          {/* Language assessment — shown as fallback or supplementary */}
          {!hasAI && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-550 uppercase tracking-wide mb-2">Đánh giá ngoại ngữ</h3>
              <p className="text-slate-700 leading-relaxed text-sm">{result.languageAssessment}</p>
            </div>
          )}

          {/* Suggestion — shown as fallback or supplementary */}
          {!hasAI && (
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 p-6 mb-6">
              <h3 className="text-sm font-bold text-teal-700 uppercase tracking-wide mb-2">Gợi ý bước tiếp theo</h3>
              <p className="text-teal-800 leading-relaxed text-sm">{result.suggestion}</p>
            </div>
          )}

          {/* CTA buttons */}
          <div className={`flex flex-col sm:flex-row gap-3 mb-6 no-print ${hasAI ? "mt-6" : ""}`}>
            <a
              href={result.ctaPrimary.href}
              className={`flex-1 text-center px-6 py-3.5 bg-gradient-to-r ${style.gradient} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200`}
            >
              {result.ctaPrimary.label}
            </a>
            <a
              href={result.ctaSecondary.href}
              className="flex-1 text-center px-6 py-3.5 bg-white text-slate-700 font-bold rounded-xl border-2 border-slate-200 hover:border-teal-300 hover:text-teal-650 transition-all duration-200"
            >
              {result.ctaSecondary.label}
            </a>
          </div>
        </div>

        {/* Tab 2: Radar Chart & Strengths/Weaknesses Analysis */}
        <div className={activeTab === "radar" ? "block" : "hidden print:block"}>
          {/* Radar Chart */}
          {result.radarScores && (
            <div className="mb-6">
              <RadarChart scores={result.radarScores} />
            </div>
          )}

          {/* Strengths & Weaknesses Detailed breakdown */}
          <div className="space-y-6 mb-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <span>🔍</span> Đánh giá chi tiết năng lực
            </h3>

            {/* Strengths Section */}
            {strengths.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Điểm mạnh nổi bật ({strengths.length})
                </h4>
                <div className="grid gap-3">
                  {strengths.map((item) => (
                    <div key={item.key} className="bg-emerald-50/40 border border-emerald-100/60 rounded-xl p-4 transition-all hover:bg-emerald-50/70">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          <span>{item.icon}</span> {item.label}
                        </span>
                        <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                          {item.score.toFixed(1)}/5
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${(item.score / 5) * 100}%` }} />
                      </div>
                      <p className="text-xs text-slate-650 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Improvements Section */}
            {improvements.length > 0 && (
              <div className="space-y-3 mt-4">
                <h4 className="text-xs font-extrabold text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Chỉ số cần cải thiện ({improvements.length})
                </h4>
                <div className="grid gap-3">
                  {improvements.map((item) => (
                    <div key={item.key} className="bg-amber-50/20 border border-amber-100/50 rounded-xl p-4 transition-all hover:bg-amber-50/40">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          <span>{item.icon}</span> {item.label}
                        </span>
                        <span className="text-xs font-extrabold text-amber-600 bg-amber-100/60 px-2 py-0.5 rounded-md">
                          {item.score.toFixed(1)}/5
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                        <div className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${(item.score / 5) * 100}%` }} />
                      </div>
                      <p className="text-xs text-slate-650 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save & Share Section */}
      <div className="no-print mt-8 pt-6 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center sm:text-left">Lưu trữ & Chia sẻ</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Export PDF Button */}
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <span>📄</span> Xuất file PDF (In)
          </button>

          {/* Share Copy Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer active:scale-95"
          >
            <span>🔗</span> {copied ? "Đã sao chép báo cáo!" : "Sao chép kết quả"}
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="flex items-center gap-2 justify-center">
          <span className="text-xs text-slate-500 mr-2">Chia sẻ nhanh:</span>
          
          {/* Facebook Share Button */}
          <a
            href={fbShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:shadow active:scale-95"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </a>

          {/* Zalo Share Button */}
          <a
            href={zaloShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0068ff] hover:bg-[#005ce6] text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:shadow active:scale-95"
          >
            <span className="text-[10px] font-extrabold tracking-tighter bg-white text-[#0068ff] px-0.5 rounded-sm">Z</span>
            Zalo
          </a>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full text-center text-sm font-semibold text-slate-400 hover:text-slate-650 py-4 mt-2 transition-colors no-print"
      >
        ← Đánh giá lại từ đầu
      </button>
    </div>
  );
}
