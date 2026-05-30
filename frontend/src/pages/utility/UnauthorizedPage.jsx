import { useNavigate } from 'react-router-dom';
import { ShieldOff, Home } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center
                    justify-center p-4">
      <div className="text-center max-w-md">

        {/* Icon */}
        <div className="w-20 h-20 bg-danger-100 rounded-2xl
                        flex items-center justify-center mx-auto mb-6">
          <ShieldOff size={36} className="text-danger-500" />
        </div>

        <p className="text-6xl font-bold text-secondary-200 mb-4">
          403
        </p>
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">
          Access denied
        </h1>
        <p className="text-secondary-500 mb-8">
          You don't have permission to view this page.
          Please login with the correct account.
        </p>

        <Button onClick={() => navigate('/')}>
          <Home size={16} />
          Go to Home
        </Button>
      </div>
    </div>
  );
}
