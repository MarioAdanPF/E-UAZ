import React from 'react';

const Textarea = ({ 
  label, 
  error, 
  className = '',
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={`${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={`
          block w-full rounded-lg border-gray-300 shadow-sm
          focus:border-primary-500 focus:ring-primary-500
          px-3 py-2
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Textarea;
