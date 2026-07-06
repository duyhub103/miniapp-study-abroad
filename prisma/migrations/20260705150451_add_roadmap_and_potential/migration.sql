-- CreateTable
CREATE TABLE "RoadmapFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentViaEmail" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RoadmapFeedback_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lead" (
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
    "aiEvaluation" TEXT,
    "consentAccepted" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "assignedTo" TEXT,
    "notes" TEXT,
    "potentialScore" INTEGER NOT NULL DEFAULT 0,
    "potentialLevel" TEXT NOT NULL DEFAULT 'cold',
    "sourcePage" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Lead" ("academicLevel", "aiEvaluation", "budget", "certificate", "certificateScore", "consentAccepted", "createdAt", "currentEducationLevel", "currentMajor", "currentRole", "departureTime", "email", "fullName", "graduationPlan", "id", "language", "languageGroup", "languageLevel", "phone", "profileGroup", "resultNote", "resultTitle", "sourcePage", "status", "studyType", "targetCountry", "targetMajor", "updatedAt", "utmCampaign", "utmMedium", "utmSource", "weakSkill") SELECT "academicLevel", "aiEvaluation", "budget", "certificate", "certificateScore", "consentAccepted", "createdAt", "currentEducationLevel", "currentMajor", "currentRole", "departureTime", "email", "fullName", "graduationPlan", "id", "language", "languageGroup", "languageLevel", "phone", "profileGroup", "resultNote", "resultTitle", "sourcePage", "status", "studyType", "targetCountry", "targetMajor", "updatedAt", "utmCampaign", "utmMedium", "utmSource", "weakSkill" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
CREATE INDEX "Lead_phone_idx" ON "Lead"("phone");
CREATE INDEX "Lead_profileGroup_idx" ON "Lead"("profileGroup");
CREATE INDEX "Lead_status_idx" ON "Lead"("status");
CREATE INDEX "Lead_potentialLevel_idx" ON "Lead"("potentialLevel");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "RoadmapFeedback_leadId_idx" ON "RoadmapFeedback"("leadId");
