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

export const STATUS_LABELS: Record<typeof LEAD_STATUSES[number], string> = {
  new: "Mới nhận",
  contacted: "Đã liên hệ",
  consulted: "Đang tư vấn",
  closed: "Đã chốt",
};

export const PROFILE_GROUPS = ["A", "B", "C", "D"] as const;

// Step labels for the progress bar
export const FORM_STEPS = [
  "Thông tin cá nhân",
  "Học tập",
  "Định hướng du học",
  "Ngoại ngữ",
  "Xác nhận & Gửi",
] as const;

// ============================================================
// Additional option arrays for enhanced UX
// ============================================================

export const CURRENT_MAJORS = [
  "Quản trị kinh doanh",
  "Kế toán – Tài chính",
  "Công nghệ thông tin",
  "Kỹ thuật điện – Điện tử",
  "Cơ khí – Chế tạo",
  "Xây dựng – Kiến trúc",
  "Ngôn ngữ Anh",
  "Ngôn ngữ Nhật",
  "Ngôn ngữ Hàn",
  "Ngôn ngữ Trung",
  "Y tế – Điều dưỡng",
  "Du lịch – Nhà hàng khách sạn",
  "Nông nghiệp",
  "Luật",
  "Sư phạm",
  "Khác",
] as const;

export const CERTIFICATE_SCORES: Record<string, readonly string[]> = {
  "IELTS": ["3.0", "3.5", "4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0"],
  "TOEIC": ["10–250", "255–400", "405–600", "605–780", "785–900", "905–990"],
  "TOEFL": ["Dưới 42", "42–71", "72–94", "95–113", "114–120"],
  "JLPT": ["N5", "N4", "N3", "N2", "N1"],
  "TOPIK": ["TOPIK I (Level 1)", "TOPIK I (Level 2)", "TOPIK II (Level 3)", "TOPIK II (Level 4)", "TOPIK II (Level 5)", "TOPIK II (Level 6)"],
  "Goethe": ["A1", "A2", "B1", "B2", "C1", "C2"],
  "TestDaF": ["TDN 3", "TDN 4", "TDN 5"],
};
