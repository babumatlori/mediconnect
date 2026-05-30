import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock,
  Stethoscope, Award, Calendar
} from 'lucide-react';
import { userApi } from '../../api/userApi';
import { useAuth } from '../../hooks/useAuth';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import SkeletonCard from '../../components/ui/SkeletonCard';
import { SPECIALIZATIONS, ROLES } from '../../utils/constants';

export default function DoctorPublicProfile() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuth();

  const [doctor, setDoctor]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    userApi.getDoctorById(id)
      .then(res => setDoctor(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const specLabel = SPECIALIZATIONS.find(
    s => s.value === doctor?.specialization
  )?.label || doctor?.specialization;

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === ROLES.PATIENT) {
      navigate(`/patient/book?doctorId=${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <PublicNavbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-secondary-500
                     hover:text-secondary-700 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Doctors
        </button>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            <SkeletonCard lines={5} />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="card text-center py-12">
            <p className="text-secondary-500">Doctor not found</p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => navigate('/doctors')}
            >
              Browse All Doctors
            </Button>
          </div>
        )}

        {/* Doctor Info */}
        {doctor && !loading && (
          <div className="space-y-4">

            {/* Header Card */}
            <div className="card">
              <div className="flex items-start gap-5">

                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-primary-100
                                flex items-center justify-center shrink-0">
                  <span className="text-primary-600 text-3xl font-bold">
                    {doctor.firstName?.charAt(0) || 'D'}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-secondary-900">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h1>
                  <Badge variant="primary" className="mt-1 mb-3">
                    {specLabel}
                  </Badge>

                  <div className="flex flex-wrap gap-4 text-sm text-secondary-500">
                    {doctor.experienceYears && (
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {doctor.experienceYears} years experience
                      </div>
                    )}
                    {doctor.qualification && (
                      <div className="flex items-center gap-1.5">
                        <Award size={14} />
                        {doctor.qualification}
                      </div>
                    )}
                    {doctor.consultationFee && (
                      <div className="flex items-center gap-1.5">
                        <span>₹{doctor.consultationFee} per visit</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {doctor.bio && (
              <div className="card">
                <h2 className="section-title">About</h2>
                <p className="text-secondary-600 text-sm leading-relaxed">
                  {doctor.bio}
                </p>
              </div>
            )}

            {/* Specialization info */}
            <div className="card">
              <h2 className="section-title">Specialization</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl
                                flex items-center justify-center">
                  <Stethoscope size={18} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-900">
                    {specLabel}
                  </p>
                  <p className="text-xs text-secondary-500">
                    Verified Specialist
                  </p>
                </div>
              </div>
            </div>

            {/* Book CTA */}
            {user?.role === ROLES.PATIENT && (
              <Button
                fullWidth
                size="lg"
                onClick={handleBookNow}
              >
                <Calendar size={18} />
                Book Appointment with Dr. {doctor.firstName}
              </Button>
            )}

            {!user && (
              <div className="card text-center">
                <p className="text-secondary-600 mb-4">
                  Login to book an appointment
                </p>
                <Button onClick={() => navigate('/login')}>
                  Login to Book
                </Button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
