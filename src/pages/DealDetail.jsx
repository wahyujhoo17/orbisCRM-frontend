import React from 'react';
import { useParams } from 'react-router-dom';
import RecordDetailView from '../components/detail/RecordDetailView';

const mockDealsData = {
  'DL-01': {
    id: 'DL-01',
    name: 'Ronald Richards',
    title: 'Data Migration Project',
    company: 'CloudSync',
    value: 12000,
    stage: 'Lead',
    assigned_to: 'Sarah Chen',
    created_at: '2025-03-02',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    purpose: 'New Purchase'
  },
  'DL-05': {
    id: 'DL-05',
    name: 'Ronald Richards',
    title: 'Q4 Enterprise License',
    company: 'Acme Corp',
    value: 450000,
    stage: 'Negotiation',
    assigned_to: 'Wade Warren',
    created_at: '2025-03-02',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    purpose: 'New Purchase'
  }
};

const defaultDeal = {
  id: 'DL-1000',
  name: 'Ronald Richards',
  title: 'Enterprise License Deal',
  company: 'Richards Corp',
  value: 450000,
  stage: 'In Progress',
  assigned_to: 'Sarah Chen',
  created_at: '2025-03-02',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  purpose: 'New Purchase'
};

export default function DealDetail() {
  const { id } = useParams();
  const record = mockDealsData[id] || { ...defaultDeal, id: id || 'DL-1000' };

  return <RecordDetailView record={record} recordType="deal" />;
}
