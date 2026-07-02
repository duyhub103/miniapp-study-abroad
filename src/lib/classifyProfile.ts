// ============================================================
// Profile classification logic per spec §7 (CORRECTED VERSION)
// Priority: D → C → A → B → default C
// ============================================================

export type ProfileClassInput = {
  academicLevel: string;
  languageGroup: number;
  targetCountry: string;
  targetMajor: string;
  budget: string;
  departureTime: string;
};

export type ProfileClassResult = {
  profileGroup: string; // A / B / C / D
  resultTitle: string;
};

export function classifyProfile(input: ProfileClassInput): ProfileClassResult {
  const {
    academicLevel,
    languageGroup,
    targetCountry,
    targetMajor,
    budget,
    departureTime,
  } = input;

  const academic = academicLevel.toLowerCase();

  // Rule D: language_group == 4 → always D (regardless of academic level)
  if (languageGroup === 4) {
    return {
      profileGroup: "D",
      resultTitle: "Hồ sơ cần xây dựng lại nền tảng",
    };
  }

  // Rule C: any of the 4 orientation fields is "Chưa xác định"
  if (
    targetCountry === "Chưa xác định" ||
    targetMajor === "Chưa xác định" ||
    budget === "Chưa xác định" ||
    departureTime === "Chưa xác định"
  ) {
    return {
      profileGroup: "C",
      resultTitle: "Hồ sơ cần tư vấn lộ trình chi tiết",
    };
  }

  // Rule A: academic khá/giỏi + language group 1 + budget defined
  if (
    (academic === "khá" || academic === "giỏi") &&
    languageGroup === 1 &&
    budget !== "Chưa xác định"
  ) {
    return {
      profileGroup: "A",
      resultTitle: "Hồ sơ tiềm năng cao",
    };
  }

  // Rule B: all 4 orientation fields defined + (language group 2/3 OR (group 1 + academic trung bình/yếu))
  if (
    targetCountry !== "Chưa xác định" &&
    targetMajor !== "Chưa xác định" &&
    budget !== "Chưa xác định" &&
    (languageGroup === 2 ||
      languageGroup === 3 ||
      (languageGroup === 1 &&
        (academic === "trung bình" || academic === "yếu")))
  ) {
    return {
      profileGroup: "B",
      resultTitle: "Hồ sơ phù hợp nhưng cần bổ sung",
    };
  }

  // Default: C (safety net)
  return {
    profileGroup: "C",
    resultTitle: "Hồ sơ cần tư vấn lộ trình chi tiết",
  };
}
