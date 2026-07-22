import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LayoutGrid, List, Plus, MoreHorizontal, Building2, Calendar, DollarSign, Search, Filter } from 'lucide-react';
import { useToast } from '../hooks';

// Dummy Data
const STAGES = ['Lead', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

const STAGE_COLORS = {
  'Lead': 'bg-blue-500',
  'Qualification': 'bg-amber-500',
  'Proposal': 'bg-indigo-500',
  'Negotiation': 'bg-rose-500',
  'Closed Won': 'bg-emerald-500',
  'Closed Lost': 'bg-stone-500'
};

const initialDeals = {
  'Lead': [
    { id: 'DL-01', title: 'Data Migration Project', company: 'CloudSync', value: 12000, date: 'Oct 12', owner: 'https://i.pravatar.cc/150?u=1' },
    { id: 'DL-02', title: 'Q1 Partnership', company: 'Nexus Health', value: 20000, date: 'Oct 15', owner: 'https://i.pravatar.cc/150?u=2' }
  ],
  'Qualification': [
    { id: 'DL-03', title: 'Support Contract', company: 'StartUp Ltd', value: 15000, date: 'Nov 01', owner: 'https://i.pravatar.cc/150?u=3' }
  ],
  'Proposal': [
    { id: 'DL-04', title: 'Consulting Package', company: 'Tech Inc', value: 25000, date: 'Dec 15', owner: 'https://i.pravatar.cc/150?u=4' }
  ],
  'Negotiation': [
    { id: 'DL-05', title: 'Q4 Enterprise License', company: 'Acme Corp', value: 45000, date: 'Nov 15', owner: 'https://i.pravatar.cc/150?u=5' }
  ],
  'Closed Won': [],
  'Closed Lost': []
};

function SortableDealCard({ deal, id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 rounded-xl border transition-all duration-200 mb-3 group cursor-grab active:cursor-grabbing ${
        isDragging ? 'border-indigo-400 shadow-xl ring-4 ring-indigo-400/10 scale-105 rotate-2' : 'border-stone-200 hover:border-stone-300 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-sm text-stone-900 leading-tight pr-4">{deal.title}</h3>
        <button className="text-stone-400 hover:text-stone-900 opacity-0 group-hover:opacity-100 transition-opacity p-1 -mr-2 -mt-1 rounded-md hover:bg-stone-100">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-1.5 text-xs text-stone-600 mb-4 font-medium">
        <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <span className="truncate">{deal.company}</span>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
        <div className="flex items-center gap-1 font-bold text-sm text-stone-800">
          <DollarSign className="w-3.5 h-3.5 text-stone-400" />
          {deal.value.toLocaleString()}
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500 bg-stone-100/80 px-2 py-1 rounded-md">
            <Calendar className="w-3 h-3 text-stone-400" />
            {deal.date}
          </div>
          {deal.owner && (
            <img src={deal.owner} alt="Owner" className="w-6 h-6 rounded-full border-2 border-white shadow-sm" />
          )}
        </div>
      </div>
    </div>
  );
}

function DroppableColumn({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`flex-1 overflow-y-auto p-3 transition-colors ${isOver ? 'bg-stone-200/40 rounded-xl' : ''}`}>
      {children}
    </div>
  );
}

export default function DealsKanban() {
  const [columns, setColumns] = useState(initialDeals);
  const [activeId, setActiveId] = useState(null);
  const [activeDeal, setActiveDeal] = useState(null);
  const [initialStage, setInitialStage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    
    // Find the active deal for overlay
    let foundDeal = null;
    let foundStage = null;
    for (const key in columns) {
      const match = columns[key].find(d => d.id === active.id);
      if (match) {
        foundDeal = match;
        foundStage = key;
        break;
      }
    }
    setActiveDeal(foundDeal);
    setInitialStage(foundStage);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find columns
    const activeColumn = Object.keys(columns).find(key => columns[key].some(item => item.id === activeId));
    const overColumn = Object.keys(columns).find(key => columns[key].some(item => item.id === overId)) || (STAGES.includes(overId) ? overId : null);

    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return;
    }

    setColumns(prev => {
      const activeItems = prev[activeColumn];
      const overItems = prev[overColumn];

      const activeIndex = activeItems.findIndex(item => item.id === activeId);
      const overIndex = overItems.findIndex(item => item.id === overId);

      const newIndex = overIndex >= 0 ? overIndex + (overIndex === overItems.length - 1 && event.delta.y > 0 ? 1 : 0) : overItems.length;

      return {
        ...prev,
        [activeColumn]: [
          ...activeItems.slice(0, activeIndex),
          ...activeItems.slice(activeIndex + 1)
        ],
        [overColumn]: [
          ...overItems.slice(0, newIndex),
          activeItems[activeIndex],
          ...overItems.slice(newIndex)
        ]
      };
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      setActiveDeal(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const activeColumn = Object.keys(columns).find(key => columns[key].some(item => item.id === activeId));
    const overColumn = Object.keys(columns).find(key => columns[key].some(item => item.id === overId)) || (STAGES.includes(overId) ? overId : null);

    if (activeColumn && overColumn && activeColumn === overColumn) {
      const activeIndex = columns[activeColumn].findIndex(item => item.id === activeId);
      const overIndex = columns[overColumn].findIndex(item => item.id === overId);

      if (activeIndex !== overIndex) {
        setColumns(prev => ({
          ...prev,
          [activeColumn]: arrayMove(prev[activeColumn], activeIndex, overIndex)
        }));
      }
    }

    if (activeColumn && initialStage && activeColumn !== initialStage) {
      toast.success('Pipeline Updated', {
        description: `${activeDeal?.title || 'Deal'} moved to ${activeColumn}`
      });
    }

    setActiveId(null);
    setActiveDeal(null);
    setInitialStage(null);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals Kanban</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and track your sales pipeline visually</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search deals..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition-all font-medium text-sm shadow-sm active:scale-95">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-all font-medium text-sm shadow-sm active:scale-95">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Deal</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden -mx-6 px-6">
        <div className="flex gap-6 h-full items-start">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {STAGES.map((stage) => {
              const stageDeals = (columns[stage] || []).filter(deal => {
                if (!searchTerm) return true;
                const lower = searchTerm.toLowerCase();
                return deal.title.toLowerCase().includes(lower) || deal.company.toLowerCase().includes(lower);
              });
              const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

              return (
                <div key={stage} className="w-[320px] shrink-0 h-full flex flex-col bg-stone-100/50 rounded-2xl border border-stone-200/60 overflow-hidden relative shadow-sm">
                  {/* Stage Top Color Line */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${STAGE_COLORS[stage] || 'bg-stone-300'}`} />
                  
                  {/* Column Header */}
                  <div className="px-4 py-3 border-b border-stone-200/60 bg-stone-50/50 flex flex-col gap-1 shrink-0 mt-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-sm text-stone-800">{stage}</h2>
                        <span className="px-1.5 py-0.5 rounded-md bg-white border border-stone-200 text-[11px] font-bold text-stone-500 shadow-sm">
                          {stageDeals.length}
                        </span>
                      </div>
                      <button className="p-1 text-stone-400 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-[13px] font-semibold text-stone-500">
                      {formatCurrency(totalValue)}
                    </div>
                  </div>

                  {/* Column Body - Droppable Area */}
                  <SortableContext 
                    id={stage} 
                    items={stageDeals.map(d => d.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <DroppableColumn id={stage}>
                      {stageDeals.map((deal) => (
                        <SortableDealCard key={deal.id} id={deal.id} deal={deal} />
                      ))}
                      {stageDeals.length === 0 && (
                         <div className="h-full w-full flex items-center justify-center p-4">
                            <div className="border-2 border-dashed border-stone-200/80 rounded-xl w-full h-24 flex items-center justify-center text-xs font-semibold text-stone-400 bg-stone-50/50">
                              Drop deals here
                            </div>
                         </div>
                      )}
                    </DroppableColumn>
                  </SortableContext>
                </div>
              );
            })}

            <DragOverlay>
              {activeDeal ? (
                <div className="bg-white p-4 rounded-xl border border-indigo-400 shadow-2xl opacity-90 ring-4 ring-indigo-400/20 rotate-3 scale-105 cursor-grabbing">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-sm text-stone-900 leading-tight pr-4">{activeDeal.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-600 mb-4 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{activeDeal.company}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-1 font-bold text-sm text-stone-800">
                      <DollarSign className="w-3.5 h-3.5 text-stone-400" />
                      {activeDeal.value.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500 bg-stone-100/80 px-2 py-1 rounded-md">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        {activeDeal.date}
                      </div>
                      {activeDeal.owner && (
                        <img src={activeDeal.owner} alt="Owner" className="w-6 h-6 rounded-full border-2 border-white shadow-sm" />
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
