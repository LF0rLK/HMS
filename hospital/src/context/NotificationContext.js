'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(({ message, type = 'info', duration = 4000 }) => {
    const id = `notif_${Date.now()}`;
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = {
    success: (message) => addNotification({ message, type: 'success' }),
    error: (message) => addNotification({ message, type: 'error' }),
    info: (message) => addNotification({ message, type: 'info' }),
    warning: (message) => addNotification({ message, type: 'warning' }),
  };

  return (
    <NotificationContext.Provider value={{ notifications, notify, removeNotification }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`
              pointer-events-auto px-4 py-3 rounded-md shadow-lg text-body-sm font-medium
              flex items-center justify-between gap-4 min-w-[280px] max-w-[380px]
              transition-all duration-300
              ${n.type === 'success' ? 'bg-green-600 text-white' : ''}
              ${n.type === 'error' ? 'bg-bias-left text-white' : ''}
              ${n.type === 'warning' ? 'bg-yellow-500 text-white' : ''}
              ${n.type === 'info' ? 'bg-accent text-white' : ''}
            `}
          >
            <span>{n.message}</span>
            <button
              onClick={() => removeNotification(n.id)}
              className="font-bold text-white/80 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used inside <NotificationProvider>');
  return ctx;
};
