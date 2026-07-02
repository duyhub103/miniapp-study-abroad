"use client";

import { TextField, SelectField, ChipGroup } from "@/components/FormField";
import { EDUCATION_LEVELS, ACADEMIC_LEVELS } from "@/lib/enums";

interface StepProps {
  data: Record<string, string>;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export default function Step2Education({ data, errors, onChange }: StepProps) {
  return (
    <div className="space-y-1 animate-fadeIn">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-sm">🎓</span>
        Thông tin học tập
      </h2>

      <SelectField
        id="currentEducationLevel"
        label="Trình độ học vấn hiện tại"
        required
        value={data.currentEducationLevel || ""}
        onChange={(v) => onChange("currentEducationLevel", v)}
        error={errors.currentEducationLevel}
        options={EDUCATION_LEVELS}
      />

      <ChipGroup
        id="academicLevel"
        label="Học lực"
        required
        value={data.academicLevel || ""}
        onChange={(v) => onChange("academicLevel", v)}
        error={errors.academicLevel}
        options={ACADEMIC_LEVELS}
      />

      <TextField
        id="currentMajor"
        label="Ngành học hiện tại (nếu có)"
        value={data.currentMajor || ""}
        onChange={(v) => onChange("currentMajor", v)}
        error={errors.currentMajor}
        placeholder="VD: Quản trị kinh doanh"
      />

      <TextField
        id="graduationPlan"
        label="Dự kiến tốt nghiệp (nếu có)"
        value={data.graduationPlan || ""}
        onChange={(v) => onChange("graduationPlan", v)}
        error={errors.graduationPlan}
        placeholder="VD: 6/2026"
      />
    </div>
  );
}
