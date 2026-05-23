import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';
import DashboardLayout from '../components/layout/DashboardLayout';

const PageSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-secondary-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-sm text-secondary-500">Loading...</p>
    </div>
  </div>
);

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
    <Suspense fallback={<PageSpinner />}>
      <Routes>

        {/* ── Public Routes — no layout wrapper ── */}
        <Route path="/"            element={<LandingPage />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/register"    element={<RegisterPage />} />
        <Route path="/doctors"     element={<DoctorDirectory />} />
        <Route path="/doctors/:id" element={<DoctorPublicProfile />} />

        {/* ── Patient Routes — inside DashboardLayout ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleGuard allowedRole="PATIENT" />}>
            {/*
              DashboardLayout wraps all patient pages.
              Sidebar + Navbar render once.
              Each child page renders inside <Outlet />.
            */}
            <Route element={<DashboardLayout />}>
              <Route path="/patient/dashboard"     element={<PatientDashboard />} />
              <Route path="/patient/book"          element={<BookAppointment />} />
              <Route path="/patient/appointments"  element={<MyAppointments />} />
              <Route path="/patient/profile"       element={<PatientProfile />} />
              <Route path="/patient/ai/symptoms"   element={<SymptomChecker />} />
              <Route path="/patient/ai/reports"    element={<ReportSummarizer />} />
              <Route path="/patient/notifications" element={<Notifications />} />
            </Route>
          </Route>
        </Route>

        {/* ── Doctor Routes — inside DashboardLayout ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleGuard allowedRole="DOCTOR" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/doctor/dashboard"    element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
              <Route path="/doctor/availability" element={<DoctorAvailability />} />
              <Route path="/doctor/profile"      element={<DoctorProfile />} />
            </Route>
          </Route>
        </Route>

        {/* ── Admin Routes — inside DashboardLayout ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleGuard allowedRole="ADMIN" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users"     element={<ManageUsers />} />
            </Route>
          </Route>
        </Route>

        {/* ── Utility Routes ── */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/404"          element={<NotFoundPage />} />
        <Route path="*"             element={<Navigate to="/404" replace />} />

      </Routes>
    </Suspense>
  );
}
