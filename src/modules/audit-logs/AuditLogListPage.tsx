import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditLogApiService, AuditLogData } from '../../services/endpoints/audit-log.service.js';
import { PageHeader } from '../../common/components/layout/PageHeader.js';
import { DataTable, Column } from '../../common/components/data-table/DataTable.js';
import { formatDateTime } from '../../common/utils/formatters.js';
import { Activity } from 'lucide-react';

export const AuditLogListPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ['audit-logs', page],
    queryFn: () => auditLogApiService.getAll({ page, limit: 20 }),
  });

  const columns: Column<AuditLogData>[] = [
    {
      key: 'action',
      header: 'Action / Event',
      render: (row) => (
        <span className="font-semibold text-txt-primary font-mono text-xs flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-brand-500" />
          {row.action}
        </span>
      ),
    },
    {
      key: 'entityType',
      header: 'Target Entity',
      render: (row) => <span className="uppercase text-xs font-mono text-brand-600 dark:text-brand-400 font-medium">{row.entityType}</span>,
    },
    {
      key: 'user',
      header: 'Performed By',
      render: (row) => (
        <span className="text-txt-secondary text-xs">{row.userId?.fullName || row.userId?.email || 'System'}</span>
      ),
    },
    {
      key: 'ipAddress',
      header: 'IP Address',
      render: (row) => <span className="font-mono text-xs text-txt-muted">{row.ipAddress || '127.0.0.1'}</span>,
    },
    {
      key: 'createdAt',
      header: 'Timestamp',
      render: (row) => <span className="text-xs text-txt-muted">{formatDateTime(row.createdAt)}</span>,
    },
  ];

  const logs = (response?.data as unknown as AuditLogData[]) || [];
  const meta = response?.meta || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Compliance Audit Logs"
        description="Immutable enterprise audit trail tracking modifications, approvals, and user sessions."
      />

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={logs as unknown as Record<string, unknown>[]}
        isLoading={isLoading}
        page={meta.page}
        totalPages={meta.totalPages}
        totalItems={meta.total}
        onPageChange={setPage}
        emptyMessage="No audit records found."
      />
    </div>
  );
};
