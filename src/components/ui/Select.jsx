import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Select = ({
  label,
  error,
  helperText,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search option...',
  size = 'md',
  className = '',
  name,
  disabled = false,
  isSearchable = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0, width: 0, isUpward: false });
  
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const menuRef = useRef(null);

  // Normalize options array into [{ value, label }]
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return { value: opt.value, label: opt.label || opt.value };
    }
    return { value: opt, label: String(opt) };
  });

  // Find current selected option
  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));

  // Filter options by search query
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate position on open, scroll, or resize
  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Open upward if space below is under 220px AND space above is greater
      const isUpward = spaceBelow < 220 && spaceAbove > spaceBelow;

      setMenuCoords({
        top: isUpward ? rect.top - 6 : rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        isUpward
      });
    }
  };

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Reposition on window resize or scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      const isTriggerClick = triggerRef.current && triggerRef.current.contains(event.target);
      const isMenuClick = menuRef.current && menuRef.current.contains(event.target);

      if (!isTriggerClick && !isMenuClick) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Auto focus search input when popover opens
  useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen, isSearchable]);

  const handleSelect = (optionValue) => {
    if (onChange) {
      onChange({
        target: {
          name: name || '',
          value: optionValue
        }
      });
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-3.5 py-2 text-xs',
    lg: 'px-4 py-2.5 text-sm'
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-stone-700 mb-1">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`w-full flex items-center justify-between rounded-lg border bg-white font-medium transition-all cursor-pointer ${sizeClasses[size]} ${
          error
            ? 'border-rose-300 ring-1 ring-rose-300 text-rose-900 bg-rose-50/20'
            : isOpen
            ? 'border-stone-400 ring-2 ring-stone-900/10 text-stone-900 shadow-2xs'
            : 'border-stone-200 text-stone-900 hover:border-stone-300 shadow-2xs'
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-stone-50' : ''}`}
      >
        <span className={`truncate ${!selectedOption ? 'text-stone-400 font-normal' : 'font-bold text-stone-900'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-stone-700' : ''
          }`}
        />
      </button>

      {/* Portal-rendered Dropdown Menu */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: menuCoords.isUpward ? 6 : -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: menuCoords.isUpward ? 6 : -6, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                left: menuCoords.left,
                width: menuCoords.width,
                top: menuCoords.isUpward ? 'auto' : menuCoords.top,
                bottom: menuCoords.isUpward ? window.innerHeight - menuCoords.top : 'auto',
                zIndex: 9999
              }}
              className="bg-white rounded-xl border border-stone-200 shadow-2xl p-1.5 flex flex-col min-w-[200px]"
            >
              {/* Search Input Box */}
              {isSearchable && (
                <div className="p-1.5 border-b border-stone-100 mb-1 sticky top-0 bg-white z-10">
                  <div className="relative flex items-center">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="w-full pl-8 pr-7 py-1.5 bg-stone-50 border border-stone-200 rounded-md text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-stone-400 transition-colors"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 text-stone-400 hover:text-stone-700 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="max-h-52 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-stone-200">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-3 text-xs text-stone-400 text-center font-medium">
                    {searchQuery ? `No results for "${searchQuery}"` : 'No options available'}
                  </div>
                ) : (
                  filteredOptions.map((opt) => {
                    const isSelected = String(opt.value) === String(value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelect(opt.value)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-stone-900 text-white font-bold shadow-2xs'
                            : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900 font-medium'
                        }`}
                      >
                        <span className="truncate pr-2">{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-white" />}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {error && <p className="mt-1 text-xs font-semibold text-rose-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-stone-400">{helperText}</p>}
    </div>
  );
};

export default Select;
