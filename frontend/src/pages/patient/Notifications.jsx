import { useEffect, useState } from 'react';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import { notificationApi } from '../../api/notificationApi';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonCard from '../../components/ui/SkeletonCard';
import { timeAgo } from '../../utils/formatDate';
import { cn } from '../../utils/cn';

const TYPE_CONFIG = {
  BOOKING_CONFIRMED:      { label: 'Confirmed',  variant: 'success' },
  APPOINTMENT_CANCELLED:  { label: 'Cancelled',  variant: 'danger'  },
  APPOINTMENT_COMPLETED:  { label: 'Completed',  variant: 'primary' },
  REMINDER:               { label: 'Reminder',   variant: 'warning' },
  GENERAL:                { label: 'General',    variant: 'secondary'},
};

export default function Notifications() {
  const { user }           = useAuth();
  const { showSuccess, showError } = useToast();

  const [notifications, setNotifs] = useState([]);
  const [loading, setLoading]      = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getNotifications(user.id);
      setNotifs(res.data || []);
    } catch {
      showError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifs(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch {
      showError('Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead(user.id);
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
      showSuccess('All notifications marked as read');
    } catch {
      showError('Failed to mark all as read');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkAllRead}
          >
            <CheckCheck size={15} />
            Mark all read
          </Button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <SkeletonCard key={i} lines={2} />)}
        </div>
      )}

      {/* Empty */}
      {!loading && notifications.length === 0 && (
        <EmptyState
          icon={<Bell size={28} />}
          title="No notifications yet"
          description="You'll receive notifications here when appointments are booked or updated"
        />
      )}

      {/* Notification List */}
      {!loading && notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map(notif => {
            const config = TYPE_CONFIG[notif.type] ||
                           TYPE_CONFIG.GENERAL;

            return (
              <div
                key={notif.id}
                className={cn(
                  'card transition-all duration-150',
                  !notif.isRead && 'border-l-4 border-l-primary-500 bg-primary-50/30'
                )}
              >
                <div className="flex items-start justify-between gap-3">

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className={cn(
                        'text-sm',
                        notif.isRead
                          ? 'text-secondary-600'
                          : 'text-secondary-900 font-semibold'
                      )}>
                        {notif.title}
                      </p>
                      <Badge variant={config.variant}>
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-secondary-500 mb-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-secondary-400">
                      <Clock size={11} />
                      {timeAgo(notif.createdAt)}
                    </div>
                  </div>

                  {/* Mark as read button */}
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="shrink-0 w-2.5 h-2.5 bg-primary-500
                                 rounded-full hover:bg-primary-700
                                 transition-colors mt-1"
                      title="Mark as read"
                      aria-label="Mark as read"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
