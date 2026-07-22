import React, { useState } from 'react';
import { 
  Mail,
  Phone,
  Building2,
  MapPin,
  UserCircle2
} from 'lucide-react';
import { DataTable } from '../components/common';
import { ConfirmModal } from '../components/ui';
import { gooeyToast } from 'goey-toast';

// Dummy Data mapped from project.md schema
const mockLeads = [
  {
    id: 'LD-1001',
    salutation: 'Mr.',
    first_name: 'Alex',
    last_name: 'Stirling',
    name: 'Alex Stirling',
    email: 'alex.stirling@nexushealth.com',
    mobile_no: '+1 (555) 019-2834',
    company_name: 'Nexus Health',
    lead_status: 'New',
    lead_source: 'Website',
    industry: 'Healthcare',
    territory: 'North America',
    assigned_to: 'Sarah Chen',
    created_at: '2026-07-16',
  },
  {
    id: 'LD-1002',
    salutation: 'Ms.',
    first_name: 'Elena',
    last_name: 'Rostova',
    name: 'Elena Rostova',
    email: 'elena.r@brightretail.co.uk',
    mobile_no: '+44 20 7946 0958',
    company_name: 'Bright Retail',
    lead_status: 'Qualified',
    lead_source: 'Referral',
    industry: 'Retail',
    territory: 'Europe',
    assigned_to: 'Marcus Thorne',
    created_at: '2026-07-15',
  },
  {
    id: 'LD-1003',
    salutation: 'Dr.',
    first_name: 'Rajiv',
    last_name: 'Menon',
    name: 'Rajiv Menon',
    email: 'rmenon@fintechsol.io',
    mobile_no: '+65 6789 0123',
    company_name: 'Fintech Solutions',
    lead_status: 'Contacted',
    lead_source: 'Webinar',
    industry: 'Finance',
    territory: 'APAC',
    assigned_to: 'Sarah Chen',
    created_at: '2026-07-14',
  },
  {
    id: 'LD-1004',
    salutation: 'Mr.',
    first_name: 'Thomas',
    last_name: 'Vance',
    name: 'Thomas Vance',
    email: 'tvance@acmecorp.com',
    mobile_no: '+1 (555) 982-1102',
    company_name: 'Acme Corp',
    lead_status: 'Qualified',
    lead_source: 'Cold Call',
    industry: 'Manufacturing',
    territory: 'North America',
    assigned_to: 'James Wilson',
    created_at: '2026-07-12',
  },
  {
    id: 'LD-1005',
    salutation: 'Mrs.',
    first_name: 'Linda',
    last_name: 'Katz',
    name: 'Linda Katz',
    email: 'linda.katz@globalogistics.net',
    mobile_no: '+49 30 1234 5678',
    company_name: 'Global Logistics',
    lead_status: 'Lost',
    lead_source: 'Trade Show',
    industry: 'Logistics',
    territory: 'Europe',
    assigned_to: 'Marcus Thorne',
    created_at: '2026-07-10',
  },
  {
    id: 'LD-1006',
    salutation: 'Mr.',
    first_name: 'Kenji',
    last_name: 'Sato',
    name: 'Kenji Sato',
    email: 'ksato@aitech.jp',
    mobile_no: '+81 3 1234 5678',
    company_name: 'AI Tech Japan',
    lead_status: 'New',
    lead_source: 'Website',
    industry: 'Technology',
    territory: 'APAC',
    assigned_to: 'Sarah Chen',
    created_at: '2026-07-18',
  },
  {
    id: 'LD-1007',
    salutation: 'Ms.',
    first_name: 'Sophia',
    last_name: 'Martinez',
    name: 'Sophia Martinez',
    email: 'smartinez@lumina.co',
    mobile_no: '+34 91 123 4567',
    company_name: 'Lumina Energy',
    lead_status: 'Contacted',
    lead_source: 'Trade Show',
    industry: 'Energy',
    territory: 'Europe',
    assigned_to: 'James Wilson',
    created_at: '2026-07-19',
  },
  {
    id: 'LD-1008',
    salutation: 'Mr.',
    first_name: 'David',
    last_name: 'Kim',
    name: 'David Kim',
    email: 'dkim@koreavision.kr',
    mobile_no: '+82 2 9876 5432',
    company_name: 'Korea Vision',
    lead_status: 'Qualified',
    lead_source: 'Referral',
    industry: 'Retail',
    territory: 'APAC',
    assigned_to: 'Sarah Chen',
    created_at: '2026-07-20',
  },
  {
    id: 'LD-1009',
    salutation: 'Mrs.',
    first_name: 'Amanda',
    last_name: 'Gomez',
    name: 'Amanda Gomez',
    email: 'agomez@startupsynergy.com',
    mobile_no: '+1 (555) 321-9876',
    company_name: 'Startup Synergy',
    lead_status: 'New',
    lead_source: 'Webinar',
    industry: 'Technology',
    territory: 'North America',
    assigned_to: 'Marcus Thorne',
    created_at: '2026-07-21',
  },
  {
    id: 'LD-1010',
    salutation: 'Dr.',
    first_name: 'Hassan',
    last_name: 'Ali',
    name: 'Hassan Ali',
    email: 'hassan.ali@medicare.ae',
    mobile_no: '+971 4 123 4567',
    company_name: 'MediCare Dubai',
    lead_status: 'Contacted',
    lead_source: 'Cold Call',
    industry: 'Healthcare',
    territory: 'EMEA',
    assigned_to: 'James Wilson',
    created_at: '2026-07-22',
  },
  {
    id: 'LD-1011',
    salutation: 'Ms.',
    first_name: 'Isabella',
    last_name: 'Rossi',
    name: 'Isabella Rossi',
    email: 'i.rossi@milanfashion.it',
    mobile_no: '+39 02 8765 4321',
    company_name: 'Milan Fashion',
    lead_status: 'Lost',
    lead_source: 'Website',
    industry: 'Retail',
    territory: 'Europe',
    assigned_to: 'Sarah Chen',
    created_at: '2026-07-23',
  },
  {
    id: 'LD-1012',
    salutation: 'Mr.',
    first_name: 'Lucas',
    last_name: 'Silva',
    name: 'Lucas Silva',
    email: 'lsilva@brasilagro.br',
    mobile_no: '+55 11 98765 4321',
    company_name: 'Brasil Agro',
    lead_status: 'Qualified',
    lead_source: 'Trade Show',
    industry: 'Agriculture',
    territory: 'South America',
    assigned_to: 'Marcus Thorne',
    created_at: '2026-07-24',
  },
  {
    id: 'LD-1013',
    salutation: 'Mr.',
    first_name: 'Chen',
    last_name: 'Wei',
    name: 'Chen Wei',
    email: 'chen.wei@shanghai-tech.cn',
    mobile_no: '+86 21 1234 5678',
    company_name: 'Shanghai Tech',
    lead_status: 'New',
    lead_source: 'Referral',
    industry: 'Technology',
    territory: 'APAC',
    assigned_to: 'James Wilson',
    created_at: '2026-07-25',
  }
];

