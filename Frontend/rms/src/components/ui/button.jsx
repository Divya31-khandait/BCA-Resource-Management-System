import React from 'react';
export function Button({ className = '', variant = 'default', size = 'md', ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg shadow hover:opacity-90 focus:outline-none ${className}`}
      {...props}
    />
  );
}