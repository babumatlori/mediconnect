import { useEffect, useState, useCallback } from 'react';
import {
  Users, UserCheck,
  Activity, TrendingUp
} from 'lucide-react';
import { userApi } from '../../api/userApi';
import { useToast } from '../../hooks/useToast';
import StatCard from '../../components/domain/StatCard';
import SkeletonCard from '../../components/ui/SkeletonCard';

export default function AdminDashboard() {
  const { showError } = useToast();

  const [doctors, setDoctors]   = useState([]);
  const [loading, setLoading]   = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userApi.getDoctors();
      setDoctors(res.data || []);
    } catch {
      showError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const availableDoctors = doctors.filter(d => d.isAvailable);

  return (
    <div className="animate-fadeIn">

      {/* Header */}
      <div className="mb-6">
        <h1 className="page-title">Platform Overview</h1>
        <p className="page-subtitle">
          MediConnect admin dashboard
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Doctors"
            value={doctors.length}
            icon={<Users size={20} />}
            iconBg="bg-primary-50"
            iconColor="text-primary-600"
          />
          <StatCard
            title="Available Doctors"
            value={availableDoctors.length}
            icon={<UserCheck size={20} />}
            iconBg="bg-success-50"
            iconColor="text-success-600"
          />
          <StatCard
            title="Specializations"
            value={new Set(doctors.map(d => d.specialization)).size}
            icon={<Activity size={20} />}
            iconBg="bg-ai-50"
            iconColor="text-ai-600"
          />
          <StatCard
            title="Platform Status"
            value="Live"
            icon={<TrendingUp size={20} />}
            iconBg="bg-warning-50"
            iconColor="text-warning-600"
          />
        </div>
      )}

      {/* Doctors by Specialization */}
      {!loading && doctors.length > 0 && (
        <div className="card">
          <h2 className="section-title">Doctors by Specialization</h2>
          <div className="space-y-3">
            {Object.entries(
              doctors.reduce((acc, doc) => {
                const spec = doc.specialization || 'Unknown';
                acc[spec] = (acc[spec] || 0) + 1;
                return acc;
              }, {})
            )
            .sort((a, b) => b[1] - a[1])
            .map(([spec, count]) => (
              <div key={spec} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary-700 font-medium">
                      {spec}
                    </span>
                    <span className="text-secondary-500">
                      {count} doctor{count > 1 ? 's' : ''}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-secondary-100 rounded-full">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{
                        width: `${(count / doctors.length) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
