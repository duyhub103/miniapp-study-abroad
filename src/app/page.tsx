import { Suspense } from "react";
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
  return (
    <main className="flex-1">
      {/* Hero / 2-column layout */}
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left column: Benefits */}
        <div className="lg:w-5/12 bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 text-white p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-16 translate-y-16" />
          <div className="absolute top-1/2 right-0 w-32 h-32 bg-cyan-400/10 rounded-full translate-x-16" />

          <div className="relative z-10">
            {/* Logo / Brand */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl">
                  🎓
                </div>
                <span className="text-lg font-bold tracking-wide">Du Học Bình Dương</span>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold mb-4 leading-tight">
              Đánh giá đầu vào
              <br />
              <span className="text-cyan-300">du học miễn phí</span>
            </h1>

            <p className="text-teal-100 mb-10 text-lg leading-relaxed max-w-md">
              Tự đánh giá mức độ sẵn sàng cho lộ trình du học chỉ trong 3 phút. Nhận kết quả và gợi ý ngay lập tức.
            </p>

            {/* Benefits list */}
            <div className="space-y-5">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-white/20 transition-colors">
                    {b.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-0.5">{b.title}</h3>
                    <p className="text-teal-200 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <div className="flex items-center gap-6 text-sm text-teal-200">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">🔒</span> Bảo mật thông tin
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">✓</span> Miễn phí 100%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="lg:w-7/12 p-6 sm:p-8 lg:p-12 flex items-start lg:items-center justify-center bg-slate-50">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 border border-slate-100">
              <Suspense fallback={<div className="text-center py-10 text-slate-400">Đang tải form...</div>}>
                <EvaluationForm />
              </Suspense>
            </div>

            <p className="text-center text-xs text-slate-400 mt-4">
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
