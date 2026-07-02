"use client";

import { SelectField, ChipGroup } from "@/components/FormField";
import { TARGET_COUNTRIES, TARGET_MAJORS, BUDGETS, DEPARTURE_TIMES, STUDY_TYPES } from "@/lib/enums";

interface StepProps {
  data: Record<string, string>;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export default function Step3StudyAbroad({ data, errors, onChange }: StepProps) {
  return (
    <div className="space-y-1 animate-fadeIn">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-sm">🌍</span>
        Định hướng du học
      </h2>

      <SelectField
        id="targetCountry"
        label="Quốc gia mục tiêu"
        required
        value={data.targetCountry || ""}
        onChange={(v) => onChange("targetCountry", v)}
        error={errors.targetCountry}
        options={TARGET_COUNTRIES}
        placeholder="-- Chọn quốc gia --"
      />

      <SelectField
        id="targetMajor"
        label="Ngành học mục tiêu"
        required
        value={data.targetMajor || ""}
        onChange={(v) => onChange("targetMajor", v)}
        error={errors.targetMajor}
        options={TARGET_MAJORS}
        placeholder="-- Chọn ngành --"
      />

      <ChipGroup
        id="studyType"
        label="Bậc học"
        required
        value={data.studyType || ""}
        onChange={(v) => onChange("studyType", v)}
        error={errors.studyType}
        options={STUDY_TYPES}
      />

      <SelectField
        id="departureTime"
        label="Thời gian dự kiến xuất cảnh"
        required
        value={data.departureTime || ""}
        onChange={(v) => onChange("departureTime", v)}
        error={errors.departureTime}
        options={DEPARTURE_TIMES}
      />

      <SelectField
        id="budget"
        label="Ngân sách dự kiến"
        required
        value={data.budget || ""}
        onChange={(v) => onChange("budget", v)}
        error={errors.budget}
        options={BUDGETS}
      />
    </div>
  );
}
