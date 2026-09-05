import {
  LayoutDashboard,
  Users,
  Building2,
  FileSpreadsheet,
  Briefcase,
  CalendarDays,
  Clock,
  CalendarOff,
  UserCheck,
  Receipt,
  FileText,
  CreditCard,
  Bell,
  ShieldCheck,
  Shield,
  Activity,
} from 'lucide-react';
import { Modules } from './constants.js';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  module?: string;
  badge?: string;
}

export interface NavGroup {
  id: string;
  groupTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  hubHref?: string;
  items: NavItem[];
}

export const navigationConfig: NavGroup[] = [
  {
    id: 'overview',
    groupTitle: 'Overview',
    icon: LayoutDashboard,
    hubHref: '/dashboard',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        module: Modules.DASHBOARD,
      },
    ],
  },
  {
    id: 'workforce',
    groupTitle: 'Workforce & Ops',
    icon: Briefcase,
    hubHref: '/workforce',
    items: [
      {
        title: 'Employees',
        href: '/employees',
        icon: Users,
        module: Modules.EMPLOYEE,
      },
      {
        title: 'Clients',
        href: '/clients',
        icon: Building2,
        module: Modules.CLIENT,
      },
      {
        title: 'Manpower Requests',
        href: '/manpower-requests',
        icon: FileSpreadsheet,
        module: Modules.MANPOWER_REQUEST,
      },
      {
        title: 'Assignments',
        href: '/assignments',
        icon: Briefcase,
        module: Modules.ASSIGNMENT,
      },
      {
        title: 'Rosters & Schedules',
        href: '/schedules',
        icon: CalendarDays,
        module: Modules.SCHEDULE,
      },
      {
        title: 'Attendance',
        href: '/attendance',
        icon: Clock,
        module: Modules.ATTENDANCE,
      },
      {
        title: 'Leave Requests',
        href: '/leaves',
        icon: CalendarOff,
        module: Modules.LEAVE,
      },
      {
        title: 'Replacements',
        href: '/replacements',
        icon: UserCheck,
        module: Modules.REPLACEMENT,
      },
    ],
  },
  {
    id: 'financials',
    groupTitle: 'Financials & Billing',
    icon: CreditCard,
    hubHref: '/financials',
    items: [
      {
        title: 'Payroll',
        href: '/payroll',
        icon: Receipt,
        module: Modules.PAYROLL,
      },
      {
        title: 'Invoices',
        href: '/invoices',
        icon: FileText,
        module: Modules.INVOICE,
      },
      {
        title: 'Payments',
        href: '/payments',
        icon: CreditCard,
        module: Modules.PAYMENT,
      },
    ],
  },
  {
    id: 'administration',
    groupTitle: 'Administration',
    icon: ShieldCheck,
    hubHref: '/administration',
    items: [
      {
        title: 'Organization',
        href: '/organization',
        icon: Building2,
        module: Modules.ORGANIZATION,
      },
      {
        title: 'User Accounts',
        href: '/users',
        icon: Users,
        module: Modules.USER,
      },
      {
        title: 'Roles & Permissions',
        href: '/roles',
        icon: Shield,
        module: Modules.ROLE,
      },
      {
        title: 'Audit Logs',
        href: '/audit-logs',
        icon: Activity,
        module: Modules.AUDIT_LOG,
      },
      {
        title: 'Notifications',
        href: '/notifications',
        icon: Bell,
        module: Modules.NOTIFICATION,
      },
    ],
  },
];
