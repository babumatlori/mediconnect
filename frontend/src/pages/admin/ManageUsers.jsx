import { useEffect, useState, useCallback } from 'react';
import { Search, Users } from 'lucide-react';
import { userApi } from '../../api/userApi';
import { useToast } from '../../hooks/useToast';
import SkeletonCard from '../../components/ui/SkeletonCard';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { SPECIALIZATIONS } from '../../utils/constants';

export default function ManageUsers() {
  const { showError } = useToast();

  const [doctors, setDoctors]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userApi.getDoctors();
      setDoctors(res.data || []);
    } catch {
      showError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const filtered = doctors.filter(doc => {
    const name = `${doc.firstName || ''} ${doc.lastName || ''}
                  ${doc.email || ''}`.toLowerCase();
    return !searchTerm ||
      name.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="animate-fadeIn">

      {/* Header */}
      <div className="mb-6">
        <h1 className="page-title">Manage Users</h1>
        <p className="page-subtitle">
          {doctors.length} registered doctors
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2
                     text-secondary-400"
        />
        <input
          type="text"
          placeholder="Search doctors..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="input pl-9"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <SkeletonCard key={i} lines={2} />)}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <EmptyState
          icon={<Users size={28} />}
          title="No doctors found"
          description="No doctors match your search"
        />
      )}

      {/* Table — desktop */}
      {!loading && filtered.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block card p-0 overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary-50 border-b border-secondary-200">
                <tr>
                  {['Doctor', 'Specialization', 'Experience', 'Fee', 'Status'].map(h => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold
                                 text-secondary-500 uppercase tracking-wide
                                 px-4 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {filtered.map(doc => {
                  const specLabel = SPECIALIZATIONS.find(
                    s => s.value === doc.specialization
                  )?.label || doc.specialization || '—';

                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-secondary-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full
                                          flex items-center justify-center shrink-0">
                            <span className="text-primary-600 text-sm font-semibold">
                              {doc.firstName?.charAt(0) || 'D'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-secondary-900">
                              Dr. {doc.firstName} {doc.lastName}
                            </p>
                            <p className="text-xs text-secondary-400">
                              ID: {doc.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="primary">{specLabel}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-secondary-600">
                        {doc.experienceYears
                          ? `${doc.experienceYears} yrs`
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-secondary-600">
                        {doc.consultationFee
                          ? `₹${doc.consultationFee}`
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={doc.isAvailable ? 'success' : 'secondary'}>
                          {doc.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map(doc => {
              const specLabel = SPECIALIZATIONS.find(
                s => s.value === doc.specialization
              )?.label || doc.specialization || 'Unknown';

              return (
                <div key={doc.id} className="card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl
                                    flex items-center justify-center">
                      <span className="text-primary-600 font-bold">
                        {doc.firstName?.charAt(0) || 'D'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">
                        Dr. {doc.firstName} {doc.lastName}
                      </p>
                      <Badge variant="primary" className="mt-0.5">
                        {specLabel}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-secondary-500">
                    <span>
                      {doc.experienceYears
                        ? `${doc.experienceYears} yrs exp`
                        : 'Experience N/A'}
                    </span>
                    <Badge variant={doc.isAvailable ? 'success' : 'secondary'}>
                      {doc.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
