# 🧭 Đánh giá đầu vào du học (Study Abroad Evaluation MVP)

Hệ thống đánh giá hồ sơ du học thông minh và cá nhân hóa sử dụng **Gemini AI API** kết hợp với bộ quy tắc phân loại tối ưu (Rule-based) để thu thập lead, phân loại hồ sơ và đưa ra định hướng chi tiết cho học viên.

---

## 🌟 Tính năng chính

### 1. Trải nghiệm đánh giá (Client-side)
* **Form 5 bước mượt mà**: Giao diện trực quan được xây dựng bằng React và Tailwind CSS, hỗ trợ tự động lưu bản nháp vào `localStorage`.
* **Phân loại kết quả kép**:
  * **Quy tắc (Rule-based)**: Đánh giá hồ sơ theo 4 nhóm học lực (A/B/C/D) và 4 nhóm ngoại ngữ dựa trên bộ tiêu chí cố định.
  * **Cá nhân hóa bằng Trí tuệ nhân tạo (Gemini AI)**: Tự động phân tích các thông tin chi tiết (tên, học lực, chứng chỉ, ngân sách, nguyện vọng) để đưa ra bài đánh giá 3 đoạn mạch lạc.
* **Cơ chế Fallback thông minh**: Nếu API Gemini bị lỗi hoặc hết quota, hệ thống tự động chuyển sang hiển thị văn bản cố định theo nhóm phân loại.
* **Bảo mật và chống spam**:
  * **Honeypot**: Bẫy ẩn chống các công cụ spam bot gửi form tự động.
  * **Rate Limiting**: Giới hạn tối đa 3 lần gửi form trong 1 giờ dựa trên IP (tự động bỏ qua khi chạy local dev).
  * **Sanitization**: Tự động lọc các thẻ HTML độc hại khỏi input của user.

### 2. Trang quản trị viên (Admin Dashboard - `/admin`)
* **Xác thực JWT**: Bảo vệ các route admin, hỗ trợ đăng nhập và đăng xuất an toàn.
* **Quản lý danh sách Lead**: Bộ lọc theo Trạng thái xử lý (`Mới`, `Đã liên hệ`, `Đã tư vấn`, `Đã đóng`).
* **Chi tiết Lead**: Hiển thị đầy đủ thông tin khảo sát, nguồn UTM tracking, kết quả phân loại quy tắc và nội dung nhận xét của Gemini AI.
* **Cập nhật trạng thái**: Cho phép thay đổi tiến độ tư vấn trực tiếp trên giao diện admin.

### 3. Hệ thống Webhook & Xử lý bất đồng bộ
* Tự động gửi thông tin lead sang các webhook bên thứ ba (Google Sheet, Zalo OA, Email) mà không làm nghẽn luồng đăng ký của học viên.
* **Webhook Retry (Cron Job)**: Cung cấp API endpoint `/api/cron/retry-webhooks` để thiết lập tự động gửi lại các webhook bị lỗi tối đa 5 lần.

---

## 🛠️ Công nghệ sử dụng

* **Framework**: Next.js 16 (App Router)
* **Ngôn ngữ**: TypeScript
* **Styling**: Tailwind CSS
* **Database**: SQLite (phát triển local) / Hỗ trợ PostgreSQL (production) thông qua **Prisma ORM**
* **Trí tuệ nhân tạo**: `@google/generative-ai` (Sử dụng model `gemini-1.5-flash`)
* **Validation**: Zod (Đồng bộ schemas giữa Client và Server)
* **Unit Testing**: Jest & ts-jest (Độ phủ kiểm thử thuật toán phân loại)

---

## 📁 Cấu trúc thư mục chính

```text
├── prisma/
│   ├── schema.prisma          # Định nghĩa Database Models
│   └── dev.db                 # File cơ sở dữ liệu SQLite local
├── src/
│   ├── app/
│   │   ├── admin/             # Các trang quản trị (Dashboard, Lead Detail)
│   │   ├── api/               # API xử lý Submit, Admin CRUD, Webhook Cron
│   │   ├── globals.css        # Cấu hình Tailwind & Custom Animations
│   │   └── page.tsx           # Trang chủ chứa form khảo sát
│   ├── components/            # Các React components và form steps
│   ├── lib/
│   │   ├── __tests__/         # File kiểm thử thuật toán phân loại
│   │   ├── classifyLanguage.ts# Logic phân nhóm ngoại ngữ (1-4)
│   │   ├── classifyProfile.ts # Logic phân nhóm hồ sơ học thuật (A-D)
│   │   ├── gemini.ts          # Module tích hợp Gemini API
│   │   ├── rateLimit.ts       # Logic giới hạn tần suất gửi form
│   │   └── webhook.ts         # Xử lý bắn data webhook bất đồng bộ
└── README.md
```

---

## 🚀 Cài đặt và Chạy thử (Local Development)

### 1. Clone dự án và cài đặt dependencies
```bash
git clone https://github.com/duyhub103/miniapp-study-abroad.git
cd miniapp-study-abroad
npm install
```

### 2. Cấu hình biến môi trường
Tạo file `.env` từ file mẫu `.env.example`:
```bash
cp .env.example .env
```
Mở file `.env` và điền các giá trị:
```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="mật_khẩu_admin_của_bạn"
ADMIN_JWT_SECRET="khóa_bí_mật_tự_chọn_để_mã_hóa_token"
GEMINI_API_KEY="AIzaSy..." # Lấy tại https://aistudio.google.com/
```

### 3. Tạo cơ sở dữ liệu và đồng bộ Prisma Schema
```bash
npx prisma migrate dev --name init
```

### 4. Khởi chạy Development Server
```bash
npm run dev
```
Truy cập:
* Form đánh giá: [http://localhost:3000](http://localhost:3000)
* Giao diện Admin: [http://localhost:3000/admin](http://localhost:3000/admin) (Mật khẩu đăng nhập lấy từ `ADMIN_PASSWORD` trong file `.env`)

### 5. Quản lý dữ liệu trực quan bằng Prisma Studio
Để kiểm tra, xem hoặc chỉnh sửa trực tiếp dữ liệu leads đã lưu trong SQLite local:
```bash
npx prisma studio
```
Truy cập link hiển thị trên terminal (thường là `http://localhost:5555`) để bắt đầu xem bảng.

---

## 🧪 Kiểm thử (Testing)

Dự án đã tích hợp sẵn 17 unit tests bao phủ toàn bộ các trường hợp logic phân loại học thuật và ngoại ngữ theo đúng yêu cầu nghiệp vụ.

Chạy kiểm thử bằng lệnh:
```bash
npm run test
```

---

## 📦 Triển khai lên Production (Vercel & Cloud DB)

1. **Database**: Thay đổi `provider = "sqlite"` thành `provider = "postgresql"` trong file `prisma/schema.prisma` và thay thế `DATABASE_URL` thành chuỗi kết nối PostgreSQL (ví dụ Supabase hoặc Neon DB).
2. **Deploy**: Kết nối repo Github này với Vercel. Cấu hình đầy đủ các biến Environment Variables tương tự trong file `.env` trên giao diện cài đặt của Vercel.
