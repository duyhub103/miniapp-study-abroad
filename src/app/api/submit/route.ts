import { NextRequest, NextResponse } from "next/server";
import { leadFormSchema } from "@/lib/validation";
import { sanitizeObject } from "@/lib/sanitize";
import { classifyLanguage } from "@/lib/classifyLanguage";
import { classifyProfile } from "@/lib/classifyProfile";
import { buildResultNote, RESULT_CONTENT, LANGUAGE_ASSESSMENTS } from "@/lib/resultContent";
import { prisma } from "@/lib/prisma";
import { isRateLimited, recordSubmission } from "@/lib/rateLimit";
import { fireWebhooks } from "@/lib/webhook";
import { generateAIEvaluation } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";

    // Rate limit check
    if (await isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Bạn đã gửi quá nhiều lần. Vui lòng thử lại sau." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot check
    if (body.website && body.website.length > 0) {
      // Bot detected — return fake success to not reveal the trap
      return NextResponse.json({ success: true, result: { profileGroup: "C", resultTitle: "Hồ sơ cần tư vấn lộ trình chi tiết" } });
    }

    // Validate with Zod
    const parsed = leadFormSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ error: "Dữ liệu không hợp lệ.", fieldErrors: errors }, { status: 400 });
    }

    // Sanitize all string fields
    const data = sanitizeObject(parsed.data);

    // ── Step 1: Rule-based classification (unchanged) ──
    const langResult = classifyLanguage({
      certificate: data.certificate,
      languageLevel: data.languageLevel,
      weakSkill: data.weakSkill,
    });

    const profileResult = classifyProfile({
      academicLevel: data.academicLevel,
      languageGroup: langResult.languageGroup,
      targetCountry: data.targetCountry,
      targetMajor: data.targetMajor,
      budget: data.budget,
      departureTime: data.departureTime,
    });

    // ── Step 2: Fallback content (always available) ──
    const resultNote = buildResultNote(profileResult.profileGroup, langResult.languageGroup);
    const resultContent = RESULT_CONTENT[profileResult.profileGroup];
    const languageAssessment = LANGUAGE_ASSESSMENTS[langResult.languageGroup];

    // ── Step 3: Gemini AI personalized evaluation ──
    const aiEvaluation = await generateAIEvaluation({
      fullName: data.fullName,
      currentRole: data.currentRole,
      currentEducationLevel: data.currentEducationLevel,
      academicLevel: data.academicLevel,
      currentMajor: data.currentMajor,
      targetCountry: data.targetCountry,
      targetMajor: data.targetMajor,
      studyType: data.studyType,
      departureTime: data.departureTime,
      budget: data.budget,
      language: data.language,
      certificate: data.certificate,
      certificateScore: data.certificateScore,
      languageLevel: data.languageLevel,
      weakSkill: data.weakSkill,
      profileGroup: profileResult.profileGroup,
      resultTitle: profileResult.resultTitle,
      languageGroup: langResult.languageGroup,
    });

    // Check for duplicate phone within 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingLead = await prisma.lead.findFirst({
      where: { phone: data.phone, createdAt: { gte: twentyFourHoursAgo } },
      orderBy: { createdAt: "desc" },
    });

    const leadData = {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || null,
      currentRole: data.currentRole,
      currentEducationLevel: data.currentEducationLevel,
      academicLevel: data.academicLevel,
      currentMajor: data.currentMajor || null,
      graduationPlan: data.graduationPlan || null,
      targetCountry: data.targetCountry,
      targetMajor: data.targetMajor,
      studyType: data.studyType,
      departureTime: data.departureTime,
      budget: data.budget,
      language: data.language,
      certificate: data.certificate,
      certificateScore: data.certificateScore || null,
      languageLevel: data.languageLevel,
      weakSkill: data.weakSkill,
      languageGroup: langResult.languageGroup,
      profileGroup: profileResult.profileGroup,
      resultTitle: profileResult.resultTitle,
      resultNote,
      aiEvaluation: aiEvaluation || null, // Store AI evaluation (null if fallback)
      consentAccepted: Boolean(data.consentAccepted),
      sourcePage: data.sourcePage || null,
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
    };

    let lead;
    if (existingLead) {
      lead = await prisma.lead.update({ where: { id: existingLead.id }, data: leadData });
    } else {
      lead = await prisma.lead.create({ data: { ...leadData, status: "new" } });
    }

    // Record rate limit
    await recordSubmission(ip);

    // Fire webhooks asynchronously (don't block response)
    fireWebhooks(lead).catch((err) => console.error("[Webhook] Background error:", err));

    return NextResponse.json({
      success: true,
      result: {
        profileGroup: profileResult.profileGroup,
        resultTitle: profileResult.resultTitle,
        overview: resultContent.overview,
        suggestion: resultContent.suggestion,
        languageAssessment,
        aiEvaluation: aiEvaluation || null, // Send to frontend
        ctaPrimary: resultContent.ctaPrimary,
        ctaSecondary: resultContent.ctaSecondary,
      },
    });
  } catch (err) {
    console.error("[Submit] Error:", err);
    return NextResponse.json({ error: "Đã có lỗi xảy ra. Vui lòng thử lại." }, { status: 500 });
  }
}
