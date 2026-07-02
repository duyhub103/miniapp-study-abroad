"use client";

interface ResultData {
  profileGroup: string;
  resultTitle: string;
  overview: string;
  suggestion: string;
  languageAssessment: string;
  aiEvaluation?: string | null;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

interface ResultDisplayProps {
  result: ResultData;
  onReset: () => void;
}

const GROUP_STYLES: Record<string, { gradient: string; icon: string; badge: string }> = {
  A: { gradient: "from-emerald-500 to-teal-500", icon: "🌟", badge: "bg-emerald-100 text-emerald-700" },
  B: { gradient: "from-blue-500 to-cyan-500", icon: "📋", badge: "bg-blue-100 text-blue-700" },
  C: { gradient: "from-amber-500 to-orange-500", icon: "🧭", badge: "bg-amber-100 text-amber-700" },
  D: { gradient: "from-rose-500 to-pink-500", icon: "📚", badge: "bg-rose-100 text-rose-700" },
};

export default function ResultDisplay({ result, onReset }: ResultDisplayProps) {
  const style = GROUP_STYLES[result.profileGroup] || GROUP_STYLES.C;
  const hasAI = result.aiEvaluation && result.aiEvaluation.length > 0;

  return (
    <div className="animate-fadeIn">
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
          <p className="text-white/90 leading-relaxed">{result.overview}</p>
        </div>
      </div>

      {/* AI Personalized Evaluation — only shown when available */}
      {hasAI && (
        <div className="relative bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 rounded-2xl border border-purple-200 p-6 mb-4 shadow-sm overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-purple-200/40 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-fuchsia-200/30 rounded-full blur-xl" />

          <div className="relative z-10">
            <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="text-base">✨</span>
              Nhận xét từ AI
            </h3>
            <div className="text-slate-700 leading-relaxed whitespace-pre-line text-sm">
              {result.aiEvaluation}
            </div>
          </div>
        </div>
      )}

      {/* Language assessment — shown as fallback or supplementary */}
      {!hasAI && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Đánh giá ngoại ngữ</h3>
          <p className="text-slate-700">{result.languageAssessment}</p>
        </div>
      )}

      {/* Suggestion — shown as fallback or supplementary */}
      {!hasAI && (
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 p-6 mb-6">
          <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wide mb-2">Gợi ý bước tiếp theo</h3>
          <p className="text-teal-800 leading-relaxed">{result.suggestion}</p>
        </div>
      )}

      {/* CTA buttons */}
      <div className={`flex flex-col sm:flex-row gap-3 mb-4 ${hasAI ? "mt-6" : ""}`}>
        <a
          href={result.ctaPrimary.href}
          className={`flex-1 text-center px-6 py-3.5 bg-gradient-to-r ${style.gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200`}
        >
          {result.ctaPrimary.label}
        </a>
        <a
          href={result.ctaSecondary.href}
          className="flex-1 text-center px-6 py-3.5 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-teal-300 hover:text-teal-600 transition-all duration-200"
        >
          {result.ctaSecondary.label}
        </a>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full text-center text-sm text-slate-400 hover:text-slate-600 py-2 transition-colors"
      >
        ← Đánh giá lại
      </button>
    </div>
  );
}
