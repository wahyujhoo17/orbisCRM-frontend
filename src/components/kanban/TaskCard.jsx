import React from 'react';
import { Folder, Zap, Sparkles, CheckCircle2, MoreVertical, Link, Calendar, MessageSquare, Flag } from 'lucide-react';

const priorityColors = {
  Urgent: 'text-rose-600',
  High: 'text-orange-600',
  Normal: 'text-rose-400',
  Low: 'text-emerald-500'
};

export default function TaskCard({ task }) {
  return (
    <div className="bg-white border border-stone-200/60 rounded-xl p-3.5 hover:shadow-lg transition-all cursor-pointer group flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-500">
          <Link className="w-3 h-3 text-stone-400" />
          <span>{task.id}</span>
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-semibold ${priorityColors[task.priority]}`}>
          <Flag className="w-3 h-3 fill-current" />
          {task.priority}
        </div>
      </div>

      {/* Main Content */}
      <div>
        <h4 className="text-[13px] font-bold text-stone-900 leading-tight mb-1">{task.title}</h4>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500">
          <span>↘</span>
          <span className="text-[13px]">{task.projectIcon}</span>
          <span>{task.project}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-2 py-1 bg-stone-50 border border-stone-200/70 rounded w-fit text-[10px] font-semibold text-stone-600">
        <Calendar className="w-3 h-3 text-stone-400" />
        <span>Due to: {task.dueDate}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-1">
        {/* Avatars */}
        {task.users && (
          <div className="flex items-center -space-x-1.5">
            {task.users.map((user, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 border-white bg-stone-200 flex items-center justify-center text-[8px] font-bold text-stone-600 overflow-hidden shadow-sm"
              >
                {typeof user === 'string' && user.startsWith('+') ? (
                  <span>{user}</span>
                ) : (
                  <img src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&q=80&${task.id}${i}`} className="w-full h-full object-cover" alt="" />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {task.comments > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-500">
              <MessageSquare className="w-3 h-3 text-stone-400" />
              <span>{task.comments}</span>
            </div>
          )}
          <span className="text-[10px] font-semibold text-stone-500">{task.date}</span>
        </div>
      </div>
    </div>
  );
}