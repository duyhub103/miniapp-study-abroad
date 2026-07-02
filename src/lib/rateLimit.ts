import { prisma } from "./prisma";

const MAX_SUBMISSIONS_PER_HOUR = 3;

export async function isRateLimited(ip: string): Promise<boolean> {
  // Bypass rate limiting in local development
  if (process.env.NODE_ENV === "development") {
    return false;
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const count = await prisma.rateLimit.count({
    where: { ip, createdAt: { gte: oneHourAgo } },
  });
  return count >= MAX_SUBMISSIONS_PER_HOUR;
}

export async function recordSubmission(ip: string): Promise<void> {
  await prisma.rateLimit.create({ data: { ip } });
}

export async function cleanupRateLimits(): Promise<void> {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  await prisma.rateLimit.deleteMany({ where: { createdAt: { lt: twoHoursAgo } } });
}
