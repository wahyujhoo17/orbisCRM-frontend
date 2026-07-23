import React from 'react';
import { useParams } from 'react-router-dom';
import RecordDetailView from '../components/detail/RecordDetailView';

const mockLeadsData = {
  'LD-1001': {
    id: 'LD-1001',
    name: 'Alex Stirling',
    first_name: 'Alex',
    last_name: 'Stirling',
    email: 'alex.stirling@nexushealth.com',
    mobile_no: '+1 (555) 019-2834',
    company: 'Nexus Health',
    lead_status: 'New',
    industry: 'Healthcare',
    territory: 'North America',
    assigned_to: 'Sarah Chen',
    created_at: '2026-07-16',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
    value: 120000,
    purpose: 'Healthcare Equipment Purchase'
  },
  'LD-1002': {
    id: 'LD-1002',
    name: 'Elena Rostova',
    first_name: 'Elena',
    last_name: 'Rostova',
    email: 'elena.r@brightretail.co.uk',
    mobile_no: '+44 20 7946 0958',
    company: 'Bright Retail',
    lead_status: 'Qualified',
    industry: 'Retail',
    territory: 'Europe',
    assigned_to: 'Marcus Thorne',
    created_at: '2026-07-15',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
    value: 85000,
    purpose: 'POS System Upgrade'
  }
};

const defaultLead = {
  id: 'LD-1000',
  name: 'Ronald Richards',
  first_name: 'Ronald',
  last_name: 'Richards',
  email: 'ronald.richards@example.com',
  mobile_no: '+64 21 890 1234',
  company: 'Richards Corp',
  lead_status: 'Contacted',
  industry: 'Finance & Banking',
  territory: 'APAC',
  assigned_to: 'Sarah Chen',
  created_at: '2025-03-02',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  value: 450000,
  purpose: 'New Purchase'
};

export default function LeadDetail() {
  const { id } = useParams();
  const record = mockLeadsData[id] || { ...defaultLead, id: id || 'LD-1000' };

  return <RecordDetailView record={record} recordType="lead" />;
}
