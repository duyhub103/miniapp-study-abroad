import { GoogleGenerativeAI } from "@google/generative-ai";

// ============================================================
// AI Roadmap Generator — creates personalized study abroad
// roadmaps for leads based on their profile data
// ============================================================

export interface RoadmapProfileData {
  fullName: string;
  currentRole: string;
  currentEducationLevel: string;
  academicLevel: string;
  currentMajor?: string | null;
  targetCountry: string;
  targetMajor: string;
  studyType: string;
  departureTime: string;
  budget: string;
  language: string;
  certificate: string;
  certificateScore?: string | null;
  languageLevel: string;
  weakSkill: string;
  profileGroup: string;
  languageGroup: number;
  potentialLevel: string;
}

function buildRoadmapPrompt(data: RoadmapProfileData): string {
  return `Bạn là một chuyên gia tư vấn du học giàu kinh nghiệm tại "Du Học Bình Dương". Hãy tạo một LỘ TRÌNH DU HỌC CÁ NHÂN HÓA chi tiết cho học viên dựa trên hồ sơ dưới đây.

Yêu cầu về nội dung & định dạng:
1. Viết bằng tiếng Việt, giọng điệu chuyên nghiệp, tận tâm, xưng "chúng tôi" hoặc "Du Học Bình Dương" và gọi học viên là "bạn".
2. Lộ trình gồm đúng 5 GIAI ĐOẠN theo thứ tự thời gian, mỗi giai đoạn gồm:
   - Tên giai đoạn (ví dụ: "Giai đoạn 1: Chuẩn bị nền tảng")
   - Thời gian dự kiến (tính từ ngày bắt đầu)
   - 3-4 công việc cụ thể cần thực hiện trong giai đoạn đó
   - Kết quả cần đạt được cuối giai đoạn

3. Các giai đoạn nên bao gồm:
   - Giai đoạn 1: Chuẩn bị nền tảng (ngoại ngữ, học lực)
   - Giai đoạn 2: Chọn trường và chương trình phù hợp
   - Giai đoạn 3: Chuẩn bị hồ sơ và tài chính
   - Giai đoạn 4: Nộp hồ sơ và xin visa
   - Giai đoạn 5: Chuẩn bị lên đường và hòa nhập

4. Điều chỉnh nội dung phù hợp với:
   - Trình độ hiện tại (nếu yếu thì giai đoạn 1 cần dài hơn)
   - Quốc gia mục tiêu (yêu cầu visa, hồ sơ khác nhau)
   - Ngân sách (gợi ý học bổng nếu ngân sách thấp)
   - Thời gian dự kiến lên đường

5. KHÔNG sử dụng markdown heading (## hay ###). Sử dụng số đề mục (1., 2., ...) và gạch đầu dòng (- ) thay thế.
6. Viết văn bản thuần túy, tự nhiên. KHÔNG dùng dấu ** hay * cho in đậm/nghiêng.

THÔNG TIN HỒ SƠ HỌC VIÊN:
- Họ tên: ${data.fullName}
- Vai trò hiện tại: ${data.currentRole}
- Trình độ học vấn: ${data.currentEducationLevel}
- Học lực: ${data.academicLevel}
- Ngành hiện tại: ${data.currentMajor || "Chưa có"}
- Quốc gia mục tiêu: ${data.targetCountry}
- Ngành mục tiêu: ${data.targetMajor}
- Bậc học: ${data.studyType}
- Thời gian dự kiến: ${data.departureTime}
- Ngân sách: ${data.budget}
- Ngoại ngữ: ${data.language}
- Chứng chỉ: ${data.certificate}${data.certificateScore ? ` (${data.certificateScore})` : ""}
- Trình độ ngoại ngữ: ${data.languageLevel}
- Kỹ năng yếu: ${data.weakSkill}
- Nhóm hồ sơ: ${data.profileGroup}
- Nhóm ngoại ngữ: ${data.languageGroup}/4
- Mức tiềm năng: ${data.potentialLevel}`;
}

/**
 * Generate personalized roadmap using Gemini AI.
 * Returns null if API key is missing or call fails.
 */
export async function generateRoadmap(
  data: RoadmapProfileData
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("[Gemini] GEMINI_API_KEY not configured, skipping roadmap generation");
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.7,
      },
    });

    const prompt = buildRoadmapPrompt(data);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text()?.trim();

    if (!text || text.length < 100) {
      console.warn("[Gemini] Roadmap response too short or empty");
      return null;
    }

    return text;
  } catch (err) {
    console.error("[Gemini] Roadmap generation failed:", err instanceof Error ? err.message : err);
    return null;
  }
}
