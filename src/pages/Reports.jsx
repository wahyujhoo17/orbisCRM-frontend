import React, { useState, useMemo } from 'react';
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
  ComposedChart,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  Download,
  Filter,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  DollarSign
} from 'lucide-react';
import Card, { CardActions } from '../components/ui/Card';
import SortableCard from '../components/ui/SortableCard';

const revenueData = [
  { name: 'Q1', revenue: 120000, target: 100000 },
  { name: 'Q2', revenue: 150000, target: 130000 },
  { name: 'Q3', revenue: 180000, target: 160000 },
  { name: 'Q4', revenue: 210000, target: 190000 },
];

const leadSourceData = [
  { name: 'Organic Search', value: 45, color: '#0ea5e9' }, // Light blue
  { name: 'Referral', value: 25, color: '#f59e0b' },      // Yellow/Orange
  { name: 'Social Media', value: 20, color: '#ef4444' },  // Red
  { name: 'Direct', value: 10, color: '#ec4899' },        // Pink
];

const TICKS = 80;
const tickData = [];
const totalLeads = leadSourceData.reduce((acc, curr) => acc + curr.value, 0);

leadSourceData.forEach(source => {
  const numTicks = Math.round((source.value / totalLeads) * TICKS);
  for (let i = 0; i < numTicks; i++) {
    tickData.push({ ...source, value: 1 });
  }
});

const conversionData = [
  { month: 'Jan', current: 7.5, previous: 4.0 },
  { month: 'Feb', current: 8.4, previous: 4.8 },
  { month: 'Mar', current: 7.8, previous: 4.0 },
  { month: 'Apr', current: 8.4, previous: 4.8 },
  { month: 'May', current: 7.6, previous: 3.0 },
  { month: 'Jun', current: 9.5, previous: 5.0 },
  { month: 'Jul', current: 8.2, previous: 4.8 },
  { month: 'Aug', current: 7.0, previous: 4.0 },
  { month: 'Sep', current: 7.0, previous: 3.0 },
  { month: 'Oct', current: 8.5, previous: 4.0 },
];

const kpiCards = [
  {
    id: 'kpi-0',
    title: 'Customer Acquisition Cost',
    value: '$245.00',
    change: '-12.5%',
    trend: 'down',
    subtext: 'vs previous quarter',
    icon: DollarSign,
    positiveIsDown: true,
  },
  {
    id: 'kpi-1',
    title: 'Customer Lifetime Value',
    value: '$4,250',
    change: '+18.4%',
    trend: 'up',
    subtext: 'vs previous quarter',
    icon: TrendingUp,
  },
  {
    id: 'kpi-2',
    title: 'Average Sales Cycle',
    value: '24 Days',
    change: '-2 Days',
    trend: 'down',
    subtext: 'improvement',
    icon: Target,
    positiveIsDown: true,
  }
];

const defaultCardOrder = [
  'kpi-0',
  'kpi-1',
  'kpi-2',
  'revenue-vs-target',
  'leads-by-source',
  'conversion-rate',
];

