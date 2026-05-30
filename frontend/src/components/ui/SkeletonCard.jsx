/**
 * SkeletonCard — loading placeholder.
 *
 * Shown while API data is loading.
 * Mimics the shape of a real card.
 * Gives users visual feedback that content is coming.
 */
export default function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card animate-pulse">
      {/* Avatar + title row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
      {/* Content lines */}
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton h-3 mb-2 ${
            i === lines - 1 ? 'w-2/3' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}
