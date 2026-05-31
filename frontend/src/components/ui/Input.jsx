import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { AlertCircle } from "lucide-react";

const Input = forwardRef(function Input(
    { label, error, leftIcon, rightIcon, className, id, ...rest}, ref
) {
    const inputId = id || rest.name;

    return (
        <div className="w-full">
            {/* label */}
            {label && (
                <label htmlFor={inputId} className="label">
                    {label}
                </label>
            )}

            {/* input wrapper for icon positioning */}
            <div className="relative">

                {/* left icon */}
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none">
                        {leftIcon}
                    </div>
                )}

                {/* actual input */}
                <input ref={ref}
                id={inputId}
                className={cn(
                    'input',
                    leftIcon && 'pl-10',
                    rightIcon && 'pr-10',
                    error && 'input-error',
                    className
                )}
                {...rest}
                />

                {/* right icon */}
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">
                        {rightIcon}
                    </div>
                )}
            </div>

            {/* Error message */}
            {error && (
                <p className="error-text">
                    <AlertCircle size={12} />
                    {error}
                </p>
            )}
        </div>
    );
});

export default Input;
