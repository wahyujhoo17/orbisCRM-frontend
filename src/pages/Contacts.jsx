import React from 'react';
import { DataTable } from '../components/common';
import { Avatar, Badge } from '../components/ui';

export default function Contacts() {
  const columns = [
    { key: 'name', label: 'Customer', render: (value, row) => (
      <div className="flex items-center gap-3">
        <Avatar name={value} size="sm" />
        <div>
          <div className="font-semibold text-stone-900">{value}</div>
          <div className="text-xs text-stone-400">{row.email}</div>
        </div>
      </div>
    )},
    { key: 'company', label: 'Company' },
    { key: 'phone', label: 'Phone' },
    { key: 'source', label: 'Source' },
    { key: 'status', label: 'Status', render: (value) => <Badge variant={value === 'Active' ? 'success' : 'default'} className="rounded-md bg-white border border-stone-200 text-stone-600 uppercase tracking-wide">{value}</Badge> }
  ];

  const data = [
    { id: 1, name: 'Emma Johansson', email: 'emma@nordicsoft.io', company: 'Nordic Soft AB', phone: '+1 234 567 890', source: 'Website', status: 'Active' },
    { id: 2, name: 'Ethan Wilson', email: 'ethan@travelventures.com', company: 'Travel Ventures', phone: '+1 234 567 891', source: 'LinkedIn', status: 'Active' },
    { id: 3, name: 'Isabella Hernandez', email: 'isabella@designstudios.net', company: 'Design Studios', phone: '+1 234 567 892', source: 'Referral', status: 'Inactive' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your business contacts</p>
      </div>
      <DataTable columns={columns} data={data} pageSize={10} primaryActionLabel="Add Contact" />
    </div>
  );
}
