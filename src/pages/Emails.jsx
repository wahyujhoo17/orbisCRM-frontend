import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Inbox, Send, FileText, Trash2, Star, Archive,
  Search, MoreHorizontal, Paperclip, Clock, Reply, Forward,
  ChevronDown, RefreshCw, Tag, Plus, X, Link2, Unlink,
  MailOpen, Check, Users, Target, Handshake, ExternalLink
} from 'lucide-react';

/* ═══════ MOCK LEADS / DEALS for linking ═══════ */
const mockLeads = [
  { id: 'L-001', name: 'Sarah Johnson', company: 'Acme Corp', email: 'sarah@acmecorp.com', status: 'Qualified' },
  { id: 'L-002', name: 'Michael Chen', company: 'Tech Inc', email: 'michael@techinc.io', status: 'New' },
  { id: 'L-003', name: 'David Kim', company: 'GlobalTech', email: 'david@globaltech.com', status: 'Contacted' },
  { id: 'L-004', name: 'Emma Wilson', company: 'Design Studio', email: 'emma@designstudio.io', status: 'New' },
  { id: 'L-005', name: 'Lisa Park', company: 'StartUp Ltd', email: 'lisa@startup.co', status: 'Qualified' },
  { id: 'L-006', name: 'Robert Taylor', company: 'MegaCorp', email: 'robert@megacorp.com', status: 'New' },
];

const mockDeals = [
  { id: 'D-001', name: 'Enterprise License', value: '$50,000', stage: 'Negotiation' },
  { id: 'D-002', name: 'Consulting Package', value: '$25,000', stage: 'Proposal' },
  { id: 'D-003', name: 'Support Contract', value: '$15,000', stage: 'Qualification' },
];

/* ═══════ FOLDERS ═══════ */
const folders = [
  { id: 'inbox', label: 'Inbox', icon: Inbox, color: 'text-indigo-600' },
  { id: 'sent', label: 'Sent', icon: Send, color: 'text-stone-500' },
  { id: 'drafts', label: 'Drafts', icon: FileText, color: 'text-stone-500' },
  { id: 'starred', label: 'Starred', icon: Star, color: 'text-amber-500' },
  { id: 'archive', label: 'Archive', icon: Archive, color: 'text-stone-500' },
  { id: 'trash', label: 'Trash', icon: Trash2, color: 'text-stone-500' },
];

