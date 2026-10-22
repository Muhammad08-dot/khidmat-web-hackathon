import React from 'react';

export interface AvatarProps {
  src?: string;
  name: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, className = 'w-12 h-12' }) => {
  if (src && src.trim() !== '') {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover border border-gray-200 dark:border-slate-700 ${className}`}
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    );
  }

  return (
    <div className={`rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center border border-gray-200 dark:border-slate-700 select-none ${className}`}>
      <svg
        className="w-2/3 h-2/3 opacity-70"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0 1 12.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
      </svg>
    </div>
  );
};

export default Avatar;
