import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { userApi } from '../../api/userApi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { SPECIALIZATIONS } from '../../utils/constants';

const doctorSchema = z.object({
  firstName:       z.string().min(1, 'First name is required'),
  lastName:        z.string().min(1, 'Last name is required'),
  phone:           z.string().optional(),
  specialization:  z.string().min(1, 'Specialization is required'),
  qualification:   z.string().optional(),
  experienceYears: z.coerce.number().min(0).optional(),
  bio:             z.string().optional(),
  consultationFee: z.coerce.number().min(0).optional(),
});

export default function DoctorProfile() {
  const { user }           = useAuth();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading]      = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(doctorSchema) });

  useEffect(() => {
    if (!user?.id) return;
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await userApi.getDoctorById(user.id);
      reset(res.data);
    } catch {
      // Profile may not exist yet — that's OK
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await userApi.updateDoctor(user.id, data);
      showSuccess('Profile updated successfully!');
    } catch {
      showError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card animate-pulse space-y-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton h-10 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-50 rounded-xl
                        flex items-center justify-center">
          <User size={20} className="text-primary-600" />
        </div>
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">
            Update your professional information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card space-y-4 mb-4">

          <h2 className="section-title mb-0">Personal Information</h2>

          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register('firstName')}
              label="First Name"
              placeholder="John"
              error={errors.firstName?.message}
            />
            <Input
              {...register('lastName')}
              label="Last Name"
              placeholder="Smith"
              error={errors.lastName?.message}
            />
          </div>

          <Input
            {...register('phone')}
            label="Phone Number"
            placeholder="+91 9876543210"
            error={errors.phone?.message}
          />

          <div>
            <label className="label">Specialization</label>
            <select
              {...register('specialization')}
              className="input"
            >
              <option value="">Select specialization</option>
              {SPECIALIZATIONS.map(s => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {errors.specialization && (
              <p className="error-text">
                {errors.specialization.message}
              </p>
            )}
          </div>

        </div>

        <div className="card space-y-4 mb-4">
          <h2 className="section-title mb-0">
            Professional Information
          </h2>

          <Input
            {...register('qualification')}
            label="Qualification"
            placeholder="MBBS, MD Cardiology"
            error={errors.qualification?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register('experienceYears')}
              label="Experience (years)"
              type="number"
              min="0"
              placeholder="10"
              error={errors.experienceYears?.message}
            />
            <Input
              {...register('consultationFee')}
              label="Consultation Fee (₹)"
              type="number"
              min="0"
              placeholder="500"
              error={errors.consultationFee?.message}
            />
          </div>

          <div>
            <label className="label">Bio</label>
            <textarea
              {...register('bio')}
              rows={4}
              placeholder="Tell patients about your experience and expertise..."
              className="input resize-none"
            />
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isSubmitting}
        >
          <Save size={18} />
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </div>
  );
}
