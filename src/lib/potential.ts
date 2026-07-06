// ============================================================
// Lead Potential Scoring — scores leads from 0-100 for business
// Classifies into: hot / warm / cold
// ============================================================

export interface PotentialInput {
  profileGroup: string;       // A / B / C / D
  languageGroup: number;      // 1-4
  academicLevel: string;
  budget: string;
  departureTime: string;
  targetCountry: string;
  targetMajor: string;
  certificate: string;
  email?: string | null;
}

export interface PotentialResult {
  potentialScore: number;   // 0-100
  potentialLevel: "hot" | "warm" | "cold";
  factors: PotentialFactor[];
}

export interface PotentialFactor {
  label: string;
  score: number;
  maxScore: number;
  note: string;
}

/**
 * Calculate potential score for a lead.
 * Higher score = more likely to convert.
 */
export function calculatePotentialScore(input: PotentialInput): PotentialResult {
  const factors: PotentialFactor[] = [];

  // Factor 1: Profile Group (max 30 pts)
  const groupScores: Record<string, number> = { A: 30, B: 22, C: 12, D: 5 };
  const groupNotes: Record<string, string> = {
    A: "Hồ sơ tiềm năng cao — sẵn sàng nộp hồ sơ",
    B: "Hồ sơ phù hợp — cần bổ sung một số điều kiện",
    C: "Chưa rõ định hướng — cần tư vấn chi tiết",
    D: "Nền tảng yếu — cần xây dựng lại từ đầu",
  };
  const groupScore = groupScores[input.profileGroup] ?? 10;
  factors.push({
    label: "Nhóm hồ sơ",
    score: groupScore,
    maxScore: 30,
    note: groupNotes[input.profileGroup] || "",
  });

  // Factor 2: Language readiness (max 20 pts)
  const langScores: Record<number, number> = { 1: 20, 2: 14, 3: 8, 4: 3 };
  const langNotes: Record<number, string> = {
    1: "Ngoại ngữ đạt chuẩn — sẵn sàng nhập học",
    2: "Có nền tảng — cần thêm chứng chỉ chính thức",
    3: "Cần cải thiện đáng kể kỹ năng ngoại ngữ",
    4: "Cần học lại từ nền tảng",
  };
  const langScore = langScores[input.languageGroup] ?? 8;
  factors.push({
    label: "Ngoại ngữ",
    score: langScore,
    maxScore: 20,
    note: langNotes[input.languageGroup] || "",
  });

  // Factor 3: Financial readiness (max 20 pts)
  const budgetScores: Record<string, number> = {
    "Trên 700 triệu/năm": 20,
    "400–700 triệu/năm": 16,
    "200–400 triệu/năm": 11,
    "Dưới 200 triệu/năm": 6,
    "Chưa xác định": 3,
  };
  const budgetScore = budgetScores[input.budget] ?? 8;
  factors.push({
    label: "Tài chính",
    score: budgetScore,
    maxScore: 20,
    note: budgetScore >= 16
      ? "Ngân sách vững vàng — phù hợp nhiều chương trình"
      : budgetScore >= 11
        ? "Ngân sách trung bình — cần cân nhắc quốc gia/trường phù hợp"
        : "Ngân sách hạn chế — cần tìm hiểu học bổng/du học nghề",
  });

  // Factor 4: Timeline urgency (max 15 pts)
  const timeScores: Record<string, number> = {
    "Trong 6 tháng tới": 15,
    "6–12 tháng tới": 11,
    "Trên 1 năm tới": 7,
    "Chưa xác định": 3,
  };
  const timeScore = timeScores[input.departureTime] ?? 7;
  factors.push({
    label: "Thời gian",
    score: timeScore,
    maxScore: 15,
    note: timeScore >= 11
      ? "Gấp rút — cần ưu tiên tư vấn ngay"
      : timeScore >= 7
        ? "Còn thời gian — có thể nurture dần"
        : "Chưa rõ kế hoạch — cần tư vấn định hướng",
  });

  // Factor 5: Direction clarity (max 10 pts)
  let dirScore = 0;
  if (input.targetCountry !== "Chưa xác định") dirScore += 4;
  if (input.targetMajor !== "Chưa xác định") dirScore += 4;
  if (input.certificate !== "Chưa có") dirScore += 2;
  factors.push({
    label: "Định hướng",
    score: dirScore,
    maxScore: 10,
    note: dirScore >= 8
      ? "Rõ ràng — biết mình muốn gì"
      : dirScore >= 4
        ? "Phần nào rõ ràng — cần hỗ trợ thêm"
        : "Chưa rõ — cần tư vấn từ đầu",
  });

  // Factor 6: Contact quality bonus (max 5 pts)
  let contactScore = 0;
  if (input.email) contactScore += 5;
  factors.push({
    label: "Liên lạc",
    score: contactScore,
    maxScore: 5,
    note: contactScore > 0
      ? "Có email — dễ liên hệ và follow-up"
      : "Chỉ có SĐT — khó follow-up bằng email",
  });

  // Total
  const potentialScore = factors.reduce((sum, f) => sum + f.score, 0);

  // Classification
  let potentialLevel: "hot" | "warm" | "cold";
  if (potentialScore >= 70) {
    potentialLevel = "hot";
  } else if (potentialScore >= 45) {
    potentialLevel = "warm";
  } else {
    potentialLevel = "cold";
  }

  return { potentialScore, potentialLevel, factors };
}

/**
 * Labels and visual config for each potential level
 */
export const POTENTIAL_LEVELS = {
  hot: {
    label: "Rất tiềm năng",
    emoji: "🔥",
    color: "bg-red-100 text-red-700 border-red-200",
    barColor: "bg-red-500",
    gradientFrom: "from-red-500",
    gradientTo: "to-orange-500",
    description: "Lead có xác suất chuyển đổi cao — ưu tiên liên hệ ngay trong 24h",
    actions: [
      "Gọi điện tư vấn trực tiếp trong 24h",
      "Gửi brochure chi phí + lộ trình chi tiết",
      "Đặt lịch hẹn tư vấn offline",
      "Chuẩn bị hồ sơ mẫu và checklist",
    ],
  },
  warm: {
    label: "Tiềm năng",
    emoji: "⚡",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    barColor: "bg-amber-500",
    gradientFrom: "from-amber-500",
    gradientTo: "to-yellow-500",
    description: "Lead cần nurture thêm — liên hệ trong 48-72h",
    actions: [
      "Gửi email giới thiệu dịch vụ + tài liệu",
      "Thêm vào danh sách chăm sóc định kỳ",
      "Gợi ý khóa học ngoại ngữ nếu cần",
      "Follow-up sau 1 tuần nếu chưa phản hồi",
    ],
  },
  cold: {
    label: "Cần chăm sóc",
    emoji: "❄️",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    barColor: "bg-blue-500",
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-500",
    description: "Lead chưa sẵn sàng — nurture dài hạn",
    actions: [
      "Thêm vào danh sách email marketing",
      "Gửi content hữu ích định kỳ (blog, tips)",
      "Mời tham gia workshop/webinar du học",
      "Re-evaluate sau 1-2 tháng",
    ],
  },
};
