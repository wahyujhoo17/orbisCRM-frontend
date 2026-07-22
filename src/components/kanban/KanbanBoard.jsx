import React, { useState } from 'react';
import { Folder, Zap, Sparkles, CheckCircle2, MoreVertical } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import { kanbanColumns } from '../../data/mockData';

const ColumnIcon = ({ icon }) => {
  switch (icon) {
    case 'folder': return <Folder className="w-3.5 h-3.5 text-stone-700" />;
    case 'zap': return <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />;
    case 'sparkles': return <Sparkles className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />;
    case 'check-circle': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
    default: return null;
  }
};

function SortableTaskCard({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
    </div>
  );
}

function DroppableColumn({ column, tasks }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { type: 'Column', column }
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header Column */}
      <div className="flex items-center justify-between mb-4 px-1 shrink-0">
        <div className="flex items-center gap-2">
          <ColumnIcon icon={column.icon} />
          <h3 className="text-xs font-bold text-stone-800">{column.title}</h3>
          <span className="text-xs font-bold text-stone-900">{tasks.length}</span>
        </div>
        <button className="text-stone-300 hover:text-stone-600 transition-colors">
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tasks List */}
      <div 
        ref={setNodeRef} 
        className="flex-1 min-h-[150px] p-2 -mx-2 rounded-xl transition-colors hover:bg-stone-100/50 space-y-4"
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export default function KanbanBoard({ tasks, setTasks }) {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    setTasks(prev => {
      const activeIndex = prev.findIndex(t => t.id === activeId);
      const activeTask = prev[activeIndex];

      if (isOverTask) {
        const overIndex = prev.findIndex(t => t.id === overId);
        const overTask = prev[overIndex];
        
        if (activeTask.columnId !== overTask.columnId) {
          const newTasks = [...prev];
          newTasks[activeIndex] = { ...activeTask, columnId: overTask.columnId };
          return newTasks;
        }
      } else if (isOverColumn) {
        if (activeTask.columnId !== overId) {
          const newTasks = [...prev];
          newTasks[activeIndex] = { ...activeTask, columnId: overId };
          return newTasks;
        }
      }
      return prev;
    });
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);
  };

  return (
    <div className="flex-1 overflow-x-auto p-6 bg-stone-50/20">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-4 gap-6 min-w-[1000px] h-full">
          {kanbanColumns.map((column) => (
            <DroppableColumn 
              key={column.id} 
              column={column} 
              tasks={tasks.filter(t => t.columnId === column.id)} 
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}