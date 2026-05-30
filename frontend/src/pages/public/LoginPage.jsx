import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { ROLES } from '../../utils/constants';
// import { cn } from '../../utils/cn';

/**
 * Zod validation schema for login form.
 *
 * WHY Zod:
 * Type-safe validation that works with TypeScript too.
 * Descriptive error messages out of the box.
 * Works perfectly with React Hook Form via zodResolver.
 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const { login }        = useAuth();
  const { showSuccess }  = useToast();
  const navigate         = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  /**
   * React Hook Form setup.
   *
   * register: connects input to RHF
   * handleSubmit: wraps our submit function, runs validation first
   * formState.errors: validation error messages
   * formState.isSubmitting: true while async submit runs
   * setError: manually set server-side errors
   */
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  /**
   * Form submit handler.
   * Only called if validation passes.
   */
  const onSubmit = async (data) => {
  try {

    const result = await login(
      data.email,
      data.password
    );

    if (!result.success) {
      setError('root', {
        message: result.message,
      });
      return;
    }

    showSuccess('Welcome back!');

    // Redirect by role
    if (result.role === ROLES.PATIENT) {
      navigate('/patient/dashboard');

    } else if (result.role === ROLES.DOCTOR) {
      navigate('/doctor/dashboard');

    } else if (result.role === ROLES.ADMIN) {
      navigate('/admin/dashboard');
    }

  } catch (error) {

    setError('root', {
      message: 'Something went wrong' + error,
    });
  }
};

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your MediConnect account"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* Server-side error banner */}
        {errors.root && (
          <div className="mb-4 p-3 rounded-md bg-danger-50
                          border border-danger-200 text-danger-700
                          text-sm flex items-center gap-2">
            <span>⚠️</span>
            {errors.root.message}
          </div>
        )}

        {/* Email field */}
        <div className="mb-4">
          <Input
            {...register('email')}
            label="Email address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            leftIcon={<Mail size={16} />}
            error={errors.email?.message}
          />
        </div>

        {/* Password field */}
        <div className="mb-6">
          <Input
            {...register('password')}
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            autoComplete="current-password"
            leftIcon={<Lock size={16} />}
            error={errors.password?.message}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-secondary-400 hover:text-secondary-600
                           transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword
                  ? <EyeOff size={16} />
                  : <Eye size={16} />
                }
              </button>
            }
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          fullWidth
          loading={isSubmitting}
          size="lg"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>

        {/* Register link */}
        <p className="text-center text-sm text-secondary-500 mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            Create account
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
}
