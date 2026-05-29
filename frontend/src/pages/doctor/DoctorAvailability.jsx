import { useCallback, useEffect, useState } from 'react';
import { Clock, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../utils/cn';
import { useAuth } from '../../hooks/useAuth';
import { appointmentApi } from '../../api/appointmentApi';

const DAYS = [
  { key: 'MON', label: 'Monday' },
  { key: 'TUE', label: 'Tuesday' },
  { key: 'WED', label: 'Wednesday' },
  { key: 'THU', label: 'Thursday' },
  { key: 'FRI', label: 'Friday' },
  { key: 'SAT', label: 'Saturday' },
  { key: 'SUN', label: 'Sunday' },
];

const DEFAULT_SCHEDULE = {
  MON: { enabled: true,  startTime: '09:00', endTime: '17:00', duration: 30 },
  TUE: { enabled: true,  startTime: '09:00', endTime: '17:00', duration: 30 },
  WED: { enabled: true,  startTime: '09:00', endTime: '17:00', duration: 30 },
  THU: { enabled: true,  startTime: '09:00', endTime: '17:00', duration: 30 },
  FRI: { enabled: true,  startTime: '09:00', endTime: '17:00', duration: 30 },
  SAT: { enabled: false, startTime: '09:00', endTime: '13:00', duration: 30 },
  SUN: { enabled: false, startTime: '09:00', endTime: '13:00', duration: 30 },
};

export default function DoctorAvailability() {
  const { showSuccess, showError } = useToast();
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [saving, setSaving]     = useState(false);
  const { user } = useAuth();

  const updateDay = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const loadAvailability = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await appointmentApi.getAvailability(user.id);
      if (res.data && res.data.lenght > 0) {
        const updated = { ...DEFAULT_SCHEDULE };
        res.data.forEach(item => {
          updated[item.dayOfWeek] = {
            enabled: item.isAvailable,
            startTime: item.startTime,
            endTime: item.endTime,
            duration: item.slotDurationMinutes,
          };
        });
        setSchedule(updated);
      }
    }catch {
      // No availability set yet use default
    }
  }, [user]);

  useEffect(() => {
    loadAvailability();

  }, [loadAvailability]);


  const handleSave = async () => {
    setSaving(true);
    try {
      await appointmentApi.saveAvailability(user.id, {
        schedule,
      });
      showSuccess('Availability saved successfully!');
    } catch {
      showError('Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-success-50 rounded-xl
                          flex items-center justify-center">
            <Clock size={20} className="text-success-600" />
          </div>
          <h1 className="page-title">My Availability</h1>
        </div>
        <p className="page-subtitle">
          Set your working hours for each day of the week.
        </p>
      </div>

      {/* Info banner */}
      <div className="p-4 bg-primary-50 border border-primary-200
                      rounded-lg mb-6 text-sm text-primary-700">
        💡 Patients can only book appointments during your available hours.
        Slots are generated every {schedule.MON.duration} minutes.
      </div>

      {/* Schedule Cards */}
      <div className="space-y-3 mb-6">
        {DAYS.map(({ key, label }) => {
          const day = schedule[key];

          return (
            <div
              key={key}
              className={cn(
                'card transition-all duration-150',
                !day.enabled && 'opacity-60'
              )}
            >
              <div className="flex items-center gap-4 flex-wrap">

                {/* Day toggle */}
                <div className="flex items-center gap-3 w-32 shrink-0">
                  <button
                    onClick={() => updateDay(key, 'enabled', !day.enabled)}
                    className={cn(
                      'relative w-10 h-5 rounded-full transition-colors duration-200',
                      day.enabled ? 'bg-primary-600' : 'bg-secondary-300'
                    )}
                    role="switch"
                    aria-checked={day.enabled}
                    aria-label={`Toggle ${label}`}
                  >
                    <div className={cn(
                      'absolute top-0.5 w-4 h-4 bg-white rounded-full',
                      'shadow transition-transform duration-200',
                      day.enabled ? 'translate-x-5' : 'translate-x-0.5'
                    )} />
                  </button>
                  <span className={cn(
                    'text-sm font-medium',
                    day.enabled ? 'text-secondary-900' : 'text-secondary-400'
                  )}>
                    {label}
                  </span>
                </div>

                {/* Time inputs */}
                {day.enabled && (
                  <div className="flex items-center gap-3 flex-wrap flex-1">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-secondary-500">From</label>
                      <input
                        type="time"
                        value={day.startTime}
                        onChange={e =>
                          updateDay(key, 'startTime', e.target.value)}
                        className="input py-1.5 w-32 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-secondary-500">To</label>
                      <input
                        type="time"
                        value={day.endTime}
                        onChange={e =>
                          updateDay(key, 'endTime', e.target.value)}
                        className="input py-1.5 w-32 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-secondary-500">Slot</label>
                      <select
                        value={day.duration}
                        onChange={e =>
                          updateDay(key, 'duration', parseInt(e.target.value))}
                        className="input py-1.5 w-24 text-sm"
                      >
                        <option value={15}>15 min</option>
                        <option value={30}>30 min</option>
                        <option value={45}>45 min</option>
                        <option value={60}>60 min</option>
                      </select>
                    </div>
                  </div>
                )}

                {!day.enabled && (
                  <span className="text-sm text-secondary-400 italic">
                    Not available
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <Button
        fullWidth
        size="lg"
        loading={saving}
        onClick={handleSave}
      >
        <Save size={18} />
        {saving ? 'Saving...' : 'Save Availability'}
      </Button>

    </div>
  );
}
