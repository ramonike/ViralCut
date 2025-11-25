export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl shadow-xl border border-slate-200 p-6 transition hover:shadow-2xl ${className}`}
      style={{ backdropFilter: 'blur(2px)' }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={`font-extrabold text-xl text-slate-800 tracking-tight ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }) {
  return <p className={`text-sm text-slate-500 mt-1 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-0 text-slate-700 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return <div className={`mt-4 ${className}`}>{children}</div>;
}
