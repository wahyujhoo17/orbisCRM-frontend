import {
  LayoutDashboard,
  Calendar,
  Target,
  Handshake,
  Kanban,
  Users,
  Building2,
  Package,
  StickyNote,
  CheckSquare,
  PhoneCall,
  Bell,
  Mail,
  LineChart,
  Upload,
  ClipboardList,
  Plug,
  Settings,
  HelpCircle,
  UserPlus,
  ShieldCheck,
  User,
  Monitor,
  MailCheck,
  FileText,
  Phone,
  SlidersHorizontal
} from 'lucide-react';

export const navigation = [
  {
    group: 'Dashboard & Analytics',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, href: '#', current: false, count: null },
      { name: 'Calendar', icon: Calendar, href: '#', current: false, count: null },
      { name: 'Reports', icon: LineChart, href: '#', current: false, count: null }
    ]
  },
  {
    group: 'Pipeline Management',
    items: [
      { name: 'Leads', icon: Target, href: '#', current: false, count: null },
      { name: 'Deals', icon: Handshake, href: '#', current: false, count: null },
      { name: 'Deal Kanban', icon: Kanban, href: '#', current: false, count: null }
    ]
  },
  {
    group: 'Contacts & Organizations',
    items: [
      { name: 'Contacts', icon: Users, href: '#', current: false, count: null },
      { name: 'Organizations', icon: Building2, href: '#', current: false, count: null }
    ]
  },
  {
    group: 'Products',
    items: [
      { name: 'Products', icon: Package, href: '#', current: false, count: null }
    ]
  },
  {
    group: 'Communication & Activities',
    items: [
      { name: 'Emails', icon: Mail, href: '#', count: null, current: false },
      { name: 'Notes', icon: StickyNote, href: '#', current: false, count: null },
      { name: 'Tasks', icon: CheckSquare, href: '#', current: false, count: null },
      { name: 'Notifications', icon: Bell, href: '#', count: 7, badgeColor: 'bg-red-500', current: false }
    ]
  },
  {
    group: 'Telephony',
    items: [
      { name: 'Call Logs', icon: PhoneCall, href: '#', current: false, count: null }
    ]
  },
  {
    group: 'Tools',
    items: [
      { name: 'Data Import', icon: Upload, href: '#', current: false, count: null },
      { name: 'Persona Forms', icon: ClipboardList, href: '#', current: false, count: null },
      { name: 'Integrations', icon: Plug, href: '#', current: false, count: null }
    ]
  },
  {
    group: 'Settings',
    items: [
      { name: 'Profile', icon: User, href: '#', current: false, count: null },
      { name: 'Sessions', icon: Monitor, href: '#', current: false, count: null },
      { name: 'Users', icon: UserPlus, href: '#', current: false, count: null },
      { name: 'Roles & Permissions', icon: ShieldCheck, href: '#', current: false, count: null },
      { name: 'Email Config', icon: MailCheck, href: '#', current: false, count: null },
      { name: 'Email Templates', icon: FileText, href: '#', current: false, count: null },
      { name: 'Twilio Config', icon: Phone, href: '#', current: false, count: null },
      { name: 'Exotel Config', icon: PhoneCall, href: '#', current: false, count: null },
      { name: 'General', icon: SlidersHorizontal, href: '#', current: false, count: null }
    ]
  }
];

export const bottomNav = [
  { name: 'Help Center', icon: HelpCircle, href: '#', external: true },
  { name: 'Invite teams', icon: UserPlus, href: '#' }
];

export const stats = [
  {
    title: 'Task status',
    mainMetrics: [
      { icon: 'square', label: 'Backlog', value: '24' },
      { icon: 'zap', label: 'In progress', value: '4' },
      { icon: 'sparkles', label: 'Validation', value: '7' }
    ]
  },
  {
    title: 'Comments',
    mainValue: '109',
    change: '10.2%',
    period: '7 days'
  },
  {
    title: 'Commits',
    mainValue: '27',
    change: '2.9%',
    period: '7 days'
  }
];

export const kanbanColumns = [
  { id: 'backlog', title: 'Backlog', count: 24, icon: 'folder' },
  { id: 'in-progress', title: 'In progress', count: 4, icon: 'zap', active: true },
  { id: 'validation', title: 'Validation', count: 7, icon: 'sparkles' },
  { id: 'done', title: 'Done', count: 13, icon: 'check-circle' }
];

export const tasks = [
  {
    id: 'MDS - 39',
    title: 'New microdose website',
    project: 'New Homepage',
    projectIcon: '🍃',
    dueDate: 'July 29, \'24',
    priority: 'Urgent',
    comments: 13,
    date: 'May 30, 2024',
    columnId: 'backlog',
    users: ['/api/placeholder/24/24']
  },
  {
    id: 'MDS - 56',
    title: 'Input Styleguide',
    project: 'Contact',
    projectIcon: '✏️',
    dueDate: 'June 2, \'24',
    priority: 'Normal',
    comments: 0,
    date: 'May 24, 2024',
    columnId: 'backlog',
    users: ['/api/placeholder/24/24']
  },
  {
    id: 'MDS - 2',
    title: 'Sales deck',
    project: 'Marketing',
    projectIcon: '📉',
    dueDate: 'Sep 19, \'24',
    priority: 'Low',
    comments: 7,
    date: 'May 31, 2024',
    columnId: 'in-progress',
    users: ['/api/placeholder/24/24', '/api/placeholder/24/24', '+3']
  },
  {
    id: 'MDS - 1',
    title: 'Case studies',
    project: 'Fin Tech work',
    projectIcon: '🌊',
    dueDate: 'Sep 21, \'24',
    priority: 'Urgent',
    comments: 1,
    date: 'Apr 22, 2024',
    columnId: 'validation',
    users: ['/api/placeholder/24/24']
  },
  {
    id: 'MDS - 12',
    title: 'Demo reel',
    project: 'Animation 2nd',
    projectIcon: '🦩',
    dueDate: 'Aug 2, \'24',
    priority: 'Normal',
    comments: 2,
    date: 'Apr 27, 2024',
    columnId: 'validation',
    users: ['/api/placeholder/24/24']
  },
  {
    id: 'MDS - 43',
    title: 'Spline animated logo',
    project: 'Logo',
    projectIcon: '🦜',
    dueDate: 'July 13, \'24',
    priority: 'Low',
    comments: 13,
    date: 'July 29, 2024',
    columnId: 'done',
    users: ['/api/placeholder/24/24', '+6']
  }
];