/* ═══════ MOCK EMAILS ═══════ */
const initialEmails = [
  {
    id: 1, sender: 'Sarah Johnson', senderEmail: 'sarah@acmecorp.com', recipient: 'sales@orbis.com',
    subject: 'Re: Enterprise License Proposal',
    preview: 'Hi team, I\'ve reviewed the proposal and would like to discuss the pricing structure for the enterprise tier.',
    body: '<p>Hi team,</p><p>I\'ve reviewed the proposal and would like to discuss the pricing structure for the enterprise tier. Can we schedule a call this week?</p><p>The features look great but we need to understand the volume pricing better before we can move forward with the procurement process.</p><p>Best regards,<br/>Sarah Johnson<br/>VP of Engineering, Acme Corp</p>',
    date: '10:32 AM', fullDate: 'Jul 18, 2026 at 10:32 AM',
    isRead: false, isStarred: true, hasAttachment: true,
    direction: 'inbound', status: 'received',
    linkedLead: { id: 'L-001', name: 'Sarah Johnson', company: 'Acme Corp' },
    linkedDeal: { id: 'D-001', name: 'Enterprise License', value: '$50,000' },
  },
  {
    id: 2, sender: 'Michael Chen', senderEmail: 'michael@techinc.io', recipient: 'sales@orbis.com',
    subject: 'Consulting Package - Next Steps',
    preview: 'Thanks for the detailed breakdown. Our team is aligned on moving forward with the consulting package.',
    body: '<p>Thanks for the detailed breakdown.</p><p>Our team is aligned on moving forward with the consulting package. Let me know about the onboarding timeline and any prerequisites we need to prepare on our end.</p><p>Cheers,<br/>Michael Chen<br/>CTO, Tech Inc</p>',
    date: '9:15 AM', fullDate: 'Jul 18, 2026 at 9:15 AM',
    isRead: false, isStarred: false, hasAttachment: false,
    direction: 'inbound', status: 'received',
    linkedLead: { id: 'L-002', name: 'Michael Chen', company: 'Tech Inc' },
    linkedDeal: { id: 'D-002', name: 'Consulting Package', value: '$25,000' },
  },
  {
    id: 3, sender: 'You', senderEmail: 'sales@orbis.com', recipient: 'lisa@startup.co',
    subject: 'Support Contract Details',
    preview: 'Hi Lisa, Please find attached the support contract details as discussed in our last call.',
    body: '<p>Hi Lisa,</p><p>Please find attached the support contract details as discussed in our last call. The pricing includes 24/7 support coverage and dedicated account management.</p><p>Let me know if you have any questions.</p><p>Best,<br/>Sales Team</p>',
    date: 'Yesterday', fullDate: 'Jul 17, 2026 at 4:45 PM',
    isRead: true, isStarred: false, hasAttachment: true,
    direction: 'outbound', status: 'sent',
    linkedLead: { id: 'L-005', name: 'Lisa Park', company: 'StartUp Ltd' },
    linkedDeal: { id: 'D-003', name: 'Support Contract', value: '$15,000' },
  },
  {
    id: 4, sender: 'David Kim', senderEmail: 'david@globaltech.com', recipient: 'sales@orbis.com',
    subject: 'Product Demo Request',
    preview: 'Hi, I came across your CRM solution and would love to schedule a demo for our sales team of 50+ people.',
    body: '<p>Hi,</p><p>I came across your CRM solution and would love to schedule a demo for our sales team of 50+ people. We\'re currently evaluating alternatives to our existing system.</p><p>Could you share available time slots for next week?</p><p>Thanks,<br/>David Kim<br/>Sales Director, GlobalTech</p>',
    date: 'Yesterday', fullDate: 'Jul 17, 2026 at 2:10 PM',
    isRead: true, isStarred: true, hasAttachment: false,
    direction: 'inbound', status: 'received',
    linkedLead: null,
    linkedDeal: null,
  },
  {
    id: 5, sender: 'Emma Wilson', senderEmail: 'emma@designstudio.io', recipient: 'sales@orbis.com',
    subject: 'Partnership Opportunity',
    preview: 'Hello! We\'re a design agency looking to partner with CRM providers to offer integrated solutions.',
    body: '<p>Hello!</p><p>We\'re a design agency looking to partner with CRM providers to offer integrated solutions to our clients. Would love to explore a mutually beneficial partnership.</p><p>Are you open to a quick introductory call?</p><p>Best,<br/>Emma Wilson<br/>Business Development, Design Studio</p>',
    date: 'Jul 16', fullDate: 'Jul 16, 2026 at 11:30 AM',
    isRead: true, isStarred: false, hasAttachment: false,
    direction: 'inbound', status: 'received',
    linkedLead: null,
    linkedDeal: null,
  },
  {
    id: 6, sender: 'You', senderEmail: 'sales@orbis.com', recipient: 'team@acmecorp.com',
    subject: 'Follow-up: Pricing Discussion',
    preview: 'Hi Sarah, Following up on our conversation about the enterprise pricing. I\'ve prepared a custom quote.',
    body: '<p>Hi Sarah,</p><p>Following up on our conversation about the enterprise pricing. I\'ve prepared a custom quote based on your requirements for 200+ seats.</p><p>Please review the attached document and let me know your thoughts.</p><p>Best regards,<br/>Sales Team</p>',
    date: 'Jul 16', fullDate: 'Jul 16, 2026 at 9:00 AM',
    isRead: true, isStarred: false, hasAttachment: true,
    direction: 'outbound', status: 'sent',
    linkedLead: { id: 'L-001', name: 'Sarah Johnson', company: 'Acme Corp' },
    linkedDeal: { id: 'D-001', name: 'Enterprise License', value: '$50,000' },
  },
  {
    id: 7, sender: 'Robert Taylor', senderEmail: 'robert@megacorp.com', recipient: 'sales@orbis.com',
    subject: 'Inquiry about CRM Pricing',
    preview: 'Good afternoon, I would like to get more information about your CRM solution for our team at MegaCorp.',
    body: '<p>Good afternoon,</p><p>I would like to get more information about your CRM solution for our team at MegaCorp. We have about 200 sales reps and are looking for a scalable solution.</p><p>Could you send me a pricing breakdown?</p><p>Thanks,<br/>Robert Taylor<br/>VP Sales, MegaCorp</p>',
    date: 'Jul 15', fullDate: 'Jul 15, 2026 at 3:22 PM',
    isRead: true, isStarred: false, hasAttachment: false,
    direction: 'inbound', status: 'received',
    linkedLead: null,
    linkedDeal: null,
  },
];

