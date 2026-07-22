import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';

export default function TaskDetail() {
  const { taskId } = useParams();

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <Link to="/tasks" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to Tasks
      </Link>

      <Card>
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="primary">{taskId}</Badge>
            <Badge variant="success">In Progress</Badge>
            <Badge variant="danger">Urgent</Badge>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Task Detail</h1>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Description</h3>
            <p className="text-gray-600">Task details will be displayed here.</p>
          </div>

          <div className="flex gap-2">
            <Button variant="primary">Edit Task</Button>
            <Button variant="secondary">Mark as Done</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
