import React from "react";
export const Input = React.forwardRef(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition w-full ${className}`}
    {...props}
  />
));
Input.displayName = "Input";
