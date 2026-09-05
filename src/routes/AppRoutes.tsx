import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../common/components/layout/AuthLayout.js';
import { AdminLayout } from '../common/components/layout/AdminLayout.js';
import { ProtectedRoute } from './ProtectedRoute.js';
import { navigationConfig } from '../config/navigation.js';

// Auth Pages
import { LoginPage } from '../modules/auth/LoginPage.js';
import { RegisterPage } from '../modules/auth/RegisterPage.js';

// Feature Pages
import { DashboardPage } from '../modules/dashboard/DashboardPage.js';
import { ModuleHubPage } from '../modules/hub/ModuleHubPage.js';
import { EmployeeListPage } from '../modules/employees/EmployeeListPage.js';
import { ClientListPage } from '../modules/clients/ClientListPage.js';
import { ManpowerRequestListPage } from '../modules/manpower-requests/ManpowerRequestListPage.js';
import { AssignmentListPage } from '../modules/assignments/AssignmentListPage.js';
import { ScheduleCalendarPage } from '../modules/schedules/ScheduleCalendarPage.js';
import { AttendanceListPage } from '../modules/attendance/AttendanceListPage.js';
import { LeaveListPage } from '../modules/leaves/LeaveListPage.js';
import { ReplacementListPage } from '../modules/replacements/ReplacementListPage.js';
import { PayrollListPage } from '../modules/payroll/PayrollListPage.js';
import { InvoiceListPage } from '../modules/invoices/InvoiceListPage.js';
import { PaymentListPage } from '../modules/payments/PaymentListPage.js';
import { OrganizationProfilePage } from '../modules/organization/OrganizationProfilePage.js';
import { UserListPage } from '../modules/users/UserListPage.js';
import { RoleListPage } from '../modules/roles/RoleListPage.js';
import { AuditLogListPage } from '../modules/audit-logs/AuditLogListPage.js';
import { NotificationListPage } from '../modules/notifications/NotificationListPage.js';

export const AppRoutes: React.FC = () => {
  const workforceGroup = navigationConfig.find((g) => g.id === 'workforce')!;
  const financialsGroup = navigationConfig.find((g) => g.id === 'financials')!;
  const adminGroup = navigationConfig.find((g) => g.id === 'administration')!;

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Module Hub Pages */}
        <Route
          path="/workforce"
          element={
            <ModuleHubPage
              group={workforceGroup}
              title="Workforce & Ops Hub"
              description="Manage employees, client contracts, manpower requests, and schedules"
            />
          }
        />
        <Route
          path="/financials"
          element={
            <ModuleHubPage
              group={financialsGroup}
              title="Financials & Billing Hub"
              description="Review payroll dispatches, client invoices, and payment tracking"
            />
          }
        />
        <Route
          path="/administration"
          element={
            <ModuleHubPage
              group={adminGroup}
              title="Administration Hub"
              description="Configure organization settings, user access, and system audit logs"
            />
          }
        />

        {/* Feature Sub-Routes */}
        <Route path="/employees" element={<EmployeeListPage />} />
        <Route path="/clients" element={<ClientListPage />} />
        <Route path="/manpower-requests" element={<ManpowerRequestListPage />} />
        <Route path="/assignments" element={<AssignmentListPage />} />
        <Route path="/schedules" element={<ScheduleCalendarPage />} />
        <Route path="/attendance" element={<AttendanceListPage />} />
        <Route path="/leaves" element={<LeaveListPage />} />
        <Route path="/replacements" element={<ReplacementListPage />} />
        <Route path="/payroll" element={<PayrollListPage />} />
        <Route path="/invoices" element={<InvoiceListPage />} />
        <Route path="/payments" element={<PaymentListPage />} />
        <Route path="/organization" element={<OrganizationProfilePage />} />
        <Route path="/users" element={<UserListPage />} />
        <Route path="/roles" element={<RoleListPage />} />
        <Route path="/audit-logs" element={<AuditLogListPage />} />
        <Route path="/notifications" element={<NotificationListPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
