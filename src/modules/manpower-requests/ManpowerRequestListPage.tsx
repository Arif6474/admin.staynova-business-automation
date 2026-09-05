import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api.client.js';
import { PageHeader } from '../../common/components/layout/PageHeader.js';
import { DataTable, Column } from '../../common/components/data-table/DataTable.js';
import { Badge } from '../../common/components/ui/Badge.js';
import { Button } from '../../common/components/ui/Button.js';
import { Plus } from 'lucide-react';
import { formatDate } from '../../common/utils/formatters.js';

export const ManpowerRequestListPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ['manpower-requests', page],
    queryFn: async () => {
      const res = await apiClient.get('/manpower-requests', { params: { page, limit: 15 } });
      return res.data;
    },
  });

  const columns: Column<any>[] = [
    {
      key: 'client',
      header: 'Client',
      render: (row) => <span className="font-semibold text-txt-primary">{row.clientId?.companyName || '-'}</span>,
    },
    {
      key: 'position',
      header: 'Position Requested',
      render: (row) => <span className="font-medium text-brand-600 dark:text-brand-400">{row.position}</span>,
    },
    {
      key: 'headcount',
      header: 'Headcount',
      render: (row) => <span className="font-bold text-txt-primary font-mono">{row.headcount} Staff</span>,
    },
    {
      key: 'requiredDate',
      header: 'Required Date',
      render: (row) => <span className="text-xs text-txt-secondary">{formatDate(row.requiredDate)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const variant =
          row.status === 'fulfilled'
            ? 'success'
            : row.status === 'partially_matched'
            ? 'warning'
            : 'neutral';
        return <Badge variant={variant}>{row.status.replace('_', ' ')}</Badge>;
      },
    },
  ];

  const requests = response?.data || [];
  const meta = response?.meta || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manpower Requisitions & Demand"
        description="Receive staffing requirements from clients and match available talent."
        actions={
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" /> New Requisition
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={requests}
        isLoading={isLoading}
        page={meta.page}
        totalPages={meta.totalPages}
        totalItems={meta.total}
        onPageChange={setPage}
        emptyMessage="No manpower requests logged."
      />
    </div>
  );
};
