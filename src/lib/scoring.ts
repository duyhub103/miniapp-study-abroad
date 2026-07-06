// ============================================================
// Scoring engine — calculates 5 dimensions for radar chart
// Each dimension scores from 1 to 5
// ============================================================

export interface RadarScores {
  academics: number;    // Học lực
  language: number;     // Ngoại ngữ
  finance: number;      // Tài chính
  timeline: number;     // Mức độ sẵn sàng về thời gian
  direction: number;    // Mức độ rõ ràng về định hướng
}

export interface ScoreInput {
  academicLevel: string;
  languageGroup: number;
  budget: string;
  departureTime: string;
  targetCountry: string;
  targetMajor: string;
  certificate: string;
  currentEducationLevel: string;
}

/**
 * Calculate radar chart scores from form data.
 * Each dimension: 1 (lowest) to 5 (highest).
 */
export function calculateScores(input: ScoreInput): RadarScores {
  return {
    academics: scoreAcademics(input),
    language: scoreLanguage(input),
    finance: scoreFinance(input),
    timeline: scoreTimeline(input),
    direction: scoreDirection(input),
  };
}

function scoreAcademics(input: ScoreInput): number {
  const academicMap: Record<string, number> = {
    "Giỏi": 5,
    "Khá": 4,
    "Trung bình": 2.5,
    "Yếu": 1,
  };

  const eduBonus: Record<string, number> = {
    "Đã tốt nghiệp Cao đẳng/Đại học": 0.5,
    "Đang học Cao đẳng/Đại học": 0.25,
  };

  const base = academicMap[input.academicLevel] ?? 2.5;
  const bonus = eduBonus[input.currentEducationLevel] ?? 0;

  return Math.min(5, base + bonus);
}

function scoreLanguage(input: ScoreInput): number {
  // languageGroup: 1 = best, 4 = weakest
  const groupMap: Record<number, number> = {
    1: 5,
    2: 3.5,
    3: 2,
    4: 1,
  };

  let score = groupMap[input.languageGroup] ?? 2;

  // Bonus if they have a certificate
  if (input.certificate && input.certificate !== "Chưa có") {
    score = Math.min(5, score + 0.5);
  }

  return score;
}

function scoreFinance(input: ScoreInput): number {
  const budgetMap: Record<string, number> = {
    "Trên 700 triệu/năm": 5,
    "400–700 triệu/năm": 4,
    "200–400 triệu/năm": 3,
    "Dưới 200 triệu/năm": 2,
    "Chưa xác định": 1.5,
  };

  return budgetMap[input.budget] ?? 2;
}

function scoreTimeline(input: ScoreInput): number {
  // More time to prepare = higher readiness score
  const timeMap: Record<string, number> = {
    "Trên 1 năm tới": 5,
    "6–12 tháng tới": 3.5,
    "Trong 6 tháng tới": 2,
    "Chưa xác định": 1.5,
  };

  return timeMap[input.departureTime] ?? 2;
}

function scoreDirection(input: ScoreInput): number {
  let score = 1;

  // Country clarity
  if (input.targetCountry && input.targetCountry !== "Chưa xác định") {
    score += 2;
  }

  // Major clarity
  if (input.targetMajor && input.targetMajor !== "Chưa xác định") {
    score += 2;
  }

  return Math.min(5, score);
}
