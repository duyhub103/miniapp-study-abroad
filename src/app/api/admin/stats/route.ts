import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function GET() {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Get status counts
    const statusCounts = await prisma.lead.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    // 2. Get profile group counts
    const groupCounts = await prisma.lead.groupBy({
      by: ["profileGroup"],
      _count: { id: true },
    });

    // 3. Get country counts
    const countryCounts = await prisma.lead.groupBy({
      by: ["targetCountry"],
      _count: { id: true },
    });

    // 4. Get assignment counts
    const assignmentCounts = await prisma.lead.groupBy({
      by: ["assignedTo"],
      _count: { id: true },
    });

    // 5. Get potential level counts
    const potentialCounts = await prisma.lead.groupBy({
      by: ["potentialLevel"],
      _count: { id: true },
    });

    // 6. Total count
    const totalLeads = await prisma.lead.count();

    // 7. Contacted/Consulted count for conversion calculation
    const contactedCount = await prisma.lead.count({
      where: {
        status: { in: ["contacted", "consulted", "closed"] }
      }
    });

    return NextResponse.json({
      success: true,
      totalLeads,
      contactedCount,
      statusCounts,
      groupCounts,
      countryCounts,
      assignmentCounts,
      potentialCounts,
    });
  } catch (error) {
    console.error("[Stats API] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
