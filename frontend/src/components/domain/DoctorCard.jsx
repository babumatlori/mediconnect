import { Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { SPECIALIZATIONS } from '../../utils/constants';
import { cn } from '../../utils/cn';

/**
 * DoctorCard — displays doctor info in directory/booking.
 *
 * Props:
 * - doctor: object from API
 * - onSelect: function(doctor) — called when "Select" clicked
 * - selectable: boolean — shows Select button vs View Profile
 * - selected: boolean — highlights card if selected
 */
export default function DoctorCard({
  doctor,
  onSelect,
  selectable = false,
  selected = false,
}) {
  const navigate = useNavigate();

  // Get readable specialization label
  const specLabel = SPECIALIZATIONS.find(
    s => s.value === doctor.specialization
  )?.label || doctor.specialization;

  return (
    <div className={cn(
      'card-hover',
      selected && 'border-primary-500 ring-2 ring-primary-500/20'
    )}>

      {/* Header row */}
      <div className="flex items-start gap-4 mb-4">

        {/* Avatar */}
        <div className="w-14 h-14 rounded-xl bg-primary-100
                        flex items-center justify-center shrink-0">
          <span className="text-primary-600 text-xl font-bold">
            {doctor.firstName?.charAt(0) || 'D'}
          </span>
        </div>

        {/* Name + specialization */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-secondary-900 truncate">
            Dr. {doctor.firstName} {doctor.lastName}
          </h3>
          <Badge variant="primary" className="mt-1">
            {specLabel}
          </Badge>
        </div>

        {/* Available indicator */}
        <div className={cn(
          'w-2.5 h-2.5 rounded-full shrink-0 mt-1',
          doctor.isAvailable ? 'bg-success-500' : 'bg-secondary-300'
        )} />
      </div>

      {/* Info row */}
      <div className="flex items-center gap-4 text-sm text-secondary-500 mb-4">
        {doctor.experienceYears && (
          <div className="flex items-center gap-1">
            <Clock size={13} />
            <span>{doctor.experienceYears} yrs exp</span>
          </div>
        )}
        {doctor.consultationFee && (
          <div className="flex items-center gap-1">
            <span>₹{doctor.consultationFee}/visit</span>
          </div>
        )}
      </div>

      {/* Bio */}
      {doctor.bio && (
        <p className="text-xs text-secondary-500 mb-4 line-clamp-2">
          {doctor.bio}
        </p>
      )}

      {/* Action button */}
      <div className="flex gap-2">
        {selectable ? (
          <Button
            fullWidth
            variant={selected ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => onSelect?.(doctor)}
          >
            {selected ? '✓ Selected' : 'Select Doctor'}
          </Button>
        ) : (
          <Button
            fullWidth
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/doctors/${doctor.id}`)}
          >
            View Profile
            <ChevronRight size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
