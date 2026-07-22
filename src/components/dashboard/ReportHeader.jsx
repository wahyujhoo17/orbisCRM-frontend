import React from 'react';
import { MoreHorizontal, Share2, Users, Star, Check, Square, Edit, Trash2 } from 'lucide-react';
import Dropdown, { DropdownItem, DropdownDivider } from '../ui/Dropdown';

export default function ReportHeader() {
  const members = Array.from({ length: 6 });
  return (
    <div className="px-6 py-5 bg-white border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <h2 className="text-lg font-bold text-stone-900">Tasks report</h2>
          <span className="text-xs text-stone-400 font-medium">Public</span>
        </div>
        <p className="text-xs text-stone-500 max-w-md">
          This report tracks all open tasks across the team, grouped by status and priority.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Member Avatars */}
        <div className="flex items-center -space-x-2 mr-2">
          {members.map((_, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full border-2 border-white bg-stone-200 flex items-center justify-center text-[10px] font-semibold text-stone-500 overflow-hidden"
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          <button className="w-7 h-7 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors">
            <Users className="w-3.5 h-3.5" />
          </button>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 shadow-sm transition-colors">
          <Share2 className="w-3.5 h-3.5 text-stone-500" />
          <span>Share</span>
        </button>

        <Dropdown
          trigger={
            <button className="p-1.5 text-stone-500 hover:bg-stone-100 rounded-md transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          }
        >
          <div className="p-2">
            <DropdownItem icon={Edit} label="Edit report" />
            <DropdownItem icon={Square} label="Duplicate" />
            <DropdownItem icon={Square} label="Pin to sidebar" />
            <DropdownDivider />
            <DropdownItem icon={Square} label="Make private" />
            <DropdownItem icon={Trash2} label="Delete report" danger />
          </div>
        </Dropdown>
      </div>
    </div>
  );
}