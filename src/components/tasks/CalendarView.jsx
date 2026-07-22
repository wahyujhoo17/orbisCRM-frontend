import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';

const priorityColors = {
  Urgent: 'bg-rose-100 text-rose-700 border-rose-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Normal: 'bg-stone-100 text-stone-700 border-stone-200',
  Low: 'bg-emerald-100 text-emerald-700 border-emerald-200'
};

export default function CalendarView({ tasks }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Generate a mock 35-day grid
  const calendarGrid = Array.from({ length: 35 }).map((_, i) => {
    const dayNumber = (i % 31) + 1;
    // Mock assigning tasks to random dates just for visual representation
    const dayTasks = tasks.filter((t, idx) => (idx * 7) % 31 + 1 === dayNumber);
    return { dayNumber, tasks: dayTasks, isCurrentMonth: i >= 2 && i <= 32 };
  });

  return (
    <div className="flex-1 p-6 h-full overflow-hidden flex flex-col">
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Calendar Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-lg">
            <CalendarIcon className="w-5 h-5 text-stone-400" />
            July 2024
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-md text-stone-400 hover:text-stone-900 hover:bg-white border border-transparent hover:border-stone-200 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="px-3 py-1.5 rounded-md text-sm font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 transition-all">
              Today
            </button>
            <button className="p-1.5 rounded-md text-stone-400 hover:text-stone-900 hover:bg-white border border-transparent hover:border-stone-200 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-7 h-full min-h-[600px]">
            {/* Days Header */}
            {days.map(day => (
              <div key={day} className="px-2 py-3 text-center text-[11px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 bg-white sticky top-0 z-10 shadow-sm">
                {day}
              </div>
            ))}
            
            {/* Calendar Cells */}
            {calendarGrid.map((cell, i) => (
              <div 
                key={i} 
                className={`min-h-[120px] border-b border-r border-stone-100 p-2 flex flex-col gap-1 transition-colors hover:bg-stone-50/50 ${!cell.isCurrentMonth ? 'bg-stone-50/30' : ''}`}
              >
                <div className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${i === 15 ? 'bg-indigo-600 text-white' : (cell.isCurrentMonth ? 'text-stone-700' : 'text-stone-300')}`}>
                  {cell.dayNumber}
                </div>
                
                <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
                  {cell.tasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`text-[10px] font-semibold px-2 py-1 rounded border flex items-center gap-1.5 cursor-pointer transition-all hover:opacity-80 ${priorityColors[task.priority]}`}
                      title={task.title}
                    >
                      {task.columnId === 'done' ? <CheckCircle2 className="w-3 h-3 opacity-50 shrink-0" /> : <Circle className="w-3 h-3 opacity-50 shrink-0" />}
                      <span className="truncate">{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
