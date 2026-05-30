import {
  createContext, useState,
  useEffect, useCallback
} from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { notificationApi } from '../api/notificationApi';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifs]    = useState([]);

  /**
   * We don't use useAuth() here directly because
   * NotificationProvider wraps AuthProvider in App.jsx.
   * Instead we read user from localStorage directly.
   */
  const getUserFromStorage = () => {
    try {
      const raw = localStorage.getItem('mediconnect_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const loadNotifications = useCallback(async () => {
    const user = getUserFromStorage();
    if (!user?.id || user.role !== 'PATIENT') return;

    try {
      const res = await notificationApi
          .getNotifications(user.id);
      const data = res.data || [];
      setNotifs(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch {
      // Silently fail — notifications are non-critical
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // WebSocket connection
  useEffect(() => {
    const user = getUserFromStorage();
    if (!user?.id || user.role !== 'PATIENT') return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(
          import.meta.env.VITE_NOTIFICATION_WS_URL + '/ws' ||
          'http://localhost:8084/ws'
        ),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(
          `/topic/notifications/${user.id}`,
          (message) => {
            try {
              const notif = JSON.parse(message.body);
              setNotifs(prev => [notif, ...prev]);
              setUnreadCount(prev => prev + 1);
            } catch {
              // Invalid message format
            }
          }
        );
      },
      onStompError: () => {
        // WebSocket error — app still works without it
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifs(prev =>
        prev.map(n =>
          n.id === id ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      // Silently fail
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const user = getUserFromStorage();
    if (!user?.id) return;
    try {
      await notificationApi.markAllAsRead(user.id);
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Silently fail
    }
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      reload: loadNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
