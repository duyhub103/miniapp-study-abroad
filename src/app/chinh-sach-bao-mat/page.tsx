import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật | Du Học Bình Dương",
  description: "Chính sách bảo mật và xử lý dữ liệu cá nhân của Du Học Bình Dương.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <article className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-12">
        <Link href="/" className="text-teal-600 hover:text-teal-700 text-sm font-medium mb-6 inline-block">
          ← Quay lại trang chủ
        </Link>

        <h1 className="text-2xl font-bold text-slate-800 mb-6">Chính sách bảo mật</h1>

        <div className="prose prose-slate prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-slate-700">1. Thu thập thông tin</h2>
            <p className="text-slate-600 leading-relaxed">
              Du Học Bình Dương thu thập thông tin cá nhân bao gồm: họ tên, số điện thoại, email (nếu cung cấp),
              trình độ học vấn, định hướng du học và trình độ ngoại ngữ. Thông tin này được thu thập thông qua
              form đánh giá đầu vào du học trên website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-700">2. Mục đích sử dụng</h2>
            <p className="text-slate-600 leading-relaxed">
              Thông tin thu thập được sử dụng nhằm mục đích:
            </p>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              <li>Đánh giá sơ bộ hồ sơ du học của bạn</li>
              <li>Liên hệ tư vấn lộ trình du học phù hợp</li>
              <li>Cải thiện chất lượng dịch vụ tư vấn</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-700">3. Bảo mật thông tin</h2>
            <p className="text-slate-600 leading-relaxed">
              Chúng tôi cam kết bảo mật thông tin cá nhân của bạn. Thông tin không được chia sẻ
              cho bên thứ ba ngoài mục đích tư vấn du học, trừ khi có sự đồng ý của bạn hoặc
              theo yêu cầu của pháp luật.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-700">4. Liên hệ</h2>
            <p className="text-slate-600 leading-relaxed">
              Nếu bạn có câu hỏi về chính sách bảo mật, vui lòng liên hệ qua email hoặc số điện thoại
              được cung cấp trên website.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
