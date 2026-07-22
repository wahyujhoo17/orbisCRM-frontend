import React, { useMemo, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Phone,
  Video,
  Mail,
  Briefcase,
  Plus,
  Filter,
  Users,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Card, { CardActions } from '../components/ui/Card';
import SortableCard from '../components/ui/SortableCard';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const dateKeyFromParts = (year, month, day) => formatDateKey(new Date(year, month, day));

const getMonthCells = (monthDate) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    return {
      key: formatDateKey(date),
      dateNumber: date.getDate(),
      muted: date.getMonth() !== month,
    };
  });
};

const createDefaultEvents = (baseDate = new Date()) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  return [
    { id: 'event-bright-call', date: dateKeyFromParts(year, month, 8), title: 'Bright discovery', type: 'call' },
    { id: 'event-acme-demo', date: dateKeyFromParts(year, month, 10), title: 'Acme demo', type: 'demo' },
    { id: 'event-fintech-email', date: dateKeyFromParts(year, month, 10), title: 'Proposal email', type: 'email' },
    { id: 'event-global-follow-up', date: dateKeyFromParts(year, month, 14), title: 'Global follow-up', type: 'follow-up' },
    { id: 'event-nexus-deal', date: dateKeyFromParts(year, month, 15), title: 'Nexus deal review', type: 'deal' },
    { id: 'event-retail-meeting', date: dateKeyFromParts(year, month, 17), title: 'Retail meeting', type: 'meeting' },
    { id: 'event-logistics-call', date: dateKeyFromParts(year, month, 21), title: 'Logistics call', type: 'call' },
    { id: 'event-fintech-close', date: dateKeyFromParts(year, month, 24), title: 'Close plan', type: 'close' },
    { id: 'event-nexus-renewal', date: dateKeyFromParts(year, month, 31), title: 'Renewal', type: 'renewal' },
  ];
};

const agenda = [
  {
    id: 1,
    time: '09:30',
    title: 'Discovery call with Bright Retail',
    company: 'Bright Retail',
    type: 'Call',
    icon: Phone,
    color: 'bg-blue-50 text-blue-600',
    status: 'Confirmed',
  },
  {
    id: 2,
    time: '11:00',
    title: 'Product demo for Acme Corp',
    company: 'Acme Corp',
    type: 'Demo',
    icon: Video,
    color: 'bg-indigo-50 text-indigo-600',
    status: 'High value',
  },
  {
    id: 3,
    time: '13:45',
    title: 'Follow up proposal email',
    company: 'Fintech Solutions',
    type: 'Email',
    icon: Mail,
    color: 'bg-amber-50 text-amber-600',
    status: 'Pending',
  },
  {
    id: 4,
    time: '15:30',
    title: 'Contract review meeting',
    company: 'Nexus Health',
    type: 'Deal',
    icon: Briefcase,
    color: 'bg-emerald-50 text-emerald-600',
    status: 'Closing',
  },
];

const defaultCardOrder = ['calls-due', 'emails-pending', 'meetings-booked', 'deals-closing', 'month-calendar', 'today-agenda', 'overdue-follow-ups', 'upcoming-commitments'];

const getStoredCardOrder = () => {
  const stored = localStorage.getItem('calendar-card-order');
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

const getStoredEvents = () => {
  const stored = localStorage.getItem('calendar-events');
  if (!stored) return createDefaultEvents();

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : createDefaultEvents();
  } catch {
    return createDefaultEvents();
  }
};

const followUps = {
  'calls-due': { label: 'Calls due today', value: 8, change: '12.4%', trend: 'up', icon: Phone, color: 'text-blue-600' },
  'emails-pending': { label: 'Emails pending', value: 14, change: '4.8%', trend: 'down', icon: Mail, color: 'text-amber-600' },
  'meetings-booked': { label: 'Meetings booked', value: 6, change: '8.1%', trend: 'up', icon: Users, color: 'text-indigo-600' },
  'deals-closing': { label: 'Deals closing', value: 3, change: '2.9%', trend: 'up', icon: Briefcase, color: 'text-emerald-600' },
};

const eventColor = {
  demo: 'bg-indigo-500',
  call: 'bg-blue-500',
  email: 'bg-amber-500',
  'follow-up': 'bg-purple-500',
  deal: 'bg-emerald-500',
  meeting: 'bg-stone-500',
  close: 'bg-rose-500',
  renewal: 'bg-cyan-500',
};

