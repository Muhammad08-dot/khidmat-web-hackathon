import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-[#1E293B] rounded-2xl shadow-soft border border-gray-200 dark:border-slate-800 p-6 md:p-8 transition-all w-full ${className}`}>
      {children}
    </div>
  );
};

export default Card;
