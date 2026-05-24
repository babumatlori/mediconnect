import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { appointmentApi } from '../../api/appointmentApi';
import AppointmentCard from '../../components/domain/AppointmentCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { cn } from '../../utils/cn';

const FILTERS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

export default function MyAppointments() {
  const { user }           = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate           = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    if (!user?.id) return;
    console.log(user);
    console.log(user.id);
    loadAppointments();
  }, [user]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentApi.getPatientAppointments(user.id);
      setAppointments(res.data || []);
    } catch {
      showError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await appointmentApi.cancel(id);
      showSuccess('Appointment cancelled');
      loadAppointments();
    } catch {
      showError('Failed to cancel appointment');
    }
  };

  // Filter logic
  const filtered = appointments.filter(a => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Upcoming')
      return a.status === APPOINTMENT_STATUS.CONFIRMED ||
             a.status === APPOINTMENT_STATUS.PENDING;
    if (activeFilter === 'Completed')
      return a.status === APPOINTMENT_STATUS.COMPLETED;
    if (activeFilter === 'Cancelled')
      return a.status === APPOINTMENT_STATUS.CANCELLED;
    return true;
  });

  return (
    <div className="animate-fadeIn">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">My Appointments</h1>
          <p className="page-subtitle">
            {appointments.length} total appointments
          </p>
        </div>
        <Button onClick={() => navigate('/patient/book')}>
          Book New
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {FILTERS.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap',
              'transition-all duration-150',
              activeFilter === filter
                ? 'bg-primary-600 text-white'
                : 'bg-white text-secondary-600 border border-secondary-200 hover:border-primary-300'
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <EmptyState
          icon={<Calendar size={28} />}
          title="No appointments found"
          description={
            activeFilter === 'All'
              ? 'Book your first appointment to get started'
              : `No ${activeFilter.toLowerCase()} appointments`
          }
          action={
            activeFilter === 'All'
              ? { label: 'Book Appointment', onClick: () => navigate('/patient/book') }
              : undefined
          }
        />
      )}

      {/* List */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(appt => (
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
  );
}
