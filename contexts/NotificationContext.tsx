import React, { createContext, useState, ReactNode, useCallback, useRef, useMemo } from 'react';

export interface Notification {
  id: number;
  title?: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type?: Notification['type'], title?: string) => void;
  removeNotification: (id: number) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const nextId = useRef(0);

  const removeNotification = useCallback((id: number) => {
    setNotifications(currentNotifications =>
      currentNotifications.filter(notification => notification.id !== id)
    );
  }, []);

  const addNotification = useCallback((message: string, type: Notification['type'] = 'info', title?: string) => {
    const newNotification = { id: nextId.current, message, type, title };
    nextId.current += 1;
    setNotifications(currentNotifications => {
        const updatedNotifications = [...currentNotifications, newNotification];
        if (updatedNotifications.length > 5) {
            // Remove the oldest notification if the queue is too long
            return updatedNotifications.slice(1);
        }
        return updatedNotifications;
    });
  }, []);

  const value = useMemo(() => ({ notifications, addNotification, removeNotification }), [notifications, addNotification, removeNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};