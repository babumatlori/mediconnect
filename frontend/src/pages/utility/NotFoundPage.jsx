import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center
                    justify-center p-4">
      <div className="text-center max-w-md">

        {/* 404 number */}
        <p className="text-8xl font-bold text-secondary-200 mb-4">
          404
        </p>

        <h1 className="text-2xl font-bold text-secondary-900 mb-2">
          Page not found
        </h1>
        <p className="text-secondary-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex gap-3 justify-center">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
          <Button onClick={() => navigate('/')}>
            <Home size={16} />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
