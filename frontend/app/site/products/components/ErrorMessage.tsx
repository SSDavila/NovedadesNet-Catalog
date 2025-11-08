import { FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { itemVariants } from '../animations/variants';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <motion.div className="text-center py-16 bg-red-50 rounded-lg border border-red-200" variants={itemVariants}>
      <FaExclamationTriangle className="mx-auto text-red-500 text-4xl" />
      <p className="mt-4 text-lg text-red-700 font-medium">Error: {message}</p>
    </motion.div>
  );
}