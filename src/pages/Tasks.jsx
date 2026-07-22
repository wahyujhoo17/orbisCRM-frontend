import React, { useState } from 'react';
import ReportMetrics from '../components/dashboard/ReportMetrics';
import ViewTabs from '../components/dashboard/ViewTabs';
import KanbanBoard from '../components/kanban/KanbanBoard';
import SpreadsheetView from '../components/tasks/SpreadsheetView';
import CalendarView from '../components/tasks/CalendarView';
import TimelineView from '../components/tasks/TimelineView';
import { tasks as initialTasks } from '../data/mockData';

export default function Tasks() {
  const [activeTab, setActiveTab] = useState('Board');
  const [tasksData, setTasksData] = useState(initialTasks);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50">
      <div className="flex-1 overflow-y-auto flex flex-col">
        <ReportMetrics />
        <ViewTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 flex flex-col">
          {activeTab === 'Board' && <KanbanBoard tasks={tasksData} setTasks={setTasksData} />}
          {activeTab === 'Spreadsheet' && <SpreadsheetView tasks={tasksData} />}
          {activeTab === 'Calendar' && <CalendarView tasks={tasksData} />}
          {activeTab === 'Timeline' && <TimelineView tasks={tasksData} />}
        </div>
      </div>
    </div>
  );
}
