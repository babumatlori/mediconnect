import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { appointmentApi } from '../../api/appointmentApi';
import AppointmentCard from '../../components/domain/AppointmentCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Calendar } from 'lucide-react';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { cn } from '../../utils/cn';

const FILTERS = ['All', 'Today', 'Upcoming', 'Completed', 'Cancelled'];

export default function DoctorAppointments() {
  const { user }           = useAuth();
  const { showSuccess, showError } = useToast();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [notesModal, setNotesModal]     = useState(null);
  const [notes, setNotes]               = useState('');
  const [savingNotes, setSavingNotes]   = useState(false);

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

  const handleComplete = (id) => {
    const appt = appointments.find(a => a.id === id);
    setNotesModal(appt);
    setNotes('');
  };

  const handleSaveComplete = async () => {
    if (!notesModal) return;
    setSavingNotes(true);
    try {
      await appointmentApi.complete(notesModal.id, notes);
      showSuccess('Appointment completed');
      setNotesModal(null);
      loadAppointments();
    } catch {
      showError('Failed to complete appointment');
    } finally {
      setSavingNotes(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const filtered = appointments.filter(a => {
    if (activeFilter === 'All')       return true;
    if (activeFilter === 'Today')
      return a.appointmentDate === today;
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
      <div className="mb-6">
        <h1 className="page-title">My Appointments</h1>
        <p className="page-subtitle">
          {appointments.length} total appointments
        </p>
      </div>

      {/* Filter Tabs */}
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
          description={`No ${activeFilter.toLowerCase()} appointments`}
        />
      )}

      {/* List */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(appt => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              onComplete={handleComplete}
              role="DOCTOR"
            />
          ))}
        </div>
      )}

      {/* Complete with Notes Modal */}
      <Modal
        isOpen={!!notesModal}
        onClose={() => setNotesModal(null)}
        title="Complete Appointment"
      >
        <p className="text-sm text-secondary-600 mb-4">
          Add consultation notes for Patient ID:{' '}
          <span className="font-medium">
            {notesModal?.patientId}
          </span>
        </p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add consultation notes, diagnosis, prescription..."
          rows={4}
          className="input resize-none mb-4"
        />
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setNotesModal(null)}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            loading={savingNotes}
            onClick={handleSaveComplete}
          >
            Complete Appointment
          </Button>
        </div>
      </Modal>

    </div>
  );
}
