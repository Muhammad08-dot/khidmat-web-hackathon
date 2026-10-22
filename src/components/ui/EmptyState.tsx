import React from 'react';

export interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`text-center max-w-md mx-auto py-12 px-6 flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary dark:text-primary-fixed flex items-center justify-center border border-primary/20">
        <Icon className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
      <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-primary hover:brightness-105 active:scale-95 text-on-primary font-semibold py-3 px-6 rounded-xl transition-all shadow-soft text-sm w-full"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
