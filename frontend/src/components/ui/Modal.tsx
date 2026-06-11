import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** If provided, renders a primary CTA button */
  confirmLabel?: string;
  onConfirm?: () => void;
  /** If provided, renders a secondary/cancel button */
  cancelLabel?: string;
  /** Prevents closing by clicking the backdrop */
  preventBackdropClose?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  confirmLabel,
  onConfirm,
  cancelLabel = 'Cancel',
  preventBackdropClose = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Trap focus and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Focus the dialog on open
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={preventBackdropClose ? undefined : onClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            ref={dialogRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-surface-raised border border-white/10 rounded-2xl shadow-2xl w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/8">
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-gray-light tracking-tight"
                >
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="text-gray-mid hover:text-gray-light transition-colors duration-200 rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-teal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">{children}</div>

              {/* Footer */}
              {(confirmLabel || cancelLabel) && (
                <div className="flex gap-3 justify-end p-6 pt-0">
                  <Button variant="ghost" size="md" onClick={onClose}>
                    {cancelLabel}
                  </Button>
                  {confirmLabel && onConfirm && (
                    <Button variant="primary" size="md" onClick={onConfirm}>
                      {confirmLabel}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
