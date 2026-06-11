import { Lock } from 'lucide-react';

export interface SessionFooterProps {
  className?: string;
}

export function SessionFooter({ className = '' }: SessionFooterProps) {
  return (
    <footer
      className={['flex items-center justify-center gap-1.5 py-4', className].join(' ')}
      aria-label="Session privacy notice"
    >
      <Lock size={11} className="text-gray-dark shrink-0" aria-hidden="true" />
      <span className="text-xs text-gray-dark select-none">
        Session-only mode — nothing saved
      </span>
    </footer>
  );
}
