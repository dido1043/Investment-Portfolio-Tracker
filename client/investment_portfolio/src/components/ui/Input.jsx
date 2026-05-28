export default function Input({ label, error, icon: Icon, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-slate-500" />
          </div>
        )}
        <input
          className={`
            w-full bg-slate-800 border rounded-lg text-slate-100 placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            transition-all duration-150 text-sm
            ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5
            ${error ? 'border-red-500' : 'border-slate-700 hover:border-slate-600'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
