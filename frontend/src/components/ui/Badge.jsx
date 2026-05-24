import { cn } from '../../utils/cn';

/**
 * Badge — status indicator pill.
 *
 * Used for appointment status (Confirmed, Cancelled etc.)
 * and urgency levels from AI service.
 *
 * Props:
 * - variant: maps to CSS class
 * - children: text inside badge
 */
export default function Badge({ variant = 'primary', children, className }) {
  const variants = {
    success:   'badge-success',
    warning:   'badge-warning',
    danger:    'badge-danger',
    primary:   'badge-primary',
    secondary: 'badge-secondary',
    ai:        'badge-ai',
  };

  return (
    <span className={cn(variants[variant], className)}>
      {children}
    </span>
  );
}
