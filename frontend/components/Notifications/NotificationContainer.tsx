'use client';

import { AnimatePresence } from 'framer-motion';
import { useNotification } from '@/components/Notifications/NotificationContext';
import Notification from './Notification';

export default function NotificationContainer() {
  const { notifications } = useNotification();

  return (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-sm space-y-3">
      <AnimatePresence>
        {notifications.map(notification => (
          <Notification key={notification.id} notification={notification} />
        ))}
      </AnimatePresence>
    </div>
  );
}

