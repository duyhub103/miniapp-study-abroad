-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "currentRole" TEXT NOT NULL,
    "currentEducationLevel" TEXT NOT NULL,
    "academicLevel" TEXT NOT NULL,
    "currentMajor" TEXT,
    "graduationPlan" TEXT,
    "targetCountry" TEXT NOT NULL,
    "targetMajor" TEXT NOT NULL,
    "studyType" TEXT NOT NULL,
    "departureTime" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "certificate" TEXT NOT NULL,
    "certificateScore" TEXT,
    "languageLevel" TEXT NOT NULL,
    "weakSkill" TEXT NOT NULL,
    "languageGroup" INTEGER NOT NULL,
    "profileGroup" TEXT NOT NULL,
    "resultTitle" TEXT NOT NULL,
    "resultNote" TEXT NOT NULL,
    "consentAccepted" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "sourcePage" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WebhookLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ip" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Lead_phone_idx" ON "Lead"("phone");

-- CreateIndex
CREATE INDEX "Lead_profileGroup_idx" ON "Lead"("profileGroup");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "RateLimit_ip_createdAt_idx" ON "RateLimit"("ip", "createdAt");
