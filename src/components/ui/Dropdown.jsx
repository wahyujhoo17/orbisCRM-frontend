import React, { useState, useRef, useEffect } from 'react';

export default function Dropdown({ trigger, children, align = 'right' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[200px] z-50 animate-in fade-in duration-200`}>
          <div onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
    >
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="border-t border-gray-200 my-1" />;
}
