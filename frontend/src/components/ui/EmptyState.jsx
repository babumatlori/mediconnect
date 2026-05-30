import { cn } from '../../utils/cn';
import Button from './Button';

/**
 * EmptyState — shown when a list has no data.
 *
 * Props:
 * - icon: JSX — illustration or icon
 * - title: string — main message
 * - description: string — helpful context
 * - action: { label, onClick } — optional CTA button
 */
export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center',
      'py-16 text-center',
      className
    )}>
      {/* Icon */}
      {icon && (
        <div className="w-16 h-16 bg-secondary-100 rounded-2xl
                        flex items-center justify-center mb-4
                        text-secondary-400">
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-base font-semibold text-secondary-900 mb-1">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-secondary-500 max-w-xs">
          {description}
        </p>
      )}

      {/* Action button */}
      {action && (
        <Button
          onClick={action.onClick}
          className="mt-5"
          size="sm"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
