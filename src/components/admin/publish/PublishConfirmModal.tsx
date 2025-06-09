import React from 'react';
import { PublishType } from '@/types/publish';
import { SimpleSpinner } from '@/components/Spinner';

interface PublishConfirmModalProps {
  show: boolean;
  loading: boolean;
  publishType: PublishType | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const PublishConfirmModal: React.FC<PublishConfirmModalProps> = ({ show, loading, publishType, onConfirm, onCancel }) => {

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-xl font-bold mb-2 text-primary-700">
          {publishType === PublishType.Build ? 'Confirm Full Rebuild' : 'Confirm Manual Revalidation'}
        </h2>
        <p className="mb-4 text-gray-700">
          {publishType === PublishType.Build
            ? 'This will trigger a full rebuild of all event pages and clear all caches. Use only if you want to force a complete refresh. This will take 2 mins to complete'
            : 'This will rebuild events pages and refresh cached content. Only needed if your pages don\'t match the current data.'}
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded shadow-sm transition-all duration-200 focus:outline-none flex items-center gap-2"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <SimpleSpinner />} {publishType === PublishType.Build ? 'Yes, Full Rebuild' : 'Yes, Revalidate'}
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-primary-700 font-bold px-4 py-2 rounded shadow-sm transition-all duration-200 focus:outline-none"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishConfirmModal;
