import { Calendar, Clock, User } from 'lucide-react';
import { useState } from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {  formatTime, smartDate } from '../../utils/formatDate';
import { APPOINTMENT_STATUS } from '../../utils/constants';

/**
 * Maps appointment status to badge variant.
 */
const STATUS_VARIANT = {
  CONFIRMED:  'success',
  PENDING:    'warning',
  CANCELLED:  'danger',
  COMPLETED:  'primary',
};

/**
 * AppointmentCard — displays a single appointment.
 *
 * Props:
 * - appointment: object from API
 * - onCancel: function(id) — cancel button handler
 * - onComplete: function(id) — complete button handler (doctor)
 * - showActions: boolean — show cancel/complete buttons
 * - role: 'PATIENT' | 'DOCTOR'
 */
export default function AppointmentCard({
  appointment,
  onCancel,
  onComplete,
  showActions = true,
  role = 'PATIENT',
}) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    await onCancel?.(appointment.id);
    setLoading(false);
  };

  const isCancellable =
    appointment.status === APPOINTMENT_STATUS.CONFIRMED ||
    appointment.status === APPOINTMENT_STATUS.PENDING;

  const isCompletable =
    appointment.status === APPOINTMENT_STATUS.CONFIRMED;

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">

        {/* Left content */}
        <div className="flex-1 min-w-0">

          {/* Doctor/Patient name + status */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-secondary-700">
              <User size={15} className="text-secondary-400" />
              <span className="font-medium text-sm">
                {role === 'PATIENT'
                  ? `Doctor ID: ${appointment.doctorId}`
                  : `Patient ID: ${appointment.patientId}`
                }
              </span>
            </div>
            <Badge variant={STATUS_VARIANT[appointment.status]}>
              {appointment.status}
            </Badge>
          </div>

          {/* Date + Time */}
          <div className="flex items-center gap-4 text-sm text-secondary-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{smartDate(appointment.appointmentDate)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{formatTime(appointment.startTime)}</span>
            </div>
          </div>

          {/* Reason */}
          {appointment.reason && (
            <p className="text-xs text-secondary-400 mt-2 truncate">
              Reason: {appointment.reason}
            </p>
          )}

          {/* Doctor's notes (completed appointments) */}
          {appointment.notes && (
            <p className="text-xs text-secondary-500 mt-2 bg-secondary-50
                          rounded-md px-3 py-2">
              📝 {appointment.notes}
            </p>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-col gap-2 shrink-0">
            {/* Patient: cancel button */}
            {role === 'PATIENT' && isCancellable && onCancel && (
              <Button
                variant="danger"
                size="sm"
                loading={loading}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}

            {/* Doctor: complete button */}
            {role === 'DOCTOR' && isCompletable && onComplete && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onComplete(appointment.id)}
              >
                Complete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
