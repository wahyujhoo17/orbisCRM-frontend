import React from 'react';
import { Square, Zap, Sparkles, TrendingDown, TrendingUp, MoreHorizontal, Edit, Trash2, Maximize2 } from 'lucide-react';
import { stats } from '../../data/mockData';
import Dropdown, { DropdownItem, DropdownDivider } from '../ui/Dropdown';

const MetricIcon = ({ type }) => {
  switch (type) {
    case 'square': return <Square className="w-3.5 h-3.5 text-stone-400" />;
    case 'zap': return <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />;
    case 'sparkles': return <Sparkles className="w-3.5 h-3.5 text-purple-500" />;
    default: return null;
  }
};

// Mini chart visualizations using SVG
const BarChart = () => (
  <svg viewBox="0 0 100 40" className="w-full h-10" preserveAspectRatio="none">
    {[
      { x: 5, h: 15 }, { x: 20, h: 25 }, { x: 35, h: 20 },
      { x: 50, h: 30 }, { x: 65, h: 22 }, { x: 80, h: 35 }
    ].map((b, i) => (
      <rect key={i} x={b.x} y={40 - b.h} width="10" height={b.h} fill="#e7e5e4" rx="2" />
    ))}
  </svg>
);

const ScatterChart = () => (
  <svg viewBox="0 0 100 40" className="w-full h-10" preserveAspectRatio="none">
    {[
      { x: 5, y: 25 }, { x: 15, y: 18 }, { x: 25, y: 30 },
      { x: 35, y: 12 }, { x: 45, y: 22 }, { x: 55, y: 8 },
      { x: 65, y: 28 }, { x: 75, y: 15 }, { x: 85, y: 20 }
    ].map((p, i) => (
      <circle key={i} cx={p.x} cy={p.y} r="2" fill="#a8a29e" />
    ))}
  </svg>
);

const BurndownChart = () => (
  <svg viewBox="0 0 100 60" className="w-full h-24" preserveAspectRatio="none">
    {/* Grid lines */}
    <line x1="0" y1="20" x2="100" y2="20" stroke="#f5f5f4" strokeWidth="0.5" />
    <line x1="0" y1="40" x2="100" y2="40" stroke="#f5f5f4" strokeWidth="0.5" />
    {/* Ideal line */}
    <line x1="0" y1="5" x2="100" y2="55" stroke="#d6d3d1" strokeWidth="1" strokeDasharray="2,2" />
    {/* Actual line */}
    <polyline
      points="0,5 20,12 40,18 60,30 80,42 100,55"
      fill="none"
      stroke="#4f46e5"
      strokeWidth="1.5"
    />
  </svg>
);

export default function MetricsGrid() {
  return (
    <div className="px-6 py-5 bg-stone-50/50 border-b border-stone-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Task Status Widget */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-stone-900">{stats[0].title}</h3>
            <Dropdown
              trigger={
                <button className="p-1 hover:bg-stone-100 rounded transition-colors">
                  <MoreHorizontal className="w-3.5 h-3.5 text-stone-400" />
                </button>
              }
            >
              <div className="p-2">
                <DropdownItem icon={Maximize2} label="Expand" />
                <DropdownItem icon={Edit} label="Edit widget" />
                <DropdownDivider />
                <DropdownItem icon={Trash2} label="Remove" danger />
              </div>
            </Dropdown>
          </div>
          <div className="space-y-2 mb-3">
            {stats[0].mainMetrics.map((m) => (
              <div key={m.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-stone-600">
                  <MetricIcon type={m.icon} />
                  <span>{m.label}</span>
                </div>
                <span className="font-semibold text-stone-900">{m.value}</span>
              </div>
            ))}
          </div>
          <BarChart />
        </div>

        {/* Comments Widget */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-stone-900">{stats[1].title}</h3>
            <Dropdown
              trigger={
                <button className="p-1 hover:bg-stone-100 rounded transition-colors">
                  <MoreHorizontal className="w-3.5 h-3.5 text-stone-400" />
                </button>
              }
            >
              <div className="p-2">
                <DropdownItem icon={Maximize2} label="Expand" />
                <DropdownItem icon={Edit} label="Edit widget" />
                <DropdownDivider />
                <DropdownItem icon={Trash2} label="Remove" danger />
              </div>
            </Dropdown>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-stone-900">{stats[1].mainValue}</span>
            <div className="flex items-center gap-1 text-xs text-rose-600 font-medium">
              <TrendingDown className="w-3 h-3" />
              <span>{stats[1].change}</span>
            </div>
          </div>
          <p className="text-[10px] text-stone-400 mb-3">vs last {stats[1].period}</p>
          <ScatterChart />
        </div>

        {/* Commits Widget */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-stone-900">{stats[2].title}</h3>
            <Dropdown
              trigger={
                <button className="p-1 hover:bg-stone-100 rounded transition-colors">
                  <MoreHorizontal className="w-3.5 h-3.5 text-stone-400" />
                </button>
              }
            >
              <div className="p-2">
                <DropdownItem icon={Maximize2} label="Expand" />
                <DropdownItem icon={Edit} label="Edit widget" />
                <DropdownDivider />
                <DropdownItem icon={Trash2} label="Remove" danger />
              </div>
            </Dropdown>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-stone-900">{stats[2].mainValue}</span>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>{stats[2].change}</span>
            </div>
          </div>
          <p className="text-[10px] text-stone-400 mb-3">vs last {stats[2].period}</p>
          <BarChart />
        </div>

        {/* Burndown Chart Widget */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-stone-900">Burndown chart</h3>
            <Dropdown
              trigger={
                <button className="p-1 hover:bg-stone-100 rounded transition-colors">
                  <MoreHorizontal className="w-3.5 h-3.5 text-stone-400" />
                </button>
              }
            >
              <div className="p-2">
                <DropdownItem icon={Maximize2} label="Expand" />
                <DropdownItem icon={Edit} label="Edit widget" />
                <DropdownDivider />
                <DropdownItem icon={Trash2} label="Remove" danger />
              </div>
            </Dropdown>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <div className="w-3 h-0.5 bg-stone-300" />
              <span>Ideal</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <div className="w-3 h-0.5 bg-indigo-600" />
              <span>Actual</span>
            </div>
          </div>
          <BurndownChart />
        </div>
      </div>
    </div>
  );
}