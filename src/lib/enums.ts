// ============================================================
// Centralized enum/option arrays for the study abroad form
// Used by both form UI and Zod validation
// ============================================================

export const CURRENT_ROLES = [
  "Học sinh",
  "Sinh viên",
  "Phụ huynh",
  "Người đi làm",
] as const;

export const EDUCATION_LEVELS = [
  "THCS",
  "Đang học THPT",
  "Đã tốt nghiệp THPT",
  "Đang học Cao đẳng/Đại học",
  "Đã tốt nghiệp Cao đẳng/Đại học",
  "Đã đi làm",
] as const;

export const ACADEMIC_LEVELS = [
  "Giỏi",
  "Khá",
  "Trung bình",
  "Yếu",
] as const;

export const TARGET_COUNTRIES = [
  "Nhật Bản",
  "Hàn Quốc",
  "Đài Loan",
  "Đức",
  "Úc",
  "Canada",
  "Mỹ",
  "Anh",
  "Singapore",
  "New Zealand",
  "Chưa xác định",
] as const;

export const TARGET_MAJORS = [
  "Kỹ thuật – Công nghệ",
  "Kinh tế – Quản trị kinh doanh",
  "Ngôn ngữ – Xã hội nhân văn",
  "Y tế – Điều dưỡng",
  "Nhà hàng – Khách sạn – Du lịch",
  "Nông nghiệp – Công nghệ thực phẩm",
  "Cơ khí – Xây dựng",
  "Chưa xác định",
] as const;

export const BUDGETS = [
  "Dưới 200 triệu/năm",
  "200–400 triệu/năm",
  "400–700 triệu/năm",
  "Trên 700 triệu/năm",
  "Chưa xác định",
] as const;

export const DEPARTURE_TIMES = [
  "Trong 6 tháng tới",
  "6–12 tháng tới",
  "Trên 1 năm tới",
  "Chưa xác định",
] as const;

export const STUDY_TYPES = [
  "Du học nghề",
  "Cao đẳng",
  "Đại học",
  "Sau đại học",
] as const;

export const LANGUAGES = [
  "Tiếng Anh",
  "Tiếng Nhật",
  "Tiếng Hàn",
  "Tiếng Đức",
  "Tiếng Trung",
  "Khác",
] as const;

export const CERTIFICATES = [
  "IELTS",
  "TOEIC",
  "TOEFL",
  "JLPT",
  "TOPIK",
  "Goethe",
  "TestDaF",
  "Chưa có",
] as const;

export const LANGUAGE_LEVELS = [
  "Chưa học/mất gốc",
  "Cơ bản",
  "Trung bình",
  "Khá",
  "Tốt",
  "Đã có chứng chỉ",
] as const;

export const WEAK_SKILLS = [
  "Nghe",
  "Nói",
  "Đọc",
  "Viết",
  "Yếu toàn bộ",
  "Chưa xác định",
] as const;

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "consulted",
  "closed",
] as const;

export const PROFILE_GROUPS = ["A", "B", "C", "D"] as const;

// Step labels for the progress bar
export const FORM_STEPS = [
  "Thông tin cá nhân",
  "Học tập",
  "Định hướng du học",
  "Ngoại ngữ",
  "Xác nhận & Gửi",
] as const;