function SummaryCard({ item }) {
  const Icon = item.icon;
  const isUp = item.trend === 'up';

  return (
    <Card padding="none" className="px-4 py-3 h-full flex flex-col">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center shrink-0">
            <Icon className={`w-3.5 h-3.5 ${item.color}`} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold text-stone-400 leading-none mb-1">Calendar metric</div>
            <div className="text-[12px] font-bold text-stone-900 tracking-tight truncate">{item.label}</div>
          </div>
        </div>
        <CardActions />
      </div>

      <div className="flex items-end justify-between gap-3 mt-4">
        <div className="text-[26px] font-bold text-stone-950 leading-none tracking-tight">{item.value}</div>
        <div className="flex items-center gap-1 text-[10px] font-bold leading-none pb-0.5 whitespace-nowrap">
          <span className={isUp ? 'text-emerald-500' : 'text-rose-500'}>{isUp ? '↗' : '↘'} {item.change}</span>
          <span className="text-stone-400 font-semibold">(7d)</span>
        </div>
      </div>
    </Card>
  );
}

function CalendarEvent({ event }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: event.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1.5 text-[10px] font-semibold text-stone-600 truncate cursor-grab active:cursor-grabbing rounded-md px-1.5 py-1 hover:bg-stone-100 ${isDragging ? 'opacity-70 z-20 shadow-sm bg-white' : ''}`}
      {...listeners}
      {...attributes}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${eventColor[event.type]}`} />
      <span className="truncate">{event.title}</span>
    </div>
  );
}

