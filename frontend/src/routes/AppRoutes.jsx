import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';

/**
 * PageSpinner — shown while lazy-loaded pages load.
 * Inline here to avoid circular dependency.
 */
const PageSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-secondary-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-sm text-secondary-500">Loading...</p>
    </div>
  </div>
);

/**
 * Lazy loading — pages are loaded only when visited.
 *
 * WHY lazy load:
 * Without it, ALL pages load on initial visit.
 * Landing page would load doctor dashboard code too.
 * With lazy loading: only the current page's code loads.
 * Faster initial load, better performance.
 */

// Public pages
const LandingPage         = lazy(() => import('../pages/public/LandingPage'));
const LoginPage           = lazy(() => import('../pages/public/LoginPage'));
const RegisterPage        = lazy(() => import('../pages/public/RegisterPage'));
const DoctorDirectory     = lazy(() => import('../pages/public/DoctorDirectory'));
const DoctorPublicProfile = lazy(() => import('../pages/public/DoctorPublicProfile'));

// Patient pages
const PatientDashboard = lazy(() => import('../pages/patient/PatientDashboard'));
const BookAppointment  = lazy(() => import('../pages/patient/BookAppointment'));
const MyAppointments   = lazy(() => import('../pages/patient/MyAppointments'));
const PatientProfile   = lazy(() => import('../pages/patient/PatientProfile'));
const SymptomChecker   = lazy(() => import('../pages/patient/SymptomChecker'));
const ReportSummarizer = lazy(() => import('../pages/patient/ReportSummarizer'));
const Notifications    = lazy(() => import('../pages/patient/Notifications'));

// Doctor pages
const DoctorDashboard    = lazy(() => import('../pages/doctor/DoctorDashboard'));
const DoctorAppointments = lazy(() => import('../pages/doctor/DoctorAppointments'));
const DoctorAvailability = lazy(() => import('../pages/doctor/DoctorAvailability'));
const DoctorProfile      = lazy(() => import('../pages/doctor/DoctorProfile'));

// Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const ManageUsers    = lazy(() => import('../pages/admin/ManageUsers'));

// Utility pages
const NotFoundPage     = lazy(() => import('../pages/utility/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('../pages/utility/UnauthorizedPage'));

export default function AppRoutes() {
  return (
    /**
     * Suspense shows PageSpinner while any lazy page loads.
     * fallback is shown until the import() resolves.
     */
    <Suspense fallback={<PageSpinner />}>
      <Routes>

        {/* ── PUBLIC ROUTES ── no authentication needed ── */}
        <Route path="/"            element={<LandingPage />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/register"    element={<RegisterPage />} />
        <Route path="/doctors"     element={<DoctorDirectory />} />
        <Route path="/doctors/:id" element={<DoctorPublicProfile />} />

        {/* ── PATIENT ROUTES ── must be logged in as PATIENT ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleGuard allowedRole="PATIENT" />}>
            <Route path="/patient/dashboard"     element={<PatientDashboard />} />
            <Route path="/patient/book"          element={<BookAppointment />} />
            <Route path="/patient/appointments"  element={<MyAppointments />} />
            <Route path="/patient/profile"       element={<PatientProfile />} />
            <Route path="/patient/ai/symptoms"   element={<SymptomChecker />} />
            <Route path="/patient/ai/reports"    element={<ReportSummarizer />} />
            <Route path="/patient/notifications" element={<Notifications />} />
          </Route>
        </Route>

        {/* ── DOCTOR ROUTES ── must be logged in as DOCTOR ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleGuard allowedRole="DOCTOR" />}>
            <Route path="/doctor/dashboard"    element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            <Route path="/doctor/availability" element={<DoctorAvailability />} />
            <Route path="/doctor/profile"      element={<DoctorProfile />} />
          </Route>
        </Route>

        {/* ── ADMIN ROUTES ── must be logged in as ADMIN ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleGuard allowedRole="ADMIN" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users"     element={<ManageUsers />} />
          </Route>
        </Route>

        {/* ── UTILITY ROUTES ── */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/404"          element={<NotFoundPage />} />
        {/* Catch-all — any unknown URL goes to 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />

      </Routes>
    </Suspense>
  );
}
