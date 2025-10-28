import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Bell, Trophy, AlertTriangle } from 'lucide-react';
import { Notification } from '../../contexts/NotificationContext';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationToastProps {
  notification: Notification;
}

const icons = {
  info: <Bell className="w-6 h-6" />,
  success: <Trophy className="w-6 h-6" />,
  error: <AlertTriangle className="w-6 h-6" />,
};

const styles = {
    info: {
        bg: 'bg-gradient-to-br from-blue-500 to-purple-600',
        iconBg: 'bg-blue-600',
        progressBar: 'bg-blue-300',
    },
    success: {
        bg: 'bg-gradient-to-br from-green-500 to-cyan-500',
        iconBg: 'bg-green-600',
        progressBar: 'bg-green-300',
    },
    error: {
        bg: 'bg-gradient-to-br from-red-500 to-orange-500',
        iconBg: 'bg-red-600',
        progressBar: 'bg-red-300',
    },
};


const NotificationToast: React.FC<NotificationToastProps> = ({ notification }) => {
  const { removeNotification } = useNotifications();
  const { id, title, message, type } = notification;
  const { bg, iconBg, progressBar } = styles[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, removeNotification]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8, transition: { duration: 0.3, ease: 'easeIn' } }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`relative flex items-start w-full max-w-sm p-4 rounded-xl shadow-2xl text-white overflow-hidden ${bg}`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
        {icons[type]}
      </div>
      <div className="ml-4 flex-1">
        {title && <p className="text-sm font-bold">{title}</p>}
        <p className="text-sm">{message}</p>
      </div>
      <button
        onClick={() => removeNotification(id)}
        className="absolute top-2 right-2 p-1 rounded-full text-white/70 hover:text-white/100 hover:bg-black/20 transition-colors"
      >
        <X size={16} />
      </button>
       <motion.div
            className={`absolute bottom-0 left-0 h-1 ${progressBar}`}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 5, ease: 'linear' }}
        />
    </motion.div>
  );
};

export default NotificationToast;