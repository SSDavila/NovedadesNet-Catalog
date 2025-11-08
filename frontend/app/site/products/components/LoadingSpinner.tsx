import { FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { itemVariants } from '../animations/variants';

export default function LoadingSpinner() {
  return (
    <motion.div className="text-center py-16" variants={itemVariants}>
      <FaSpinner className="mx-auto text-purple-600 text-4xl animate-spin" />
      <p className="mt-4 text-lg text-gray-600">Cargando productos...</p>
    </motion.div>
  );
}