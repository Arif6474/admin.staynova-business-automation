import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApiService, UserAccountData } from '../../services/endpoints/user.service.js';
import { PageHeader } from '../../common/components/layout/PageHeader.js';
import { DataTable, Column } from '../../common/components/data-table/DataTable.js';
import { Badge } from '../../common/components/ui/Badge.js';
import { Button } from '../../common/components/ui/Button.js';
import { UserPlus, Shield } from 'lucide-react';
import { formatDateTime } from '../../common/utils/formatters.js';

export const UserListPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ['users', page],
    queryFn: () => userApiService.getAll({ page, limit: 15 }),
  });

  const columns: Column<UserAccountData>[] = [
    {
      key: 'fullName',
      header: 'User Account',
      render: (row) => (
        <div>
          <p className="font-semibold text-txt-primary">{row.fullName}</p>
          <p className="text-xs text-txt-muted">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Assigned Role',
      render: (row) => (
        <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-brand-500" />
          {row.roleId?.name || 'Standard User'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'danger'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'lastLoginAt',
      header: 'Last Active',
      render: (row) => <span className="text-xs text-txt-muted">{formatDateTime(row.lastLoginAt)}</span>,
    },
  ];

  const users = (response?.data as unknown as UserAccountData[]) || [];
  const meta = response?.meta || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin & Staff User Accounts"
        description="Manage system login credentials, passwords, and security status."
        actions={
          <Button variant="primary" size="md">
            <UserPlus className="w-4 h-4 mr-1.5" /> Invite User
          </Button>
        }
      />

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={users as unknown as Record<string, unknown>[]}
        isLoading={isLoading}
        page={meta.page}
        totalPages={meta.totalPages}
        totalItems={meta.total}
        onPageChange={setPage}
        emptyMessage="No users registered."
      />
    </div>
  );
};
