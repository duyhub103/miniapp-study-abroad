"use client";

import { TextField, SelectField, ChipGroup } from "@/components/FormField";
import { LANGUAGES, CERTIFICATES, LANGUAGE_LEVELS, WEAK_SKILLS } from "@/lib/enums";

interface StepProps {
  data: Record<string, string>;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export default function Step4Language({ data, errors, onChange }: StepProps) {
  return (
    <div className="space-y-1 animate-fadeIn">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-sm">🗣️</span>
        Trình độ ngoại ngữ
      </h2>

      <SelectField
        id="language"
        label="Ngoại ngữ đang học/sử dụng"
        required
        value={data.language || ""}
        onChange={(v) => onChange("language", v)}
        error={errors.language}
        options={LANGUAGES}
      />

      <SelectField
        id="certificate"
        label="Chứng chỉ ngoại ngữ"
        required
        value={data.certificate || ""}
        onChange={(v) => onChange("certificate", v)}
        error={errors.certificate}
        options={CERTIFICATES}
      />

      {data.certificate && data.certificate !== "Chưa có" && (
        <TextField
          id="certificateScore"
          label="Điểm/Cấp độ chứng chỉ"
          value={data.certificateScore || ""}
          onChange={(v) => onChange("certificateScore", v)}
          error={errors.certificateScore}
          placeholder="VD: 6.5, N2, Level 4..."
        />
      )}

      <ChipGroup
        id="languageLevel"
        label="Tự đánh giá trình độ ngoại ngữ"
        required
        value={data.languageLevel || ""}
        onChange={(v) => onChange("languageLevel", v)}
        error={errors.languageLevel}
        options={LANGUAGE_LEVELS}
      />

      <ChipGroup
        id="weakSkill"
        label="Kỹ năng yếu nhất"
        required
        value={data.weakSkill || ""}
        onChange={(v) => onChange("weakSkill", v)}
        error={errors.weakSkill}
        options={WEAK_SKILLS}
      />
    </div>
  );
}
