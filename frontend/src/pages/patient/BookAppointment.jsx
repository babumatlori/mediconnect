import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { userApi } from '../../api/userApi';
import { appointmentApi } from '../../api/appointmentApi';
import DoctorCard from '../../components/domain/DoctorCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { SPECIALIZATIONS } from '../../utils/constants';
import { toApiDate } from '../../utils/formatDate';
import { cn } from '../../utils/cn';

/**
 * Step indicator at the top of the booking flow.
 */
function StepIndicator({ currentStep, steps }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const stepNum  = index + 1;
        const isDone   = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={step} className="flex items-center">

            {/* Circle */}
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center',
              'text-sm font-semibold transition-all duration-200',
              isDone   && 'bg-success-500 text-white',
              isActive && 'bg-primary-600 text-white',
              !isDone && !isActive && 'bg-secondary-200 text-secondary-500'
            )}>
              {isDone ? <Check size={16} /> : stepNum}
            </div>

            {/* Label */}
            <span className={cn(
              'hidden sm:block ml-2 text-xs font-medium',
              isActive ? 'text-primary-600' : 'text-secondary-400'
            )}>
              {step}
            </span>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className={cn(
                'w-12 sm:w-20 h-0.5 mx-2',
                stepNum < currentStep
                  ? 'bg-success-500'
                  : 'bg-secondary-200'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const STEPS = ['Doctor', 'Date', 'Slot', 'Confirm'];

export default function BookAppointment() {
  const { user }           = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate           = useNavigate();
  const location = useLocation();

  const [currentStep, setCurrentStep]         = useState(1);
  const [doctors, setDoctors]                 = useState([]);
  const [loadingDoctors, setLoadingDoctors]   = useState(true);
  const [slots, setSlots]                     = useState([]);
  const [loadingSlots, setLoadingSlots]       = useState(false);
  const [booking, setBooking]                 = useState(false);
  const [filterSpec, setFilterSpec]           = useState(
    () => new URLSearchParams(location.search).get('specialization') || ''
  );
  const [searchTerm, setSearchTerm]           = useState('');

  // Booking state
  const [selectedDoctor, setSelectedDoctor]   = useState(null);
  const [selectedDate, setSelectedDate]       = useState('');
  const [selectedSlot, setSelectedSlot]       = useState('');
  const [reason, setReason]                   = useState('');


  useEffect(() => {
    let cancelled = false;
    userApi.getDoctors()
      .then(res => { if (!cancelled) setDoctors(res.data || []); })
      .catch(() => { if (!cancelled) showError('Failed to load doctors'); })
      .finally(() => { if (!cancelled) setLoadingDoctors(false); });
    return () => { cancelled = true; };
  }, [showError]);

  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;
    let cancelled = false;
    appointmentApi.getSlots(selectedDoctor.id, selectedDate)
      .then(res => { if (!cancelled) { setSlots(res.data || []); setLoadingSlots(false); } })
      .catch(() => { if (!cancelled) { showError('Failed to load available slots'); setLoadingSlots(false); } });
    return () => { cancelled = true; };
  }, [selectedDoctor, selectedDate, showError]);

 const handleBooking = async () => {
  console.log("BUTTON CLICKED");

  console.log("USER:", user);

  if (!user?.id) {
    console.log("NO USER ID");
    return;
  }

  setBooking(true);

  console.log({
    patientId: user.id,
    doctorId: selectedDoctor.id,
    appointmentDate: selectedDate,
    startTime: selectedSlot,
    reason,
  });

  try {
    const response = await appointmentApi.book({
      patientId: Number(user.id),
      doctorId: Number(selectedDoctor.id),
      appointmentDate: selectedDate,
      startTime: selectedSlot,
      reason: reason || 'General consultation',
    });

    console.log("BOOKING RESPONSE:", response);

    showSuccess('Appointment booked successfully!');
    navigate('/patient/appointments');

  } catch (err) {
    console.log("BOOKING ERROR:", err);
    console.log("ERROR RESPONSE:", err.response);

    showError(
      err.response?.data?.message ||
      'Booking failed. Slot may no longer be available.'
    );
  } finally {
    setBooking(false);
  }
};

  // Filter doctors by search + specialization
  const filteredDoctors = doctors.filter(doc => {
    const name = `${doc.firstName} ${doc.lastName}`.toLowerCase();
    const matchSearch = !searchTerm ||
      name.includes(searchTerm.toLowerCase());
    const matchSpec = !filterSpec ||
      doc.specialization === filterSpec;
    return matchSearch && matchSpec;
  });

  // Min date = today
  const today = toApiDate(new Date());

  return (
    <div className="animate-fadeIn max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="page-title">Book Appointment</h1>
        <p className="page-subtitle">
          Follow the steps to schedule your appointment
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} steps={STEPS} />

      {/* ── STEP 1: Choose Doctor ─────────────────── */}
      {currentStep === 1 && (
        <div>
          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <input
              type="text"
              placeholder="Search by doctor name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input flex-1"
            />
            <select
              value={filterSpec}
              onChange={e => setFilterSpec(e.target.value)}
              className="input sm:w-56"
            >
              <option value="">All Specializations</option>
              {SPECIALIZATIONS.map(s => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor Grid */}
          {loadingDoctors ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filteredDoctors.length === 0 ? (
            <EmptyState
              title="No doctors found"
              description="Try adjusting your search or filter"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredDoctors.map(doctor => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  selectable
                  selected={selectedDoctor?.id === doctor.id}
                  onSelect={(doc) => {
                    setSelectedDoctor(doc);
                    setSelectedSlot('');
                    setSlots([]);
                    setLoadingSlots(true);
                  }}
                />
              ))}
            </div>
          )}

          {/* Next button */}
          <div className="flex justify-end mt-6">
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!selectedDoctor}
            >
              Next: Choose Date
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Choose Date ───────────────────── */}
      {currentStep === 2 && (
        <div className="card max-w-sm mx-auto">
          <h2 className="section-title">Select Date</h2>

          {/* Selected doctor summary */}
          <div className="flex items-center gap-3 p-3 bg-primary-50
                          rounded-lg mb-5">
            <div className="w-10 h-10 bg-primary-100 rounded-lg
                            flex items-center justify-center">
              <span className="text-primary-600 font-bold">
                {selectedDoctor?.firstName?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm text-secondary-900">
                Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}
              </p>
              <p className="text-xs text-secondary-500">
                {selectedDoctor?.specialization}
              </p>
            </div>
          </div>

          {/* Date input */}
          <div className="mb-6">
            <label className="label">Appointment Date</label>
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={e => {
                setSelectedDate(e.target.value);
                setSelectedSlot('');
                setSlots([]);
                setLoadingSlots(true);
              }}
              className="input"
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={() => setCurrentStep(1)}
            >
              <ChevronLeft size={16} />
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={!selectedDate}
            >
              Next: Choose Slot
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Choose Time Slot ──────────────── */}
      {currentStep === 3 && (
        <div className="card">
          <h2 className="section-title">
            Available Slots — {selectedDate}
          </h2>

          {loadingSlots ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="skeleton h-10 rounded-md" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <EmptyState
              title="No slots available"
              description="Please choose a different date"
              action={{
                label: 'Change Date',
                onClick: () => setCurrentStep(2)
              }}
            />
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
                {slots.map(slot => {
                  // Format slot for display: "09:00" → "9:00 AM"
                  const [h, m] = slot.split(':');
                  const hour   = parseInt(h);
                  const ampm   = hour >= 12 ? 'PM' : 'AM';
                  const h12    = hour > 12 ? hour - 12 : hour || 12;
                  const label  = `${h12}:${m} ${ampm}`;

                  return (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={cn(
                        'py-2.5 px-3 rounded-md text-sm font-medium',
                        'border transition-all duration-150',
                        selectedSlot === slot
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-secondary-700 border-secondary-200 hover:border-primary-400'
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setCurrentStep(2)}>
                  <ChevronLeft size={16} />
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(4)}
                  disabled={!selectedSlot}
                >
                  Next: Confirm
                  <ChevronRight size={16} />
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── STEP 4: Confirm Booking ───────────────── */}
      {currentStep === 4 && (
        <div className="card max-w-sm mx-auto">
          <h2 className="section-title">Confirm Appointment</h2>

          {/* Summary */}
          <div className="space-y-3 mb-6">
            {[
              { label: 'Doctor', value: `Dr. ${selectedDoctor?.firstName} ${selectedDoctor?.lastName}` },
              { label: 'Specialization', value: selectedDoctor?.specialization },
              { label: 'Date', value: selectedDate },
              { label: 'Time', value: selectedSlot },
              { label: 'Fee', value: selectedDoctor?.consultationFee ? `₹${selectedDoctor.consultationFee}` : 'N/A' },
            ].map(item => (
              <div
                key={item.label}
                className="flex justify-between py-2 border-b border-secondary-100 text-sm"
              >
                <span className="text-secondary-500">{item.label}</span>
                <span className="font-medium text-secondary-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Reason textarea */}
          <div className="mb-6">
            <label className="label">
              Reason for visit (optional)
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Describe your symptoms or reason..."
              rows={3}
              className="input resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              fullWidth
              size="lg"
              loading={booking}
              onClick={handleBooking}
            >
              {booking ? 'Booking...' : 'Confirm Appointment'}
            </Button>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => setCurrentStep(3)}
              disabled={booking}
            >
              <ChevronLeft size={16} />
              Back
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
