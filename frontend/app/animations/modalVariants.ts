import { Variants } from 'framer-motion';

export const backdropVariants: Variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.1, duration: 0.3, ease: 'easeInOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeInOut' },
  },
};