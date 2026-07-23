import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'lg', showCloseButton = true }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-full mx-4'
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className={`relative bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} animate-in fade-in zoom-in-95 duration-200 border border-stone-100`}>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-stone-100 text-stone-400 hover:text-stone-600 rounded-lg transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {title && (
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="text-[15px] font-bold text-stone-900">{title}</h2>
          </div>
        )}
        <div className="px-6 py-4 max-h-[calc(100vh-100px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
