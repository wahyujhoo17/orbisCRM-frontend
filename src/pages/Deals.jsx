import React from 'react';
import { DataTable } from '../components/common';
import { Badge } from '../components/ui';

export default function Deals() {
  const columns = [
    { key: 'title', label: 'Deal Title' },
    { key: 'company', label: 'Company' },
    { key: 'value', label: 'Value', render: (value) => `$${value.toLocaleString()}` },
    { key: 'stage', label: 'Stage', render: (value) => <Badge variant="primary">{value}</Badge> },
    { key: 'probability', label: 'Probability', render: (value) => `${value}%` }
  ];

  const data = [
    { title: 'Enterprise License', company: 'Acme Corp', value: 50000, stage: 'Negotiation', probability: 75 },
    { title: 'Consulting Package', company: 'Tech Inc', value: 25000, stage: 'Proposal', probability: 60 },
    { title: 'Support Contract', company: 'StartUp Ltd', value: 15000, stage: 'Qualification', probability: 40 }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Deals</h1>
        <p className="text-sm text-stone-500 mt-1">Track your sales pipeline</p>
      </div>
      
      <DataTable columns={columns} data={data} pageSize={10} primaryActionLabel="Add Deal" />
    </div>
  );
}
