import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { employeeApiService, EmployeeData } from '../../services/endpoints/employee.service.js';
import { PageHeader } from '../../common/components/layout/PageHeader.js';
import { DataTable, Column } from '../../common/components/data-table/DataTable.js';
import { Badge } from '../../common/components/ui/Badge.js';
import { Button } from '../../common/components/ui/Button.js';
import { Plus, ShieldAlert } from 'lucide-react';
import { formatDate } from '../../common/utils/formatters.js';

export const EmployeeListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data: response, isLoading } = useQuery({
    queryKey: ['employees', page, search],
    queryFn: () => employeeApiService.getAll({ page, limit: 15, search: search || undefined }),
  });

  const { data: expiringDocs } = useQuery({
    queryKey: ['expiring-documents'],
    queryFn: () => employeeApiService.getExpiringDocuments(30),
  });

  const columns: Column<EmployeeData>[] = [
    {
      key: 'employeeCode',
      header: 'Code',
      render: (row) => (
        <span className="font-mono text-xs text-brand-600 dark:text-brand-400 font-semibold">
          {row.employeeCode}
        </span>
      ),
    },
    {
      key: 'fullName',
      header: 'Employee Name',
      render: (row) => (
        <div>
          <p className="font-medium text-txt-primary">{row.firstName} {row.lastName}</p>
          <p className="text-xs text-txt-muted">{row.email || row.phone || 'No contact info'}</p>
        </div>
      ),
    },
    {
      key: 'position',
      header: 'Position & Dept',
      render: (row) => (
        <div>
          <p className="text-txt-secondary">{row.position || '-'}</p>
          <p className="text-xs text-txt-muted">{row.department || 'General'}</p>
        </div>
      ),
    },
    {
      key: 'employmentType',
      header: 'Type',
      render: (row) => (
        <span className="capitalize text-xs text-txt-secondary font-medium">
          {row.employmentType.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const variant =
          row.status === 'active'
            ? 'success'
            : row.status === 'on_leave'
            ? 'warning'
            : 'neutral';
        return <Badge variant={variant}>{row.status.replace('_', ' ')}</Badge>;
      },
    },
    {
      key: 'createdAt',
      header: 'Hire Date',
      render: (row) => <span className="text-xs text-txt-muted">{formatDate(row.createdAt)}</span>,
    },
  ];

  const employees = (response?.data as unknown as EmployeeData[]) || [];
  const meta = response?.meta || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workforce & Employee Directory"
        description="Manage employee profiles, skills, availability, and document compliance."
        actions={
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" /> Add Employee
          </Button>
        }
      />

      {expiringDocs && expiringDocs.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between text-amber-800 dark:text-amber-300 text-xs sm:text-sm">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <strong className="font-semibold text-amber-800 dark:text-amber-200">Compliance Warning:</strong>{' '}
              {expiringDocs.length} employee documents (Visas, IDs, Passports) are expiring within 30 days.
            </div>
          </div>
        </div>
      )}

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={employees as unknown as Record<string, unknown>[]}
        isLoading={isLoading}
        searchPlaceholder="Search by name, code, email..."
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        page={meta.page}
        totalPages={meta.totalPages}
        totalItems={meta.total}
        onPageChange={setPage}
        emptyMessage="No employees registered yet."
      />
    </div>
  );
};
