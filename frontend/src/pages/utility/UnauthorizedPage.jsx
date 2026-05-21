export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-secondary-200">403</h1>
        <p className="text-secondary-500 mt-2">You don't have permission to view this page</p>
        <a href="/" className="btn-primary mt-4 inline-block">
          Go Home
        </a>
      </div>
    </div>
  );
}
