import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api.client.js';
import { PageHeader } from '../../common/components/layout/PageHeader.js';
import { DataTable, Column } from '../../common/components/data-table/DataTable.js';
import { Badge } from '../../common/components/ui/Badge.js';
import { formatDate } from '../../common/utils/formatters.js';

export const ReplacementListPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ['replacements', page],
    queryFn: async () => {
      const res = await apiClient.get('/replacements', { params: { page, limit: 15 } });
      return res.data;
    },
  });

  const columns: Column<any>[] = [
    {
      key: 'replacement',
      header: 'Replacement Worker',
      render: (row) => (
        <div>
          <p className="font-semibold text-txt-primary">
            {row.replacementEmployeeId?.firstName} {row.replacementEmployeeId?.lastName}
          </p>
          <span className="text-xs text-brand-600 dark:text-brand-400 font-mono">
            {row.replacementEmployeeId?.employeeCode}
          </span>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (row) => <span className="text-xs text-txt-secondary italic">{row.reason}</span>,
    },
    {
      key: 'effectiveDate',
      header: 'Effective Date',
      render: (row) => <span className="text-xs text-txt-muted">{formatDate(row.effectiveDate)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge variant="success">{row.status}</Badge>,
    },
  ];

  const replacements = response?.data || [];
  const meta = response?.meta || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Worker Replacements & Substitution Queue"
        description="Inspect emergency employee replacements across shifts and client assignments."
      />

      <DataTable
        columns={columns}
        data={replacements}
        isLoading={isLoading}
        page={meta.page}
        totalPages={meta.totalPages}
        totalItems={meta.total}
        onPageChange={setPage}
        emptyMessage="No worker substitutions recorded."
      />
    </div>
  );
};
