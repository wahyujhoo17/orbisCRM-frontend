import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail,
  Phone,
  Building2,
  MapPin,
  UserCircle2
} from 'lucide-react';
import { DataTable } from '../components/common';
import { ConfirmModal, Modal, Input, Select } from '../components/ui';
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
  const navigate = useNavigate();
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

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    salutation: 'Mr.',
    first_name: '',
    last_name: '',
    email: '',
    mobile_no: '',
    company_name: '',
    lead_status: 'New',
    lead_source: 'Website',
    industry: 'Healthcare',
    territory: 'North America',
    assigned_to: 'Sarah Chen'
  });

  const handleAddLeadSubmit = (e) => {
    e.preventDefault();
    if (addMode === 'existing' && !selectedContactId) {
      gooeyToast.error('Please select a contact from the database');
      return;
    }

    if (addMode === 'new' && (!newLead.first_name.trim() || !newLead.last_name.trim())) {
      gooeyToast.error('Please enter first name and last name');
      return;
    }

    const created = {
      id: `LD-${1000 + leads.length + 1}`,
      ...newLead,
      name: `${newLead.first_name} ${newLead.last_name}`,
      created_at: new Date().toISOString().split('T')[0]
    };

    setLeads([created, ...leads]);
    setIsAddModalOpen(false);
    setSelectedContactId('');
    setNewLead({
      salutation: 'Mr.',
      first_name: '',
      last_name: '',
      email: '',
      mobile_no: '',
      company_name: '',
      lead_status: 'New',
      lead_source: 'Website',
      industry: 'Healthcare',
      territory: 'North America',
      assigned_to: 'Sarah Chen'
    });
    gooeyToast.success('Lead added successfully', {
      description: `${created.salutation} ${created.name} has been added to your pipeline.`
    });
  };

  const [addMode, setAddMode] = useState('new'); // 'new' or 'existing'
  const [selectedContactId, setSelectedContactId] = useState('');
  const mockContactsList = [
    { id: 'C-1', name: 'Emma Johansson', first_name: 'Emma', last_name: 'Johansson', email: 'emma@nordicsoft.io', mobile_no: '+1 234 567 890', company_name: 'Nordic Soft AB', salutation: 'Ms.' },
    { id: 'C-2', name: 'Ethan Wilson', first_name: 'Ethan', last_name: 'Wilson', email: 'ethan@travelventures.com', mobile_no: '+1 234 567 891', company_name: 'Travel Ventures', salutation: 'Mr.' },
    { id: 'C-3', name: 'Isabella Hernandez', first_name: 'Isabella', last_name: 'Hernandez', email: 'isabella@designstudios.net', mobile_no: '+1 234 567 892', company_name: 'Design Studios', salutation: 'Ms.' },
    { id: 'C-4', name: 'Ronald Richards', first_name: 'Ronald', last_name: 'Richards', email: 'ronald.richards@example.com', mobile_no: '+64 21 890 1234', company_name: 'Richards Corp', salutation: 'Mr.' }
  ];

  const handleSelectContact = (contactId) => {
    setSelectedContactId(contactId);
    const found = mockContactsList.find(c => c.id === contactId);
    if (found) {
      setNewLead(prev => ({
        ...prev,
        salutation: found.salutation,
        first_name: found.first_name,
        last_name: found.last_name,
        email: found.email,
        mobile_no: found.mobile_no,
        company_name: found.company_name
      }));
    }
  };

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
          onPrimaryAction={() => setIsAddModalOpen(true)}
          searchPlaceholder="Search leads..."
          onRowClick={(row) => navigate(`/leads/${row.id}`)}
          onRowView={(row) => navigate(`/leads/${row.id}`)}
          onRowDelete={(row) => {
            setLeadToDelete(row);
            setIsDeleteModalOpen(true);
          }}
        />

        {/* Add Lead Modal */}
        <Modal 
          isOpen={isAddModalOpen} 
          onClose={() => {
            setIsAddModalOpen(false);
            setSelectedContactId('');
          }} 
          title="Add New Lead"
        >
          <form onSubmit={handleAddLeadSubmit} className="space-y-4 text-xs">
            {/* Tab Mode Selector */}
            <div className="flex items-center p-1 bg-stone-100 rounded-lg border border-stone-200/60 font-semibold text-xs mb-2">
              <button
                type="button"
                onClick={() => {
                  setAddMode('new');
                  setSelectedContactId('');
                }}
                className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer ${
                  addMode === 'new' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Create New Prospect
              </button>
              <button
                type="button"
                onClick={() => setAddMode('existing')}
                className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer ${
                  addMode === 'existing' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Select Existing Contact
              </button>
            </div>

            {addMode === 'existing' ? (
              <div className="space-y-4">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1.5">
                  <Select
                    label="Select Contact from Database *"
                    value={selectedContactId}
                    onChange={(e) => handleSelectContact(e.target.value)}
                    placeholder="-- Choose Existing Contact --"
                    options={mockContactsList.map(c => ({
                      value: c.id,
                      label: `${c.name} (${c.company_name}) - ${c.email}`
                    }))}
                  />
                </div>

                {/* Selected Contact Preview Card */}
                {selectedContactId && (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200">
                        {newLead.first_name?.[0]}{newLead.last_name?.[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-xs">
                          {newLead.salutation} {newLead.first_name} {newLead.last_name}
                        </h4>
                        <p className="text-[11px] text-stone-500 font-medium">
                          {newLead.company_name} • {newLead.email} • {newLead.mobile_no}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      Contact Linked
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Create New Prospect Personal Details */
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <Select
                    label="Salutation"
                    value={newLead.salutation}
                    onChange={(e) => setNewLead({ ...newLead, salutation: e.target.value })}
                    options={[
                      { value: 'Mr.', label: 'Mr.' },
                      { value: 'Ms.', label: 'Ms.' },
                      { value: 'Dr.', label: 'Dr.' },
                      { value: 'Mrs.', label: 'Mrs.' }
                    ]}
                  />
                  <Input
                    label="First Name *"
                    value={newLead.first_name}
                    onChange={(e) => setNewLead({ ...newLead, first_name: e.target.value })}
                    placeholder="John"
                    required
                  />
                  <Input
                    label="Last Name *"
                    value={newLead.last_name}
                    onChange={(e) => setNewLead({ ...newLead, last_name: e.target.value })}
                    placeholder="Doe"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Email Address"
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="john.doe@company.com"
                  />
                  <Input
                    label="Mobile Phone"
                    value={newLead.mobile_no}
                    onChange={(e) => setNewLead({ ...newLead, mobile_no: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Company Name"
                    value={newLead.company_name}
                    onChange={(e) => setNewLead({ ...newLead, company_name: e.target.value })}
                    placeholder="Acme Corp"
                  />
                  <Select
                    label="Industry"
                    value={newLead.industry}
                    onChange={(e) => setNewLead({ ...newLead, industry: e.target.value })}
                    options={['Healthcare', 'Retail', 'Finance', 'Manufacturing', 'Logistics', 'Technology']}
                  />
                </div>
              </div>
            )}

            {/* Pipeline Configuration Parameters (Common to both modes) */}
            <div className="pt-2 border-t border-stone-100 space-y-4">
              <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Pipeline Settings
              </h4>

              <div className="grid grid-cols-3 gap-3">
                <Select
                  label="Status"
                  value={newLead.lead_status}
                  onChange={(e) => setNewLead({ ...newLead, lead_status: e.target.value })}
                  options={['New', 'Contacted', 'Qualified', 'Lost']}
                />
                <Select
                  label="Source"
                  value={newLead.lead_source}
                  onChange={(e) => setNewLead({ ...newLead, lead_source: e.target.value })}
                  options={['Website', 'Referral', 'Cold Call', 'Trade Show', 'Webinar']}
                />
                <Select
                  label="Territory"
                  value={newLead.territory}
                  onChange={(e) => setNewLead({ ...newLead, territory: e.target.value })}
                  options={['North America', 'Europe', 'APAC', 'LATAM']}
                />
              </div>

              <Select
                label="Assigned Agent"
                value={newLead.assigned_to}
                onChange={(e) => setNewLead({ ...newLead, assigned_to: e.target.value })}
                options={['Sarah Chen', 'Marcus Thorne', 'James Wilson']}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)} 
                className="px-4 py-2 border border-stone-200 rounded-lg font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-stone-900 text-white rounded-lg font-bold hover:bg-stone-800 cursor-pointer"
              >
                Save Lead
              </button>
            </div>
          </form>
        </Modal>

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
