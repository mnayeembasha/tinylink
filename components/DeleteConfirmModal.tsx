import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  linkCode: string;
  linkUrl: string;
  isDeleting: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  linkCode,
  linkUrl,
  isDeleting,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeIn" style={{ animation: 'fadeIn 0.2s ease-out' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Delete Link</h3>
          </div>
          <p className="text-gray-600">
            Are you sure you want to delete this short link? This action cannot be undone.
          </p>
        </div>

        {/* Link Details */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">Short Code</span>
              <p className="text-sm font-mono font-semibold text-blue-600 mt-1">{linkCode}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">Target URL</span>
              <p className="text-sm text-gray-700 mt-1 truncate" title={linkUrl}>
                {linkUrl}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}