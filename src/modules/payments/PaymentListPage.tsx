import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api.client.js';
import { PageHeader } from '../../common/components/layout/PageHeader.js';
import { DataTable, Column } from '../../common/components/data-table/DataTable.js';
import { formatCurrency, formatDate } from '../../common/utils/formatters.js';

export const PaymentListPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ['payments', page],
    queryFn: async () => {
      const res = await apiClient.get('/payments', { params: { page, limit: 15 } });
      return res.data;
    },
  });

  const columns: Column<any>[] = [
    {
      key: 'invoice',
      header: 'Invoice Reference',
      render: (row) => (
        <span className="font-mono text-xs text-brand-600 dark:text-brand-400 font-bold">
          {row.invoiceId?.invoiceNumber || '-'}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount Received',
      render: (row) => <span className="font-bold text-status-success font-mono">{formatCurrency(row.amount)}</span>,
    },
    {
      key: 'paymentMethod',
      header: 'Method',
      render: (row) => <span className="capitalize text-xs text-txt-secondary">{row.paymentMethod.replace('_', ' ')}</span>,
    },
    {
      key: 'referenceNumber',
      header: 'Txn / Ref #',
      render: (row) => <span className="font-mono text-xs text-txt-muted">{row.referenceNumber || '-'}</span>,
    },
    {
      key: 'paymentDate',
      header: 'Payment Date',
      render: (row) => <span className="text-xs text-txt-muted">{formatDate(row.paymentDate)}</span>,
    },
  ];

  const payments = response?.data || [];
  const meta = response?.meta || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Receipts & Reconciliation"
        description="Audit received client payments and automatic ledger reconciliation."
      />

      <DataTable
        columns={columns}
        data={payments}
        isLoading={isLoading}
        page={meta.page}
        totalPages={meta.totalPages}
        totalItems={meta.total}
        onPageChange={setPage}
        emptyMessage="No payments logged."
      />
    </div>
  );
};
