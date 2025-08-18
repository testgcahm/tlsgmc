import { SimpleSpinner } from '@/components/Spinner';
import { PublishType } from '@/types/publish';
import Link from 'next/link';
import React from 'react';

export default function AdminActions({
  loading,
  setShowPublishConfirm,
  setPublishType,
  publishType,
}: {
  loading: boolean;
  setShowPublishConfirm: (v: boolean) => void;
  setPublishType: (v: PublishType) => void;
  publishType: PublishType | null;
}) {
  return (
    <div className="flex-1 flex-wrap gap-4 flex mb-10 justify-center">
      <button
        className="bg-primary disabled:bg-primary-300 hover:bg-primary-light text-white font-bold px-4 py-2 rounded shadow-sm transition-all duration-200 focus:outline-none flex items-center gap-2"
        onClick={() => { setShowPublishConfirm(true); setPublishType(PublishType.Revalidate); }}
        disabled={loading}
      >
        {loading && publishType === PublishType.Revalidate ? <SimpleSpinner /> : null}
        <span>Manual Revalidate</span>
      </button>
      <button
        className="bg-accent disabled:bg-accent-light hover:bg-primary-700 text-white font-bold px-4 py-2 rounded shadow-sm transition-all duration-200 focus:outline-none flex items-center gap-2"
        onClick={() => { setShowPublishConfirm(true); setPublishType(PublishType.Build); }}
        disabled={loading}
      >
        {loading && publishType === PublishType.Build ? <SimpleSpinner /> : null}
        <span>Full Rebuild</span>
      </button>
      <Link className="bg-teal-500 disabled:bg-teal-300 hover:bg-teal-600 text-white font-bold px-4 py-2 rounded shadow-sm transition-all duration-200 focus:outline-none flex items-center gap-2"
        href="/api/auth/google/start">Setup Google Drive Connection</Link>
    </div>
  );
}
