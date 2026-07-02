"use client";

import { FORM_STEPS } from "@/lib/enums";

interface ProgressBarProps {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="mb-8">
      {/* Step indicators */}
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
          style={{ width: `${(currentStep / (FORM_STEPS.length - 1)) * 100}%` }}
        />

        {FORM_STEPS.map((step, index) => (
          <div key={step} className="flex flex-col items-center relative z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                index < currentStep
                  ? "bg-teal-500 text-white shadow-md shadow-teal-200"
                  : index === currentStep
                  ? "bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-200 scale-110"
                  : "bg-white text-slate-400 border-2 border-slate-200"
              }`}
            >
              {index < currentStep ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className={`mt-2 text-xs font-medium text-center max-w-[80px] hidden sm:block ${
              index <= currentStep ? "text-teal-600" : "text-slate-400"
            }`}>
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile step label */}
      <p className="sm:hidden text-center mt-3 text-sm font-medium text-teal-600">
        Bước {currentStep + 1}: {FORM_STEPS[currentStep]}
      </p>
    </div>
  );
}