/* ═══════ LINK TO LEAD/DEAL POPUP ═══════ */
function LinkPopup({ email, onLink, onClose }) {
  const [tab, setTab] = useState('lead');
  const [search, setSearch] = useState('');

  const items = tab === 'lead' ? mockLeads : mockDeals;
  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.company && item.company.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[440px] max-h-[520px] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-stone-900">Link to Lead or Deal</h3>
            <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-stone-500 mb-3">
            Hubungkan email dari <span className="font-semibold text-stone-700">{email.sender}</span> ke Lead atau Deal yang ada.
          </p>

          {/* Tab toggle */}
          <div className="flex gap-1 p-0.5 bg-stone-100 rounded-lg mb-3">
            <button
              onClick={() => { setTab('lead'); setSearch(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-md transition-all ${tab === 'lead' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              <Target className="w-3.5 h-3.5" />
              Lead
            </button>
            <button
              onClick={() => { setTab('deal'); setSearch(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-md transition-all ${tab === 'deal' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              <Handshake className="w-3.5 h-3.5" />
              Deal
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tab === 'lead' ? 'Cari lead berdasarkan nama atau perusahaan...' : 'Cari deal berdasarkan nama...'}
              className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-sm">Tidak ditemukan</div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item) => {
                const isAlreadyLinked = tab === 'lead'
                  ? email.linkedLead?.id === item.id
                  : email.linkedDeal?.id === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => !isAlreadyLinked && onLink(tab, item)}
                    disabled={isAlreadyLinked}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                      isAlreadyLinked
                        ? 'bg-indigo-50 border border-indigo-200 cursor-default'
                        : 'hover:bg-stone-50 border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      tab === 'lead' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {tab === 'lead' ? <Target className="w-4 h-4" /> : <Handshake className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-stone-900 truncate">{item.name}</div>
                      <div className="text-[11px] text-stone-500">
                        {tab === 'lead' ? `${item.company} • ${item.status}` : `${item.value} • ${item.stage}`}
                      </div>
                    </div>
                    {isAlreadyLinked && (
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full shrink-0">Linked</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════ COMPOSE MODAL ═══════ */
const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ]
};

function ComposeModal({ onClose }) {
  const [content, setContent] = useState('');
  
  return (
    <div className="fixed bottom-0 right-6 w-[500px] bg-white rounded-t-xl shadow-2xl border border-stone-200 z-50 flex flex-col" style={{ height: '500px' }}>
      <div className="flex items-center justify-between px-4 py-2.5 bg-stone-900 rounded-t-xl shrink-0">
        <span className="text-sm font-semibold text-white">New Message</span>
        <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
      </div>
      <div className="border-b border-stone-100 shrink-0">
        <div className="flex items-center px-4 py-2 border-b border-stone-100">
          <span className="text-xs font-semibold text-stone-400 w-14">To</span>
          <input className="flex-1 text-sm text-stone-900 outline-none bg-transparent placeholder:text-stone-400" placeholder="Recipients" />
        </div>
        <div className="flex items-center px-4 py-2">
          <span className="text-xs font-semibold text-stone-400 w-14">Subject</span>
          <input className="flex-1 text-sm text-stone-900 outline-none bg-transparent placeholder:text-stone-400" placeholder="Subject" />
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0 bg-white [&_.quill]:flex [&_.quill]:flex-col [&_.quill]:h-full [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-stone-100 [&_.ql-container]:border-none [&_.ql-container]:flex-1 [&_.ql-editor]:text-sm [&_.ql-editor]:text-stone-700">
        <ReactQuill 
          theme="snow" 
          value={content} 
          onChange={setContent}
          modules={quillModules}
          placeholder="Compose your email..."
        />
      </div>
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-stone-100 bg-stone-50/50 shrink-0">
        <button className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2">
          <Send className="w-3.5 h-3.5" /> Send
        </button>
        <div className="flex items-center gap-1">
          <button className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-all"><Paperclip className="w-4 h-4" /></button>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}

/* ═══════ MAIN PAGE ═══════ */
export default function Emails() {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [replyMode, setReplyMode] = useState(null); // null | 'reply' | 'forward'
  const [replyText, setReplyText] = useState('');
  const [emails, setEmails] = useState(initialEmails);

  const filteredEmails = emails.filter((e) => {
    if (activeFolder === 'starred') return e.isStarred;
    if (activeFolder === 'sent') return e.direction === 'outbound';
    if (activeFolder === 'drafts') return e.status === 'draft';
    if (activeFolder === 'inbox') return e.direction === 'inbound';
    return true;
  }).filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return e.subject.toLowerCase().includes(q) || e.sender.toLowerCase().includes(q) || e.preview.toLowerCase().includes(q);
  });

  const toggleStar = (id, e) => {
    e.stopPropagation();
    setEmails(prev => prev.map(em => em.id === id ? { ...em, isStarred: !em.isStarred } : em));
    if (selectedEmail?.id === id) setSelectedEmail(prev => ({ ...prev, isStarred: !prev.isStarred }));
  };

  const openEmail = (email) => {
    setSelectedEmail(email);
    setReplyMode(null);
    setReplyText('');
    setEmails(prev => prev.map(em => em.id === email.id ? { ...em, isRead: true } : em));
  };

  const startReply = (mode) => {
    setReplyMode(mode);
    setReplyText('');
  };

  const sendReply = () => {
    if (!replyText.trim()) return;
    const replyEmail = {
      id: Date.now(),
      sender: 'You',
      senderEmail: 'sales@orbis.com',
      recipient: replyMode === 'forward' ? '' : selectedEmail.senderEmail,
      subject: `${replyMode === 'forward' ? 'Fwd' : 'Re'}: ${selectedEmail.subject}`,
      preview: replyText.slice(0, 100),
      body: replyText,
      date: 'Just now',
      fullDate: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      isRead: true, isStarred: false, hasAttachment: false,
      direction: 'outbound', status: 'sent',
      linkedLead: selectedEmail.linkedLead,
      linkedDeal: selectedEmail.linkedDeal,
    };
    setEmails(prev => [replyEmail, ...prev]);
    setReplyMode(null);
    setReplyText('');
  };

  const handleLink = (type, item) => {
    const updated = { ...selectedEmail };
    if (type === 'lead') {
      updated.linkedLead = { id: item.id, name: item.name, company: item.company };
    } else {
      updated.linkedDeal = { id: item.id, name: item.name, value: item.value };
    }
    setSelectedEmail(updated);
    setEmails(prev => prev.map(em => em.id === updated.id ? updated : em));
    setShowLinkPopup(false);
  };

  const unlinkEntity = (type) => {
    const updated = { ...selectedEmail };
    if (type === 'lead') updated.linkedLead = null;
    else updated.linkedDeal = null;
    setSelectedEmail(updated);
    setEmails(prev => prev.map(em => em.id === updated.id ? updated : em));
  };

  const unreadCount = emails.filter(e => !e.isRead && e.direction === 'inbound').length;

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-stone-50/30">

      {/* ─── FOLDER SIDEBAR ─── */}
      <div className="w-52 shrink-0 bg-white border-r border-stone-200/60 flex flex-col">
        <div className="p-3">
          <button
            onClick={() => setShowCompose(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-[13px] font-semibold rounded-lg shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" /> Compose
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
          {folders.map((f) => {
            const Icon = f.icon;
            const isActive = activeFolder === f.id;
            const count = f.id === 'inbox' ? unreadCount : f.id === 'drafts' ? 3 : 0;
            return (
              <button
                key={f.id}
                onClick={() => { setActiveFolder(f.id); setSelectedEmail(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : f.color}`} />
                <span className="flex-1 text-left">{f.label}</span>
                {count > 0 && (
                  <span className={`text-[10px] font-bold min-w-[20px] text-center py-0.5 rounded-full ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-stone-100">
          <div className="text-[10px] font-medium text-stone-400 mb-1.5">Storage</div>
          <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '35%' }} />
          </div>
          <div className="text-[10px] text-stone-400 mt-1">3.5 / 10 GB</div>
        </div>
      </div>

      {/* ─── EMAIL LIST ─── */}
      <div className={`flex flex-col bg-white ${selectedEmail ? 'w-[360px] shrink-0 border-r border-stone-200/60' : 'flex-1'}`}>
        {/* Search */}
        <div className="px-3 pt-3 pb-2 border-b border-stone-100">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emails..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all placeholder:text-stone-400"
            />
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-medium text-stone-400">{filteredEmails.length} messages</span>
            <button className="p-1 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 transition-all">
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-2 py-20">
              <MailOpen className="w-10 h-10 text-stone-300" />
              <p className="text-sm font-medium">No emails found</p>
            </div>
          ) : (
            filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => openEmail(email)}
                className={`px-3 py-3 border-b border-stone-100/70 cursor-pointer transition-all group ${
                  selectedEmail?.id === email.id
                    ? 'bg-indigo-50/70 border-l-[3px] border-l-indigo-500'
                    : email.isRead
                      ? 'hover:bg-stone-50/70 border-l-[3px] border-l-transparent'
                      : 'bg-indigo-50/25 hover:bg-indigo-50/50 border-l-[3px] border-l-transparent'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                    email.direction === 'outbound'
                      ? 'bg-stone-200 text-stone-600'
                      : 'bg-stone-800 text-white'
                  }`}>
                    {email.sender.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-[13px] truncate ${email.isRead ? 'font-medium text-stone-600' : 'font-bold text-stone-900'}`}>
                        {email.sender}
                      </span>
                      <span className="text-[10px] text-stone-400 shrink-0 ml-2">{email.date}</span>
                    </div>
                    <div className={`text-[12px] truncate mb-0.5 ${email.isRead ? 'text-stone-500' : 'font-semibold text-stone-800'}`}>
                      {email.subject}
                    </div>
                    <div className="text-[11px] text-stone-400 truncate leading-relaxed">{email.preview}</div>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {email.linkedLead && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 flex items-center gap-1">
                          <Target className="w-2.5 h-2.5" /> {email.linkedLead.name}
                        </span>
                      )}
                      {email.linkedDeal && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 flex items-center gap-1">
                          <Handshake className="w-2.5 h-2.5" /> {email.linkedDeal.name}
                        </span>
                      )}
                      {!email.linkedLead && !email.linkedDeal && (
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 flex items-center gap-1">
                          <Link2 className="w-2.5 h-2.5" /> Unlinked
                        </span>
                      )}
                      {email.hasAttachment && <Paperclip className="w-2.5 h-2.5 text-stone-400" />}
                    </div>
                  </div>

                  {/* Star */}
                  <button
                    onClick={(e) => toggleStar(email.id, e)}
                    className={`mt-1 shrink-0 transition-all ${email.isStarred ? 'text-amber-400' : 'text-stone-200 opacity-0 group-hover:opacity-100 hover:text-amber-400'}`}
                  >
                    <Star className={`w-3.5 h-3.5 ${email.isStarred ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ─── EMAIL DETAIL PANEL ─── */}
      {selectedEmail && (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Header */}
          <div className="px-6 py-3 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-stone-900 truncate flex-1 mr-4">{selectedEmail.subject}</h2>
            <div className="flex items-center gap-0.5 shrink-0">
              <button className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-all" title="Archive"><Archive className="w-4 h-4" /></button>
              <button className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
              <button className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-all" title="More"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-5">
              {/* Sender */}
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {selectedEmail.sender.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900">{selectedEmail.sender}</span>
                    <span className="text-[11px] text-stone-400">&lt;{selectedEmail.senderEmail}&gt;</span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-1">
                    to {selectedEmail.recipient} <ChevronDown className="w-3 h-3" />
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-stone-400">{selectedEmail.fullDate}</span>
                  <button
                    onClick={(e) => toggleStar(selectedEmail.id, e)}
                    className={`${selectedEmail.isStarred ? 'text-amber-400' : 'text-stone-300 hover:text-amber-400'} transition-colors`}
                  >
                    <Star className={`w-4 h-4 ${selectedEmail.isStarred ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Linked Lead/Deal cards */}
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedEmail.linkedLead ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200/60 rounded-lg group">
                    <Target className="w-3.5 h-3.5 text-indigo-500" />
                    <div>
                      <div className="text-[11px] font-bold text-indigo-700">{selectedEmail.linkedLead.name}</div>
                      <div className="text-[10px] text-indigo-500">{selectedEmail.linkedLead.company} • Lead</div>
                    </div>
                    <button
                      onClick={() => unlinkEntity('lead')}
                      className="ml-1 p-0.5 text-indigo-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      title="Unlink"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLinkPopup(true)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-dashed border-stone-300 text-stone-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg text-[11px] font-semibold transition-all"
                  >
                    <Link2 className="w-3 h-3" /> Link to Lead
                  </button>
                )}

                {selectedEmail.linkedDeal ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200/60 rounded-lg group">
                    <Handshake className="w-3.5 h-3.5 text-emerald-500" />
                    <div>
                      <div className="text-[11px] font-bold text-emerald-700">{selectedEmail.linkedDeal.name}</div>
                      <div className="text-[10px] text-emerald-500">{selectedEmail.linkedDeal.value} • Deal</div>
                    </div>
                    <button
                      onClick={() => unlinkEntity('deal')}
                      className="ml-1 p-0.5 text-emerald-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      title="Unlink"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLinkPopup(true)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-dashed border-stone-300 text-stone-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-lg text-[11px] font-semibold transition-all"
                  >
                    <Link2 className="w-3 h-3" /> Link to Deal
                  </button>
                )}
              </div>

              {/* Attachment */}
              {selectedEmail.hasAttachment && (
                <div className="flex items-center gap-3 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg mb-5">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-stone-800">proposal_v2.pdf</div>
                    <div className="text-[10px] text-stone-400">245 KB</div>
                  </div>
                  <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Download</button>
                </div>
              )}

              {/* Email body */}
              <div
                className="text-sm text-stone-700 leading-relaxed [&_p]:mb-3"
                dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
              />
            </div>
          </div>

          {/* Reply / Forward area */}
          <div className="border-t border-stone-200">
            {replyMode ? (
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-500">
                    {replyMode === 'reply' ? `Reply to ${selectedEmail.sender}` : `Forward: ${selectedEmail.subject}`}
                  </span>
                  <button onClick={() => { setReplyMode(null); setReplyText(''); }} className="text-stone-400 hover:text-stone-600 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {replyMode === 'forward' && (
                  <div className="flex items-center mb-2">
                    <span className="text-xs font-medium text-stone-400 w-10">To</span>
                    <input className="flex-1 text-sm text-stone-900 outline-none bg-stone-50 border border-stone-200 rounded px-2 py-1.5 focus:border-stone-300" placeholder="Recipient email" />
                  </div>
                )}
                <div className="flex-1 overflow-hidden flex flex-col bg-white border border-stone-200 rounded-lg focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all [&_.quill]:flex [&_.quill]:flex-col [&_.quill]:h-full [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-stone-200 [&_.ql-container]:border-none [&_.ql-container]:flex-1 [&_.ql-editor]:text-sm [&_.ql-editor]:text-stone-700 [&_.ql-editor]:min-h-[120px]">
                  <ReactQuill 
                    theme="snow"
                    value={replyText}
                    onChange={setReplyText}
                    modules={quillModules}
                    placeholder={replyMode === 'reply' ? 'Type your reply...' : 'Type your message...'}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={sendReply}
                      disabled={!replyText.trim()}
                      className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Send
                    </button>
                    <button className="p-1.5 text-stone-400 hover:text-stone-600 transition-colors"><Paperclip className="w-3.5 h-3.5" /></button>
                  </div>
                  <button onClick={() => { setReplyMode(null); setReplyText(''); }} className="text-xs text-stone-400 hover:text-stone-600 transition-colors">Discard</button>
                </div>
              </div>
            ) : (
              <div className="px-6 py-3 flex items-center gap-2">
                <button onClick={() => startReply('reply')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-md transition-all">
                  <Reply className="w-3.5 h-3.5" /> Reply
                </button>
                <button onClick={() => startReply('forward')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-md transition-all">
                  <Forward className="w-3.5 h-3.5" /> Forward
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Popups */}
      {showCompose && <ComposeModal onClose={() => setShowCompose(false)} />}
      {showLinkPopup && selectedEmail && (
        <LinkPopup email={selectedEmail} onLink={handleLink} onClose={() => setShowLinkPopup(false)} />
      )}
    </div>
  );
}
