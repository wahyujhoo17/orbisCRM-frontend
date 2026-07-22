import React, { useMemo, useState } from 'react';
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
import {
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Calendar,
  Clock,
  Phone,
  Mail,
  Target,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Card, { CardActions } from '../components/ui/Card';
import SortableCard from '../components/ui/SortableCard';

const kpiCards = [
  {
    id: 'total-revenue',
    title: 'Total Revenue',
    value: '$428,500',
    change: '+18.4%',
    trend: 'up',
    subtext: 'vs previous month',
    icon: DollarSign,
  },
  {
    id: 'deals-won',
    title: 'Deals Won',
    value: '34',
    change: '+12.5%',
    trend: 'up',
    subtext: '68% win rate',
    icon: Briefcase,
  },
  {
    id: 'new-leads',
    title: 'New Leads',
    value: '1,240',
    change: '+8.2%',
    trend: 'up',
    subtext: '142 needs follow-up',
    icon: Users,
  },
  {
    id: 'avg-deal-value',
    title: 'Avg. Deal Value',
    value: '$12,600',
    change: '-2.1%',
    trend: 'down',
    subtext: 'Target: $14,000',
    icon: Target,
  }
];

const revenueData = [
  { month: 'Jan', actual: 28, target: 35 },
  { month: 'Feb', actual: 42, target: 45 },
  { month: 'Mar', actual: 39, target: 52 },
  { month: 'Apr', actual: 58, target: 62 },
  { month: 'May', actual: 64, target: 70 },
  { month: 'Jun', actual: 82, target: 78 },
  { month: 'Jul', actual: 96, target: 88 },
];

const pipelineFunnel = [
  { stage: 'Lead / Discovery', count: 42, value: '$520,000', percentage: 100, color: 'bg-stone-300' },
  { stage: 'Qualified', count: 28, value: '$380,000', percentage: 75, color: 'bg-blue-500' },
  { stage: 'Proposal Sent', count: 18, value: '$240,000', percentage: 50, color: 'bg-indigo-500' },
  { stage: 'Negotiation', count: 11, value: '$165,000', percentage: 32, color: 'bg-amber-500' },
  { stage: 'Closed Won', count: 8, value: '$112,000', percentage: 20, color: 'bg-emerald-500' }
];

const recentDeals = [
  {
    id: 1,
    name: 'Enterprise Cloud Migration',
    company: 'Acme Corp',
    stage: 'Negotiation',
    stageColor: 'bg-amber-50 text-amber-700 border-amber-200',
    value: '$85,000',
    owner: 'Kamil Bachanek',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&q=80',
    closeDate: 'Jul 24, 2024'
  },
  {
    id: 2,
    name: 'Mobile App Redesign',
    company: 'Fintech Solutions',
    stage: 'Proposal Sent',
    stageColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    value: '$42,000',
    owner: 'Sarah Connor',
    ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&q=80',
    closeDate: 'Jul 28, 2024'
  },
  {
    id: 3,
    name: 'Annual SaaS Subscription',
    company: 'Global Logistics',
    stage: 'Qualified',
    stageColor: 'bg-blue-50 text-blue-700 border-blue-200',
    value: '$120,000',
    owner: 'Kamil Bachanek',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&q=80',
    closeDate: 'Aug 05, 2024'
  },
  {
    id: 4,
    name: 'Security Audit & Setup',
    company: 'Nexus Health',
    stage: 'Closed Won',
    stageColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    value: '$35,000',
    owner: 'Alex Rivers',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&q=80',
    closeDate: 'Jul 15, 2024'
  },
  {
    id: 5,
    name: 'Customer Data Platform',
    company: 'Bright Retail',
    stage: 'Negotiation',
    stageColor: 'bg-amber-50 text-amber-700 border-amber-200',
    value: '$67,500',
    owner: 'Nina Park',
    ownerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&q=80',
    closeDate: 'Aug 12, 2024'
  }
];

const activities = [
  {
    id: 1,
    icon: Phone,
    iconColor: 'bg-blue-50 text-blue-600',
    title: 'Call scheduled with Acme Corp',
    desc: 'Discuss contract amendment & deployment timeline',
    time: '10 min ago',
    user: 'Kamil'
  },
  {
    id: 2,
    icon: Mail,
    iconColor: 'bg-indigo-50 text-indigo-600',
    title: 'Proposal sent to Fintech Solutions',
    desc: 'Quote #2024-88 sent to sarah@fintech.com',
    time: '1 hour ago',
    user: 'Sarah'
  },
  {
    id: 3,
    icon: Briefcase,
    iconColor: 'bg-emerald-50 text-emerald-600',
    title: 'Deal moved to Closed Won',
    desc: 'Nexus Health signed contract ($35,000)',
    time: '3 hours ago',
    user: 'Alex'
  },
  {
    id: 4,
    icon: Calendar,
    iconColor: 'bg-amber-50 text-amber-600',
    title: 'Demo presentation completed',
    desc: 'Global Logistics stakeholder review meeting',
    time: '5 hours ago',
    user: 'Kamil'
  }
];

const defaultCardOrder = [
  'total-revenue',
  'deals-won',
  'new-leads',
  'avg-deal-value',
  'revenue-trend',
  'pipeline-stage',
  'high-value-opportunities',
  'recent-sales-activity',
];

function getStoredCardOrder() {
  const stored = localStorage.getItem('dashboard-card-order');
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
}

function KpiCard({ kpi }) {
  const Icon = kpi.icon;

  return (
    <Card padding="sm" className="h-full flex flex-col justify-between hover:shadow-xs transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-[14px] text-stone-800">
          <Icon className="w-4 h-4 text-stone-600" />
          <span>{kpi.title}</span>
        </div>
        <CardActions />
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold text-stone-900 leading-tight">{kpi.value}</div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px]">
          <span className={`flex items-center gap-0.5 font-semibold ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {kpi.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {kpi.change}
          </span>
          <span className="text-stone-400 font-medium">{kpi.subtext}</span>
        </div>
      </div>
    </Card>
  );
}

function RevenueTrendCard() {
  return (
    <Card className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" /> Revenue & Forecast Trend
          </h2>
          <p className="text-[11px] text-stone-400 font-medium">Monthly revenue progression ($k)</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-stone-600">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" /> Actual Revenue
            </span>
            <span className="flex items-center gap-1.5 text-stone-400">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300 inline-block" /> Target Forecast
            </span>
          </div>
          <CardActions />
        </div>
      </div>

      <div className="w-full h-[230px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="crmRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.26} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e7e5e4" strokeDasharray="4 4" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a8a29e', fontSize: 11, fontWeight: 600 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value}k`}
              tick={{ fill: '#a8a29e', fontSize: 11, fontWeight: 700 }}
            />
            <Tooltip
              cursor={{ stroke: '#d6d3d1', strokeDasharray: '4 4' }}
              contentStyle={{
                border: '1px solid #e7e5e4',
                borderRadius: 10,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                fontSize: 12,
                fontWeight: 600,
              }}
              formatter={(value, name) => [`$${value}k`, name === 'actual' ? 'Actual Revenue' : 'Target Forecast']}
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#4f46e5"
              strokeWidth={3}
              fill="url(#crmRevenueGrad)"
              dot={{ r: 4, fill: '#ffffff', stroke: '#4f46e5', strokeWidth: 2.5 }}
              activeDot={{ r: 5, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#cbd5e1"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function PipelineStageCard() {
  return (
    <Card className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600" /> Pipeline Stage Breakdown
        </h2>
        <CardActions />
      </div>

      <div className="space-y-3 my-auto">
        {pipelineFunnel.map((item) => (
          <div key={item.stage} className="space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-stone-700">
              <span>{item.stage} <span className="text-stone-400 font-normal">({item.count})</span></span>
              <span className="font-bold">{item.value}</span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div className={`h-full ${item.color} rounded-full transition-all duration-300`} style={{ width: `${item.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-600">
        <span>Total Pipeline Value</span>
        <span className="text-stone-900 font-bold">$1,425,000</span>
      </div>
    </Card>
  );
}

function HighValueOpportunitiesCard() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" /> High Value Opportunities
          </h2>
          <p className="text-[11px] text-stone-400 font-medium">Deals with highest probability & revenue impact</p>
        </div>
        <CardActions />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200/60 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              <th className="py-2.5 px-2">Deal Name</th>
              <th className="py-2.5 px-2">Stage</th>
              <th className="py-2.5 px-2">Value</th>
              <th className="py-2.5 px-2">Owner</th>
              <th className="py-2.5 px-2">Close Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-xs">
            {recentDeals.map((deal) => (
              <tr key={deal.id} className="hover:bg-stone-50/70 transition-colors">
                <td className="py-3 px-2">
                  <div className="font-semibold text-stone-900">{deal.name}</div>
                  <div className="text-[11px] text-stone-400 flex items-center gap-1">{deal.company}</div>
                </td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${deal.stageColor}`}>{deal.stage}</span>
                </td>
                <td className="py-3 px-2 font-bold text-stone-900">{deal.value}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-1.5">
                    <img src={deal.ownerAvatar} alt={deal.owner} className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-stone-700 font-medium">{deal.owner}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-stone-500 font-medium">{deal.closeDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function RecentSalesActivityCard() {
  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" /> Recent Sales Activity
          </h2>
          <CardActions />
        </div>

        <div className="space-y-4">
          {activities.map((act) => {
            const Icon = act.icon;
            return (
              <div key={act.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${act.iconColor} shrink-0 mt-0.5`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-stone-900 leading-snug">{act.title}</div>
                  <div className="text-[11px] text-stone-500 truncate mt-0.5">{act.desc}</div>
                  <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-1 font-medium">
                    <span>{act.time}</span>
                    <span>•</span>
                    <span>By {act.user}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button className="w-full mt-4 py-2 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/70 rounded-lg text-xs font-semibold transition-colors">
        View Full Audit Log
      </button>
    </Card>
  );
}

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('This Month');
  const [cardOrder, setCardOrder] = useState(getStoredCardOrder);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const cardMap = useMemo(() => {
    const cards = new Map();
    kpiCards.forEach((kpi) => {
      cards.set(kpi.id, {
        id: kpi.id,
        className: 'col-span-12 sm:col-span-6 xl:col-span-3',
        content: <KpiCard kpi={kpi} />,
      });
    });
    cards.set('revenue-trend', {
      id: 'revenue-trend',
      className: 'col-span-12 xl:col-span-8',
      content: <RevenueTrendCard />,
    });
    cards.set('pipeline-stage', {
      id: 'pipeline-stage',
      className: 'col-span-12 xl:col-span-4',
      content: <PipelineStageCard />,
    });
    cards.set('high-value-opportunities', {
      id: 'high-value-opportunities',
      className: 'col-span-12 xl:col-span-8',
      content: <HighValueOpportunitiesCard />,
    });
    cards.set('recent-sales-activity', {
      id: 'recent-sales-activity',
      className: 'col-span-12 xl:col-span-4',
      content: <RecentSalesActivityCard />,
    });
    return cards;
  }, []);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setCardOrder((items) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const nextItems = arrayMove(items, oldIndex, newIndex);
      localStorage.setItem('dashboard-card-order', JSON.stringify(nextItems));
      return nextItems;
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#fafafa]">
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-6 max-w-[1440px] mx-auto space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200/60">
            <div>
              <h1 className="text-xl font-bold text-stone-900 tracking-tight">CRM Sales Dashboard</h1>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Overview of customer pipeline, revenue metrics, and active deals.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white border border-stone-200 rounded-lg p-1 text-xs font-semibold text-stone-700 shadow-2xs">
                {['This Week', 'This Month', 'Quarter'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-md transition-all ${timeRange === range ? 'bg-stone-900 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>

              <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-2xs">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Deal</span>
              </button>
            </div>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={cardOrder} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-12 gap-5">
                {cardOrder.map((id) => {
                  const card = cardMap.get(id);
                  if (!card) return null;

                  return (
                    <SortableCard key={card.id} id={card.id} className={card.className}>
                      {card.content}
                    </SortableCard>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
