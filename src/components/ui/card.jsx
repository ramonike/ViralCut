export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl bg-white/90 shadow-xl border border-slate-200 p-6 transition hover:shadow-2xl ${className}`}
      style={{ backdropFilter: 'blur(2px)' }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="mb-4 font-extrabold text-xl text-slate-800 tracking-tight flex items-center gap-2">{children}</div>;
}

export function CardContent({ children }) {
  return <div className="p-0 text-slate-700">{children}</div>;
}
