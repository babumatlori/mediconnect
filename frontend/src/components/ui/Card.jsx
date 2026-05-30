import { cn } from '../../utils/cn';

/**
 * Card — content container.
 *
 * Props:
 * - hover: boolean — adds hover lift effect
 * - onClick: function — makes card clickable
 * - className: extra classes
 * - children: card content
 */
export default function Card({
  hover = false,
  onClick,
  className,
  children,
  ...rest
}) {
  return (
    <div
      className={cn(
        hover ? 'card-hover' : 'card',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
}
