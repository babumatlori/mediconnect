import { useState } from 'react';
import { Stethoscope, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { aiApi } from '../../api/aiApi';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { cn } from '../../utils/cn';

/**
 * Maps urgency level to badge variant and icon.
 */
const URGENCY_CONFIG = {
  HIGH:   { variant: 'danger',  label: 'High Urgency',   icon: <AlertTriangle size={14} /> },
  MEDIUM: { variant: 'warning', label: 'Medium Urgency', icon: <AlertTriangle size={14} /> },
  LOW:    { variant: 'success', label: 'Low Urgency',    icon: <CheckCircle size={14} /> },
};

/**
 * Animated typing dots — shown while AI is thinking.
 */
function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm text-secondary-500">AI is analyzing</span>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-1.5 h-1.5 bg-ai-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export default function SymptomChecker() {
  const { showError } = useToast();
  const navigate      = useNavigate();

  const [symptoms, setSymptoms] = useState('');
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      showError('Please describe your symptoms first');
      return;
    }
    if (symptoms.trim().length < 10) {
      showError('Please provide more detail about your symptoms');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await aiApi.checkSymptoms({ symptoms });
      setResult(res.data);
    } catch {
      showError('AI analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const urgencyConfig = result
    ? URGENCY_CONFIG[result.urgencyLevel] || URGENCY_CONFIG.MEDIUM
    : null;

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-ai-50 rounded-xl
                          flex items-center justify-center">
            <Stethoscope size={20} className="text-ai-600" />
          </div>
          <h1 className="page-title">AI Symptom Checker</h1>
        </div>
        <p className="page-subtitle">
          Describe your symptoms and get AI-powered analysis and doctor recommendations.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-warning-50
                      border border-warning-200 rounded-lg mb-6">
        <AlertTriangle size={18} className="text-warning-600 shrink-0 mt-0.5" />
        <p className="text-sm text-warning-700">
          This AI tool provides general information only and is not a substitute
          for professional medical advice. Always consult a qualified doctor.
        </p>
      </div>

      {/* Input Card */}
      <div className="card mb-6">
        <label className="label text-base font-semibold">
          Describe your symptoms
        </label>
        <textarea
          value={symptoms}
          onChange={e => setSymptoms(e.target.value)}
          placeholder="Example: I have been experiencing severe headache, fever of 102°F, and stiff neck for the past 2 days. I also feel sensitive to light..."
          rows={5}
          className="input resize-none mt-1 mb-4"
          disabled={loading}
        />

        {/* Character count */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-secondary-400">
            {symptoms.length} characters
            {symptoms.length < 10 && symptoms.length > 0 && (
              <span className="text-warning-500 ml-1">
                (please add more detail)
              </span>
            )}
          </span>
          {loading && <ThinkingDots />}
        </div>

        <Button
          variant="ai"
          fullWidth
          size="lg"
          loading={loading}
          onClick={handleAnalyze}
          disabled={symptoms.trim().length < 10}
        >
          <Stethoscope size={18} />
          {loading ? 'Analyzing...' : 'Analyze Symptoms'}
        </Button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fadeIn">

          {/* Urgency Level */}
          <div className={cn(
            'flex items-center justify-between p-4 rounded-lg border',
            result.urgencyLevel === 'HIGH'
              ? 'bg-danger-50 border-danger-200'
              : result.urgencyLevel === 'MEDIUM'
              ? 'bg-warning-50 border-warning-200'
              : 'bg-success-50 border-success-200'
          )}>
            <div className="flex items-center gap-2">
              {urgencyConfig?.icon}
              <span className="font-semibold text-sm">
                {urgencyConfig?.label}
              </span>
            </div>
            <Badge variant={urgencyConfig?.variant}>
              {result.urgencyLevel}
            </Badge>
          </div>

          {/* Possible Conditions */}
          {result.possibleConditions?.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-secondary-900 mb-3">
                Possible Conditions
              </h3>
              <div className="space-y-2">
                {result.possibleConditions.map((condition, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-secondary-700"
                  >
                    <div className="w-1.5 h-1.5 bg-ai-500 rounded-full shrink-0" />
                    {condition}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Doctor */}
          {result.recommendedSpecialization && (
            <div className="card border-primary-200 bg-primary-50">
              <h3 className="font-semibold text-secondary-900 mb-1">
                Recommended Specialist
              </h3>
              <p className="text-primary-700 font-medium">
                {result.recommendedSpecialization}
              </p>
            </div>
          )}

          {/* AI Advice */}
          {result.advice && (
            <div className="card">
              <h3 className="font-semibold text-secondary-900 mb-2">
                💡 AI Advice
              </h3>
              <p className="text-sm text-secondary-600 leading-relaxed">
                {result.advice}
              </p>
            </div>
          )}

          {/* Book Doctor CTA */}
          <Button
            fullWidth
            size="lg"
            onClick={() => navigate('/patient/book')}
          >
            Book a {result.recommendedSpecialization || 'Doctor'} Now
            <ArrowRight size={16} />
          </Button>

          {/* Analyze Again */}
          <Button
            variant="ghost"
            fullWidth
            onClick={() => {
              setResult(null);
              setSymptoms('');
            }}
          >
            Analyze Different Symptoms
          </Button>

        </div>
      )}

    </div>
  );
}
