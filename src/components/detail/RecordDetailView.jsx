import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Plus,
  Building2,
  DollarSign,
  FileText,
  Upload,
  Download,
  Trash2,
  Edit3,
  Check,
  Send,
  Bell,
  AlertCircle,
  Calendar,
  User,
  Clock,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  PieChart,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Lock,
  Tag,
  Globe,
  MapPin,
  CreditCard,
  CheckSquare,
  Copy
} from 'lucide-react';
import { gooeyToast } from 'goey-toast';
import { Modal } from '../ui';

export default function RecordDetailView({ record, recordType = 'deal' }) {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState('Details');
  const [leftTab, setLeftTab] = useState('Activity');

  // Task management state (Zero emojis)
  const [tasksList, setTasksList] = useState([
    {
      id: 1,
      title: 'Share Current letter of employment',
      description: 'There should be three safety seals around the edges of the filter.',
      dueDate: 'Today 12:00 PM',
      createdBy: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      completed: true,
      tags: ['Priority', 'Reminder'],
      important: false
    },
    {
      id: 2,
      title: 'Confirmation of income tax payment',
      description: 'Confirmation of property tax payment made up to date',
      dueDate: 'Today 12:00 PM',
      createdBy: 'Wade Warren',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      completed: false,
      tags: ['Important', 'Reminder'],
      important: true
    },
    {
      id: 3,
      title: 'Confirmation of income tax payment',
      description: 'Confirmation of property tax payment made up to date',
      dueDate: 'Today 12:00 PM',
      createdBy: 'Wade Warren',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      completed: false,
      tags: ['Reminder'],
      important: false
    }
  ]);

  const [taskHistory] = useState([
    {
      id: 101,
      title: 'Confirmation of property tax payment made up to date',
      dueDate: 'Today 12:00 PM',
      completed: true,
      completedDate: '12th November, 2024'
    }
  ]);

  // Notes state
  const [notesList, setNotesList] = useState([
    {
      id: 1,
      author: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
      time: '2 hours ago',
      category: 'Client Call',
      content: 'Client requested an updated quote including international wire transfer coverage.'
    },
    {
      id: 2,
      author: 'Marcus Thorne',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      time: 'Yesterday at 4:15 PM',
      category: 'Internal Note',
      content: 'Initial discovery call went very well. High intent buyer with budget approved for Q3.'
    }
  ]);
  const [newNote, setNewNote] = useState('');

  // Documents state
  const [documentsList] = useState([
    { id: 1, name: 'Employment_Verification_2025.pdf', category: 'Verification', size: '2.4 MB', uploadedBy: 'Ronald Richards', date: 'Mar 02, 2025' },
    { id: 2, name: 'Income_Tax_Receipts_Q4.pdf', category: 'Financials', size: '1.8 MB', uploadedBy: 'Wade Warren', date: 'Feb 28, 2025' },
    { id: 3, name: 'Identity_Passport_Scan.png', category: 'Identity', size: '850 KB', uploadedBy: 'Ronald Richards', date: 'Feb 20, 2025' }
  ]);
  const [docCategoryFilter, setDocCategoryFilter] = useState('All');

  // Emails log
  const [emailLogs] = useState([
    {
      id: 1,
      subject: 'Proposal & Agreement Review - Richards Corp',
      recipient: 'ronald.richards@example.com',
      date: 'Today at 10:30 AM',
      status: 'Opened',
      snippet: 'Hi Ronald, Please find attached the updated proposal details for your review...'
    },
    {
      id: 2,
      subject: 'Follow-up on Verification Documents',
      recipient: 'ronald.richards@example.com',
      date: 'Yesterday at 2:15 PM',
      status: 'Delivered',
      snippet: 'Thanks for sending over your employment verification documents. We have processed...'
    }
  ]);

  // Call logs
  const [callLogs] = useState([
    {
      id: 1,
      type: 'Outgoing',
      duration: '14m 20s',
      agent: 'Sarah Chen',
      date: 'Today at 09:15 AM',
      outcome: 'Connected & Spoke',
      notes: 'Discussed loan terms and payment schedule flexibility. Client confirmed receipt of tax forms.'
    },
    {
      id: 2,
      type: 'Incoming',
      duration: '5m 10s',
      agent: 'Marcus Thorne',
      date: 'Yesterday at 3:45 PM',
      outcome: 'Connected & Spoke',
      notes: 'Client inquired about document upload status.'
    }
  ]);

  // SMS logs
  const [smsLogs, setSmsLogs] = useState([
    { id: 1, sender: 'System / Agent', text: 'Hello Ronald, your document verification is complete.', time: '10:00 AM', direction: 'outbound' },
    { id: 2, sender: 'Ronald Richards', text: 'Thank you! When can we expect final approval?', time: '10:04 AM', direction: 'inbound' },
    { id: 3, sender: 'System / Agent', text: 'Our underwriting team is reviewing it today. We will update you shortly.', time: '10:06 AM', direction: 'outbound' }
  ]);
  const [newSmsText, setNewSmsText] = useState('');

  // Activity timeline
  const [activities] = useState([
    {
      id: 1,
      user: 'Andrew',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      text: 'tagged you in a comment',
      time: 'Today 12:00 PM',
      badge: 'Accepted'
    },
    {
      id: 2,
      user: 'Jenny Cook',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop',
      text: 'shared deal progress',
      time: 'Today 14:30 PM',
      flow: { from: 'New', to: 'In progress' }
    },
    {
      id: 3,
      user: 'Eleanor Pena',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
      text: 'commented on Documents update',
      time: 'Today 12:00 PM'
    }
  ]);

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Form states
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [callNotes, setCallNotes] = useState('');
  const [callOutcome, setCallOutcome] = useState('Connected & Spoke');

  // Toggle task completion
  const handleToggleTask = (taskId) => {
    setTasksList(prev => prev.map(t => {
      if (t.id === taskId) {
        const updated = !t.completed;
        gooeyToast.success(updated ? 'Task marked as completed' : 'Task reopened');
        return { ...t, completed: updated };
      }
      return t;
    }));
  };

  // Create new task
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const created = {
      id: Date.now(),
      title: newTaskTitle,
      description: newTaskDesc || 'No details provided.',
      dueDate: 'Today 17:00 PM',
      createdBy: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      completed: false,
      tags: ['Reminder'],
      important: false
    };

    setTasksList([created, ...tasksList]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setIsTaskModalOpen(false);
    gooeyToast.success('Task created successfully');
  };

  // Add Note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const noteObj = {
      id: Date.now(),
      author: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      time: 'Just now',
      category: 'General Note',
      content: newNote
    };

    setNotesList([noteObj, ...notesList]);
    setNewNote('');
    gooeyToast.success('Note added');
  };

  // Send SMS
  const handleSendSms = (e) => {
    e.preventDefault();
    if (!newSmsText.trim()) return;

    const msg = {
      id: Date.now(),
      sender: 'System / Agent',
      text: newSmsText,
      time: 'Just now',
      direction: 'outbound'
    };

    setSmsLogs([...smsLogs, msg]);
    setNewSmsText('');
    gooeyToast.success('SMS sent');
  };

  // Send Email simulation
  const handleSendEmail = (e) => {
    e.preventDefault();
    gooeyToast.success(`Email sent to ${record?.email || 'client'}`);
    setIsMailModalOpen(false);
    setEmailSubject('');
    setEmailBody('');
  };

  // Log Call simulation
  const handleLogCall = (e) => {
    e.preventDefault();
    gooeyToast.success('Call log saved');
    setIsCallModalOpen(false);
    setCallNotes('');
  };

  // Normalize data from record prop
  const name = record?.name || (record?.first_name ? `${record.first_name} ${record.last_name}` : 'Ronald Richards');
  const createdOn = record?.created_at ? new Date(record.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '2 Mar, 2025';
  const avatarUrl = record?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop';
  const titleCategory = recordType === 'deal' ? 'Active Deals' : 'Active Leads';
  const backRoute = recordType === 'deal' ? '/deals' : '/leads';

  const mainTabs = [
    'Details',
    'Position',
    'Documents',
    'Assessment',
    'Notes',
    `Tasks (${tasksList.length})`,
    'Emails',
    'Calls',
    'SMS'
  ];

  const filteredDocs = docCategoryFilter === 'All' 
    ? documentsList 
    : documentsList.filter(d => d.category === docCategoryFilter);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#fafafa] font-sans text-stone-900">
      
      {/* Record Hero Header */}
      <div className="px-8 py-6 bg-white border-b border-stone-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img 
              src={avatarUrl} 
              alt={name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-stone-200/60" 
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">{name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-medium text-stone-500">
              <span>Created On: <strong className="text-stone-800">{createdOn}</strong></span>
              <span className="text-stone-300">•</span>
              <div className="flex items-center gap-1.5 font-semibold text-stone-700 bg-stone-100/80 px-2.5 py-0.5 rounded-full border border-stone-200/50">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Last Activity <strong className="text-stone-900">2 Nov, 2024 at 09:00AM</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Avatar stack */}
          <div className="flex items-center -space-x-2 mr-2">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" alt="Member" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Member" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
            <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[11px] font-bold text-stone-900 shadow-2xs">
              +2
            </div>
          </div>

          <button 
            onClick={() => setIsMailModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold border border-stone-200 rounded-lg text-stone-700 bg-white hover:bg-stone-50 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-stone-500" />
            Mail
          </button>

          <button 
            onClick={() => setIsCallModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold border border-stone-200 rounded-lg text-stone-700 bg-white hover:bg-stone-50 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-stone-500" />
            Call
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="flex items-center gap-1 px-3.5 py-2 text-xs font-bold border border-stone-200 rounded-lg text-stone-600 bg-stone-100/60 hover:bg-stone-200/60 transition-all cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4 text-stone-600" />
              More
            </button>

            {isMoreMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-xl z-30 p-1.5 text-xs font-medium"
                onClick={() => setIsMoreMenuOpen(false)}
              >
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-700 flex items-center gap-2 cursor-pointer">
                  <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                  Edit Record
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-700 flex items-center gap-2 cursor-pointer">
                  <Download className="w-3.5 h-3.5 text-stone-500" />
                  Export PDF
                </button>
                <div className="h-px bg-stone-100 my-1"></div>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  Delete Record
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Split View */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* LEFT COLUMN: Info & Activity */}
        <div className="w-full lg:w-[380px] xl:w-[420px] bg-white border-r border-stone-200/80 p-6 flex flex-col gap-6">
          
          {/* Sub Tab Header */}
          <div className="flex items-center border-b border-stone-200">
            <button 
              onClick={() => setLeftTab('Info')}
              className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
                leftTab === 'Info' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              {recordType === 'deal' ? 'Deal Info' : 'Lead Info'}
            </button>
            <button 
              onClick={() => setLeftTab('Activity')}
              className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
                leftTab === 'Activity' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Activity
            </button>
          </div>

          {/* Left Column Content */}
          {leftTab === 'Activity' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-[11px] font-bold tracking-wider text-stone-400 uppercase mb-4">RECENT ACTIVITY</h3>
                
                {/* Timeline */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-200">
                  {activities.map((act) => (
                    <div key={act.id} className="relative flex items-start gap-3 text-xs">
                      <img 
                        src={act.avatar} 
                        alt={act.user} 
                        className="absolute -left-6 top-0 w-5 h-5 rounded-full object-cover ring-2 ring-white shadow-2xs" 
                      />
                      
                      <div className="flex-1 pt-0.5">
                        <p className="text-stone-700 font-medium">
                          <strong className="font-bold text-stone-900">{act.user}</strong> {act.text}
                        </p>
                        <p className="text-[11px] font-medium text-stone-400 mt-0.5">{act.time}</p>

                        {act.badge && (
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <Check className="w-3 h-3 text-emerald-600" />
                            {act.badge}
                          </div>
                        )}

                        {act.flow && (
                          <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold">
                            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700">{act.flow.from}</span>
                            <span className="text-stone-400">→</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">{act.flow.to}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DEAL / LEAD INFO summary block below recent activity */}
              <div className="pt-6 border-t border-stone-100">
                <h3 className="text-[11px] font-bold tracking-wider text-stone-400 uppercase mb-4">
                  {recordType === 'deal' ? 'DEAL INFO' : 'LEAD INFO'}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <div className="p-2 bg-white rounded-lg border border-stone-200/60 shadow-2xs text-stone-600">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                        {recordType === 'deal' ? 'Loan Purpose' : 'Industry'}
                      </p>
                      <p className="text-xs font-bold text-stone-900">
                        {record?.purpose || record?.industry || 'New Purchase'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <div className="p-2 bg-white rounded-lg border border-stone-200/60 shadow-2xs text-stone-600">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                        {recordType === 'deal' ? 'Loan Amount' : 'Estimated Value'}
                      </p>
                      <p className="text-xs font-bold text-stone-900">
                        {record?.value ? `$${record.value.toLocaleString()}` : 'NZ$4,50,000'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Detailed Executive Info Tab */
            <div className="space-y-5 text-xs">
              {/* Highlight parameter cards */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 shadow-2xs">
                  <div className="p-2 bg-white rounded-lg border border-stone-200 shadow-2xs text-stone-700">
                    <Building2 className="w-4 h-4 text-stone-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      {recordType === 'deal' ? 'Loan Purpose' : 'Industry'}
                    </p>
                    <p className="text-xs font-bold text-stone-900 mt-0.5">
                      {record?.purpose || record?.industry || 'New Purchase'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 shadow-2xs">
                  <div className="p-2 bg-white rounded-lg border border-stone-200 shadow-2xs text-emerald-600">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      {recordType === 'deal' ? 'Loan Amount' : 'Estimated Value'}
                    </p>
                    <p className="text-sm font-bold text-emerald-700 mt-0.5">
                      {record?.value ? `$${record.value.toLocaleString()}` : 'NZ$4,50,000'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Company & Contact Card */}
              <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-2xs space-y-3">
                <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider pb-2 border-b border-stone-100">
                  COMPANY & CONTACT
                </h4>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-medium">Company Name</span>
                    <span className="font-bold text-stone-900">{record?.company || record?.company_name || 'Richards Corp'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-medium">Email Address</span>
                    <div className="flex items-center gap-1.5 font-bold text-stone-900">
                      <span className="truncate max-w-[170px]">{record?.email || 'ronald.richards@example.com'}</span>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(record?.email || 'ronald.richards@example.com'); gooeyToast.success('Email copied'); }} 
                        className="text-stone-400 hover:text-stone-700 cursor-pointer"
                        title="Copy Email"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-medium">Mobile Phone</span>
                    <span className="font-bold text-stone-900">{record?.mobile_no || '+64 21 890 1234'}</span>
                  </div>
                </div>
              </div>

              {/* Assignment & Territory Card */}
              <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-2xs space-y-3">
                <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider pb-2 border-b border-stone-100">
                  ASSIGNMENT & LOCATION
                </h4>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-medium">Assigned Owner</span>
                    <div className="flex items-center gap-1.5">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Sarah" className="w-4 h-4 rounded-full object-cover" />
                      <span className="font-bold text-stone-900">{record?.assigned_to || 'Sarah Chen'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-medium">Territory</span>
                    <span className="font-bold text-stone-900">{record?.territory || 'North America'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-medium">Pipeline Stage</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {record?.stage || record?.lead_status || 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT MAIN AREA: Tabbed Navigation & Content */}
        <div className="flex-1 flex flex-col bg-[#fafafa]">
          
          {/* Main Tab Navigation */}
          <div className="px-8 bg-white border-b border-stone-200/80 flex items-center overflow-x-auto gap-6 scrollbar-none">
            {mainTabs.map((tab) => {
              const isActive = activeMainTab === tab || (activeMainTab.startsWith('Tasks') && tab.startsWith('Tasks'));
              return (
                <button
                  key={tab}
                  onClick={() => setActiveMainTab(tab)}
                  className={`py-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                    isActive
                      ? 'border-stone-900 text-stone-900 font-bold'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT AREA */}
          <div className="flex-1 p-8 overflow-y-auto">
            
            {/* TASKS TAB */}
            {(activeMainTab.startsWith('Tasks')) && (
              <div className="max-w-4xl space-y-8">
                
                {/* Upcoming Tasks Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold tracking-tight text-stone-900">Upcoming Tasks</h2>
                  <button 
                    onClick={() => setIsTaskModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold border border-stone-300 rounded-lg text-stone-800 bg-white hover:bg-stone-50 shadow-2xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-stone-700" />
                    Create Task
                  </button>
                </div>

                {/* Upcoming Task Cards */}
                <div className="space-y-3">
                  {tasksList.map((task) => (
                    <div 
                      key={task.id}
                      className="p-5 bg-white rounded-xl border border-stone-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <button 
                            onClick={() => handleToggleTask(task.id)}
                            className="mt-0.5 focus:outline-none transition-transform active:scale-125 cursor-pointer"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                            ) : (
                              <Circle className="w-5 h-5 text-stone-300 hover:text-stone-500" />
                            )}
                          </button>
                          <div>
                            <h3 className={`text-sm font-bold ${task.completed ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                              {task.title}
                            </h3>
                            <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                              {task.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-xs font-semibold text-stone-500 whitespace-nowrap">
                          Due Date: <strong className="text-stone-900">{task.dueDate}</strong>
                        </div>
                      </div>

                      {/* Bottom row meta inside card */}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                        <div className="flex items-center gap-2 text-stone-600 font-medium">
                          <img src={task.avatar} alt={task.createdBy} className="w-5 h-5 rounded-full object-cover" />
                          <span>Created by <strong className="text-stone-900">{task.createdBy}</strong></span>
                        </div>

                        <div className="flex items-center gap-2">
                          {task.important && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              Important
                            </span>
                          )}
                          {task.tags.map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold text-stone-600 bg-stone-100 rounded-lg border border-stone-200/50">
                              {tag === 'Reminder' && <Bell className="w-3 h-3 text-stone-500" />}
                              {tag === 'Priority' && <Tag className="w-3 h-3 text-stone-500" />}
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Task History Header & Section */}
                <div className="pt-6 border-t border-stone-200/80">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-stone-900">Task History</h3>
                    <p className="text-xs text-stone-400 font-medium">12th November, 2024</p>
                  </div>

                  <div className="space-y-3">
                    {taskHistory.map((item) => (
                      <div key={item.id} className="p-4 bg-white rounded-xl border border-stone-200/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                          <span className="font-semibold text-stone-800">{item.title}</span>
                        </div>
                        <span className="text-stone-500">Due Date: <strong className="text-stone-900">{item.dueDate}</strong></span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* DETAILS TAB */}
            {activeMainTab === 'Details' && (
              <div className="max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-stone-900">Record Overview</h2>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-stone-200 bg-white rounded-lg hover:bg-stone-50 text-stone-700">
                    <Edit3 className="w-3.5 h-3.5 text-stone-500" /> Edit Information
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  {/* Contact Card */}
                  <div className="p-6 bg-white rounded-xl border border-stone-200/80 space-y-4 shadow-2xs">
                    <div className="flex items-center gap-2 pb-3 border-b border-stone-100 font-bold text-stone-900 text-sm">
                      <User className="w-4 h-4 text-stone-500" /> Primary Contact Information
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400 font-semibold uppercase text-[10px] tracking-wider">Full Name</span>
                        <span className="font-bold text-stone-900">{name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400 font-semibold uppercase text-[10px] tracking-wider">Email Address</span>
                        <div className="flex items-center gap-1.5 font-bold text-stone-900">
                          {record?.email || 'ronald.richards@example.com'}
                          <button onClick={() => { navigator.clipboard.writeText(record?.email || 'ronald.richards@example.com'); gooeyToast.success('Email copied'); }} title="Copy email">
                            <Copy className="w-3 h-3 text-stone-400 hover:text-stone-600" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400 font-semibold uppercase text-[10px] tracking-wider">Mobile Phone</span>
                        <span className="font-bold text-stone-900">{record?.mobile_no || '+64 21 890 1234'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400 font-semibold uppercase text-[10px] tracking-wider">Company</span>
                        <span className="font-bold text-stone-900">{record?.company || record?.company_name || 'Richards Corp'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Commercial / Pipeline Card */}
                  <div className="p-6 bg-white rounded-xl border border-stone-200/80 space-y-4 shadow-2xs">
                    <div className="flex items-center gap-2 pb-3 border-b border-stone-100 font-bold text-stone-900 text-sm">
                      <TrendingUp className="w-4 h-4 text-stone-500" /> Pipeline & Commercial Details
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400 font-semibold uppercase text-[10px] tracking-wider">Stage / Status</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                          {record?.stage || record?.lead_status || 'Negotiation'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400 font-semibold uppercase text-[10px] tracking-wider">Estimated Value</span>
                        <span className="font-bold text-stone-900 text-sm">{record?.value ? `$${record.value.toLocaleString()}` : 'NZ$450,000'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400 font-semibold uppercase text-[10px] tracking-wider">Win Probability</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-stone-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <span className="font-bold text-stone-800">75%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400 font-semibold uppercase text-[10px] tracking-wider">Territory</span>
                        <span className="font-bold text-stone-900">{record?.territory || 'North America'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit metadata */}
                <div className="p-5 bg-stone-100/60 rounded-xl border border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-600 gap-2 font-medium">
                  <div>Assigned Agent: <strong className="text-stone-900">{record?.assigned_to || 'Sarah Chen'}</strong></div>
                  <div>Record ID: <code className="bg-white px-2 py-0.5 rounded border border-stone-200 font-mono font-bold text-stone-800">{record?.id || 'REC-1001'}</code></div>
                  <div>Created: <strong className="text-stone-900">{createdOn}</strong></div>
                </div>
              </div>
            )}

            {/* POSITION TAB */}
            {activeMainTab === 'Position' && (
              <div className="max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-stone-900">Financial Position & Surplus Analysis</h2>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    High Solvency Index
                  </span>
                </div>

                {/* Top Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Monthly Gross Income</span>
                    <p className="text-2xl font-bold text-stone-900 mt-2">$14,500 <span className="text-xs font-normal text-stone-400">/ mo</span></p>
                  </div>
                  <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Monthly Total Debt</span>
                    <p className="text-2xl font-bold text-stone-900 mt-2">$4,200 <span className="text-xs font-normal text-stone-400">/ mo</span></p>
                  </div>
                  <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Net Borrowing Power</span>
                    <p className="text-2xl font-bold text-emerald-600 mt-2">$520,000</p>
                  </div>
                </div>

                {/* Position Table */}
                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
                  <div className="px-6 py-4 border-b border-stone-100 font-bold text-stone-900 text-sm flex items-center justify-between">
                    <span>Income & Liability Breakdown</span>
                    <span className="text-xs text-stone-500 font-normal">Updated 2 days ago</span>
                  </div>
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-50 text-stone-400 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3">Description</th>
                        <th className="px-6 py-3 text-right">Monthly Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      <tr>
                        <td className="px-6 py-3.5 font-bold text-stone-900">Primary Salary</td>
                        <td className="px-6 py-3.5 text-stone-500">Senior Director Compensation</td>
                        <td className="px-6 py-3.5 font-bold text-emerald-600 text-right">+$12,000</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-3.5 font-bold text-stone-900">Investment Dividend</td>
                        <td className="px-6 py-3.5 text-stone-500">Equities Portfolio Yield</td>
                        <td className="px-6 py-3.5 font-bold text-emerald-600 text-right">+$2,500</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-3.5 font-bold text-stone-900">Mortgage Commitment</td>
                        <td className="px-6 py-3.5 text-stone-500">Primary Residence Loan</td>
                        <td className="px-6 py-3.5 font-bold text-rose-600 text-right">-$3,200</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-3.5 font-bold text-stone-900">Vehicle Loan</td>
                        <td className="px-6 py-3.5 text-stone-500">Auto Lease Payment</td>
                        <td className="px-6 py-3.5 font-bold text-rose-600 text-right">-$1,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeMainTab === 'Documents' && (
              <div className="max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Document Repository</h2>
                    <p className="text-xs text-stone-500 mt-0.5">Manage and verify client attachments</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Upload File
                  </button>
                </div>

                {/* Category filters */}
                <div className="flex items-center gap-2 text-xs">
                  {['All', 'Verification', 'Financials', 'Identity'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setDocCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        docCategoryFilter === cat ? 'bg-stone-900 text-white shadow-2xs' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {filteredDocs.map((doc) => (
                    <div key={doc.id} className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 bg-stone-100 rounded-lg text-stone-700">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-stone-900">{doc.name}</p>
                            <span className="px-2 py-0.5 bg-stone-100 text-stone-600 font-bold text-[10px] rounded">
                              {doc.category}
                            </span>
                          </div>
                          <p className="text-stone-400 font-medium mt-1">
                            {doc.size} • Uploaded by {doc.uploadedBy} on {doc.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => gooeyToast.success(`Downloading ${doc.name}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 text-stone-700 bg-white hover:bg-stone-50 font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-stone-500" /> Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ASSESSMENT TAB */}
            {activeMainTab === 'Assessment' && (
              <div className="max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Underwriting & Qualification Assessment</h2>
                    <p className="text-xs text-stone-500 mt-0.5">Automated risk checks and compliance metrics</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-200">
                    Low Risk Profile
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2 shadow-2xs">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Credit Score</span>
                    <p className="text-xl font-bold text-emerald-600">780 / Excellent</p>
                    <p className="text-[11px] text-stone-500">Equifax Verified</p>
                  </div>
                  <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2 shadow-2xs">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Debt Service Coverage</span>
                    <p className="text-xl font-bold text-stone-900">2.45x Ratio</p>
                    <p className="text-[11px] text-stone-500">Optimal Liquidity</p>
                  </div>
                  <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2 shadow-2xs">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">KYC Verification</span>
                    <p className="text-xl font-bold text-emerald-600">Passed</p>
                    <p className="text-[11px] text-stone-500">Zero Flags Reported</p>
                  </div>
                </div>

                {/* Compliance Checklist */}
                <div className="p-6 bg-white rounded-xl border border-stone-200 space-y-4 shadow-2xs text-xs">
                  <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-3">Compliance Checklist</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-stone-800">Employment Verification</span>
                      </div>
                      <span className="text-emerald-700 font-bold">Verified</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-stone-800">Income Tax Record Audit</span>
                      </div>
                      <span className="text-emerald-700 font-bold">Passed</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-stone-800">Anti-Money Laundering (AML) Screening</span>
                      </div>
                      <span className="text-emerald-700 font-bold">Clear</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NOTES TAB */}
            {activeMainTab === 'Notes' && (
              <div className="max-w-4xl space-y-6">
                <h2 className="text-lg font-bold text-stone-900">Notes & History</h2>
                
                <form onSubmit={handleAddNote} className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-2xs space-y-3">
                  <textarea 
                    rows={3} 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Write an internal note or client update..."
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-stone-400 font-medium"
                  />
                  <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 text-xs font-bold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer">
                      Add Note
                    </button>
                  </div>
                </form>

                <div className="space-y-3">
                  {notesList.map((note) => (
                    <div key={note.id} className="p-5 bg-white rounded-xl border border-stone-200/80 shadow-2xs space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img src={note.avatar} alt={note.author} className="w-7 h-7 rounded-full object-cover border border-stone-200" />
                          <span className="font-bold text-stone-900">{note.author}</span>
                          <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-bold text-[10px]">
                            {note.category}
                          </span>
                        </div>
                        <span className="text-stone-400 font-medium">{note.time}</span>
                      </div>
                      <p className="text-stone-700 leading-relaxed pl-9">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EMAILS TAB */}
            {activeMainTab === 'Emails' && (
              <div className="max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Email Correspondence</h2>
                    <p className="text-xs text-stone-500 mt-0.5">Track and send email messages</p>
                  </div>
                  <button 
                    onClick={() => setIsMailModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" /> Compose Email
                  </button>
                </div>

                <div className="space-y-3">
                  {emailLogs.map((log) => (
                    <div key={log.id} className="p-5 bg-white rounded-xl border border-stone-200/80 shadow-2xs space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 text-sm">{log.subject}</span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-bold rounded text-[10px]">
                          {log.status}
                        </span>
                      </div>
                      <p className="text-stone-500 font-medium">{log.snippet}</p>
                      <div className="pt-2 flex justify-between text-[11px] text-stone-400 font-medium border-t border-stone-100">
                        <span>To: {log.recipient}</span>
                        <span>{log.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CALLS TAB */}
            {activeMainTab === 'Calls' && (
              <div className="max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Call Logs & Telephony</h2>
                    <p className="text-xs text-stone-500 mt-0.5">Record phone conversations and outcomes</p>
                  </div>
                  <button 
                    onClick={() => setIsCallModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" /> Log New Call
                  </button>
                </div>

                <div className="space-y-3">
                  {callLogs.map((call) => (
                    <div key={call.id} className="p-5 bg-white rounded-xl border border-stone-200/80 shadow-2xs space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {call.type === 'Outgoing' ? <PhoneOutgoing className="w-4 h-4 text-emerald-600" /> : <PhoneIncoming className="w-4 h-4 text-indigo-600" />}
                          <span className="font-bold text-stone-900">{call.type} Call ({call.duration})</span>
                        </div>
                        <span className="px-2 py-0.5 bg-stone-100 font-bold text-stone-700 rounded text-[10px]">
                          {call.outcome}
                        </span>
                      </div>
                      <p className="text-stone-700 leading-relaxed">{call.notes}</p>
                      <div className="pt-2 flex justify-between text-[11px] text-stone-400 font-medium border-t border-stone-100">
                        <span>Logged by: {call.agent}</span>
                        <span>{call.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SMS TAB */}
            {activeMainTab === 'SMS' && (
              <div className="max-w-4xl space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">SMS Messaging Thread</h2>
                  <p className="text-xs text-stone-500 mt-0.5">Direct text message communications</p>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col h-[400px]">
                  <div className="flex-1 p-5 overflow-y-auto space-y-3">
                    {smsLogs.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex flex-col max-w-[75%] ${msg.direction === 'outbound' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        <div className={`p-3 rounded-2xl text-xs ${msg.direction === 'outbound' ? 'bg-stone-900 text-white rounded-br-none' : 'bg-stone-100 text-stone-800 rounded-bl-none'}`}>
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-stone-400 mt-1 px-1 font-medium">{msg.sender} • {msg.time}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendSms} className="p-3 bg-stone-50 border-t border-stone-200 flex gap-2">
                    <input 
                      type="text" 
                      value={newSmsText} 
                      onChange={(e) => setNewSmsText(e.target.value)} 
                      placeholder="Type SMS message..." 
                      className="flex-1 text-xs bg-white border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stone-400 font-medium"
                    />
                    <button type="submit" className="px-4 py-2 text-xs font-bold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1 cursor-pointer">
                      <Send className="w-3.5 h-3.5" /> Send
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* CREATE TASK MODAL */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Task Title</label>
            <input 
              type="text" 
              value={newTaskTitle} 
              onChange={(e) => setNewTaskTitle(e.target.value)} 
              placeholder="e.g. Follow up on document submission" 
              className="w-full p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
              required 
            />
          </div>
          <div>
            <label className="block font-bold text-stone-700 mb-1">Description</label>
            <textarea 
              value={newTaskDesc} 
              onChange={(e) => setNewTaskDesc(e.target.value)} 
              placeholder="Task details and instructions..." 
              rows={3} 
              className="w-full p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={() => setIsTaskModalOpen(false)} 
              className="px-4 py-2 border border-stone-200 rounded-lg font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-stone-900 text-white rounded-lg font-bold hover:bg-stone-800 cursor-pointer"
            >
              Save Task
            </button>
          </div>
        </form>
      </Modal>

      {/* SEND MAIL MODAL */}
      <Modal isOpen={isMailModalOpen} onClose={() => setIsMailModalOpen(false)} title={`Send Email to ${name}`}>
        <form onSubmit={handleSendEmail} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Subject</label>
            <input 
              type="text" 
              value={emailSubject} 
              onChange={(e) => setEmailSubject(e.target.value)} 
              placeholder="Email subject..." 
              className="w-full p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
              required 
            />
          </div>
          <div>
            <label className="block font-bold text-stone-700 mb-1">Message</label>
            <textarea 
              value={emailBody} 
              onChange={(e) => setEmailBody(e.target.value)} 
              placeholder="Write your email content..." 
              rows={5} 
              className="w-full p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={() => setIsMailModalOpen(false)} 
              className="px-4 py-2 border border-stone-200 rounded-lg font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-lg font-bold hover:bg-stone-800 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Send Email
            </button>
          </div>
        </form>
      </Modal>

      {/* CALL MODAL */}
      <Modal isOpen={isCallModalOpen} onClose={() => setIsCallModalOpen(false)} title={`Log Call with ${name}`}>
        <form onSubmit={handleLogCall} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Call Outcome</label>
            <select 
              value={callOutcome} 
              onChange={(e) => setCallOutcome(e.target.value)}
              className="w-full p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 font-medium"
            >
              <option value="Connected & Spoke">Connected & Spoke</option>
              <option value="Left Voice Message">Left Voice Message</option>
              <option value="No Answer">No Answer</option>
              <option value="Busy">Busy</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-stone-700 mb-1">Call Notes</label>
            <textarea 
              value={callNotes} 
              onChange={(e) => setCallNotes(e.target.value)} 
              placeholder="Summary of what was discussed..." 
              rows={4} 
              className="w-full p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={() => setIsCallModalOpen(false)} 
              className="px-4 py-2 border border-stone-200 rounded-lg font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-stone-900 text-white rounded-lg font-bold hover:bg-stone-800 cursor-pointer"
            >
              Save Call Log
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
