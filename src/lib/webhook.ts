import { prisma } from "./prisma";

type WebhookTarget = "google_sheet" | "zalo" | "email" | "hubspot" | "salesforce";

interface LeadData {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  profileGroup: string;
  resultTitle: string;
  assignedTo?: string | null;
  [key: string]: unknown;
}

async function sendToGoogleSheet(lead: LeadData): Promise<void> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) { console.log("[Webhook] LEAD_WEBHOOK_URL not configured, skipping Google Sheet"); return; }
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
  if (!res.ok) throw new Error(`Google Sheet webhook failed: ${res.status}`);
}

async function sendToZalo(lead: LeadData): Promise<void> {
  const url = process.env.ZALO_WEBHOOK_URL;
  if (!url) { console.log("[Webhook] ZALO_WEBHOOK_URL not configured, skipping Zalo"); return; }
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: lead.fullName, phone: lead.phone, group: lead.profileGroup }) });
  if (!res.ok) throw new Error(`Zalo webhook failed: ${res.status}`);
}

async function sendEmail(lead: LeadData): Promise<void> {
  const email = process.env.CONSULTANT_NOTIFY_EMAIL;
  if (!email) { console.log("[Webhook] CONSULTANT_NOTIFY_EMAIL not configured, skipping email"); return; }
  console.log(`[Webhook] Would send email to ${email} about lead ${lead.id} (${lead.fullName})`);
}

async function sendToHubSpot(lead: LeadData): Promise<void> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  if (!apiKey) {
    console.log(`[Webhook] HUBSPOT_API_KEY not configured. Simulating HubSpot CRM sync for lead: ${lead.fullName}`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return;
  }
  const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      properties: {
        firstname: lead.fullName.split(" ").slice(1).join(" ") || lead.fullName,
        lastname: lead.fullName.split(" ")[0] || "",
        phone: lead.phone,
        email: lead.email || "",
        hs_lead_status: "NEW",
        assigned_to: lead.assignedTo || "",
      }
    })
  });
  if (!res.ok) throw new Error(`HubSpot CRM sync failed: ${res.status}`);
}

async function sendToSalesforce(lead: LeadData): Promise<void> {
  const token = process.env.SALESFORCE_TOKEN;
  if (!token) {
    console.log(`[Webhook] SALESFORCE_TOKEN not configured. Simulating Salesforce CRM sync for lead: ${lead.fullName}`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return;
  }
  const res = await fetch("https://your-instance.my.salesforce.com/services/data/v52.0/sobjects/Lead", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      LastName: lead.fullName,
      Company: "Du Học Bình Dương",
      Phone: lead.phone,
      Email: lead.email || "",
      Status: "Open - Not Contacted",
      Owner: lead.assignedTo || "",
    })
  });
  if (!res.ok) throw new Error(`Salesforce CRM sync failed: ${res.status}`);
}

const SENDERS: Record<WebhookTarget, (lead: LeadData) => Promise<void>> = {
  google_sheet: sendToGoogleSheet,
  zalo: sendToZalo,
  email: sendEmail,
  hubspot: sendToHubSpot,
  salesforce: sendToSalesforce,
};

export async function fireWebhooks(lead: LeadData): Promise<void> {
  const targets: WebhookTarget[] = ["google_sheet", "zalo", "email", "hubspot", "salesforce"];
  for (const target of targets) {
    const log = await prisma.webhookLog.create({ data: { leadId: lead.id, target, status: "pending" } });
    try {
      await SENDERS[target](lead);
      await prisma.webhookLog.update({ where: { id: log.id }, data: { status: "sent", attempts: 1 } });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      await prisma.webhookLog.update({ where: { id: log.id }, data: { status: "failed", attempts: 1, lastError: errorMsg } });
      console.error(`[Webhook] ${target} failed for lead ${lead.id}:`, errorMsg);
    }
  }
}

const MAX_RETRY_ATTEMPTS = 5;

export async function retryFailedWebhooks(): Promise<{ retried: number; succeeded: number; dead: number }> {
  const logs = await prisma.webhookLog.findMany({ where: { status: { in: ["failed", "pending"] }, attempts: { lt: MAX_RETRY_ATTEMPTS } }, take: 50 });
  let succeeded = 0, dead = 0;
  for (const log of logs) {
    const lead = await prisma.lead.findUnique({ where: { id: log.leadId } });
    if (!lead) { await prisma.webhookLog.update({ where: { id: log.id }, data: { status: "dead", lastError: "Lead not found" } }); dead++; continue; }
    try {
      await SENDERS[log.target as WebhookTarget](lead as unknown as LeadData);
      await prisma.webhookLog.update({ where: { id: log.id }, data: { status: "sent", attempts: log.attempts + 1 } });
      succeeded++;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      const newAttempts = log.attempts + 1;
      const newStatus = newAttempts >= MAX_RETRY_ATTEMPTS ? "dead" : "failed";
      await prisma.webhookLog.update({ where: { id: log.id }, data: { status: newStatus, attempts: newAttempts, lastError: errorMsg } });
      if (newStatus === "dead") dead++;
    }
  }
  return { retried: logs.length, succeeded, dead };
}
