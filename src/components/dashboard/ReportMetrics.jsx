import React, { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Flag, MessageSquare, Upload, Folder, Zap, Sparkles, Archive } from 'lucide-react';
import { CardActions } from '../ui/Card';
import SortableCard from '../ui/SortableCard';

const defaultCardOrder = ['task-status', 'comments', 'commits', 'burndown-chart'];

const getStoredCardOrder = () => {
  const stored = localStorage.getItem('tasks-report-card-order');
  if (!stored) return defaultCardOrder;

  try {
    const parsed = JSON.parse(stored);
    const validIds = new Set(defaultCardOrder);
    const existingIds = parsed.filter((id) => validIds.has(id));
    const missingIds = defaultCardOrder.filter((id) => !existingIds.includes(id));
    return [...existingIds, ...missingIds];
  } catch {
    return defaultCardOrder;
  }
};

const StatusGradientBar = () => (
  <div className="w-full h-9 rounded-md flex overflow-hidden ring-1 ring-black/5 relative">
    <div className="h-full bg-gradient-to-r from-[#6b55e8] to-[#8c74f8]" style={{ width: '38%' }} />
    <div className="h-full bg-gradient-to-r from-[#8c74f8] to-[#c7a4fc]" style={{ width: '40%' }} />
    <div className="h-full bg-gradient-to-r from-[#c7a4fc] to-[#ebd3fe]" style={{ width: '22%' }} />
    <div className="absolute inset-0 flex items-center justify-between opacity-15 mix-blend-overlay">
      {Array.from({ length: 80 }).map((_, i) => (
        <div key={i} className="h-full w-[1px] bg-white" />
      ))}
    </div>
  </div>
);

const ScatterChart = () => (
  <svg viewBox="0 0 100 45" className="w-[90px] h-[45px] opacity-90" preserveAspectRatio="none">
    <path d="M 5,38 L 95,8" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
    {[
      [10, 32, '#6366f1'], [18, 28, '#6366f1'], [25, 35, '#6366f1'], [32, 30, '#6366f1'],
      [38, 24, '#f97316'], [45, 22, '#6366f1'], [52, 28, '#10b981'], [60, 18, '#6366f1'],
      [70, 22, '#6366f1'], [78, 14, '#f97316'], [85, 8, '#6366f1'], [92, 16, '#f97316']
    ].map((d, i) => (
      <circle key={i} cx={d[0]} cy={d[1]} r="2" fill={d[2]} />
    ))}
  </svg>
);

