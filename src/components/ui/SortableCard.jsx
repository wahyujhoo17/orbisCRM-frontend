import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableContextValue = React.createContext(null);

export default function SortableCard({ id, children, className = '' }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <SortableContextValue.Provider value={listeners}>
      <div ref={setNodeRef} style={style} className={className} {...attributes}>
        {children}
      </div>
    </SortableContextValue.Provider>
  );
}
