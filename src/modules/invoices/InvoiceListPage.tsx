import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { invoiceApiService, InvoiceData } from '../../services/endpoints/invoice.service.js';
import { PageHeader } from '../../common/components/layout/PageHeader.js';
import { DataTable, Column } from '../../common/components/data-table/DataTable.js';
import { Badge } from '../../common/components/ui/Badge.js';
import { Button } from '../../common/components/ui/Button.js';
import { Plus, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '../../common/utils/formatters.js';

export const InvoiceListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data: response, isLoading } = useQuery({
    queryKey: ['invoices', page, search],
    queryFn: () => invoiceApiService.getAll({ page, limit: 15, search: search || undefined }),
  });

  const columns: Column<InvoiceData>[] = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      render: (row) => (
        <span className="font-mono text-xs text-brand-600 dark:text-brand-400 font-bold flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          {row.invoiceNumber}
        </span>
      ),
    },
    {
      key: 'client',
      header: 'Client Company',
      render: (row) => <span className="font-semibold text-txt-primary">{row.clientId?.companyName || 'Client'}</span>,
    },
    {
      key: 'totalAmount',
      header: 'Total Amount (w/ VAT)',
      render: (row) => <span className="font-bold text-txt-primary font-mono">{formatCurrency(row.totalAmount)}</span>,
    },
    {
      key: 'amountPaid',
      header: 'Amount Paid',
      render: (row) => (
        <span className="text-status-success font-mono font-semibold">
          {formatCurrency(row.amountPaid || 0)}
        </span>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (row) => <span className="text-xs text-txt-muted">{formatDate(row.dueDate)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const variant =
          row.status === 'paid'
            ? 'success'
            : row.status === 'partially_paid'
            ? 'warning'
            : row.status === 'overdue'
            ? 'danger'
            : row.status === 'sent'
            ? 'primary'
            : 'neutral';
        return <Badge variant={variant}>{row.status.replace('_', ' ')}</Badge>;
      },
    },
  ];

  const invoices = (response?.data as unknown as InvoiceData[]) || [];
  const meta = response?.meta || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices & Billing"
        description="Automate recurring client billing, line items calculation, and VAT enforcement."
        actions={
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" /> Create Invoice
          </Button>
        }
      />

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={invoices as unknown as Record<string, unknown>[]}
        isLoading={isLoading}
        searchPlaceholder="Search invoices..."
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        page={meta.page}
        totalPages={meta.totalPages}
        totalItems={meta.total}
        onPageChange={setPage}
        emptyMessage="No invoices found."
      />
    </div>
  );
};
