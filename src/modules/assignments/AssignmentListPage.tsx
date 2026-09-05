import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api.client.js';
import { PageHeader } from '../../common/components/layout/PageHeader.js';
import { DataTable, Column } from '../../common/components/data-table/DataTable.js';
import { Badge } from '../../common/components/ui/Badge.js';
import { Button } from '../../common/components/ui/Button.js';
import { Plus, History } from 'lucide-react';
import { formatDate } from '../../common/utils/formatters.js';

export const AssignmentListPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ['assignments', page],
    queryFn: async () => {
      const res = await apiClient.get('/assignments', { params: { page, limit: 15 } });
      return res.data;
    },
  });

  const columns: Column<any>[] = [
    {
      key: 'employee',
      header: 'Assigned Staff',
      render: (row) => (
        <div>
          <p className="font-semibold text-txt-primary">
            {row.employeeId?.firstName} {row.employeeId?.lastName}
          </p>
          <span className="text-xs text-txt-muted font-mono">{row.employeeId?.employeeCode}</span>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client & Position',
      render: (row) => (
        <div>
          <p className="text-txt-secondary font-medium">{row.clientId?.companyName || '-'}</p>
          <p className="text-xs text-brand-600 dark:text-brand-400">{row.position || 'General Staff'}</p>
        </div>
      ),
    },
    {
      key: 'dates',
      header: 'Contract Duration',
      render: (row) => (
        <span className="text-xs text-txt-secondary">
          {formatDate(row.startDate)} {row.endDate ? `– ${formatDate(row.endDate)}` : '(Ongoing)'}
        </span>
      ),
    },
    {
      key: 'historyCount',
      header: 'Audit Trail',
      render: (row) => (
        <span className="text-xs text-txt-muted flex items-center gap-1">
          <History className="w-3.5 h-3.5 text-txt-muted" />
          {row.history?.length || 1} Events
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'confirmed' || row.status === 'active' ? 'success' : 'neutral'}>
          {row.status}
        </Badge>
      ),
    },
  ];

  const assignments = response?.data || [];
  const meta = response?.meta || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Assignments & Deployments"
        description="Track active employee deployment across clients with full append-only audit trail."
        actions={
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" /> Deploy Staff
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={assignments}
        isLoading={isLoading}
        page={meta.page}
        totalPages={meta.totalPages}
        totalItems={meta.total}
        onPageChange={setPage}
        emptyMessage="No staff assignments found."
      />
    </div>
  );
};
