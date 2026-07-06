import nodemailer from "nodemailer";

// ============================================================
// Email result sender — sends evaluation results to the user
// ============================================================

interface EmailResultData {
  fullName: string;
  email: string;
  profileGroup: string;
  resultTitle: string;
  overview: string;
  suggestion: string;
  languageAssessment: string;
  aiEvaluation?: string | null;
  roadmapContent?: string | null;
}

const GROUP_COLORS: Record<string, { bg: string; accent: string; icon: string; label: string }> = {
  A: { bg: "#10b981", accent: "#059669", icon: "🌟", label: "Tiềm năng cao" },
  B: { bg: "#3b82f6", accent: "#2563eb", icon: "📋", label: "Phù hợp, cần bổ sung" },
  C: { bg: "#f59e0b", accent: "#d97706", icon: "🧭", label: "Cần tư vấn chi tiết" },
  D: { bg: "#f43f5e", accent: "#e11d48", icon: "📚", label: "Cần xây dựng nền tảng" },
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function buildEmailHTML(data: EmailResultData): string {
  const group = GROUP_COLORS[data.profileGroup] || GROUP_COLORS.C;

  const aiSection = data.aiEvaluation
    ? `
    <tr>
      <td style="padding: 0 32px 24px;">
        <div style="background: linear-gradient(135deg, #f5f3ff, #faf5ff, #fdf2f8); border: 1px solid #e9d5ff; border-radius: 16px; padding: 24px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -20px; right: -20px; width: 60px; height: 60px; background: rgba(196, 181, 253, 0.3); border-radius: 50%;"></div>
          <h3 style="margin: 0 0 12px; font-size: 13px; font-weight: 700; color: #7c3aed; text-transform: uppercase; letter-spacing: 1px;">
            ✨ Nhận xét cá nhân hóa từ AI
          </h3>
          <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.7; white-space: pre-line;">${escapeHtml(data.aiEvaluation)}</p>
        </div>
      </td>
    </tr>`
    : "";

  const roadmapSection = data.roadmapContent
    ? `
    <tr>
      <td style="padding: 0 32px 24px;">
        <div style="background: linear-gradient(135deg, #f0fdfa, #ecfeff, #f0f9ff); border: 1px solid #99f6e4; border-radius: 16px; padding: 24px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -20px; right: -20px; width: 60px; height: 60px; background: rgba(20, 184, 166, 0.15); border-radius: 50%;"></div>
          <h3 style="margin: 0 0 12px; font-size: 13px; font-weight: 700; color: #0d9488; text-transform: uppercase; letter-spacing: 1px;">
            🗺️ Lộ trình du học đề xuất cho bạn
          </h3>
          <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.8; white-space: pre-line;">${escapeHtml(data.roadmapContent)}</p>
        </div>
      </td>
    </tr>`
    : "";

  const fallbackSections = !data.aiEvaluation
    ? `
    <tr>
      <td style="padding: 0 32px 16px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
          <h3 style="margin: 0 0 8px; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Đánh giá ngoại ngữ</h3>
          <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6;">${escapeHtml(data.languageAssessment)}</p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 32px 24px;">
        <div style="background: linear-gradient(135deg, #f0fdfa, #ecfeff); border: 1px solid #99f6e4; border-radius: 12px; padding: 20px;">
          <h3 style="margin: 0 0 8px; font-size: 13px; font-weight: 700; color: #0d9488; text-transform: uppercase; letter-spacing: 1px;">Gợi ý bước tiếp theo</h3>
          <p style="margin: 0; color: #134e4a; font-size: 14px; line-height: 1.6;">${escapeHtml(data.suggestion)}</p>
        </div>
      </td>
    </tr>`
    : "";

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, ${group.bg}, ${group.accent}); padding: 40px 32px; text-align: center; position: relative;">
              <div style="font-size: 48px; margin-bottom: 12px;">${group.icon}</div>
              <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 16px; border-radius: 20px; font-size: 13px; color: #ffffff; font-weight: 600; margin-bottom: 12px;">
                Nhóm ${escapeHtml(data.profileGroup)} — ${group.label}
              </div>
              <h1 style="margin: 12px 0 8px; font-size: 24px; font-weight: 800; color: #ffffff; line-height: 1.3;">
                ${escapeHtml(data.resultTitle)}
              </h1>
              <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 15px; line-height: 1.5;">
                ${escapeHtml(data.overview)}
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 32px 32px 16px;">
              <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.6;">
                Xin chào <strong>${escapeHtml(data.fullName)}</strong>,
              </p>
              <p style="margin: 8px 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                Cảm ơn bạn đã hoàn thành bài đánh giá đầu vào du học. Dưới đây là kết quả phân tích hồ sơ của bạn:
              </p>
            </td>
          </tr>

          <!-- AI Evaluation or Fallback sections -->
          ${aiSection}
          ${roadmapSection}
          ${fallbackSections}

          <!-- CTA -->
          <tr>
            <td style="padding: 8px 32px 32px; text-align: center;">
              <a href="https://duhocbinhduong.vn" style="display: inline-block; background: linear-gradient(135deg, ${group.bg}, ${group.accent}); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 36px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                Nhận tư vấn miễn phí →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #0d9488;">🎓 Du Học Bình Dương</p>
                    <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                      Đồng hành cùng bạn trên hành trình du học<br>
                      Email này được gửi tự động. Vui lòng không trả lời email này.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Send evaluation results to the user's email.
 * Runs asynchronously — caller should catch errors.
 */
export async function sendResultEmail(data: EmailResultData): Promise<boolean> {
  const transporter = getTransporter();

  if (!transporter) {
    console.log("[Mailer] SMTP not configured (missing SMTP_HOST, SMTP_USER, or SMTP_PASS), skipping email");
    return false;
  }

  const fromName = process.env.SMTP_FROM_NAME || "Du Học Bình Dương";
  const fromEmail = process.env.SMTP_USER;

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: data.email,
      subject: `🎓 Kết quả đánh giá du học — ${data.resultTitle}`,
      html: buildEmailHTML(data),
    });

    console.log(`[Mailer] ✅ Result email sent to ${data.email}`);
    return true;
  } catch (err) {
    console.error(`[Mailer] ❌ Failed to send email to ${data.email}:`, err);
    return false;
  }
}

