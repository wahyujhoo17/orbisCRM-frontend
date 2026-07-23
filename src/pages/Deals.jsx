import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../components/common';
import { Badge, Modal, ConfirmModal, Input, Select } from '../components/ui';
import { gooeyToast } from 'goey-toast';

const initialDeals = [
  { id: 'DL-05', title: 'Q4 Enterprise License', name: 'Ronald Richards', company: 'Acme Corp', value: 450000, stage: 'Negotiation', probability: 75 },
  { id: 'DL-04', title: 'Consulting Package', name: 'Tech Inc Buyer', company: 'Tech Inc', value: 25000, stage: 'Proposal', probability: 60 },
  { id: 'DL-03', title: 'Support Contract', name: 'StartUp Contact', company: 'StartUp Ltd', value: 15000, stage: 'Qualification', probability: 40 }
];

export default function Deals() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState(initialDeals);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [newDeal, setNewDeal] = useState({
    title: '',
    company: '',
    value: '',
    stage: 'Lead',
    probability: '50'
  });

  const handleAddDealSubmit = (e) => {
    e.preventDefault();
    if (!newDeal.title.trim() || !newDeal.company.trim()) {
      gooeyToast.error('Please enter deal title and company name');
      return;
    }

    const created = {
      id: `DL-0${deals.length + 6}`,
      title: newDeal.title,
      name: newDeal.company,
      company: newDeal.company,
      value: Number(newDeal.value) || 10000,
      stage: newDeal.stage,
      probability: Number(newDeal.probability) || 50
    };

    setDeals([created, ...deals]);
    setIsAddModalOpen(false);
    setNewDeal({
      title: '',
      company: '',
      value: '',
      stage: 'Lead',
      probability: '50'
    });
    gooeyToast.success('Deal created successfully', {
      description: `${created.title} has been added to your pipeline.`
    });
  };

  const handleEditDealSubmit = (e) => {
    e.preventDefault();
    if (!dealToEdit || !dealToEdit.title?.trim() || !dealToEdit.company?.trim()) {
      gooeyToast.error('Please enter deal title and company name');
      return;
    }

    setDeals(prev => prev.map(d => d.id === dealToEdit.id ? {
      ...dealToEdit,
      value: Number(dealToEdit.value) || 0,
      probability: Number(dealToEdit.probability) || 50
    } : d));

    setIsEditModalOpen(false);
    gooeyToast.success('Deal updated successfully', {
      description: `${dealToEdit.title} has been updated.`
    });
    setDealToEdit(null);
  };

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setDeals(prev => prev.filter(d => d.id !== dealToDelete.id));
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      gooeyToast.success('Deal deleted', {
        description: `${dealToDelete.title} has been removed.`
      });
      setDealToDelete(null);
    }, 600);
  };

  const columns = [
    { key: 'title', label: 'Deal Title' },
    { key: 'company', label: 'Company' },
    { key: 'value', label: 'Value', render: (value) => `$${value?.toLocaleString()}` },
    { key: 'stage', label: 'Stage', render: (value) => <Badge variant="primary">{value}</Badge> },
    { key: 'probability', label: 'Probability', render: (value) => `${value}%` }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#fafafa]">
      <div className="p-6 max-w-[1440px] mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Deals</h1>
          <p className="text-sm text-stone-500 font-medium mt-1">Track and manage your sales pipeline</p>
        </div>
        
        <DataTable 
          columns={columns} 
          data={deals} 
          pageSize={10} 
          primaryActionLabel="Add Deal"
          onPrimaryAction={() => setIsAddModalOpen(true)}
          onRowClick={(row) => navigate(`/deals/${row.id}`)}
          onRowView={(row) => navigate(`/deals/${row.id}`)}
          onRowEdit={(row) => {
            setDealToEdit({ ...row });
            setIsEditModalOpen(true);
          }}
          onRowDelete={(row) => {
            setDealToDelete(row);
            setIsDeleteModalOpen(true);
          }}
        />

        {/* Add Deal Modal */}
        <Modal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          title="Add New Deal"
        >
          <form onSubmit={handleAddDealSubmit} className="space-y-4 text-xs">
            <Input
              label="Deal Title *"
              value={newDeal.title}
              onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
              placeholder="e.g. Q3 Software License"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Company Name *"
                value={newDeal.company}
                onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })}
                placeholder="Acme Corp"
                required
              />
              <Input
                label="Deal Value ($)"
                type="number"
                value={newDeal.value}
                onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                placeholder="50000"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Stage"
                value={newDeal.stage}
                onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                options={[
                  { value: 'Lead', label: 'Lead' },
                  { value: 'Qualification', label: 'Qualification' },
                  { value: 'Proposal', label: 'Proposal' },
                  { value: 'Negotiation', label: 'Negotiation' },
                  { value: 'Closed Won', label: 'Closed Won' },
                  { value: 'Closed Lost', label: 'Closed Lost' }
                ]}
              />
              <Input
                label="Win Probability (%)"
                type="number"
                min="0"
                max="100"
                value={newDeal.probability}
                onChange={(e) => setNewDeal({ ...newDeal, probability: e.target.value })}
                placeholder="75"
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
                Save Deal
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit Deal Modal */}
        {dealToEdit && (
          <Modal 
            isOpen={isEditModalOpen} 
            onClose={() => {
              setIsEditModalOpen(false);
              setDealToEdit(null);
            }} 
            title="Edit Deal"
          >
            <form onSubmit={handleEditDealSubmit} className="space-y-4 text-xs">
              <Input
                label="Deal Title *"
                value={dealToEdit.title || ''}
                onChange={(e) => setDealToEdit({ ...dealToEdit, title: e.target.value })}
                placeholder="e.g. Q3 Software License"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Company Name *"
                  value={dealToEdit.company || ''}
                  onChange={(e) => setDealToEdit({ ...dealToEdit, company: e.target.value })}
                  placeholder="Acme Corp"
                  required
                />
                <Input
                  label="Deal Value ($)"
                  type="number"
                  value={dealToEdit.value || ''}
                  onChange={(e) => setDealToEdit({ ...dealToEdit, value: e.target.value })}
                  placeholder="50000"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Stage"
                  value={dealToEdit.stage || 'Lead'}
                  onChange={(e) => setDealToEdit({ ...dealToEdit, stage: e.target.value })}
                  options={[
                    { value: 'Lead', label: 'Lead' },
                    { value: 'Qualification', label: 'Qualification' },
                    { value: 'Proposal', label: 'Proposal' },
                    { value: 'Negotiation', label: 'Negotiation' },
                    { value: 'Closed Won', label: 'Closed Won' },
                    { value: 'Closed Lost', label: 'Closed Lost' }
                  ]}
                />
                <Input
                  label="Win Probability (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={dealToEdit.probability || ''}
                  onChange={(e) => setDealToEdit({ ...dealToEdit, probability: e.target.value })}
                  placeholder="75"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="px-4 py-2 border border-stone-200 rounded-lg font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg font-bold hover:bg-stone-800 cursor-pointer"
                >
                  Update Deal
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDealToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Deal"
          message={
            dealToDelete 
              ? `Are you sure you want to delete deal "${dealToDelete.title}"? This action cannot be undone.`
              : 'Are you sure you want to delete this deal?'
          }
          type="danger"
          confirmText="Yes, delete deal"
          cancelText="Cancel"
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
