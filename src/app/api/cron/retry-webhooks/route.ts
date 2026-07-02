import { NextResponse } from "next/server";
import { retryFailedWebhooks } from "@/lib/webhook";
import { cleanupRateLimits } from "@/lib/rateLimit";

export async function POST() {
  try {
    const result = await retryFailedWebhooks();
    await cleanupRateLimits();
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[Cron] Error:", err);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
