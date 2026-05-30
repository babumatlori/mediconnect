import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, CheckCircle, Clock, ChevronRight
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
import { toApiDate } from '../../utils/formatDate';

export default function DoctorDashboard() {
  const { user }           = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate           = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);

  const loadAppointments = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await appointmentApi
          .getDoctorAppointments(user.id);
      setAppointments(res.data || []);
    } catch {
      showError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, [user, showError]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleComplete = async (id) => {
    try {
      await appointmentApi.complete(id, '');
      showSuccess('Appointment marked as complete');
      loadAppointments();
    } catch {
      showError('Failed to update appointment');
    }
  };

  // Today's appointments
  const today = toApiDate(new Date());
  const todayAppointments = appointments.filter(
    a => a.appointmentDate === today &&
         a.status === APPOINTMENT_STATUS.CONFIRMED
  );

  const upcoming = appointments.filter(
    a => a.status === APPOINTMENT_STATUS.CONFIRMED ||
         a.status === APPOINTMENT_STATUS.PENDING
  );

  const completed = appointments.filter(
    a => a.status === APPOINTMENT_STATUS.COMPLETED
  );

  const firstName = user?.email?.split('@')[0] || 'Doctor';

  return (
    <div className="animate-fadeIn">

      {/* Welcome */}
      <div className="mb-6">
        <h1 className="page-title">
          Good day, Dr. {firstName}! 👨‍⚕️
        </h1>
        <p className="page-subtitle">
          {todayAppointments.length > 0
            ? `You have ${todayAppointments.length} appointment${todayAppointments.length > 1 ? 's' : ''} today`
            : 'No appointments scheduled for today'
          }
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Today"
          value={todayAppointments.length}
          icon={<Calendar size={20} />}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
          trend="Scheduled today"
        />
        <StatCard
          title="Upcoming"
          value={upcoming.length}
          icon={<Clock size={20} />}
          iconBg="bg-warning-50"
          iconColor="text-warning-600"
          trend="Total pending"
        />
        <StatCard
          title="Completed"
          value={completed.length}
          icon={<CheckCircle size={20} />}
          iconBg="bg-success-50"
          iconColor="text-success-600"
          trend="All time"
        />
      </div>

      {/* Today's Schedule */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">
            Today's Schedule
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/doctor/appointments')}
          >
            View all
            <ChevronRight size={14} />
          </Button>
        </div>

        {loading && (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!loading && todayAppointments.length === 0 && (
          <EmptyState
            icon={<Calendar size={28} />}
            title="No appointments today"
            description="Your schedule is clear for today"
          />
        )}

        {!loading && todayAppointments.length > 0 && (
          <div className="space-y-3">
            {todayAppointments.map(appt => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                onComplete={handleComplete}
                role="DOCTOR"
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/doctor/appointments')}
          className="card-hover flex items-center gap-4 text-left"
        >
          <div className="w-11 h-11 bg-primary-50 rounded-xl
                          flex items-center justify-center shrink-0">
            <Calendar size={20} className="text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-secondary-900 text-sm">
              All Appointments
            </p>
            <p className="text-xs text-secondary-500">
              View and manage schedule
            </p>
          </div>
        </button>

        <button
          onClick={() => navigate('/doctor/availability')}
          className="card-hover flex items-center gap-4 text-left"
        >
          <div className="w-11 h-11 bg-success-50 rounded-xl
                          flex items-center justify-center shrink-0">
            <Clock size={20} className="text-success-600" />
          </div>
          <div>
            <p className="font-semibold text-secondary-900 text-sm">
              Set Availability
            </p>
            <p className="text-xs text-secondary-500">
              Manage working hours
            </p>
          </div>
        </button>
      </div>

    </div>
  );
}