function CalendarDayCell({ day, events, todayKey }) {
  const { setNodeRef, isOver } = useDroppable({ id: `day:${day.key}` });
  const isToday = day.key === todayKey;

  return (
    <div ref={setNodeRef} className={`min-h-[100px] p-2 flex flex-col transition-colors ${isOver ? 'bg-indigo-50/70 ring-1 ring-inset ring-indigo-200' : 'bg-white hover:bg-stone-50/50'}`}>
      <div className={`text-xs font-bold mb-1.5 w-6 h-6 rounded-full flex items-center justify-center ${day.muted ? 'text-stone-300' : isToday ? 'text-white bg-stone-900' : 'text-stone-700'}`}>
        {day.dateNumber}
      </div>
      <div className="space-y-0.5">
        {events.map((event) => (
          <CalendarEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

export default function Calendar() {
  const [view, setView] = useState('Month');
  const [cardOrder, setCardOrder] = useState(getStoredCardOrder);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [events, setEvents] = useState(getStoredEvents);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const calendarCells = useMemo(() => getMonthCells(currentMonth), [currentMonth]);
  const todayKey = formatDateKey(new Date());
  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setCardOrder((items) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const nextItems = arrayMove(items, oldIndex, newIndex);
      localStorage.setItem('calendar-card-order', JSON.stringify(nextItems));
      return nextItems;
    });
  };

  const handleEventDragEnd = ({ active, over }) => {
    if (!over || !String(over.id).startsWith('day:')) return;

    const nextDate = String(over.id).replace('day:', '');
    setEvents((items) => {
      const nextItems = items.map((event) => (event.id === active.id ? { ...event, date: nextDate } : event));
      localStorage.setItem('calendar-events', JSON.stringify(nextItems));
      return nextItems;
    });
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#fafafa]">
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6 max-w-[1440px] mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
            <div>
              <h1 className="text-xl font-bold text-stone-900 tracking-tight">CRM Calendar</h1>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Manage meetings, follow-ups, demos, renewals, and deal deadlines.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              <div className="flex items-center bg-white border border-stone-200 rounded-lg p-1 text-xs font-semibold text-stone-700 shadow-2xs">
                {['Day', 'Week', 'Month'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setView(item)}
                    className={`px-3 py-1 rounded-md transition-all ${view === item ? 'bg-stone-900 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs">
                <Filter className="w-3.5 h-3.5 text-stone-400" />
                Filter
              </button>

              <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-2xs">
                <Plus className="w-3.5 h-3.5" />
                Add event
              </button>
            </div>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={cardOrder} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 auto-rows-auto xl:auto-rows-[98px] gap-4">
                {cardOrder.map((id) => {
                  if (followUps[id]) {
                    return (
                      <SortableCard key={id} id={id} className="sm:col-span-1 xl:col-span-3">
                        <SummaryCard item={followUps[id]} />
                      </SortableCard>
                    );
                  }

                  if (id === 'month-calendar') {
                    return (
                      <SortableCard key={id} id={id} className="sm:col-span-2 xl:col-span-8 xl:row-span-6">
                        <Card className="h-full overflow-hidden flex flex-col">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 shrink-0">
                            <div>
                              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-indigo-600" /> {monthLabel}
                              </h2>
                              <p className="text-[11px] text-stone-400 font-medium">Sales activity and customer touchpoints</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button onClick={goToPreviousMonth} className="p-1.5 rounded-md border border-stone-200 text-stone-500 hover:bg-stone-50">
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={goToNextMonth} className="p-1.5 rounded-md border border-stone-200 text-stone-500 hover:bg-stone-50">
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                              <CardActions />
                            </div>
                          </div>

                          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEventDragEnd}>
                            <div className="overflow-x-auto rounded-xl border border-stone-100 bg-stone-100 flex-1 flex flex-col min-h-0">
                              <div className="grid grid-cols-7 min-w-[760px] xl:min-w-0 gap-px flex-1">
                              {days.map((day) => (
                                <div key={day} className="bg-stone-50/80 py-2 text-center text-[11px] font-bold text-stone-400">
                                  {day}
                                </div>
                              ))}

                              {calendarCells.map((day) => (
                                <CalendarDayCell
                                  key={day.key}
                                  day={day}
                                  events={events.filter((event) => event.date === day.key)}
                                  todayKey={todayKey}
                                />
                              ))}
                              </div>
                            </div>
                          </DndContext>
                        </Card>
                      </SortableCard>
                    );
                  }

                  if (id === 'today-agenda') {
                    return (
                      <SortableCard key={id} id={id} className="sm:col-span-2 xl:col-span-4 xl:row-span-6">
                        <Card className="h-full flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-indigo-600" /> Today agenda
                                </h2>
                                <p className="text-[11px] text-stone-400 font-medium">Prioritized CRM activities</p>
                              </div>
                              <CardActions />
                            </div>

                            <div className="space-y-3">
                              {agenda.map((event) => {
                                const Icon = event.icon;
                                return (
                                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-xl border border-stone-100 hover:bg-stone-50/70 transition-colors">
                                    <div className={`p-2 rounded-lg ${event.color} shrink-0`}>
                                      <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="text-xs font-bold text-stone-900 truncate">{event.title}</div>
                                        <div className="text-[10px] font-bold text-stone-400">{event.time}</div>
                                      </div>
                                      <div className="text-[11px] text-stone-500 mt-0.5">{event.company}</div>
                                      <div className="flex items-center justify-between mt-2">
                                        <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 rounded-full px-2 py-0.5">{event.type}</span>
                                        <span className="text-[10px] font-semibold text-stone-400">{event.status}</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </Card>
                      </SortableCard>
                    );
                  }

                  if (id === 'overdue-follow-ups') {
                    return (
                      <SortableCard key={id} id={id} className="sm:col-span-2 xl:col-span-6 xl:row-span-2">
                        <Card className="h-full">
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-600" /> Overdue follow-ups
                            </h2>
                            <CardActions />
                          </div>
                          <div className="space-y-3 text-xs">
                            {['Send pricing update to Global Logistics', 'Call back procurement lead at Acme Corp', 'Confirm demo slot with Bright Retail'].map((item) => (
                              <div key={item} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-b-0">
                                <span className="font-semibold text-stone-700">{item}</span>
                                <span className="text-[10px] font-bold text-rose-500 bg-rose-50 rounded-full px-2 py-0.5">Overdue</span>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </SortableCard>
                    );
                  }

                  if (id === 'upcoming-commitments') {
                    return (
                      <SortableCard key={id} id={id} className="sm:col-span-2 xl:col-span-6 xl:row-span-2">
                        <Card className="h-full">
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Upcoming commitments
                            </h2>
                            <CardActions />
                          </div>
                          <div className="space-y-3 text-xs">
                            {['Renewal review with Nexus Health', 'Prepare executive deck for Fintech Solutions', 'Send Q3 pipeline summary'].map((item) => (
                              <div key={item} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-b-0">
                                <span className="font-semibold text-stone-700">{item}</span>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5">Scheduled</span>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </SortableCard>
                    );
                  }

                  return null;
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
