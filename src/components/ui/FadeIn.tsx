import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

/**
 * Wrapper component that applies a blur-in entrance animation using Framer Motion.
 * @param children - Content to animate in
 * @param delay - Animation delay in seconds
 * @param duration - Animation duration in seconds
 * @param className - Additional CSS classes
 */
export function FadeIn({ children, delay = 0, duration = 0.5, className = '' }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{ duration, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Wrapper that triggers blur-in animation when scrolled into view.
 * @param children - Content to animate in
 * @param delay - Animation delay in seconds
 * @param className - Additional CSS classes
 */
export function FadeInView({ children, delay = 0, className = '' }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Stagger container variants for Framer Motion */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

/** Stagger child variants for Framer Motion */
export const staggerChild = {
  initial: { opacity: 0, filter: 'blur(8px)', y: 20 },
  animate: { opacity: 1, filter: 'blur(0px)', y: 0 },
}
