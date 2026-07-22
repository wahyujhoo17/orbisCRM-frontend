import React from 'react';
import { Package, MoreHorizontal } from 'lucide-react';
import DataTable from '../components/common/DataTable';

// Dummy data for products
const products = [
  {
    id: 'PRD-001',
    name: 'Enterprise CRM License',
    category: 'Software',
    price: 15000,
    unit: 'Yearly',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop',
  },
  {
    id: 'PRD-002',
    name: 'Cloud Storage 1TB',
    category: 'Infrastructure',
    price: 120,
    unit: 'Monthly',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&h=100&fit=crop',
  },
  {
    id: 'PRD-003',
    name: 'On-site Integration Support',
    category: 'Services',
    price: 2500,
    unit: 'One-time',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop',
  },
  {
    id: 'PRD-004',
    name: 'Premium Support Plan',
    category: 'Services',
    price: 500,
    unit: 'Monthly',
    status: 'Inactive',
    image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=100&h=100&fit=crop',
  },
];

const columns = [
  {
    key: 'product',
    label: 'PRODUCT',
    render: (value, row) => (
      <div className="flex items-center gap-3">
        {row.image ? (
          <img src={row.image} alt={row.name} className="w-10 h-10 rounded-lg object-cover border border-stone-200" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center">
            <Package className="w-5 h-5 text-stone-400" />
          </div>
        )}
        <div>
          <div className="font-bold text-stone-900">{row.name}</div>
          <div className="text-xs text-stone-500 font-medium">{row.id}</div>
        </div>
      </div>
    )
  },
  {
    key: 'category',
    label: 'CATEGORY',
    render: (value) => (
      <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-semibold">
        {value}
      </span>
    )
  },
  {
    key: 'price',
    label: 'PRICE',
    render: (value) => (
      <div className="font-bold text-stone-900">
        ${value.toLocaleString()}
      </div>
    )
  },
  {
    key: 'unit',
    label: 'UNIT'
  },
  {
    key: 'status',
    label: 'STATUS',
    render: (value) => (
      <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${
        value === 'Active' 
          ? 'bg-emerald-100 text-emerald-700' 
          : 'bg-stone-100 text-stone-500'
      }`}>
        {value}
      </span>
    )
  }
];

export default function Products() {
  const handleRowClick = (product) => {
    console.log('Clicked product:', product);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your product catalog and pricing</p>
      </div>
      
      <DataTable 
        columns={columns} 
        data={products} 
        onRowClick={handleRowClick}
        pageSize={10}
        primaryActionLabel="Add Product"
      />
    </div>
  );
}
