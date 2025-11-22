export function Button({ children, className = "", variant = "primary", ...props }) {
  let base =
    "px-4 py-2 rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ";
  let variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-200",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200",
  };
  return (
    <button
      {...props}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}
