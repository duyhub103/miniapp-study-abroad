// ============================================================
// Result content for each profile group (A/B/C/D) per spec §8
// ============================================================

export type ResultContent = {
  resultTitle: string;
  overview: string;
  suggestion: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
};

export const RESULT_CONTENT: Record<string, ResultContent> = {
  A: {
    resultTitle: "Hồ sơ tiềm năng cao",
    overview:
      "Bạn đã có nền tảng tốt để bắt đầu chuẩn bị hồ sơ du học.",
    suggestion:
      "Bước tiếp theo nên là kiểm tra điều kiện đầu vào từng trường, chọn chương trình phù hợp và xây kế hoạch nộp hồ sơ.",
    ctaPrimary: { label: "Nhận tư vấn hồ sơ", href: "#contact" },
    ctaSecondary: { label: "Xem chi phí du học", href: "#cost" },
  },
  B: {
    resultTitle: "Hồ sơ phù hợp nhưng cần bổ sung",
    overview:
      "Bạn đã có định hướng tương đối rõ, tuy nhiên vẫn cần bổ sung một số điều kiện trước khi nộp hồ sơ.",
    suggestion:
      "Nên được tư vấn cụ thể về chứng chỉ ngoại ngữ, hồ sơ học tập, tài chính và thời gian nộp hồ sơ.",
    ctaPrimary: { label: "Nhận tư vấn bổ sung hồ sơ", href: "#contact" },
    ctaSecondary: { label: "Liên hệ Zalo", href: "#zalo" },
  },
  C: {
    resultTitle: "Hồ sơ cần tư vấn lộ trình chi tiết",
    overview:
      "Bạn hiện chưa xác định rõ một số yếu tố quan trọng trong lộ trình du học.",
    suggestion:
      "Nên trao đổi với tư vấn viên để được xây dựng lộ trình từ bước chọn quốc gia, ngành học, chi phí đến thời gian chuẩn bị hồ sơ.",
    ctaPrimary: { label: "Tư vấn lộ trình miễn phí", href: "#contact" },
    ctaSecondary: { label: "Xem chi phí & lộ trình", href: "#cost" },
  },
  D: {
    resultTitle: "Hồ sơ cần xây dựng lại nền tảng",
    overview:
      "Bạn cần cải thiện thêm nền tảng học tập hoặc ngoại ngữ trước khi chọn chương trình du học cụ thể.",
    suggestion:
      "Nên bắt đầu bằng việc học ngoại ngữ, xác định ngành học phù hợp, tìm hiểu chi phí và xây dựng kế hoạch chuẩn bị dài hạn.",
    ctaPrimary: { label: "Nhận lộ trình nền tảng", href: "#contact" },
    ctaSecondary: { label: "Liên hệ tư vấn viên", href: "#zalo" },
  },
};

export const LANGUAGE_ASSESSMENTS: Record<number, string> = {
  1: "Ngoại ngữ của bạn đang ở mức đạt yêu cầu cơ bản.",
  2: "Bạn có nền tảng ngoại ngữ nhưng cần bổ sung chứng chỉ chính thức.",
  3: "Bạn cần cải thiện thêm kỹ năng ngoại ngữ còn yếu.",
  4: "Bạn nên học lại nền tảng ngoại ngữ trước khi chuẩn bị hồ sơ.",
};

/**
 * Build the full result note that was displayed to the user.
 * This string is saved to DB so we have an exact record of what the user saw.
 */
export function buildResultNote(
  profileGroup: string,
  languageGroup: number
): string {
  const content = RESULT_CONTENT[profileGroup];
  const langAssessment = LANGUAGE_ASSESSMENTS[languageGroup];

  if (!content) return "";

  return [
    `Nhóm hồ sơ: ${content.resultTitle}`,
    `Tổng quan: ${content.overview}`,
    `Đánh giá ngoại ngữ: ${langAssessment}`,
    `Gợi ý: ${content.suggestion}`,
  ].join("\n");
}
