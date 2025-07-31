import React from 'react';
export function Card({ className = '', children, ...props }) {
  return (
    <div className={`bg-white p-4 rounded-2xl shadow ${className}`} {...props}>
      {children}
    </div>
  );
}
export function CardContent({ className = '', children, ...props }) {
  return <div className={className} {...props}>{children}</div>;
}
export function CardTitle({ className = '', children, ...props }) {
  return <h3 className={`text-lg font-semibold ${className}`} {...props}>{children}</h3>;
}