// ============================================================
// Roadmap email sender — sends personalized roadmap to the user
// ============================================================

interface RoadmapEmailData {
  fullName: string;
  email: string;
  profileGroup: string;
  resultTitle: string;
  roadmapContent: string;
}

function buildRoadmapEmailHTML(data: RoadmapEmailData): string {
  const group = GROUP_COLORS[data.profileGroup] || GROUP_COLORS.C;

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${group.bg}, ${group.accent}); padding: 40px 32px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 12px;">🗺️</div>
              <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 16px; border-radius: 20px; font-size: 13px; color: #ffffff; font-weight: 600; margin-bottom: 12px;">
                Lộ trình cá nhân hóa — Nhóm ${escapeHtml(data.profileGroup)}
              </div>
              <h1 style="margin: 12px 0 8px; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.3;">
                Lộ trình du học dành riêng cho bạn
              </h1>
              <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 14px; line-height: 1.5;">
                Được xây dựng bởi đội ngũ tư vấn viên Du Học Bình Dương
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 32px 32px 16px;">
              <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.6;">
                Xin chào <strong>${escapeHtml(data.fullName)}</strong>,
              </p>
              <p style="margin: 8px 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                Cảm ơn bạn đã tin tưởng Du Học Bình Dương. Dưới đây là lộ trình du học được xây dựng riêng cho bạn dựa trên hồ sơ đánh giá đầu vào:
              </p>
            </td>
          </tr>

          <!-- Roadmap Content -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <div style="background: linear-gradient(135deg, #f0fdfa, #ecfeff, #f0f9ff); border: 1px solid #99f6e4; border-radius: 16px; padding: 24px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -20px; right: -20px; width: 60px; height: 60px; background: rgba(20, 184, 166, 0.15); border-radius: 50%;"></div>
                <h3 style="margin: 0 0 16px; font-size: 13px; font-weight: 700; color: #0d9488; text-transform: uppercase; letter-spacing: 1px;">
                  🗺️ Lộ trình du học chi tiết
                </h3>
                <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.8; white-space: pre-line;">${escapeHtml(data.roadmapContent)}</p>
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 8px 32px 32px; text-align: center;">
              <p style="margin: 0 0 16px; color: #64748b; font-size: 13px; line-height: 1.5;">
                Bạn có câu hỏi về lộ trình? Hãy liên hệ tư vấn viên để được giải đáp chi tiết.
              </p>
              <a href="https://duhocbinhduong.vn" style="display: inline-block; background: linear-gradient(135deg, ${group.bg}, ${group.accent}); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 36px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                Liên hệ tư vấn viên →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #0d9488;">🎓 Du Học Bình Dương</p>
                    <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                      Đồng hành cùng bạn trên hành trình du học<br>
                      Email này được gửi tự động. Vui lòng không trả lời email này.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Send roadmap feedback email to the user.
 */
export async function sendRoadmapEmail(data: RoadmapEmailData): Promise<boolean> {
  const transporter = getTransporter();

  if (!transporter) {
    console.log("[Mailer] SMTP not configured, skipping roadmap email");
    return false;
  }

  const fromName = process.env.SMTP_FROM_NAME || "Du Học Bình Dương";
  const fromEmail = process.env.SMTP_USER;

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: data.email,
      subject: `🗺️ Lộ trình du học cá nhân hóa — ${data.fullName}`,
      html: buildRoadmapEmailHTML(data),
    });

    console.log(`[Mailer] ✅ Roadmap email sent to ${data.email}`);
    return true;
  } catch (err) {
    console.error(`[Mailer] ❌ Failed to send roadmap email to ${data.email}:`, err);
    return false;
  }
}

