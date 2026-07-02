import { classifyLanguage } from "../classifyLanguage";
import { classifyProfile } from "../classifyProfile";

// ============================================================
// classifyLanguage tests (spec §6)
// ============================================================
describe("classifyLanguage", () => {
  it("returns group 4 for 'chưa học/mất gốc'", () => {
    const r = classifyLanguage({ certificate: "Chưa có", languageLevel: "Chưa học/mất gốc", weakSkill: "Nghe" });
    expect(r.languageGroup).toBe(4);
  });

  it("returns group 4 for 'yếu toàn bộ'", () => {
    const r = classifyLanguage({ certificate: "IELTS", languageLevel: "Cơ bản", weakSkill: "Yếu toàn bộ" });
    expect(r.languageGroup).toBe(4);
  });

  it("returns group 1 if certificate is not 'Chưa có'", () => {
    const r = classifyLanguage({ certificate: "JLPT", languageLevel: "Khá", weakSkill: "Nghe" });
    expect(r.languageGroup).toBe(1);
  });

  it("returns group 1 if language level is 'tốt'", () => {
    const r = classifyLanguage({ certificate: "Chưa có", languageLevel: "Tốt", weakSkill: "Nói" });
    expect(r.languageGroup).toBe(1);
  });

  it("returns group 1 if language level is 'đã có chứng chỉ'", () => {
    const r = classifyLanguage({ certificate: "Chưa có", languageLevel: "Đã có chứng chỉ", weakSkill: "Đọc" });
    expect(r.languageGroup).toBe(1);
  });

  it("returns group 2 for khá level without certificate", () => {
    const r = classifyLanguage({ certificate: "Chưa có", languageLevel: "Khá", weakSkill: "Nghe" });
    expect(r.languageGroup).toBe(2);
  });

  it("returns group 2 for trung bình level without certificate", () => {
    const r = classifyLanguage({ certificate: "Chưa có", languageLevel: "Trung bình", weakSkill: "Chưa xác định" });
    expect(r.languageGroup).toBe(2);
  });

  it("returns group 3 for cơ bản level with specific weak skill", () => {
    const r = classifyLanguage({ certificate: "Chưa có", languageLevel: "Cơ bản", weakSkill: "Viết" });
    expect(r.languageGroup).toBe(3);
  });
});

// ============================================================
// classifyProfile tests (spec §7 — corrected version)
// Mandatory 6 test cases from the spec
// ============================================================
describe("classifyProfile", () => {
  const fullOrientation = {
    targetCountry: "Nhật Bản",
    targetMajor: "Kỹ thuật – Công nghệ",
    budget: "200–400 triệu/năm",
    departureTime: "Trong 6 tháng tới",
  };

  // Case 1: giỏi + group 4 + đủ → D (NOT C as in old buggy logic)
  it("returns D for giỏi + language group 4 (fixed case)", () => {
    const r = classifyProfile({ academicLevel: "Giỏi", languageGroup: 4, ...fullOrientation });
    expect(r.profileGroup).toBe("D");
  });

  // Case 2: trung bình + group 1 + đủ → B (NOT C as in old buggy logic)
  it("returns B for trung bình + language group 1 (fixed case)", () => {
    const r = classifyProfile({ academicLevel: "Trung bình", languageGroup: 1, ...fullOrientation });
    expect(r.profileGroup).toBe("B");
  });

  // Case 3: khá/giỏi + group 1 + budget defined → A
  it("returns A for khá + group 1 + budget defined", () => {
    const r = classifyProfile({ academicLevel: "Khá", languageGroup: 1, ...fullOrientation });
    expect(r.profileGroup).toBe("A");
  });

  it("returns A for giỏi + group 1 + budget defined", () => {
    const r = classifyProfile({ academicLevel: "Giỏi", languageGroup: 1, ...fullOrientation });
    expect(r.profileGroup).toBe("A");
  });

  // Case 4: any academic + group 2 or 3 + đủ → B
  it("returns B for group 2 with full orientation", () => {
    const r = classifyProfile({ academicLevel: "Giỏi", languageGroup: 2, ...fullOrientation });
    expect(r.profileGroup).toBe("B");
  });

  it("returns B for group 3 with full orientation", () => {
    const r = classifyProfile({ academicLevel: "Yếu", languageGroup: 3, ...fullOrientation });
    expect(r.profileGroup).toBe("B");
  });

  // Case 5: thiếu ≥1 trong 4 field → C
  it("returns C when targetCountry is undecided", () => {
    const r = classifyProfile({
      academicLevel: "Giỏi",
      languageGroup: 1,
      targetCountry: "Chưa xác định",
      targetMajor: "Kỹ thuật – Công nghệ",
      budget: "200–400 triệu/năm",
      departureTime: "Trong 6 tháng tới",
    });
    expect(r.profileGroup).toBe("C");
  });

  it("returns C when budget is undecided", () => {
    const r = classifyProfile({
      academicLevel: "Khá",
      languageGroup: 1,
      targetCountry: "Nhật Bản",
      targetMajor: "Kỹ thuật – Công nghệ",
      budget: "Chưa xác định",
      departureTime: "Trong 6 tháng tới",
    });
    expect(r.profileGroup).toBe("C");
  });

  // Case 6: mất gốc + group 4 + học lực yếu → D
  it("returns D for language group 4 regardless of weak academic level", () => {
    const r = classifyProfile({ academicLevel: "Yếu", languageGroup: 4, ...fullOrientation });
    expect(r.profileGroup).toBe("D");
  });
});
