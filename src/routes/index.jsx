import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Lazy load pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Calendar = lazy(() => import('../pages/Calendar'));
const Tasks = lazy(() => import('../pages/Tasks'));
const TaskDetail = lazy(() => import('../pages/TaskDetail'));
const Contacts = lazy(() => import('../pages/Contacts'));
const Companies = lazy(() => import('../pages/Companies'));
const Leads = lazy(() => import('../pages/Leads'));
const LeadDetail = lazy(() => import('../pages/LeadDetail'));
const Deals = lazy(() => import('../pages/Deals'));
const DealDetail = lazy(() => import('../pages/DealDetail'));
const DealsKanban = lazy(() => import('../pages/DealsKanban'));
const Products = lazy(() => import('../pages/Products'));
const Emails = lazy(() => import('../pages/Emails'));
const Reports = lazy(() => import('../pages/Reports'));
const Settings = lazy(() => import('../pages/Settings'));
const Login = lazy(() => import('../pages/Login'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Protected Route wrapper
function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem('auth_token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes with AppLayout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />

          {/* Tasks */}
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:taskId" element={<TaskDetail />} />

          {/* Contacts */}
          <Route path="/contacts" element={<Contacts />} />

          {/* Companies */}
          <Route path="/companies" element={<Companies />} />

          {/* Leads */}
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/:id" element={<LeadDetail />} />

          {/* Deals */}
          <Route path="/deals" element={<Deals />} />
          <Route path="/deals/:id" element={<DealDetail />} />
          <Route path="/deals-kanban" element={<DealsKanban />} />

          {/* Products */}
          <Route path="/products" element={<Products />} />

          {/* Emails */}
          <Route path="/emails" element={<Emails />} />

          {/* Reports */}
          <Route path="/reports" element={<Reports />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/:section" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
