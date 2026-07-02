"use client";

import Link from "next/link";

interface StepProps {
  data: Record<string, string>;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export default function Step5Consent({ data, errors, onChange }: StepProps) {
  const isChecked = data.consentAccepted === "true";

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-sm">✅</span>
        Xác nhận & Gửi
      </h2>

      {/* Summary */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Tóm tắt thông tin:</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="text-slate-500">Họ tên:</div>
          <div className="text-slate-800 font-medium">{data.fullName || "—"}</div>
          <div className="text-slate-500">SĐT:</div>
          <div className="text-slate-800 font-medium">{data.phone || "—"}</div>
          <div className="text-slate-500">Quốc gia:</div>
          <div className="text-slate-800 font-medium">{data.targetCountry || "—"}</div>
          <div className="text-slate-500">Ngành:</div>
          <div className="text-slate-800 font-medium">{data.targetMajor || "—"}</div>
          <div className="text-slate-500">Bậc học:</div>
          <div className="text-slate-800 font-medium">{data.studyType || "—"}</div>
          <div className="text-slate-500">Ngoại ngữ:</div>
          <div className="text-slate-800 font-medium">{data.language || "—"}</div>
        </div>
      </div>

      {/* Consent checkbox */}
      <div className="flex items-start gap-3">
        <input
          id="consentAccepted"
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onChange("consentAccepted", e.target.checked ? "true" : "")}
          className="mt-1 w-5 h-5 rounded border-slate-300 text-teal-500 focus:ring-teal-500 cursor-pointer"
        />
        <label htmlFor="consentAccepted" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
          Tôi đồng ý để <strong>Du Học Bình Dương</strong> xử lý thông tin cá nhân nhằm mục đích tư vấn lộ trình du học.{" "}
          <Link href="/chinh-sach-bao-mat" target="_blank" className="text-teal-600 underline hover:text-teal-700">
            Xem chính sách bảo mật
          </Link>
        </label>
      </div>
      {errors.consentAccepted && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.consentAccepted}
        </p>
      )}
    </div>
  );
}
