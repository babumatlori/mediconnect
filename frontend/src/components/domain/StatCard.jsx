import { cn } from '../../utils/cn';

/**
 * StatCard — dashboard statistic display.
 *
 * Used in patient/doctor dashboards to show
 * key numbers at a glance.
 *
 * Props:
 * - title: string — "Upcoming Appointments"
 * - value: string|number — "3"
 * - icon: JSX — Lucide icon
 * - iconBg: string — Tailwind bg class
 * - iconColor: string — Tailwind text class
 * - trend: string — optional "+2 this week"
 */
export default function StatCard({
  title,
  value,
  icon,
  iconBg = 'bg-primary-50',
  iconColor = 'text-primary-600',
  trend,
  className,
}) {
  return (
    <div className={cn('card', className)}>
      <div className="flex items-start justify-between">

        {/* Text content */}
        <div>
          <p className="text-sm font-medium text-secondary-500">
            {title}
          </p>
          <p className="text-3xl font-bold text-secondary-900 mt-1">
            {value}
          </p>
          {trend && (
            <p className="text-xs text-secondary-400 mt-1">
              {trend}
            </p>
          )}
        </div>

        {/* Icon */}
        <div className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center',
          iconBg
        )}>
          <span className={iconColor}>{icon}</span>
        </div>

      </div>
    </div>
  );
}
