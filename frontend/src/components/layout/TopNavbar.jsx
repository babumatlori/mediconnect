import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useNotifications } from '../../hooks/useNotifications';
import { cn } from '../../utils/cn';

const PAGE_TITLES = {
  '/patient/dashboard':     'Dashboard',
  '/patient/book':          'Book Appointment',
  '/patient/appointments':  'My Appointments',
  '/patient/profile':       'My Profile',
  '/patient/ai/symptoms':   'AI Symptom Checker',
  '/patient/ai/reports':    'AI Report Summary',
  '/patient/notifications': 'Notifications',
  '/doctor/dashboard':      'Dashboard',
  '/doctor/appointments':   'My Appointments',
  '/doctor/availability':   'My Availability',
  '/doctor/profile':        'My Profile',
  '/admin/dashboard':       'Overview',
  '/admin/users':           'Manage Users',
};

export default function TopNavbar({ onMenuClick }) {
  const { user, logout }      = useAuth();
  const { showSuccess }       = useToast();
  const { unreadCount }       = useNotifications();
  const navigate              = useNavigate();
  const location              = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const pageTitle = PAGE_TITLES[location.pathname] || 'MediConnect';

  const handleLogout = () => {
    logout();
    showSuccess('Logged out successfully');
    navigate('/login');
  };

  const getInitials = (email) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-secondary-200
                       flex items-center justify-between px-4 md:px-6
                       shrink-0 relative z-50">

      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-secondary-500
                     hover:bg-secondary-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-secondary-900">
          {pageTitle}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Notification Bell */}
        <button
          onClick={() => navigate(
            user?.role === 'PATIENT'
              ? '/patient/notifications'
              : '#'
          )}
          className="relative p-2 rounded-md text-secondary-500
                     hover:bg-secondary-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4
                             bg-danger-500 text-white text-xs
                             rounded-full flex items-center
                             justify-center font-semibold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5
                       rounded-md hover:bg-secondary-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary-600
                            flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {getInitials(user?.email)}
              </span>
            </div>
            <span className="hidden md:block text-sm font-medium
                             text-secondary-700 max-w-32 truncate">
              {user?.email}
            </span>
            <ChevronDown
              size={16}
              className={cn(
                'text-secondary-400 transition-transform duration-150',
                userMenuOpen && 'rotate-180'
              )}
            />
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-48
                              bg-white rounded-lg border border-secondary-200
                              shadow-md z-20 py-1 animate-fadeIn">
                <button
                  onClick={() => {
                    navigate(
                      user?.role === 'PATIENT'
                        ? '/patient/profile'
                        : user?.role === 'DOCTOR'
                        ? '/doctor/profile'
                        : '#'
                    );
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2
                             text-sm text-secondary-700
                             hover:bg-secondary-50 transition-colors"
                >
                  <User size={15} className="text-secondary-400" />
                  My Profile
                </button>
                <div className="divider my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2
                             text-sm text-danger-600
                             hover:bg-danger-50 transition-colors"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
