import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * AuthLayout — wrapper for Login and Register pages.
 *
 * Structure:
 * ┌─────────────────────────────────────────┐
 * │ Full screen gradient background         │
 * │                                         │
 * │         ┌─────────────────┐             │
 * │         │  Logo           │             │
 * │         │  Title          │             │
 * │         │                 │             │
 * │         │  {children}     │             │
 * │         │  (form goes here│             │
 * │         └─────────────────┘             │
 * └─────────────────────────────────────────┘
 *
 * Props:
 * - title: string — "Sign in to your account"
 * - subtitle: string — "Don't have an account? Register"
 * - children: JSX — the actual form
 */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900
                flex flex-col items-center justify-center p-4">

      {/* Card */}
      <div className="w-full max-w-md">

        {/* Logo — links back to landing page */}
        <Link
          to="/"
          className="flex items-center justify-center gap-2 mb-8 group"
        >
          <div className="w-10 h-10 bg-primary-600 rounded-xl
                          flex items-center justify-center
                          group-hover:bg-primary-500 transition-colors">
            <Heart size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">
            Medi<span className="text-primary-400">Connect</span>
          </span>
        </Link>

        {/* White card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* Title */}
          {title && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-secondary-500 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Page content (Login form or Register form) */}
          {children}

        </div>

        {/* Footer */}
  <p className="text-center text-white text-xs mt-6">
    © 2026 MediConnect. All rights reserved.
  </p>
      </div>
    </div>
  );
}
