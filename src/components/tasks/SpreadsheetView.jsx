import React from 'react';
import DataTable from '../common/DataTable';
import { Flag, Link, Calendar } from 'lucide-react';

const priorityColors = {
  Urgent: 'text-rose-600',
  High: 'text-orange-600',
  Normal: 'text-rose-400',
  Low: 'text-emerald-500'
};

const columns = [
  {
    key: 'title',
    label: 'TASK TITLE',
    render: (value, row) => (
      <div>
        <div className="font-bold text-stone-900">{value}</div>
        <div className="text-xs text-stone-500 font-medium flex items-center gap-1 mt-0.5">
          <Link className="w-3 h-3" /> {row.id}
        </div>
      </div>
    )
  },
  {
    key: 'project',
    label: 'PROJECT',
    render: (value, row) => (
      <div className="flex items-center gap-1.5 text-sm font-medium text-stone-700">
        <span>{row.projectIcon}</span>
        <span>{value}</span>
      </div>
    )
  },
  {
    key: 'priority',
    label: 'PRIORITY',
    render: (value) => (
      <div className={`flex items-center gap-1 text-[11px] font-semibold ${priorityColors[value]}`}>
        <Flag className="w-3 h-3 fill-current" />
        {value}
      </div>
    )
  },
  {
    key: 'dueDate',
    label: 'DUE DATE',
    render: (value) => (
      <div className="flex items-center gap-1.5 text-sm text-stone-600">
        <Calendar className="w-3.5 h-3.5 text-stone-400" />
        {value}
      </div>
    )
  },
  {
    key: 'columnId',
    label: 'STATUS',
    render: (value) => (
      <span className="px-2 py-1 rounded-md bg-stone-100 text-stone-700 text-[11px] font-bold uppercase tracking-wider">
        {value.replace('-', ' ')}
      </span>
    )
  }
];

export default function SpreadsheetView({ tasks }) {
  return (
    <div className="flex-1 p-6 h-full overflow-hidden flex flex-col">
      <DataTable 
        columns={columns} 
        data={tasks} 
        pageSize={25}
        primaryActionLabel="Add Task"
      />
    </div>
  );
}