const ActivityBarChart = () => (
  <div className="flex items-end h-[45px] gap-[2px] w-[90px] opacity-90">
    {[10, 15, 12, 10, 20, 25, 45, 60, 30, 25, 20, 15].map((h, i) => (
      <div key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-t-[1.5px] ${i === 6 || i === 7 ? 'bg-[#ff7a00]' : 'bg-stone-100'}`} />
    ))}
  </div>
);

const BurndownChart = () => (
  <div className="relative w-full h-[125px] mt-1">
    {[
      { label: '120', top: '10%' },
      { label: '90', top: '36%' },
      { label: '60', top: '63%' },
      { label: '30', top: '90%' },
    ].map((g) => (
      <div key={g.label} className="absolute left-0 right-0 flex items-center" style={{ top: g.top }}>
        <span className="text-[11px] font-bold text-stone-400 w-8 -translate-y-1/2">{g.label}</span>
        <div className="flex-1 border-t border-dashed border-stone-200" />
      </div>
    ))}

    <div className="absolute left-8 right-0 top-0 bottom-0">
      <svg viewBox="0 0 400 125" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="purpleGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d="M 0,12 L 60,12 L 60,20 L 140,20 L 140,32 L 200,32 L 200,50 L 270,50 L 270,80 L 340,80 L 340,105 L 390,105 L 390,120 L 400,120" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
        <path d="M 0,20 L 90,20 L 90,32 L 130,32 L 130,55 L 170,55 L 170,82 L 220,82 L 220,95 L 300,95 L 300,112 L 375,112 L 375,120 L 400,120" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
        <path d="M 0,125 L 0,20 L 90,20 L 90,32 L 130,32 L 130,55 L 170,55 L 170,82 L 220,82 L 220,95 L 300,95 L 300,112 L 375,112 L 375,120 L 400,120 L 400,125 Z" fill="url(#purpleGrad)" />
      </svg>
    </div>
  </div>
);

const TaskStatusCard = () => (
  <div className="bg-white border text-stone-800 border-stone-100 rounded-[14px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] p-4 flex flex-col justify-between h-full">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2 font-bold text-[14px]">
        <Archive className="w-4 h-4 text-stone-600" />
        Task status
      </div>
      <CardActions />
    </div>

    <div className="mt-auto">
      <div className="flex items-center justify-between mb-4 px-1 gap-4">
        <div>
          <div className="text-[28px] font-bold text-stone-900 leading-none mb-1.5">24</div>
          <div className="text-[12px] font-semibold text-stone-800 flex items-center gap-1.5 whitespace-nowrap">
            Backlog <Folder className="w-3.5 h-3.5 text-blue-600" />
          </div>
        </div>
        <div>
          <div className="text-[28px] font-bold text-stone-900 leading-none mb-1.5">4</div>
          <div className="text-[12px] font-semibold text-stone-800 flex items-center gap-1.5 whitespace-nowrap">
            In progress <Zap className="w-3.5 h-3.5 text-purple-600" />
          </div>
        </div>
        <div>
          <div className="text-[28px] font-bold text-stone-900 leading-none mb-1.5">7</div>
          <div className="text-[12px] font-semibold text-stone-800 flex items-center gap-1.5 whitespace-nowrap">
            Validation <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          </div>
        </div>
      </div>
      <StatusGradientBar />
      <div className="flex justify-between items-center mt-1.5 text-[11px] font-semibold text-stone-400 px-0.5">
        <span>1d</span>
        <span>7d</span>
      </div>
    </div>
  </div>
);

const CommentsCard = () => (
  <div className="bg-white border text-stone-800 border-stone-100 rounded-[14px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] px-4 py-3 flex flex-col justify-between h-full">
    <div className="flex items-center justify-between font-bold text-[14px]">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-stone-600" /> Comments
      </div>
      <CardActions />
    </div>
    <div className="flex items-end justify-between leading-none mt-1">
      <div>
        <div className="text-[26px] font-bold text-stone-900 leading-none mb-1">109</div>
        <div className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
          ↘ 10.2% <span className="text-stone-400 font-medium">(7d)</span>
        </div>
      </div>
      <ScatterChart />
    </div>
  </div>
);

const CommitsCard = () => (
  <div className="bg-white border text-stone-800 border-stone-100 rounded-[14px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] px-4 py-3 flex flex-col justify-between h-full">
    <div className="flex items-center justify-between font-bold text-[14px]">
      <div className="flex items-center gap-2">
        <Upload className="w-4 h-4 text-stone-600" /> Commits
      </div>
      <CardActions />
    </div>
    <div className="flex items-end justify-between leading-none mt-1">
      <div>
        <div className="text-[26px] font-bold text-stone-900 leading-none mb-1">27</div>
        <div className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
          ↗ 2.9% <span className="text-stone-400 font-medium">(7d)</span>
        </div>
      </div>
      <ActivityBarChart />
    </div>
  </div>
);

const BurndownChartCard = () => (
  <div className="bg-white border text-stone-800 border-stone-100 rounded-[14px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] p-4 flex flex-col justify-between h-full">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 font-bold text-[14px]">
        <Flag className="w-4 h-4 text-stone-600" />
        Burndown chart <span className="text-stone-400 font-medium text-[12px] ml-1">(estimate points)</span>
      </div>
      <CardActions />
    </div>
    <div className="w-full">
      <BurndownChart />
    </div>
  </div>
);

const cards = {
  'task-status': {
    className: 'row-span-2 min-h-[230px]',
    content: <TaskStatusCard />,
  },
  comments: {
    className: 'min-h-[105px]',
    content: <CommentsCard />,
  },
  commits: {
    className: 'min-h-[105px]',
    content: <CommitsCard />,
  },
  'burndown-chart': {
    className: 'row-span-2 min-h-[230px]',
    content: <BurndownChartCard />,
  },
};

export default function ReportMetrics() {
  const members = Array.from({ length: 4 });
  const [cardOrder, setCardOrder] = useState(getStoredCardOrder);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setCardOrder((items) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const nextItems = arrayMove(items, oldIndex, newIndex);
      localStorage.setItem('tasks-report-card-order', JSON.stringify(nextItems));
      return nextItems;
    });
  };

  return (
    <div className="px-8 pt-6 pb-2 max-w-[1400px]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-[22px] font-bold text-stone-900 tracking-tight mb-0.5">Tasks report</h2>
          <p className="text-[12px] text-stone-500 font-medium leading-relaxed">
            Stay on top of your tasks, monitor progress, and track status. Streamline your<br />workflow and transform how you deliver results.
          </p>
        </div>
        <div className="flex items-center -space-x-1.5">
          {members.map((_, i) => (
            <img key={i} src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&q=80&${i}`} alt="user" className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm relative z-0" />
          ))}
          <button className="w-8 h-8 rounded-full border border-dashed border-stone-300 bg-white flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors text-sm font-semibold relative z-10 shadow-sm">
            +
          </button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cardOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-[1.1fr_0.8fr_1.85fr] grid-rows-[105px_105px] gap-5 mb-2">
            {cardOrder.map((id) => {
              const card = cards[id];
              if (!card) return null;

              return (
                <SortableCard key={id} id={id} className={card.className}>
                  {card.content}
                </SortableCard>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
