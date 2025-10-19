'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { Notification as NotificationProps, useNotification } from '@/components/Notifications/NotificationContext';

const icons = {
  success: <FaCheckCircle className="text-green-500" size={20} />,
  error: <FaExclamationCircle className="text-red-500" size={20} />,
  info: <FaInfoCircle className="text-blue-500" size={20} />,
  warning: <FaExclamationTriangle className="text-yellow-500" size={20} />,
};

const bgColors = {
  success: 'bg-green-50',
  error: 'bg-red-50',
  info: 'bg-blue-50',
  warning: 'bg-yellow-50',
};

const textColors = {
  success: 'text-green-800',
  error: 'text-red-800',
  info: 'text-blue-800',
  warning: 'text-yellow-800',
};

export default function Notification({ notification }: { notification: NotificationProps }) {
  const { removeNotification } = useNotification();

  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification, removeNotification]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`relative flex items-start w-full max-w-sm p-4 rounded-lg shadow-lg ${bgColors[notification.type]}`}
    >
      <div className="flex-shrink-0">{icons[notification.type]}</div>
      <div className={`ml-3 w-0 flex-1 pt-0.5 ${textColors[notification.type]}`}>
        <p className="text-sm font-medium">{notification.message}</p>
      </div>
      <button onClick={() => removeNotification(notification.id)} className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600">
        <FaTimes size={16} />
      </button>
    </motion.div>
  );
}

