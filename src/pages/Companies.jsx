import React from 'react';
import { DataTable } from '../components/common';
import { Badge } from '../components/ui';

export default function Companies() {
  const columns = [
    { key: 'name', label: 'Company Name' },
    { key: 'industry', label: 'Industry' },
    { key: 'size', label: 'Size' },
    { key: 'contacts', label: 'Contacts' },
    { key: 'status', label: 'Status', render: (value) => <Badge variant={value === 'Active' ? 'success' : 'default'}>{value}</Badge> }
  ];

  const data = [
    { name: 'Acme Corp', industry: 'Technology', size: '50-100', contacts: 15, status: 'Active' },
    { name: 'Tech Inc', industry: 'Software', size: '100-500', contacts: 23, status: 'Active' },
    { name: 'StartUp Ltd', industry: 'Fintech', size: '10-50', contacts: 8, status: 'Inactive' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your business partners</p>
      </div>
      <DataTable columns={columns} data={data} pageSize={10} primaryActionLabel="Add Organization" />
    </div>
  );
}
