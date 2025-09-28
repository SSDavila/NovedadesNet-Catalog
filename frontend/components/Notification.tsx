'use client';

import { FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
  message: string | null;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: NotificationProps) {
  if (!message) return null;

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';
  const borderColor = isSuccess ? 'border-green-500' : 'border-red-500';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const Icon = isSuccess ? FaCheckCircle : FaExclamationTriangle;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className={`${bgColor} border-l-4 ${borderColor} ${textColor} p-4 rounded-r-lg shadow-lg relative flex items-start gap-3`}
        role="alert"
      >
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-grow">
          <p className="font-bold">{isSuccess ? 'Éxito' : 'Error'}</p>
          <p className="text-sm">{message}</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10 transition-colors">
          <FaTimes className="h-4 w-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}