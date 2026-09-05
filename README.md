# StayNova  — Business Automation Admin Portal

High-performance, enterprise-grade admin web application built with **React, TypeScript, Vite, TailwindCSS, and TanStack Query**.

---

## ⚡ Tech Stack & Highlights

- **Vite 6**: Sub-second Hot Module Replacement (HMR) and optimized build pipeline.
- **React 19 + TypeScript**: Strong typing throughout models, forms, hooks, and API responses.
- **TailwindCSS**: Sleek dark enterprise theme with glassmorphism panels, cohesive slate & indigo color palette, and micro-animations.
- **TanStack React Query v5**: Server state management, auto-caching, mutation handlers, background revalidation, and pagination.
- **Axios Interceptor Engine**: Automatic Bearer token attachment, silent token refresh flow on 401s, and error toast handling.
- **React Router DOM v6**: Protected routing with `ProtectedRoute` and granular permission `RoleGuard`.
- **Recharts**: Executive analytics, workforce charts, and attendance distribution.
- **Lucide Icons**: Modern, lightweight SVG iconography.

---

## 📁 Directory Structure

```
admin/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── .env.example
├── .env
└── src/
    ├── main.tsx                         # App bootstrap
    ├── App.tsx                          # App providers (QueryClient, Auth, Router, Toaster)
    ├── index.css                        # Design system tokens & Tailwind imports
    │
    ├── config/                          # App configs & navigation hierarchy
    │   ├── env.config.ts
    │   ├── constants.ts
    │   └── navigation.ts                # Navigation groups mapped to RBAC permissions
    │
    ├── common/                          # Reusable components & utilities
    │   ├── components/
    │   │   ├── ui/                      # Button, Input, Select, Badge, Card, Modal, Spinner, Avatar, Tabs
    │   │   ├── layout/                  # AdminLayout, Sidebar, Topbar, PageHeader, AuthLayout
    │   │   └── data-table/              # Paginated, searchable DataTable
    │   ├── hooks/                       # useAuth, usePermission
    │   ├── utils/                       # cn helper, formatCurrency, formatDate
    │   └── types/                       # Shared API response interfaces
    │
    ├── services/                        # API communication
    │   ├── api.client.ts                # Axios instance with refresh interceptor
    │   └── endpoints/                   # Typed API service wrappers for all backend modules
    │
    ├── context/                         # AuthContext state provider
    │   └── AuthContext.tsx
    │
    ├── routes/                          # App routing & guards
    │   ├── AppRoutes.tsx
    │   ├── ProtectedRoute.tsx
    │   └── RoleGuard.tsx
    │
    └── modules/                         # Domain-driven feature pages
        ├── auth/                        # LoginPage, RegisterPage
        ├── dashboard/                   # DashboardPage (KPIs, Charts, Compliance alerts)
        ├── employees/                   # EmployeeListPage
        ├── clients/                     # ClientListPage
        ├── manpower-requests/           # ManpowerRequestListPage
        ├── assignments/                 # AssignmentListPage
        ├── schedules/                   # ScheduleCalendarPage
        ├── attendance/                  # AttendanceListPage
        ├── leaves/                      # LeaveListPage
        ├── replacements/                # ReplacementListPage
        ├── payroll/                     # PayrollListPage
        ├── invoices/                    # InvoiceListPage
        ├── payments/                    # PaymentListPage
        ├── organization/                # OrganizationProfilePage
        ├── roles/                       # RoleListPage
        ├── users/                       # UserListPage
        ├── audit-logs/                  # AuditLogListPage
        └── notifications/               # NotificationListPage
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20+` or `v22+`
- **StayNova Backend API**: Running on port `5005` (`npm run dev` in `backend/`)

### 2. Setup & Installation
```bash
# Navigate to admin directory
cd admin

# Install dependencies
npm install

# Start development server
npm run dev
```

The admin portal will be accessible at `http://localhost:3000`.

### 3. Production Build
```bash
# Typecheck & build bundle
npm run build

# Preview build locally
npm run preview
```

---

## 🔐 Default Super Admin Credentials
- **Email**: `admin@staynova.com`
- **Password**: `StayNova2026!Secure`
