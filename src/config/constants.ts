export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'staynova_access_token',
  REFRESH_TOKEN: 'staynova_refresh_token',
  USER_DATA: 'staynova_user_data',
  THEME: 'staynova_theme',
} as const;

export const SystemRoles = {
  SUPER_ADMIN: 'Super Admin',
  MANAGEMENT: 'Management',
  HR: 'HR',
  OPERATIONS: 'Operations',
  FINANCE: 'Finance',
  SALES: 'Sales',
  SUPERVISOR: 'Supervisor',
  EMPLOYEE: 'Employee',
} as const;

export const Modules = {
  ORGANIZATION: 'organization',
  USER: 'user',
  ROLE: 'role',
  EMPLOYEE: 'employee',
  CLIENT: 'client',
  MANPOWER_REQUEST: 'manpower_request',
  ASSIGNMENT: 'assignment',
  SHIFT: 'shift',
  SCHEDULE: 'schedule',
  ATTENDANCE: 'attendance',
  LEAVE: 'leave',
  REPLACEMENT: 'replacement',
  PAYROLL: 'payroll',
  INVOICE: 'invoice',
  PAYMENT: 'payment',
  NOTIFICATION: 'notification',
  AUDIT_LOG: 'audit_log',
  DASHBOARD: 'dashboard',
} as const;
