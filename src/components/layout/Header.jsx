import { useLocation } from 'react-router-dom';
import { Menu, ArrowLeft, Folder, Search, Share2, LayoutDashboard, Users, Settings, Calendar, Target, Handshake, Kanban, Package, StickyNote, CheckSquare, PhoneCall, Bell, Mail, LineChart, Upload, ClipboardList, Plug, ShieldCheck, UserPlus, Building2, User, Monitor, MailCheck, FileText, Phone, SlidersHorizontal } from 'lucide-react';

const breadcrumbs = {
  '/dashboard': { icon: LayoutDashboard, label: 'Dashboard & Analytics', sublabel: 'Dashboard' },
  '/calendar': { icon: Calendar, label: 'Dashboard & Analytics', sublabel: 'Calendar' },
  '/reports': { icon: LineChart, label: 'Dashboard & Analytics', sublabel: 'Reports' },
  '/leads': { icon: Target, label: 'Pipeline Management', sublabel: 'Leads' },
  '/deals-kanban': { icon: Kanban, label: 'Pipeline Management', sublabel: 'Deal Kanban' },
  '/deals': { icon: Handshake, label: 'Pipeline Management', sublabel: 'Deals' },
  '/contacts': { icon: Users, label: 'Contacts & Organizations', sublabel: 'Contacts' },
  '/companies': { icon: Building2, label: 'Contacts & Organizations', sublabel: 'Organizations' },
  '/products': { icon: Package, label: 'Products' },
  '/emails': { icon: Mail, label: 'Communication & Activities', sublabel: 'Emails' },
  '/notes': { icon: StickyNote, label: 'Communication & Activities', sublabel: 'Notes' },
  '/tasks': { icon: CheckSquare, label: 'Communication & Activities', sublabel: 'Tasks' },
  '/notifications': { icon: Bell, label: 'Communication & Activities', sublabel: 'Notifications' },
  '/call-logs': { icon: PhoneCall, label: 'Telephony', sublabel: 'Call Logs' },
  '/data-import': { icon: Upload, label: 'Tools', sublabel: 'Data Import' },
  '/persona-forms': { icon: ClipboardList, label: 'Tools', sublabel: 'Persona Forms' },
  '/settings/integration': { icon: Plug, label: 'Settings', sublabel: 'Integration' },
  '/settings/profile': { icon: User, label: 'Settings', sublabel: 'Profile' },
  '/settings/sessions': { icon: Monitor, label: 'Settings', sublabel: 'Sessions' },
  '/settings/users': { icon: UserPlus, label: 'Settings', sublabel: 'Users' },
  '/settings/roles': { icon: ShieldCheck, label: 'Settings', sublabel: 'Roles & Permissions' },
  '/settings/email-config': { icon: MailCheck, label: 'Settings', sublabel: 'Email Config' },
  '/settings/email-templates': { icon: FileText, label: 'Settings', sublabel: 'Email Templates' },
  '/settings/twilio-config': { icon: Phone, label: 'Settings', sublabel: 'Twilio Config' },
  '/settings/exotel-config': { icon: PhoneCall, label: 'Settings', sublabel: 'Exotel Config' },
  '/settings/general': { icon: SlidersHorizontal, label: 'Settings', sublabel: 'General' },
  '/settings': { icon: Settings, label: 'Settings' }
};

export default function Header({ onMenuToggle }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const breadcrumb = Object.entries(breadcrumbs).find(([path]) => currentPath.startsWith(path))?.[1] || { icon: Folder, label: 'Home' };
  const Icon = breadcrumb.icon;

  return (
    <header className="px-4 lg:px-6 py-4 bg-white border-b border-stone-200/80 flex items-center justify-between gap-4 font-sans h-[56px] shrink-0">
      {/* Mobile Menu & Path */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-1 -ml-1 text-stone-500 hover:text-stone-900 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <button className="hidden lg:block text-stone-400 hover:text-stone-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
          {!breadcrumb.sublabel && <Icon className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />}
          <span className="hidden sm:inline">{breadcrumb.label}</span>
          {breadcrumb.sublabel && (
            <>
              <span className="text-stone-300 font-normal">/</span>
              <Icon className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-800 font-semibold">{breadcrumb.sublabel}</span>
            </>
          )}
        </div>
      </div>

      {/* Inputs & Actions */}
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            className="w-44 pl-8 pr-8 py-1 text-xs bg-stone-100/80 border-transparent rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-300 transition-all font-medium text-stone-700 placeholder-stone-400"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1 text-[9px] font-sans text-stone-400 bg-white border border-stone-200 rounded leading-none">⌘F</kbd>
        </div>

        <button className="flex items-center gap-1 px-3 py-1 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors shadow-xs">
          <Folder className="w-3.5 h-3.5 text-stone-400" />
          <span>Manage</span>
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors shadow-xs">
          <Share2 className="w-3.5 h-3.5 text-stone-400" />
          <span>Share</span>
        </button>

        <button className="flex items-center gap-1 px-3.5 py-1 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs">
          <span>Create task</span>
        </button>
      </div>
    </header>
  );
}