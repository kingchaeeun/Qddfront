import React from 'react';
import { motion } from 'motion/react';

interface PanelContainerProps {
  isOpen: boolean;
  children: React.ReactNode;
}

/**
 * PanelContainer: Overlay push 패널 (420px)
 */
export function PanelContainer({ isOpen, children }: PanelContainerProps) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className="fixed top-0 right-0 h-screen w-[420px] bg-white shadow-2xl z-50 overflow-y-auto"
    >
      {children}
    </motion.div>
  );
}
