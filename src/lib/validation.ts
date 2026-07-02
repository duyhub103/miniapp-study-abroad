import { z } from "zod";
import {
  CURRENT_ROLES,
  EDUCATION_LEVELS,
  ACADEMIC_LEVELS,
  TARGET_COUNTRIES,
  TARGET_MAJORS,
  BUDGETS,
  DEPARTURE_TIMES,
  STUDY_TYPES,
  LANGUAGES,
  CERTIFICATES,
  LANGUAGE_LEVELS,
  WEAK_SKILLS,
} from "./enums";

// Vietnamese phone: 0 or +84 prefix, then 3/5/7/8/9, then 8 digits
const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

export const leadFormSchema = z.object({
  // Step 1: Personal Info
  fullName: z
    .string()
    .min(1, "Vui lòng nhập họ và tên.")
    .max(100, "Họ tên quá dài."),
  phone: z
    .string()
    .min(1, "Vui lòng nhập số điện thoại hợp lệ.")
    .regex(phoneRegex, "Vui lòng nhập số điện thoại hợp lệ."),
  email: z
    .string()
    .email("Email không hợp lệ.")
    .optional()
    .or(z.literal("")),
  currentRole: z.enum(CURRENT_ROLES, {
    message: "Vui lòng chọn vai trò hiện tại.",
  }),

  // Step 2: Education
  currentEducationLevel: z.enum(EDUCATION_LEVELS, {
    message: "Vui lòng chọn trình độ học vấn.",
  }),
  academicLevel: z.enum(ACADEMIC_LEVELS, {
    message: "Vui lòng chọn học lực.",
  }),
  currentMajor: z.string().max(200).optional().or(z.literal("")),
  graduationPlan: z.string().max(100).optional().or(z.literal("")),

  // Step 3: Study Abroad
  targetCountry: z.enum(TARGET_COUNTRIES, {
    message: "Vui lòng chọn quốc gia mục tiêu.",
  }),
  targetMajor: z.enum(TARGET_MAJORS, {
    message: "Vui lòng chọn ngành học mục tiêu.",
  }),
  studyType: z.enum(STUDY_TYPES, {
    message: "Vui lòng chọn bậc học.",
  }),
  departureTime: z.enum(DEPARTURE_TIMES, {
    message: "Vui lòng chọn thời gian dự kiến.",
  }),
  budget: z.enum(BUDGETS, {
    message: "Vui lòng chọn ngân sách.",
  }),

  // Step 4: Language
  language: z.enum(LANGUAGES, {
    message: "Vui lòng chọn ngoại ngữ.",
  }),
  certificate: z.enum(CERTIFICATES, {
    message: "Vui lòng chọn chứng chỉ.",
  }),
  certificateScore: z.string().max(50).optional().or(z.literal("")),
  languageLevel: z.enum(LANGUAGE_LEVELS, {
    message: "Vui lòng chọn trình độ ngoại ngữ.",
  }),
  weakSkill: z.enum(WEAK_SKILLS, {
    message: "Vui lòng chọn kỹ năng yếu nhất.",
  }),

  // Step 5: Consent
  consentAccepted: z.literal(true, {
    message: "Vui lòng đồng ý xử lý dữ liệu cá nhân trước khi gửi form.",
  }),

  // Honeypot — must be empty
  website: z.string().max(0).optional(),

  // UTM tracking (optional, from query string)
  sourcePage: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

// Partial schemas for step-by-step validation
export const step1Schema = leadFormSchema.pick({
  fullName: true,
  phone: true,
  email: true,
  currentRole: true,
});

export const step2Schema = leadFormSchema.pick({
  currentEducationLevel: true,
  academicLevel: true,
  currentMajor: true,
  graduationPlan: true,
});

export const step3Schema = leadFormSchema.pick({
  targetCountry: true,
  targetMajor: true,
  studyType: true,
  departureTime: true,
  budget: true,
});

export const step4Schema = leadFormSchema.pick({
  language: true,
  certificate: true,
  certificateScore: true,
  languageLevel: true,
  weakSkill: true,
});

export const step5Schema = leadFormSchema.pick({
  consentAccepted: true,
});
