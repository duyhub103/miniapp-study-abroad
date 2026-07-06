"use client";

import React, { useState, useRef, useEffect } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  id: string;
}

export default function FormField({ label, required, error, children, id }: FormFieldProps) {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// Reusable select component
interface SelectFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
}

export function SelectField({ id, label, required, error, value, onChange, options, placeholder }: SelectFieldProps) {
  return (
    <FormField id={id} label={label} required={required} error={error}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm transition-all duration-200 outline-none appearance-none cursor-pointer ${
          error ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        }`}
      >
        <option value="">{placeholder || "-- Chọn --"}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </FormField>
  );
}

// Reusable text input
interface TextFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

export function TextField({ id, label, required, error, value, onChange, placeholder, type = "text" }: TextFieldProps) {
  return (
    <FormField id={id} label={label} required={required} error={error}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm transition-all duration-200 outline-none ${
          error ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        }`}
      />
    </FormField>
  );
}

// Radio group styled as chips
interface ChipGroupProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}

export function ChipGroup({ id, label, required, error, value, onChange, options }: ChipGroupProps) {
  return (
    <FormField id={id} label={label} required={required} error={error}>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 ${
              value === opt
                ? "bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-200"
                : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-600"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </FormField>
  );
}

// Combo select — dropdown with predefined options + "Khác" free text input
interface ComboFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  customLabel?: string;
}

export function ComboField({ id, label, required, error, value, onChange, options, placeholder, customLabel }: ComboFieldProps) {
  const isCustom = value !== "" && !options.includes(value) && value !== "__custom__";
  const [showCustom, setShowCustom] = useState(isCustom);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (v: string) => {
    if (v === "__custom__") {
      setShowCustom(true);
      onChange("");
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setShowCustom(false);
      onChange(v);
    }
  };

  return (
    <FormField id={id} label={label} required={required} error={error}>
      <select
        id={id}
        value={showCustom ? "__custom__" : value}
        onChange={(e) => handleSelect(e.target.value)}
        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm transition-all duration-200 outline-none appearance-none cursor-pointer ${
          error ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        }`}
      >
        <option value="">{placeholder || "-- Chọn --"}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
        <option value="__custom__">{customLabel || "✏️ Nhập ngành khác..."}</option>
      </select>
      {showCustom && (
        <input
          ref={inputRef}
          type="text"
          value={value === "__custom__" ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nhập tại đây..."
          className="w-full mt-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all duration-200 outline-none hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      )}
    </FormField>
  );
}

// Month picker — shows month/year selector
interface MonthPickerFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MonthPickerField({ id, label, required, error, value, onChange, placeholder }: MonthPickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current value or default to current date
  const now = new Date();
  const parseValue = (v: string) => {
    const match = v.match(/^(\d{1,2})\/(\d{4})$/);
    if (match) return { month: parseInt(match[1]), year: parseInt(match[2]) };
    return { month: now.getMonth() + 1, year: now.getFullYear() };
  };

  const parsed = parseValue(value);
  const [viewYear, setViewYear] = useState(parsed.year);

  // Close picker when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const months = [
    "Th1", "Th2", "Th3", "Th4", "Th5", "Th6",
    "Th7", "Th8", "Th9", "Th10", "Th11", "Th12",
  ];

  const selectMonth = (monthIndex: number) => {
    const formatted = `${monthIndex + 1}/${viewYear}`;
    onChange(formatted);
    setShowPicker(false);
  };

  const isPast = (monthIndex: number, year: number) => {
    return year < now.getFullYear() || (year === now.getFullYear() && monthIndex < now.getMonth());
  };

  return (
    <FormField id={id} label={label} required={required} error={error}>
      <div ref={containerRef} className="relative">
        <div
          onClick={() => { setShowPicker(!showPicker); setViewYear(parsed.year); }}
          className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm transition-all duration-200 outline-none cursor-pointer flex items-center justify-between ${
            error ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          }`}
        >
          <span className={value ? "text-slate-800" : "text-slate-400"}>
            {value || placeholder || "Chọn tháng/năm"}
          </span>
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {showPicker && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-4 z-50 animate-fadeIn">
            {/* Year navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setViewYear((y) => y - 1)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
              >
                ‹
              </button>
              <span className="font-bold text-slate-800">{viewYear}</span>
              <button
                type="button"
                onClick={() => setViewYear((y) => y + 1)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
              >
                ›
              </button>
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-4 gap-2">
              {months.map((m, i) => {
                const isSelected = parsed.month === i + 1 && parsed.year === viewYear && value !== "";
                const disabled = isPast(i, viewYear);

                return (
                  <button
                    key={m}
                    type="button"
                    disabled={disabled}
                    onClick={() => selectMonth(i)}
                    className={`py-2 text-sm rounded-lg transition-all duration-150 ${
                      isSelected
                        ? "bg-teal-500 text-white font-semibold shadow-md shadow-teal-200"
                        : disabled
                          ? "text-slate-300 cursor-not-allowed"
                          : "text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </FormField>
  );
}
