export function Checkbox({ checked, onCheckedChange }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={e => onCheckedChange?.(e.target.checked)}
      className="w-5 h-5 accent-blue-600 rounded border border-slate-300 shadow-sm focus:ring-2 focus:ring-blue-200 transition"
      style={{ cursor: 'pointer' }}
    />
  );
}
