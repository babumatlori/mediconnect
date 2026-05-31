import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { userApi } from '../../api/userApi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const patientSchema = z.object({
  firstName:   z.string().min(1, 'First name is required'),
  lastName:    z.string().min(1, 'Last name is required'),
  phone:       z.string().optional(),
  dateOfBirth: z.string().optional(),
  bloodGroup:  z.string().optional(),
  address:     z.string().optional(),
});

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function PatientProfile() {
  const { user }           = useAuth();
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(patientSchema) });

  useEffect(() => {
    if (!user?.id) return;
    userApi.getPatient(user.id)
      .then(res => reset(res.data))
      .catch(() => {}); // Profile may not exist yet
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      await userApi.updatePatient(user.id, {
        ...data,
        email: user.email,
      });
      showSuccess('Profile updated successfully!');
    } catch {
      showError('Failed to update profile');
    }
  };

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
            Update your personal information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card space-y-4 mb-4">

          <h2 className="section-title mb-0">Personal Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register('firstName')}
              label="First Name"
              placeholder="Babu"
              error={errors.firstName?.message}
            />
            <Input
              {...register('lastName')}
              label="Last Name"
              placeholder="Matlori"
              error={errors.lastName?.message}
            />
          </div>

          <Input
            {...register('phone')}
            label="Phone Number"
            placeholder="+91 9876543210"
          />

          <Input
            {...register('dateOfBirth')}
            label="Date of Birth"
            type="date"
          />

          <div>
            <label className="label">Blood Group</label>
            <select {...register('bloodGroup')} className="input">
              <option value="">Select blood group</option>
              {BLOOD_GROUPS.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Address</label>
            <textarea
              {...register('address')}
              rows={3}
              placeholder="Your address..."
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
