import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  ChevronsLeft,
  ArrowUpDown,
  ExternalLink,
  X
} from 'lucide-react';
import { navigation, bottomNav } from '../../data/mockData';

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const [navState, setNavState] = useState({
    'Dashboard & Analytics': true,
    'Pipeline Management': true,
    'Contacts & Organizations': true,
    Products: true,
    'Communication & Activities': true,
    Telephony: true,
    Tools: true,
    Settings: true
  });

  const toggleGroup = (group) => {
    setNavState((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const getRoutePath = (name) => {
    const routes = {
      Dashboard: '/dashboard',
      Calendar: '/calendar',
      Reports: '/reports',
      Leads: '/leads',
      Deals: '/deals',
      'Deal Kanban': '/deals-kanban',
      Contacts: '/contacts',
      Organizations: '/companies',
      Products: '/products',
      Emails: '/emails',
      Notes: '/notes',
      Tasks: '/tasks',
      Notifications: '/notifications',
      'Call Logs': '/call-logs',
      'Data Import': '/data-import',
      'Persona Forms': '/persona-forms',
      Integrations: '/settings/integration',
      Profile: '/settings/profile',
      Sessions: '/settings/sessions',
      Users: '/settings/users',
      'Roles & Permissions': '/settings/roles',
      'Email Config': '/settings/email-config',
      'Email Templates': '/settings/email-templates',
      'Twilio Config': '/settings/twilio-config',
      'Exotel Config': '/settings/exotel-config',
      General: '/settings/general',
      'Help Center': '/help',
      'Invite teams': '/settings/users'
    };
    return routes[name] || '#';
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside 
        className={`fixed lg:relative inset-y-0 left-0 z-50 transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-[72px]' : 'w-56'
        } bg-[#f8f8f9] border-r border-stone-200/80 h-screen flex flex-col justify-between shrink-0 font-sans text-xs`}
      >
        <div className={`flex flex-col flex-1 overflow-y-auto py-5 ${collapsed ? 'px-2 items-center' : 'px-4'}`}>
          {/* Workspace Brand / Selector */}
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} mb-6 px-1 w-full`}>
            {!collapsed && (
              <div className="flex items-center gap-2.5">
                <img
                  src="/img/Logo.png"
                  alt="Orbis CRM"
                  className="h-8 w-auto mix-blend-multiply"
                />
              </div>
            )}
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:block text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-md hover:bg-stone-200/50"
            >
              <ChevronsLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            </button>
            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-stone-400 hover:text-stone-600 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dynamic Groups */}
          <nav className="space-y-4 flex-1 w-full">
          {navigation.map((group) => {
            const isExpanded = collapsed || navState[group.group];
            return (
              <div key={group.group} className="space-y-0.5">
                {!collapsed && (
                  <button
                    onClick={() => toggleGroup(group.group)}
                    className="w-full flex items-center justify-between py-1 px-1 text-[11px] font-semibold text-stone-500 hover:text-stone-900 transition-colors text-left"
                  >
                    <span>{group.group}</span>
                    <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
                  </button>
                )}

                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className={`space-y-1 ${collapsed ? 'pt-2 flex flex-col items-center' : 'pt-0.5'}`}>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const routePath = getRoutePath(item.name);
                      const isActive = location.pathname === routePath || location.pathname.startsWith(routePath + '/');
                      
                      return (
                        <Link
                          key={item.name}
                          to={routePath}
                          title={collapsed ? item.name : undefined}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center ${collapsed ? 'justify-center p-2.5' : 'justify-between px-2 py-1.5'} rounded-lg text-xs font-medium transition-all duration-200 w-full ${
                            isActive
                              ? 'bg-stone-200/70 text-stone-900 font-bold'
                              : 'text-stone-600 hover:bg-stone-200/40 hover:text-stone-900'
                          }`}
                        >
                          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
                            {Icon && <Icon className={`${collapsed ? 'w-5 h-5' : 'w-4 h-4'} ${isActive ? 'text-indigo-600' : 'text-stone-500'} shrink-0`} />}
                            {!collapsed && <span>{item.name}</span>}
                          </div>
                          
                          {!collapsed && (
                            <div className="flex items-center gap-1.5">
                              {item.indicator && (
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                              )}
                              {item.count !== null && (
                                <span className={`text-[10px] font-bold ${
                                  item.badgeColor ? 'px-1.5 py-0.2 rounded-full bg-rose-600 text-white' : 'text-stone-400'
                                }`}>
                                  {item.count}
                                </span>
                              )}
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
                {collapsed && <div className="h-px bg-stone-200/50 mx-2 my-2" />}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Nav */}
      <div className={`p-4 border-t border-stone-200/60 ${collapsed ? 'flex flex-col items-center space-y-2' : 'space-y-0.5'}`}>
        {bottomNav.map((item) => {
          const Icon = item.icon;
          const routePath = getRoutePath(item.name);
          const isActive = location.pathname === routePath;
          return (
            <Link
              key={item.name}
              to={routePath}
              title={collapsed ? item.name : undefined}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center ${collapsed ? 'justify-center p-2.5' : 'justify-between px-2 py-1.5'} w-full rounded-lg text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-stone-200/70 text-stone-900 font-bold'
                  : 'text-stone-600 hover:bg-stone-200/40 hover:text-stone-900'
              }`}
            >
              <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
                <Icon className={`${collapsed ? 'w-5 h-5' : 'w-4 h-4'} text-stone-500 shrink-0`} />
                {!collapsed && <span>{item.name}</span>}
              </div>
              {!collapsed && item.external && <ExternalLink className="w-3 h-3 text-stone-400" />}
            </Link>
          );
        })}

        {/* User Card - Kamil Bachanek */}
        <div className={`flex items-center ${collapsed ? 'justify-center mt-4' : 'gap-2.5 pt-3 mt-2 px-1 border-t border-stone-200/60'}`}>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Kamil Bachanek"
              className="w-8 h-8 rounded-full object-cover shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-bold text-stone-900 truncate leading-tight">Kamil Bachanek</h4>
                <p className="text-[10px] text-stone-400 truncate leading-tight mt-0.5">kamil@lumicloud.my.id</p>
              </div>
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0 cursor-pointer hover:text-stone-600" />
            </>
          )}
        </div>
      </div>
    </aside>
    </>
  );
}