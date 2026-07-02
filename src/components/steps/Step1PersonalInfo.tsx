"use client";

import { TextField, SelectField } from "@/components/FormField";
import { CURRENT_ROLES } from "@/lib/enums";

interface StepProps {
  data: Record<string, string>;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export default function Step1PersonalInfo({ data, errors, onChange }: StepProps) {
  return (
    <div className="space-y-1 animate-fadeIn">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-sm">👤</span>
        Thông tin cá nhân
      </h2>

      <TextField
        id="fullName"
        label="Họ và tên"
        required
        value={data.fullName || ""}
        onChange={(v) => onChange("fullName", v)}
        error={errors.fullName}
        placeholder="Nhập họ và tên đầy đủ"
      />

      <TextField
        id="phone"
        label="Số điện thoại"
        required
        value={data.phone || ""}
        onChange={(v) => onChange("phone", v)}
        error={errors.phone}
        placeholder="VD: 0901234567"
        type="tel"
      />

      <TextField
        id="email"
        label="Email"
        value={data.email || ""}
        onChange={(v) => onChange("email", v)}
        error={errors.email}
        placeholder="VD: email@example.com"
        type="email"
      />

      <SelectField
        id="currentRole"
        label="Bạn đang là"
        required
        value={data.currentRole || ""}
        onChange={(v) => onChange("currentRole", v)}
        error={errors.currentRole}
        options={CURRENT_ROLES}
        placeholder="-- Chọn vai trò --"
      />
    </div>
  );
}
