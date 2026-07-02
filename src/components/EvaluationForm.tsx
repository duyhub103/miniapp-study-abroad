"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProgressBar from "./ProgressBar";
import ResultDisplay from "./ResultDisplay";
import Step1PersonalInfo from "./steps/Step1PersonalInfo";
import Step2Education from "./steps/Step2Education";
import Step3StudyAbroad from "./steps/Step3StudyAbroad";
import Step4Language from "./steps/Step4Language";
import Step5Consent from "./steps/Step5Consent";
import { step1Schema, step2Schema, step3Schema, step4Schema, step5Schema } from "@/lib/validation";
import { FORM_STEPS } from "@/lib/enums";

const STORAGE_KEY = "duhoc_form_draft";

interface ResultData {
  profileGroup: string;
  resultTitle: string;
  overview: string;
  suggestion: string;
  languageAssessment: string;
  aiEvaluation?: string | null;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

export default function EvaluationForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData(parsed.data || {});
        setStep(parsed.step || 0);
      }
    } catch { /* ignore corrupt data */ }
  }, []);

  // Save draft to localStorage on change
  useEffect(() => {
    if (!result) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, step }));
      } catch { /* storage full, ignore */ }
    }
  }, [data, step, result]);

  const handleChange = useCallback((field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const validateStep = (currentStep: number): boolean => {
    const schemas = [step1Schema, step2Schema, step3Schema, step4Schema, step5Schema];
    const schema = schemas[currentStep];
    if (!schema) return true;

    // Build the data object for validation
    const validationData: Record<string, unknown> = { ...data };
    if (currentStep === 4) {
      validationData.consentAccepted = data.consentAccepted === "true" ? true : undefined;
    }

    const result = schema.safeParse(validationData);
    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: Record<string, string> = {};
    for (const [key, messages] of Object.entries(result.error.flatten().fieldErrors)) {
      if (messages && messages.length > 0) {
        fieldErrors[key] = messages[0];
      }
    }
    setErrors(fieldErrors);

    // Scroll to first error
    setTimeout(() => {
      const firstError = document.querySelector("[class*='text-red-500']");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    return false;
  };

  const goNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, FORM_STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goPrev = () => {
    setStep((s) => Math.max(s - 1, 0));
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        ...data,
        consentAccepted: true,
        website: "", // honeypot
        sourcePage: window.location.href,
        utmSource: searchParams.get("utm_source") || "",
        utmMedium: searchParams.get("utm_medium") || "",
        utmCampaign: searchParams.get("utm_campaign") || "",
      };

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.fieldErrors) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, messages] of Object.entries(json.fieldErrors)) {
            if (Array.isArray(messages) && messages.length > 0) {
              fieldErrors[key] = messages[0] as string;
            }
          }
          setErrors(fieldErrors);
          setSubmitError("Vui lòng hoàn thiện các thông tin bắt buộc trước khi xem kết quả.");
        } else {
          setSubmitError(json.error || "Đã có lỗi xảy ra.");
        }
        return;
      }

      // Success!
      setResult(json.result);
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      setSubmitError("Không thể kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setData({});
    setStep(0);
    setErrors({});
    setResult(null);
    setSubmitError(null);
    localStorage.removeItem(STORAGE_KEY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show result if submitted
  if (result) {
    return <ResultDisplay result={result} onReset={handleReset} />;
  }

  const isLastStep = step === FORM_STEPS.length - 1;

  return (
    <div>
      <ProgressBar currentStep={step} />

      {/* Honeypot field — hidden from users, filled by bots */}
      <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }} aria-hidden="true">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={data.website || ""}
          onChange={(e) => handleChange("website", e.target.value)}
        />
      </div>

      {/* Step content */}
      {step === 0 && <Step1PersonalInfo data={data} errors={errors} onChange={handleChange} />}
      {step === 1 && <Step2Education data={data} errors={errors} onChange={handleChange} />}
      {step === 2 && <Step3StudyAbroad data={data} errors={errors} onChange={handleChange} />}
      {step === 3 && <Step4Language data={data} errors={errors} onChange={handleChange} />}
      {step === 4 && <Step5Consent data={data} errors={errors} onChange={handleChange} />}

      {/* Error message */}
      {submitError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {submitError}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button
            type="button"
            onClick={goPrev}
            className="flex-1 px-6 py-3 bg-white text-slate-600 font-semibold rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-200"
          >
            ← Quay lại
          </button>
        )}
        {isLastStep ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Xem kết quả đánh giá →"
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Tiếp tục →
          </button>
        )}
      </div>
    </div>
  );
}
