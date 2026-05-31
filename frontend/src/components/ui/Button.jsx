import { cn } from '../../utils/cn';
import Spinner from './Spinner';

export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    children,
    className,
    disabled,
    ...rest
}) {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        danger: 'btn-danger',
        ghost: 'btn-ghost',
        ai: 'btn-ai',
    };

    const sizes = {
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg',
    };

    return (
        <button
            className={cn(
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                className
            )}
            disabled={disabled || loading}
            {...rest}
        >
            {loading && (
                <Spinner size="sm" className="text-current" />
            )}

            {children}
        </button>
    );
}
