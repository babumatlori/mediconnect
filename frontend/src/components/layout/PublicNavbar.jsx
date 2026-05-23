import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

export default function PublicNavbar() {
  const { isAuthenticated, user } = useAuth();
  const navigate                  = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * If already logged in, clicking logo or dashboard
   * redirects to appropriate dashboard.
   */
  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === ROLES.PATIENT) return '/patient/dashboard';
    if (user.role === ROLES.DOCTOR)  return '/doctor/dashboard';
    if (user.role === ROLES.ADMIN)   return '/admin/dashboard';
    return '/login';
  };

  return (
    <nav className="bg-white border-b border-secondary-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ──────────────────────────────── */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg
                            flex items-center justify-center
                            group-hover:bg-primary-700 transition-colors">
              <Heart size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl text-secondary-900">
              Medi<span className="text-primary-600">Connect</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ─────────────────── */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/doctors"
              className="text-sm font-medium text-secondary-600
                         hover:text-secondary-900 transition-colors"
            >
              Find Doctors
            </Link>

            {isAuthenticated ? (
              // Already logged in — show Go to Dashboard
              <button
                onClick={() => navigate(getDashboardPath())}
                className="btn-primary btn-sm"
              >
                Go to Dashboard
              </button>
            ) : (
              // Not logged in — show Login + Register
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-secondary-600
                             hover:text-secondary-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary btn-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ──────────────────── */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-secondary-500
                       hover:bg-secondary-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>

        {/* ── Mobile Menu ───────────────────────── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-secondary-200 py-3 space-y-1">
            <Link
              to="/doctors"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium
                         text-secondary-600 hover:bg-secondary-50
                         transition-colors"
            >
              Find Doctors
            </Link>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  navigate(getDashboardPath());
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md
                           text-sm font-medium text-primary-600
                           hover:bg-primary-50 transition-colors"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm
                             font-medium text-secondary-600
                             hover:bg-secondary-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm
                             font-medium text-primary-600
                             hover:bg-primary-50 transition-colors"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
