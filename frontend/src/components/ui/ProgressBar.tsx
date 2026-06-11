import { motion } from 'framer-motion';

export interface ProgressBarProps {
  /** Value from 0 to 100 */
  value: number;
  /** Optional label shown above the bar */
  label?: string;
  /** Color variant */
  variant?: 'teal' | 'coral' | 'mint';
  /** Height of the bar */
  size?: 'sm' | 'md';
  /** Show percentage text at the end */
  showValue?: boolean;
  className?: string;
}

const variantClasses = {
  teal: 'bg-teal',
  coral: 'bg-coral',
  mint: 'bg-mint',
};

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
};

export function ProgressBar({
  value,
  label,
  variant = 'teal',
  size = 'md',
  showValue = false,
  className = '',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={['w-full', className].join(' ')}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-xs font-medium text-gray-mid">{label}</span>
          )}
          {showValue && (
            <span className="text-xs font-semibold text-gray-light">
              {clampedValue}%
            </span>
          )}
        </div>
      )}
      <div
        className={['w-full bg-white/8 rounded-full overflow-hidden', sizeClasses[size]].join(' ')}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <motion.div
          className={['h-full rounded-full', variantClasses[variant]].join(' ')}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
