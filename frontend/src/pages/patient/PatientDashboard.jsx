import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, CalendarPlus, Stethoscope,
  FileText, Clock, CheckCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { appointmentApi } from '../../api/appointmentApi';
import StatCard from '../../components/domain/StatCard';
import AppointmentCard from '../../components/domain/AppointmentCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { APPOINTMENT_STATUS } from '../../utils/constants';

export default function PatientDashboard() {
  const { user }        = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate        = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);

// ── CORRECT ORDER ──────────────────────────────

// 1. Define the function FIRST
const loadAppointments = useCallback(async () => {
  if (!user?.id) return;
  setLoading(true);
  try {
    const res = await appointmentApi
        .getPatientAppointments(user.id);
    setAppointments(res.data || []);
  } catch {
    showError('Failed to load appointments');
  } finally {
    setLoading(false);
  }
}, [user, showError]);

// 2. Then use it in useEffect
useEffect(() => {
  loadAppointments();
}, [loadAppointments]);

  // Cancel appointment handler
  const handleCancel = async (id) => {
    try {
      await appointmentApi.cancel(id);
      showSuccess('Appointment cancelled successfully');
      loadAppointments(); // refresh list
    } catch {
      showError('Failed to cancel appointment');
    }
  };

  // Filter upcoming appointments
  const upcoming = appointments.filter(
    a => a.status === APPOINTMENT_STATUS.CONFIRMED ||
         a.status === APPOINTMENT_STATUS.PENDING
  );

  const completed = appointments.filter(
    a => a.status === APPOINTMENT_STATUS.COMPLETED
  );

  const cancelled = appointments.filter(
    a => a.status === APPOINTMENT_STATUS.CANCELLED
  );

  // Get first name from email for greeting
  const firstName = user?.email?.split('@')[0] || 'there';

  return (
    <div className="animate-fadeIn">

      {/* ── Welcome Banner ───────────────────────── */}
      <div className="mb-6">
        <h1 className="page-title">
          Good day, {firstName}! 👋
        </h1>
        <p className="page-subtitle">
          Here's an overview of your health journey.
        </p>
      </div>

      {/* ── Stats Row ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Upcoming"
          value={upcoming.length}
          icon={<Calendar size={20} />}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
          trend="Appointments scheduled"
        />
        <StatCard
          title="Completed"
          value={completed.length}
          icon={<CheckCircle size={20} />}
          iconBg="bg-success-50"
          iconColor="text-success-600"
          trend="Consultations done"
        />
        <StatCard
          title="Total"
          value={appointments.length}
          icon={<Clock size={20} />}
          iconBg="bg-secondary-100"
          iconColor="text-secondary-600"
          trend="All time"
        />
      </div>

      {/* ── Quick Actions ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        <button
          onClick={() => navigate('/patient/book')}
          className="card-hover flex items-center gap-4 text-left"
        >
          <div className="w-11 h-11 bg-primary-50 rounded-xl
                          flex items-center justify-center shrink-0">
            <CalendarPlus size={20} className="text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-secondary-900 text-sm">
              Book Appointment
            </p>
            <p className="text-xs text-secondary-500">
              Find and book a doctor
            </p>
          </div>
        </button>

        <button
          onClick={() => navigate('/patient/ai/symptoms')}
          className="card-hover flex items-center gap-4 text-left"
        >
          <div className="w-11 h-11 bg-ai-50 rounded-xl
                          flex items-center justify-center shrink-0">
            <Stethoscope size={20} className="text-ai-600" />
          </div>
          <div>
            <p className="font-semibold text-secondary-900 text-sm">
              Check Symptoms
            </p>
            <p className="text-xs text-secondary-500">
              AI-powered analysis
            </p>
          </div>
        </button>

        <button
          onClick={() => navigate('/patient/ai/reports')}
          className="card-hover flex items-center gap-4 text-left"
        >
          <div className="w-11 h-11 bg-warning-50 rounded-xl
                          flex items-center justify-center shrink-0">
            <FileText size={20} className="text-warning-600" />
          </div>
          <div>
            <p className="font-semibold text-secondary-900 text-sm">
              Summarize Report
            </p>
            <p className="text-xs text-secondary-500">
              Upload PDF for AI summary
            </p>
          </div>
        </button>

      </div>

      {/* ── Upcoming Appointments ─────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">
            Upcoming Appointments
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/patient/appointments')}
          >
            View all
          </Button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Empty state */}
        {!loading && upcoming.length === 0 && (
          <EmptyState
            icon={<Calendar size={28} />}
            title="No upcoming appointments"
            description="Book your first appointment with a doctor"
            action={{
              label: 'Book Appointment',
              onClick: () => navigate('/patient/book'),
            }}
          />
        )}

        {/* Appointment list — show max 3 */}
        {!loading && upcoming.length > 0 && (
          <div className="space-y-3">
            {upcoming.slice(0, 3).map(appt => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                onCancel={handleCancel}
                role="PATIENT"
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
