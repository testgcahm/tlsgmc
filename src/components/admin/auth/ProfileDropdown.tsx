import { User } from 'lucide-react';
import React, { useRef } from 'react';

export default function ProfileDropdown({
  userEmail,
  showDropdown,
  setShowDropdown,
  handleLogout,
}: {
  userEmail: string | null;
  showDropdown: boolean;
  setShowDropdown: (v: boolean) => void;
  handleLogout: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
        return;
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && showDropdown) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [showDropdown, setShowDropdown]);

  return (
    <div className="flex justify-end w-full p-4 relative">
      <button
        ref={buttonRef}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-accent hover:bg-accent-light text-white focus:outline-none"
        onClick={() => setShowDropdown(!showDropdown)}
        title="Profile"
      >
        <User className="w-6 h-6" />
      </button>
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute right-10 top-14 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 animate-fade-in"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm text-gray-700 font-semibold text-wrap break-all">{userEmail || 'No email'}</p>
          </div>
          <button
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-b-lg"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
