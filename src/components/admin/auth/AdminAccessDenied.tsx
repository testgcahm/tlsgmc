import Link from 'next/link';
import React from 'react';

export default function AdminAccessDenied({ userEmail, handleLogout }: { userEmail: string | null; handleLogout: () => void }) {
  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] bg-gray-100'>
      <h1 className="text-2xl text-primary-500 font-bold mb-4">Access Denied</h1>
      <p className="text-gray-700 mb-4">You do not have permission to access this page.</p>
      <p className="text-gray-700 mb-4">Please go to <Link href='/contact' className='text-primary font-semibold hover:font-bold'>Contact Page</Link> for more information.</p>
      {userEmail && (
        <p className="text-sm text-gray-700 font-semibold text-wrap bg-white border-primary-300 border-2 p-2 rounded break-all mb-2">{userEmail}</p>
      )}
      <button
        className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-3 py-[6px] mt-1 rounded shadow-sm transition-all duration-200 focus:outline-none flex items-center gap-3 mb-2"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