function getStoredCardOrder() {
  const stored = localStorage.getItem('reports-card-order');
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
  const isPositive = kpi.positiveIsDown ? kpi.trend === 'down' : kpi.trend === 'up';
  
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
          <span className={`flex items-center gap-0.5 font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {kpi.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {kpi.change}
          </span>
          <span className="text-stone-400 font-medium">{kpi.subtext}</span>
        </div>
      </div>
    </Card>
  );
}

function RevenueTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-3 min-w-[150px]">
        <p className="text-stone-500 text-xs font-bold mb-2 uppercase tracking-wider">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-stone-600 font-semibold">{entry.name}</span>
              </div>
              <span className="font-bold text-stone-900">${(entry.value).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

function RevenueVsTargetCard() {
  return (
    <Card className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" /> Revenue vs Target
          </h2>
          <p className="text-[11px] text-stone-400 font-medium">Quarterly financial performance</p>
        </div>
        <CardActions />
      </div>
      
      <div className="h-[300px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#78716c', fontSize: 11, fontWeight: 600 }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => `$${value/1000}k`} 
              tick={{ fill: '#78716c', fontSize: 11, fontWeight: 600 }} 
            />
            <Tooltip content={<RevenueTooltip />} cursor={{ fill: '#fafaf9' }} />
            <Legend 
              iconType="circle" 
              wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '20px', color: '#57534e' }} 
            />
            <Bar 
              dataKey="revenue" 
              name="Actual Revenue" 
              fill="url(#colorRevenue)" 
              radius={[6, 6, 0, 0]} 
              barSize={40} 
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              name="Target Revenue" 
              stroke="#94a3b8" 
              strokeWidth={3}
              strokeDasharray="6 4"
              dot={{ r: 4, fill: '#ffffff', stroke: '#94a3b8', strokeWidth: 2.5 }}
              activeDot={{ r: 6, fill: '#94a3b8', stroke: '#ffffff', strokeWidth: 2.5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function CustomPieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const originalData = payload[0].payload;
    
    if (originalData) {
      return (
        <div className="bg-white border border-stone-200 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] px-3 py-2 text-xs font-bold flex items-center gap-2 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: originalData.color }} />
          <span className="text-stone-700">{originalData.name}</span>
          <span className="text-stone-900 ml-1">{originalData.value}%</span>
        </div>
      );
    }
  }
  return null;
}

function LeadsBySourceCard() {
  return (
    <Card className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-indigo-600" /> Leads by Source
          </h2>
          <p className="text-[11px] text-stone-400 font-medium">Distribution of incoming leads</p>
        </div>
        <CardActions />
      </div>

      <div className="flex-1 flex items-center justify-center h-[300px] px-2 overflow-hidden">
        <div className="relative w-[200px] h-[200px] flex-shrink-0 flex items-center justify-center">
          {/* Inner background circle with subtle shadow */}
          <div className="absolute inset-0 m-auto w-[148px] h-[148px] rounded-full bg-[#fdfdfd] shadow-[inset_0px_3px_12px_rgba(0,0,0,0.06)] border border-stone-100" />
          
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomPieTooltip />} cursor={{ fill: 'transparent' }} isAnimationActive={false} />
              
              {/* Visible segmented pie (UI only) */}
              <Pie
                data={tickData}
                cx="50%"
                cy="50%"
                innerRadius={76}
                outerRadius={96}
                paddingAngle={2.5}
                dataKey="value"
                stroke="none"
                cornerRadius={4}
                startAngle={90}
                endAngle={-270}
                isAnimationActive={true}
                activeShape={null}
              >
                {tickData.map((entry, index) => (
                  <Cell key={`cell-visible-${index}`} fill={entry.color} style={{ pointerEvents: 'none' }} />
                ))}
              </Pie>

              {/* Invisible solid pie (Interaction only, no gaps) */}
              <Pie
                data={leadSourceData}
                cx="50%"
                cy="50%"
                innerRadius={76}
                outerRadius={96}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}
                isAnimationActive={false}
                activeShape={null}
              >
                {leadSourceData.map((entry, index) => (
                  <Cell key={`cell-invisible-${index}`} fill="rgba(255,255,255,0.01)" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Custom Legend */}
        <div className="flex-1 flex flex-col justify-center pl-6 gap-5 min-w-[120px]">
          {leadSourceData.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="font-bold text-[13px] whitespace-nowrap" style={{ color: item.color }}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function ConversionTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-stone-100 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.1)] px-5 py-4 min-w-[220px]">
        <div className="flex justify-center mb-4 pb-3 border-b border-stone-100">
          <span className="text-stone-800 text-[14px] font-medium">{label} 20, 2024</span>
        </div>
        <div className="space-y-3.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-[14px]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-stone-600">{entry.name}</span>
              </div>
              <span className="font-bold text-stone-900">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

function ConversionRateCard() {
  return (
    <Card className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" /> Conversion Rate Trend
          </h2>
          <p className="text-[11px] text-stone-400 font-medium">Monthly lead-to-win conversion percentage</p>
        </div>
        <CardActions />
      </div>

      <div className="h-[250px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={conversionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={true} horizontal={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#78716c', fontSize: 12, fontWeight: 500 }} 
              dy={15} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => `${value}%`} 
              tick={{ fill: '#78716c', fontSize: 12, fontWeight: 500 }} 
              dx={-5}
            />
            <Tooltip 
              content={<ConversionTooltip />} 
              cursor={{ stroke: '#3b82f6', strokeWidth: 1.5, strokeDasharray: '4 4' }} 
            />
            <Area 
              type="linear" 
              dataKey="previous" 
              name="Previous Year"
              stroke="#ef4444" 
              strokeWidth={2} 
              fillOpacity={1}
              fill="url(#colorPrevious)"
              activeDot={{ r: 5, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 3 }}
            />
            <Area 
              type="linear" 
              dataKey="current" 
              name="Current Year"
              stroke="#3b82f6" 
              strokeWidth={2} 
              fillOpacity={1}
              fill="url(#colorCurrent)"
              activeDot={{ r: 5, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default function Reports() {
  const [timeRange, setTimeRange] = useState('This Year');
  const [cardOrder, setCardOrder] = useState(getStoredCardOrder);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const cardMap = useMemo(() => {
    const cards = new Map();
    kpiCards.forEach((kpi) => {
      cards.set(kpi.id, {
        id: kpi.id,
        className: 'col-span-12 sm:col-span-4',
        content: <KpiCard kpi={kpi} />,
      });
    });
    cards.set('revenue-vs-target', {
      id: 'revenue-vs-target',
      className: 'col-span-12 xl:col-span-8',
      content: <RevenueVsTargetCard />,
    });
    cards.set('leads-by-source', {
      id: 'leads-by-source',
      className: 'col-span-12 xl:col-span-4',
      content: <LeadsBySourceCard />,
    });
    cards.set('conversion-rate', {
      id: 'conversion-rate',
      className: 'col-span-12',
      content: <ConversionRateCard />,
    });
    return cards;
  }, []);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setCardOrder((items) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const nextItems = arrayMove(items, oldIndex, newIndex);
      localStorage.setItem('reports-card-order', JSON.stringify(nextItems));
      return nextItems;
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#fafafa]">
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-6 max-w-[1440px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-stone-200/60">
            <div>
              <h1 className="text-xl font-bold text-stone-900 tracking-tight">Analytics & Reports</h1>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Detailed insights into revenue, lead sources, and conversion rates.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white border border-stone-200 rounded-lg p-1 text-xs font-semibold text-stone-700 shadow-2xs">
                {['This Quarter', 'This Year', 'All Time'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-md transition-all ${timeRange === range ? 'bg-stone-900 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>

              <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-stone-200 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-50 transition-colors shadow-2xs">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
              </button>
              
              <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-2xs">
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
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
