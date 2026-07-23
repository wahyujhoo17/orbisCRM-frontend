import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  icon,
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'block w-full rounded-lg border transition-all focus:outline-none focus:ring-1 font-medium';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-3.5 py-2 text-xs',
    lg: 'px-4 py-2.5 text-sm'
  };

  const stateClasses = error
    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500 text-rose-900 bg-rose-50/20'
    : 'border-stone-200 bg-white text-stone-900 focus:border-stone-400 focus:ring-stone-400 placeholder-stone-400';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold text-stone-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`${baseClasses} ${sizeClasses[size]} ${stateClasses} ${icon ? 'pl-9' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-rose-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-stone-400">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
