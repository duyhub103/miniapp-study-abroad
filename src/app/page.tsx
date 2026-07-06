"use client";

import { Suspense, useState } from "react";
import EvaluationForm from "@/components/EvaluationForm";

const BENEFITS = [
  {
    icon: "🎯",
    title: "Đánh giá chính xác",
    desc: "Hệ thống phân loại hồ sơ dựa trên nhiều tiêu chí: học lực, ngoại ngữ, định hướng ngành nghề, tài chính.",
  },
  {
    icon: "⚡",
    title: "Kết quả tức thì",
    desc: "Nhận đánh giá và gợi ý lộ trình ngay sau khi hoàn tất form, không cần chờ đợi.",
  },
  {
    icon: "🧭",
    title: "Lộ trình cá nhân hóa",
    desc: "Mỗi hồ sơ nhận được gợi ý riêng phù hợp với điều kiện hiện tại và mục tiêu du học.",
  },
  {
    icon: "🤝",
    title: "Tư vấn miễn phí",
    desc: "Đội ngũ tư vấn viên giàu kinh nghiệm sẵn sàng hỗ trợ bạn xây dựng hồ sơ hoàn chỉnh.",
  },
];

export default function HomePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <main className="flex-1">
      {/* Hero / 2-column layout */}
      <div className="min-h-screen flex flex-col lg:flex-row-reverse">
        {/* Right column: Benefits (Sidebar) */}
        <div
          className={`transition-all duration-300 ease-in-out bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 text-white relative overflow-hidden no-print flex flex-col justify-start lg:sticky lg:top-0 lg:h-screen z-20 ${
            isCollapsed
              ? "lg:w-[80px] w-full p-4 h-[70px] lg:justify-start"
              : "lg:w-[28%] w-full p-6 sm:p-8 lg:p-10 min-h-[450px] lg:justify-between"
          }`}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-16 translate-y-16 pointer-events-none" />
          <div className="absolute top-1/2 right-0 w-32 h-32 bg-cyan-400/10 rounded-full translate-x-16 pointer-events-none" />

          {/* Header containing Logo & Toggle Menu Button */}
          <div className={`flex ${isCollapsed ? "lg:flex-col lg:items-center lg:gap-6 justify-between lg:justify-start" : "items-center justify-between"} w-full mb-8 relative z-10`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl flex-shrink-0 select-none">
                🎓
              </div>
              <span className={`text-base lg:text-lg font-bold tracking-wide transition-all duration-300 whitespace-nowrap overflow-hidden ${
                isCollapsed ? "lg:w-0 lg:opacity-0" : "w-auto opacity-100"
              }`}>
                Du Học Bình Dương
              </span>
            </div>
            
            {/* Toggle Menu Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center cursor-pointer text-white flex-shrink-0"
              title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
            >
              {isCollapsed ? (
                <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

          {/* Sidebar Body Content */}
          {!isCollapsed && (
            <div className="relative z-10 flex-1 flex flex-col justify-center animate-fadeIn">
              <h1 className="text-2xl lg:text-3xl font-extrabold mb-3 leading-tight">
                Đánh giá đầu vào
                <br />
                <span className="text-cyan-300">du học miễn phí</span>
              </h1>

              <p className="text-teal-100 mb-6 text-sm lg:text-base leading-relaxed">
                Tự đánh giá mức độ sẵn sàng cho lộ trình du học chỉ trong 3 phút. Nhận kết quả và gợi ý ngay lập tức.
              </p>

              {/* Benefits list */}
              <div className="space-y-4">
                {BENEFITS.map((b) => (
                  <div key={b.title} className="flex items-start gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-sm flex-shrink-0 group-hover:bg-white/20 transition-colors">
                      {b.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-0.5">{b.title}</h3>
                      <p className="text-teal-200 text-xs leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center gap-4 text-xs text-teal-200">
                  <div className="flex items-center gap-1">
                    <span>🔒</span> Bảo mật thông tin
                  </div>
                  <div className="flex items-center gap-1">
                    <span>✓</span> Miễn phí 100%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Form */}
        <div className="flex-1 p-6 sm:p-8 lg:p-12 flex items-start lg:items-center justify-center bg-slate-50 transition-all duration-300">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 border border-slate-100">
              <Suspense fallback={<div className="text-center py-10 text-slate-400">Đang tải form...</div>}>
                <EvaluationForm />
              </Suspense>
            </div>

            <p className="text-center text-xs text-slate-400 mt-4 no-print">
              Thông tin của bạn được bảo mật theo{" "}
              <a href="/chinh-sach-bao-mat" className="underline hover:text-slate-600">
                chính sách bảo mật
              </a>{" "}
              của Du Học Bình Dương.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
