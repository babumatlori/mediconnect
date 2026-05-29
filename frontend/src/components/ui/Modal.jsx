import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Modal Component
 *
 * Props:
 * - isOpen: boolean
 * - onClose: function
 * - title: string
 * - children: content
 * - maxWidth: string — Tailwind max-width class
 *
 * WHY useEffect for ESC key:
 * Accessibility — users expect ESC to close modals.
 * Cleanup removes listener when modal closes.
 *
 * WHY stopPropagation on content click:
 * Clicking inside modal shouldn't close it.
 * Only clicking the backdrop should close it.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}) {
  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal content */}
      <div
        className={cn(
          'relative bg-white rounded-xl shadow-xl w-full animate-fadeIn',
          maxWidth
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5
                        border-b border-secondary-200">
          <h3 className="font-semibold text-secondary-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-secondary-400
                       hover:bg-secondary-100 hover:text-secondary-600
                       transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
