import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  /** Adds a teal left border accent */
  accent?: boolean;
  /** Adds a coral left border for mark-loss callouts */
  warning?: boolean;
  /** Adds a mint left border for HD criteria */
  success?: boolean;
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  className = '',
  padding = 'md',
  accent = false,
  warning = false,
  success = false,
}: CardProps) {
  const borderAccent = warning
    ? 'border-l-4 border-l-coral'
    : success
    ? 'border-l-4 border-l-mint'
    : accent
    ? 'border-l-4 border-l-teal'
    : '';

  return (
    <div
      className={[
        'bg-surface rounded-2xl border border-white/8',
        paddingClasses[padding],
        borderAccent,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
