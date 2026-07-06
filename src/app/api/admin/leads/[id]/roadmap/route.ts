import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { generateRoadmap } from "@/lib/roadmap";
import { sendRoadmapEmail } from "@/lib/mailer";

// GET — Fetch roadmap history for a lead
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const roadmaps = await prisma.roadmapFeedback.findMany({
    where: { leadId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ roadmaps });
}

// POST — Generate and optionally send roadmap
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { sendEmail = false, customContent } = body;

  // Fetch the lead
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  let roadmapContent: string;

  if (customContent && customContent.trim().length > 0) {
    // Use custom/edited content
    roadmapContent = customContent.trim();
  } else {
    // Generate via AI
    const aiRoadmap = await generateRoadmap({
      fullName: lead.fullName,
      currentRole: lead.currentRole,
      currentEducationLevel: lead.currentEducationLevel,
      academicLevel: lead.academicLevel,
      currentMajor: lead.currentMajor,
      targetCountry: lead.targetCountry,
      targetMajor: lead.targetMajor,
      studyType: lead.studyType,
      departureTime: lead.departureTime,
      budget: lead.budget,
      language: lead.language,
      certificate: lead.certificate,
      certificateScore: lead.certificateScore,
      languageLevel: lead.languageLevel,
      weakSkill: lead.weakSkill,
      profileGroup: lead.profileGroup,
      languageGroup: lead.languageGroup,
      potentialLevel: lead.potentialLevel,
    });

    if (!aiRoadmap) {
      return NextResponse.json(
        { error: "Không thể tạo lộ trình từ AI. Vui lòng thử lại hoặc nhập thủ công." },
        { status: 500 }
      );
    }

    roadmapContent = aiRoadmap;
  }

  // Save to database
  const roadmap = await prisma.roadmapFeedback.create({
    data: {
      leadId: id,
      content: roadmapContent,
      sentViaEmail: false,
      createdBy: "admin",
    },
  });

  // If requested, send via email
  let emailSent = false;
  if (sendEmail && lead.email) {
    try {
      emailSent = await sendRoadmapEmail({
        fullName: lead.fullName,
        email: lead.email,
        profileGroup: lead.profileGroup,
        resultTitle: lead.resultTitle,
        roadmapContent,
      });

      if (emailSent) {
        await prisma.roadmapFeedback.update({
          where: { id: roadmap.id },
          data: { sentViaEmail: true },
        });
      }
    } catch (err) {
      console.error("[Roadmap] Email send error:", err);
    }
  }

  return NextResponse.json({
    success: true,
    roadmap,
    emailSent,
  });
}
