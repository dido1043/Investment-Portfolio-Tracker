export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-700 text-slate-300',
    success: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
    danger: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
    warning: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
    primary: 'bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/30',
    buy: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
    sell: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
