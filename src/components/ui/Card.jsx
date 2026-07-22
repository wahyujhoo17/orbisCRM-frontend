import React, { useContext } from 'react';
import { PencilLine, Expand, MoreVertical } from 'lucide-react';
import { SortableContextValue } from './SortableCard';

export default function Card({ children, className = '', padding = 'md', ...props }) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    compact: 'px-4 py-3',
    lg: 'p-6'
  };

  return (
    <div
      className={`bg-white border border-stone-100 rounded-[14px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] text-stone-800 ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, actions, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
      {actions}
    </div>
  );
}

export function CardTitle({ children, icon: Icon, className = '' }) {
  return (
    <div className={`flex items-center gap-2 font-bold text-[14px] text-stone-900 ${className}`}>
      {Icon && <Icon className="w-4 h-4 text-stone-600" />}
      <span>{children}</span>
    </div>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-[11px] text-stone-400 font-medium mt-1 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-stone-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardActions({ className = '', dragHandleProps }) {
  const defaultListeners = useContext(SortableContextValue);
  const listeners = dragHandleProps || defaultListeners;

  return (
    <div className={`flex items-center text-stone-400 border border-stone-100/80 rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.03)] bg-stone-50/30 ${className}`}>
      <button className="p-1.5 hover:bg-stone-100 hover:text-stone-600 transition-colors rounded-l-md">
        <PencilLine className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-3.5 bg-stone-200/70" />
      <button
        className="p-1.5 hover:bg-stone-100 hover:text-stone-600 transition-colors cursor-grab active:cursor-grabbing"
        {...listeners}
      >
        <Expand className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-3.5 bg-stone-200/70" />
      <button className="p-1.5 hover:bg-stone-100 hover:text-stone-600 transition-colors rounded-r-md">
        <MoreVertical className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
