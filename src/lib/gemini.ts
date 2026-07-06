import { GoogleGenerativeAI } from "@google/generative-ai";

// ============================================================
// Gemini AI integration for personalized evaluation
// Falls back gracefully if API key is missing or call fails
// ============================================================

interface ProfileData {
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
  resultTitle: string;
  languageGroup: number;
}

function buildPrompt(data: ProfileData): string {
  return `Bạn là một chuyên gia tư vấn du học tận tâm của trung tâm "Du Học Bình Dương". Hãy viết một bài đánh giá cá nhân hóa chi tiết dựa trên hồ sơ của học viên dưới đây.

Yêu cầu về văn phong & định dạng:
1. Viết bằng tiếng Việt, giọng điệu chuyên nghiệp, nhiệt huyết, truyền cảm hứng, xưng "chúng tôi" hoặc "Du Học Bình Dương" và gọi học viên là "bạn".
2. Bố cục gồm đúng 4 đoạn văn ngắn (ngăn cách nhau bởi một dòng trống):
   - Đoạn 1: Đánh giá tổng quan về học lực và định hướng ngành học ở nước mục tiêu.
   - Đoạn 2: Đánh giá chi tiết về trình độ ngoại ngữ hiện tại, phân tích kỹ năng còn yếu và gợi ý giải pháp cải thiện.
   - Đoạn 3: Đưa ra lời khuyên cụ thể về lộ trình chuẩn bị hồ sơ và kế hoạch tài chính phù hợp với mốc thời gian dự kiến.
   - Đoạn 4: Viết một đoạn văn ngắn đầy sức thuyết phục và truyền cảm hứng để thôi thúc học viên chủ động liên hệ ngay với Du Học Bình Dương nhằm nhận bản lộ trình chi tiết hoàn toàn miễn phí, cũng như bắt đầu hoàn tất thủ tục đăng ký du học sớm để giữ các suất học bổng tốt nhất và kịp thời cho kỳ nhập học mong muốn.
3. KHÔNG sử dụng các định dạng markdown như dấu hoa thị (*), ký hiệu danh sách, tiêu đề (h1, h2, h3) hay chữ in đậm. Hãy viết văn bản thuần túy (plain text) một cách tự nhiên.

DƯỚI ĐÂY LÀ THÔNG TIN HỒ SƠ HỌC VIÊN:
- Họ tên: ${data.fullName}
- Vai trò hiện tại: ${data.currentRole}
- Trình độ học vấn: ${data.currentEducationLevel}
- Học lực: ${data.academicLevel}
- Ngành hiện tại: ${data.currentMajor || "Chưa có"}
- Quốc gia mục tiêu: ${data.targetCountry}
- Ngành mục tiêu: ${data.targetMajor}
- Bậc học: ${data.studyType}
- Thời gian dự kiến lên đường: ${data.departureTime}
- Ngân sách dự kiến: ${data.budget}
- Ngoại ngữ đăng ký: ${data.language}
- Chứng chỉ đã có: ${data.certificate}${data.certificateScore ? ` (${data.certificateScore})` : ""}
- Trình độ ngoại ngữ tự đánh giá: ${data.languageLevel}
- Kỹ năng cần cải thiện: ${data.weakSkill}

KẾT QUẢ PHÂN LOẠI HỆ THỐNG:
- Nhóm hồ sơ: ${data.profileGroup} (${data.resultTitle})
- Nhóm ngoại ngữ: Nhóm ${data.languageGroup}/4`;
}

/**
 * Generate a personalized AI evaluation using Gemini.
 * Returns null if API key is not set or if the call fails.
 */
export async function generateAIEvaluation(
  data: ProfileData
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("[Gemini] GEMINI_API_KEY not configured, skipping AI evaluation");
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Sử dụng gemini-1.5-flash cho tốc độ nhanh, ổn định và đầy đủ ý nghĩa văn bản
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 2048, // Cần đủ lớn vì gemini-2.5-flash dùng token cho cả thinking + output
        temperature: 0.7,
      },
    });

    const prompt = buildPrompt(data);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text()?.trim();

    if (!text || text.length < 50) {
      console.warn("[Gemini] Response too short or empty, falling back");
      return null;
    }

    return text;
  } catch (err) {
    console.error("[Gemini] AI evaluation failed:", err instanceof Error ? err.message : err);
    return null;
  }
}
