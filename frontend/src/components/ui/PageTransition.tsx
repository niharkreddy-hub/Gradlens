import React from 'react';
import { motion, type Transition } from 'framer-motion';

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition: Transition = {
  duration: 0.25,
  ease: 'easeOut' as const,
};

/**
 * Wraps each screen in a consistent fade+slide entrance animation.
 * Used as the outermost wrapper in every screen component.
 */
export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className={['min-h-screen flex flex-col', className].join(' ')}
    >
      {children}
    </motion.div>
  );
}
