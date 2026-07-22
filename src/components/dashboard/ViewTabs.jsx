import React from 'react';
import { Filter, LayoutDashboard } from 'lucide-react';

const tabs = ['Spreadsheet', 'Board', 'Calendar', 'Timeline'];

export default function ViewTabs({ activeTab = 'Board', onTabChange }) {
  return (
    <div className="px-6 flex items-center justify-between border-b border-stone-200/80">
      {/* Tabs */}
      <div className="flex gap-6">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange && onTabChange(tab)}
              className={`pb-3 pt-2 text-[13px] font-semibold transition-colors relative ${
                isActive ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-stone-900 rounded-t-sm" />
              )}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pb-2">
        <button className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-600 hover:text-stone-900 transition-colors">
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Widgets</span>
        </button>
        <button className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-600 hover:text-stone-900 transition-colors">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter</span>
        </button>
      </div>
    </div>
  );
}