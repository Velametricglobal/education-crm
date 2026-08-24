import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    primary: 'bg-blue-100 text-blue-800 border-blue-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    hot: 'bg-red-500 text-white font-bold',
    warm: 'bg-amber-500 text-white font-bold',
    cold: 'bg-blue-500 text-white font-bold'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${styles[variant] || styles.default} ${className}`}>
      {children}
    </span>
  );
};
