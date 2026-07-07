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
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <main className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 to-teal-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        {/* Header */}
        <header className="w-full py-5 px-6 md:px-12 flex justify-center items-center bg-white/70 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-xl text-white shadow-md shadow-teal-500/20 select-none">
              🎓
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-wide">
              Du Học Bình Dương
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col items-center justify-center text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-700 text-xs font-bold uppercase tracking-wider mb-6 border border-teal-100 shadow-sm animate-pulse">
            ✨ GIẢI PHÁP ĐÁNH GIÁ CHUYÊN NGHIỆP CÙNG AI
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight max-w-3xl mb-6">
            Đánh Giá Đầu Vào
            <br />
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Du Học Cá Nhân Hóa Miễn Phí
            </span>
          </h1>

          {/* Description */}
          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl mb-10">
            Tự đánh giá mức độ sẵn sàng cho lộ trình du học chỉ trong 3 phút. Nhận ngay kết quả phân tích học lực, tài chính, năng lực ngoại ngữ và một lộ trình chuẩn bị cá nhân hóa được tạo bởi AI.
          </p>

          {/* Main CTA Button */}
          <button
            onClick={() => setStarted(true)}
            className="group px-8 py-4 text-lg font-black text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 rounded-2xl shadow-xl shadow-teal-500/25 active:scale-95 hover:scale-[1.03] transition-all flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden"
          >
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000 ease-out" />
            Thực hiện đánh giá ngay
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">🚀</span>
          </button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-500 font-semibold">
            <div className="flex items-center gap-1">
              <span>🔒</span> Bảo mật thông tin học viên
            </div>
            <div className="flex items-center gap-1">
              <span>✓</span> Hoàn toàn miễn phí
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-16 md:mt-24 text-left">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  {b.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-2">{b.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full py-6 px-6 text-center text-xs text-slate-500 border-t border-slate-200/50 mt-12 bg-white/40 backdrop-blur-sm">
          © {new Date().getFullYear()} Du Học Bình Dương. Bảo lưu mọi quyền.
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-start relative py-8 px-4 sm:px-6 lg:px-8">
      {/* Back button and header */}
      <div className="max-w-lg w-full mx-auto mb-6 flex items-center justify-between no-print">
        <button
          onClick={() => setStarted(false)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          ← Quay lại trang chủ
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-base text-white shadow-sm select-none">
            🎓
          </div>
          <span className="text-sm font-bold text-slate-700">Du Học Bình Dương</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-lg w-full mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 border border-slate-100 animate-fadeIn">
          <Suspense fallback={<div className="text-center py-10 text-slate-400 font-medium">Đang tải form...</div>}>
            <EvaluationForm />
          </Suspense>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 no-print">
          Thông tin của bạn được bảo mật theo{" "}
          <a href="/chinh-sach-bao-mat" className="underline hover:text-slate-600 transition-colors">
            chính sách bảo mật
          </a>{" "}
          của Du Học Bình Dương.
        </p>
      </div>
    </main>
  );
}
