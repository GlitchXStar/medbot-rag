"use client";

import { motion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
      }}
    >
      {children}
    </motion.div>
  );
}
