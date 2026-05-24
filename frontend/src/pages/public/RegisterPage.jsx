import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Stethoscope } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../api/authApi';
import { ROLES, SPECIALIZATIONS } from '../../utils/constants';
import { cn } from '../../utils/cn';

/**
 * Register schema.
 * WHY .superRefine for password confirm:
 * Cross-field validation (comparing two fields)
 * needs superRefine — regular .refine only works on single fields.
 */
const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  role: z.enum(['PATIENT', 'DOCTOR']),
  specialization: z.string().optional(),
}).superRefine((data, ctx) => {
  // Password match validation
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });
  }
  // Doctor must select specialization
  if (data.role === 'DOCTOR' && !data.specialization) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select your specialization',
      path: ['specialization'],
    });
  }
});

export default function RegisterPage() {
  const { login }       = useAuth();
  const { showSuccess } = useToast();
  const navigate        = useNavigate();
  const [showPassword, setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirm]  = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'PATIENT' },
  });

  // Watch role to show/hide doctor fields
  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    try {
      // Register the user
      await authApi.register({
        email:    data.email,
        password: data.password,
        role:     data.role,
      });

      // Auto-login after registration
      const loginResult = await login(data.email, data.password);

      if (!loginResult.success) {
        navigate('/login');
        return;
      }

      showSuccess('Account created successfully! Welcome to MediConnect!');

      // Redirect based on role
      if (loginResult.role === ROLES.PATIENT) {
        navigate('/patient/dashboard');
      } else if (loginResult.role === ROLES.DOCTOR) {
        navigate('/doctor/dashboard');
      }

    } catch (error) {
  // Try multiple places where backend puts error message
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.response?.data?.details ||
    error.message ||
    'Registration failed. Please try again.';

  setError('root', { message });
}
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join MediConnect and take control of your health"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* Server error */}
        {errors.root && (
          <div className="mb-4 p-3 rounded-md bg-danger-50
                          border border-danger-200 text-danger-700 text-sm">
            ⚠️ {errors.root.message}
          </div>
        )}

        {/* Role Toggle */}
        <div className="mb-5">
          <p className="label">I am a</p>
          <div className="grid grid-cols-2 gap-3">

            {/* Patient option */}
            <button
              type="button"
              onClick={() => setValue('role', 'PATIENT')}
              className={cn(
                'flex items-center justify-center gap-2 p-3 rounded-lg',
                'border-2 text-sm font-medium transition-all duration-150',
                selectedRole === 'PATIENT'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-secondary-200 text-secondary-600 hover:border-secondary-300'
              )}
            >
              <User size={18} />
              Patient
            </button>

            {/* Doctor option */}
            <button
              type="button"
              onClick={() => setValue('role', 'DOCTOR')}
              className={cn(
                'flex items-center justify-center gap-2 p-3 rounded-lg',
                'border-2 text-sm font-medium transition-all duration-150',
                selectedRole === 'DOCTOR'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-secondary-200 text-secondary-600 hover:border-secondary-300'
              )}
            >
              <Stethoscope size={18} />
              Doctor
            </button>
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <Input
            {...register('email')}
            label="Email address"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail size={16} />}
            error={errors.email?.message}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <Input
            {...register('password')}
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 6 characters"
            leftIcon={<Lock size={16} />}
            error={errors.password?.message}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <Input
            {...register('confirmPassword')}
            label="Confirm password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Repeat your password"
            leftIcon={<Lock size={16} />}
            error={errors.confirmPassword?.message}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirmPassword)}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
        </div>

        {/* Doctor — Specialization dropdown */}
        {selectedRole === 'DOCTOR' && (
          <div className="mb-4 animate-fadeIn">
            <label className="label">Specialization</label>
            <select
              {...register('specialization')}
              className={cn(
                'input',
                errors.specialization && 'input-error'
              )}
            >
              <option value="">Select your specialization</option>
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec.value} value={spec.value}>
                  {spec.label}
                </option>
              ))}
            </select>
            {errors.specialization && (
              <p className="error-text">
                {errors.specialization.message}
              </p>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="mt-6">
          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            size="lg"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-secondary-500 mt-4">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            Sign in
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
}
