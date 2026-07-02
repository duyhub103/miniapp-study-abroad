// ============================================================
// Language classification logic per spec §6
// Priority: group 4 → 1 → 2 → 3
// ============================================================

export type LanguageClassInput = {
  certificate: string;
  languageLevel: string;
  weakSkill: string;
};

export type LanguageClassResult = {
  languageGroup: number; // 1-4
  languageAssessment: string;
};

const LANGUAGE_ASSESSMENTS: Record<number, string> = {
  1: "Ngoại ngữ của bạn đang ở mức đạt yêu cầu cơ bản.",
  2: "Bạn có nền tảng ngoại ngữ nhưng cần bổ sung chứng chỉ chính thức.",
  3: "Bạn cần cải thiện thêm kỹ năng ngoại ngữ còn yếu.",
  4: "Bạn nên học lại nền tảng ngoại ngữ trước khi chuẩn bị hồ sơ.",
};

export function classifyLanguage(input: LanguageClassInput): LanguageClassResult {
  const { certificate, languageLevel, weakSkill } = input;

  // Normalize for comparison (lowercase)
  const level = languageLevel.toLowerCase();
  const skill = weakSkill.toLowerCase();
  const cert = certificate.toLowerCase();

  // Group 4: highest risk — evaluate first
  if (level === "chưa học/mất gốc" || skill === "yếu toàn bộ") {
    return { languageGroup: 4, languageAssessment: LANGUAGE_ASSESSMENTS[4] };
  }

  // Group 1: meets basic requirements
  if (cert !== "chưa có" || level === "tốt" || level === "đã có chứng chỉ") {
    return { languageGroup: 1, languageAssessment: LANGUAGE_ASSESSMENTS[1] };
  }

  // Group 2: needs certificate supplement
  if (cert === "chưa có" && (level === "khá" || level === "trung bình")) {
    return { languageGroup: 2, languageAssessment: LANGUAGE_ASSESSMENTS[2] };
  }

  // Group 3: needs skill improvement
  if (
    (level === "cơ bản" || level === "trung bình") &&
    skill !== "chưa xác định"
  ) {
    return { languageGroup: 3, languageAssessment: LANGUAGE_ASSESSMENTS[3] };
  }

  // Default: group 3
  return { languageGroup: 3, languageAssessment: LANGUAGE_ASSESSMENTS[3] };
}