const statusStyles = {
  'New': 'bg-blue-50 text-blue-600 ring-blue-500/20',
  'Contacted': 'bg-amber-50 text-amber-600 ring-amber-500/20',
  'Qualified': 'bg-emerald-50 text-emerald-600 ring-emerald-500/20',
  'Lost': 'bg-rose-50 text-rose-600 ring-rose-500/20',
};

const sourceStyles = {
  'Website': 'bg-indigo-50 text-indigo-700',
  'Referral': 'bg-purple-50 text-purple-700',
  'Webinar': 'bg-cyan-50 text-cyan-700',
  'Cold Call': 'bg-stone-100 text-stone-700',
  'Trade Show': 'bg-orange-50 text-orange-700',
};

export default function Leads() {
  const [leads, setLeads] = useState(mockLeads);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    // Simulate API delay
    setTimeout(() => {
      setLeads(prev => prev.filter(l => l.id !== leadToDelete.id));
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      gooeyToast.success('Lead deleted', {
        description: `${leadToDelete.name} has been removed from the system.`
      });
      setLeadToDelete(null);
    }, 600);
  };

  const columns = [
    {
      key: 'name',
      label: 'Lead Details',
      render: (_, row) => (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 mt-0.5 text-stone-500 font-bold text-xs">
            {row.first_name[0]}{row.last_name[0]}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-stone-900 truncate">
              {row.salutation} {row.first_name} {row.last_name}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium truncate max-w-full">
                <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                <span className="truncate">{row.email}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium whitespace-nowrap">
                <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                {row.mobile_no}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'company_name',
      label: 'Company & Territory',
      render: (_, row) => (
        <>
          <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5 truncate">
            <Building2 className="w-3.5 h-3.5 text-stone-400" />
            {row.company_name}
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            {row.territory} • {row.industry}
          </div>
        </>
      )
    },
    {
      key: 'lead_status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ring-1 ring-inset ${statusStyles[value] || 'bg-stone-50 text-stone-600 ring-stone-500/20'}`}>
          {value}
        </span>
      )
    },
    {
      key: 'lead_source',
      label: 'Source',
      render: (value) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${sourceStyles[value] || 'bg-stone-100 text-stone-600'}`}>
          {value}
        </span>
      )
    },
    {
      key: 'assigned_to',
      label: 'Assigned To',
      render: (value) => (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
          <UserCircle2 className="w-4 h-4 text-stone-400" />
          {value}
        </div>
      )
    },
    {
      key: 'created_at',
      label: 'Added',
      render: (value) => (
        <div className="text-xs font-medium text-stone-500">
          {new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      )
    },
    // We add these invisible columns so the DataTable can search by them.
    { key: 'email', label: 'Email', render: () => null },
  ].filter(col => col.label !== 'Email'); // Remove email column visually but keep it in keys if we needed to, but DataTable maps columns directly.

  // To make email searchable, we need it as a visible column, or we just rely on 'name' and 'company_name' for search.
  // Actually, DataTable searches all columns passed to it. So let's include email but hide it? No, DataTable renders all columns.
  // We can just rely on 'name' and 'company_name' which covers most searches.
  // For 'email', I'll just add it to the name in the data source instead to make it searchable.
  
  const leadsData = leads.map(lead => ({
    ...lead,
    // Hack to make email searchable in DataTable without adding an Email column:
    // Append it to 'name' invisibly or just assume searching by name/company is enough.
    // The search checks String(row[column.key]).includes(query).
    // Let's add email to the 'name' key, and in the render function it won't show.
    name: `${lead.first_name} ${lead.last_name} ${lead.email}`
  }));

  return (
    <div className="flex-1 overflow-y-auto bg-[#fafafa]">
      <div className="p-6 max-w-[1440px] mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Leads Pipeline</h1>
          <p className="text-sm text-stone-500 font-medium mt-1">Manage and qualify your potential customers</p>
        </div>
        
        <DataTable 
          columns={columns} 
          data={leadsData} 
          pageSize={10} 
          primaryActionLabel="Add Lead"
          searchPlaceholder="Search leads..."
          onRowDelete={(row) => {
            setLeadToDelete(row);
            setIsDeleteModalOpen(true);
          }}
        />

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setLeadToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Lead"
          message={
            leadToDelete 
              ? `Are you sure you want to delete ${leadToDelete.salutation} ${leadToDelete.first_name} ${leadToDelete.last_name}? This action cannot be undone.`
              : 'Are you sure you want to delete this lead?'
          }
          type="danger"
          confirmText="Yes, delete lead"
          cancelText="Cancel"
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
