import React, { useState } from "react";
export function Select({ children, onValueChange }) {
  const [value, setValue] = useState("");
  return (
    <select
      className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition w-full"
      value={value}
      onChange={e => {
        setValue(e.target.value);
        onValueChange?.(e.target.value);
      }}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </select>
  );
}
export function SelectTrigger({ children, className = "" }) {
  return <>{children}</>;
}
export function SelectValue({ placeholder }) {
  return <option value="">{placeholder}</option>;
}
export function SelectContent({ children }) {
  return <>{children}</>;
}
export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}
