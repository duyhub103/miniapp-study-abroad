"use client";

import React from "react";

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
