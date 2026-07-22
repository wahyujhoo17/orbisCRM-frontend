import React, { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'block w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 bg-white';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`${baseClasses} ${sizeClasses[size]} ${stateClasses} ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
