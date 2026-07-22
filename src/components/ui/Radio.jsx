import React, { forwardRef } from 'react';

const Radio = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      <label className={`inline-flex items-center gap-2 cursor-pointer ${className}`}>
        <input
          ref={ref}
          type="radio"
          className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
          {...props}
        />
        {label && <span className="text-sm text-gray-700">{label}</span>}
      </label>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
});

Radio.displayName = 'Radio';

export default Radio;
