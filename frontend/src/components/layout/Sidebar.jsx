import { useNavigate, NavLink, Link } from "react-router-dom";

import { LayoutDashboard, CalendarPlus, Calendar, Stethoscope, FileText, User, Bell, Clock, BarChart2, Users, Heart, X, LogOut } from 'lucide-react';
import {cn} from '../../utils/cn';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { NAV_LINKS } from '../../utils/constants';


const ICON_MAP = {
    LayoutDashboard,
    CalendarPlus,
    Calendar,
    Stethoscope,
    FileText,
    User,
    Bell,
    Clock,
    BarChart2,
    Users,
};


export default function Sidebar({ isOpen, onClose }) {
    const { user, logout } = useAuth();
    const { showSuccess }  = useToast();
    const navigate         = useNavigate();

    // Get nav links based on user role
    const links = NAV_LINKS[user?.role] || [];

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
        <>
        {/* Side container. Desktop= visible, mobile- default not visible */}
        <aside
            className={cn(
                // base styles
                'fixed top-0 left-0 h-full w-60 z-40',
                'bg-secondary-900 flex flex-col',
                'transition-transform duration-300 ease-in-out',
                // disktop always show
                'lg:translate-x-0',
                // mobile show
                isOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 py-4 border-secondary-800">
{/* Logo name */}
                     <Link
                            to="/"
                            className="flex items-center gap-2.5 min-w-0"
                        >
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shrink-0">
                            <Heart size={16} className="text-white" />
                            </div>
                            <span className="text-white font-bold text-base tracking-tight whitespace-nowrap">
                            Medi<span className="text-primary-400">Connect</span>
                            </span>
                    </Link>

                    {/* close button for mobile */}
                    <button
                        onClick={onClose}
                        className="lg:hidden text-secondary-400 hover:text-white transition-colors p-1 shrink-0"
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                    </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {links.map((link) => {
                        // Get the icon components from the map
                        const IconComponent = ICON_MAP[link.icon];

                        return (
                            <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={onClose} //close sibar on mobile after clicling
                            className={({ isActive }) =>
                                cn(
                                    // Base link styles
                                    'flex items-center gap-3 px-3 py-2.5 rounded-md',
                                    'text-sm font-medium transition-all duration-150',
                                    // Active state blue background
                                    isActive ? 'bg-primary-600 text-white'
                                    : 'text-secondary-400 hover:bg-secondary-800 hover:text-white'
                                )
                              }
                            >
{/* Icon */}
                              {IconComponent && (
                                <IconComponent size={18} className="shrink-0"/>
                              )}
                              {/* Label */}
                              <span>{link.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* User footer */}
                <div className="p-3 border-t border-secondary-800">

                     <div className="flex items-center gap-3 px-3 py-2 mb-1">
                    {/* Avatar circle with initials */}

                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center shrink-0">
                        <span className="text-white text-sm font-semibold">
                            {getInitials(user?.email)}
                        </span>
                    </div>

                    {/* Email and role */}
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate">
                            {user?.email}
                        </p>
                        <p className="text-secondary-500 text-xs capitalize">
                            {user?.role?.toLowerCase()}
                        </p>
                    </div>
                </div>

                {/* logout button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md
                    text-sm font-medium text-secondary-400 hover:bg-danger-500/10
                    hover:text-danger-400 transition-all duration-150"
                >
                    <LogOut size={18} className="shrink-0" />
                    <span>Logout</span>
                </button>
                </div>
                </aside>

        </>
    );
}
