import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationToast from './NotificationToast';

const NotificationContainer: React.FC = () => {
  const { notifications } = useNotifications();

  return (
    <div className="fixed top-20 right-4 z-[200] w-full max-w-sm space-y-3">
      <AnimatePresence>
        {notifications.map(notification => (
          <NotificationToast key={notification.id} notification={notification} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer;