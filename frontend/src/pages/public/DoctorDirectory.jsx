import { useEffect, useState, useCallback } from 'react';
import { Search, Filter, Users } from 'lucide-react';
import { userApi } from '../../api/userApi';
import { useToast } from '../../hooks/useToast';
import DoctorCard from '../../components/domain/DoctorCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import EmptyState from '../../components/ui/EmptyState';
import PublicNavbar from '../../components/layout/PublicNavbar';
import { SPECIALIZATIONS } from '../../utils/constants';

export default function DoctorDirectory() {
  const { showError }    = useToast();

  const [doctors, setDoctors]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpec, setFilterSpec] = useState('');

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userApi.getDoctors();
      setDoctors(res.data || []);
    } catch {
      showError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const filtered = doctors.filter(doc => {
    const name = `${doc.firstName || ''} ${doc.lastName || ''}`
      .toLowerCase();
    const matchSearch = !searchTerm ||
      name.includes(searchTerm.toLowerCase());
    const matchSpec = !filterSpec ||
      doc.specialization === filterSpec;
    return matchSearch && matchSpec;
  });

  return (
    <div className="min-h-screen bg-secondary-50">
      <PublicNavbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-secondary-900 to-primary-900
                      text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Find Your Doctor
          </h1>
          <p className="text-secondary-300">
            Browse our network of verified specialists
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2
                         text-secondary-400"
            />
            <input
              type="text"
              placeholder="Search by doctor name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input pl-9"
            />
          </div>
          <div className="relative sm:w-64">
            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2
                         text-secondary-400 pointer-events-none"
            />
            <select
              value={filterSpec}
              onChange={e => setFilterSpec(e.target.value)}
              className="input pl-9"
            >
              <option value="">All Specializations</option>
              {SPECIALIZATIONS.map(s => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-secondary-500 mb-4">
            {filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found
            {filterSpec && ` in ${SPECIALIZATIONS.find(s => s.value === filterSpec)?.label}`}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <EmptyState
            icon={<Users size={28} />}
            title="No doctors found"
            description="Try adjusting your search or filter"
            action={
              (searchTerm || filterSpec)
                ? {
                    label: 'Clear Filters',
                    onClick: () => {
                      setSearchTerm('');
                      setFilterSpec('');
                    }
                  }
                : undefined
            }
          />
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(doctor => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                selectable={false}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
