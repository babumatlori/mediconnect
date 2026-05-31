import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  FileText, Upload, X, CheckCircle,
  File
} from 'lucide-react';
import { aiApi } from '../../api/aiApi';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { cn } from '../../utils/cn';

export default function ReportSummarizer() {
  const { showError } = useToast();

  const [file, setFile]       = useState(null);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * react-dropzone onDrop handler.
   * WHY useCallback: dropzone requires stable function reference.
   */
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      showError('Only PDF files are accepted (max 10MB)');
      return;
    }
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResult(null);
    }
  }, [showError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1,
  });

  const handleSummarize = async () => {
    if (!file) {
      showError('Please upload a PDF file first');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await aiApi.summarizeReport(file);
      setResult(res.data);
    } catch {
      showError('Failed to summarize report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-ai-50 rounded-xl
                          flex items-center justify-center">
            <FileText size={20} className="text-ai-600" />
          </div>
          <h1 className="page-title">AI Report Summarizer</h1>
        </div>
        <p className="page-subtitle">
          Upload your medical report PDF and get a plain-language summary.
        </p>
      </div>

      {/* Upload Area */}
      <div className="card mb-6">

        {!file ? (
          /* Dropzone */
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-10 text-center',
              'cursor-pointer transition-all duration-150',
              isDragActive
                ? 'border-ai-500 bg-ai-50'
                : 'border-secondary-300 hover:border-ai-400 hover:bg-secondary-50'
            )}
          >
            <input {...getInputProps()} />
            <Upload
              size={36}
              className={cn(
                'mx-auto mb-3',
                isDragActive ? 'text-ai-500' : 'text-secondary-400'
              )}
            />
            <p className="font-medium text-secondary-700 mb-1">
              {isDragActive
                ? 'Drop your PDF here'
                : 'Drag & drop your medical report'
              }
            </p>
            <p className="text-sm text-secondary-400 mb-3">
              or click to browse files
            </p>
            <span className="text-xs bg-secondary-100 text-secondary-500
                             px-3 py-1 rounded-full">
              PDF only • Max 10MB
            </span>
          </div>
        ) : (
          /* File Preview */
          <div className="flex items-center gap-4 p-4 bg-secondary-50
                          rounded-lg border border-secondary-200">
            <div className="w-12 h-12 bg-danger-50 rounded-xl
                            flex items-center justify-center shrink-0">
              <File size={22} className="text-danger-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-secondary-900 truncate text-sm">
                {file.name}
              </p>
              <p className="text-xs text-secondary-400 mt-0.5">
                {formatFileSize(file.size)}
              </p>
            </div>
            <button
              onClick={removeFile}
              className="p-1.5 rounded-md hover:bg-secondary-200
                         text-secondary-400 hover:text-secondary-600
                         transition-colors"
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Analyze Button */}
        {file && (
          <Button
            variant="ai"
            fullWidth
            size="lg"
            loading={loading}
            onClick={handleSummarize}
            className="mt-4"
          >
            <FileText size={18} />
            {loading ? 'Summarizing...' : 'Summarize Report'}
          </Button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="card text-center py-10">
          <div className="flex justify-center mb-4">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 bg-ai-500 rounded-full mx-1 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-secondary-500 text-sm">
            AI is reading your report...
          </p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4 animate-fadeIn">

          {/* Summary */}
          {result.summary && (
            <div className="card">
              <h3 className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
                <CheckCircle size={18} className="text-success-500" />
                Summary
              </h3>
              <p className="text-secondary-700 text-sm leading-relaxed">
                {result.summary}
              </p>
            </div>
          )}

          {/* Key Findings */}
          {result.keyFindings?.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-secondary-900 mb-3">
                🔍 Key Findings
              </h3>
              <div className="space-y-2">
                {result.keyFindings.map((finding, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-secondary-700"
                  >
                    <div className="w-1.5 h-1.5 bg-warning-500 rounded-full shrink-0 mt-1.5" />
                    {finding}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations?.length > 0 && (
            <div className="card border-success-200 bg-success-50">
              <h3 className="font-semibold text-secondary-900 mb-3">
                ✅ Recommendations
              </h3>
              <div className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-secondary-700"
                  >
                    <div className="w-1.5 h-1.5 bg-success-500 rounded-full shrink-0 mt-1.5" />
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Urgency */}
          {result.urgencyLevel && (
            <div className="flex items-center justify-between card">
              <span className="text-sm font-medium text-secondary-700">
                Urgency Level
              </span>
              <Badge variant={
                result.urgencyLevel === 'HIGH' ? 'danger' :
                result.urgencyLevel === 'MEDIUM' ? 'warning' : 'success'
              }>
                {result.urgencyLevel}
              </Badge>
            </div>
          )}

          {/* Analyze another */}
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              setFile(null);
              setResult(null);
            }}
          >
            Analyze Another Report
          </Button>

        </div>
      )}

    </div>
  );
}
