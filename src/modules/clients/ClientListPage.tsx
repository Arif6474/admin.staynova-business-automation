import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clientApiService, ClientData } from '../../services/endpoints/client.service.js';
import { PageHeader } from '../../common/components/layout/PageHeader.js';
import { DataTable, Column } from '../../common/components/data-table/DataTable.js';
import { Badge } from '../../common/components/ui/Badge.js';
import { Button } from '../../common/components/ui/Button.js';
import { Plus } from 'lucide-react';
import { formatDate } from '../../common/utils/formatters.js';

export const ClientListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data: response, isLoading } = useQuery({
    queryKey: ['clients', page, search],
    queryFn: () => clientApiService.getAll({ page, limit: 15, search: search || undefined }),
  });

  const columns: Column<ClientData>[] = [
    {
      key: 'companyName',
      header: 'Company Name',
      render: (row) => (
        <div>
          <p className="font-semibold text-txt-primary">{row.companyName}</p>
          <p className="text-xs text-txt-muted">{row.email || '-'}</p>
        </div>
      ),
    },
    {
      key: 'contactPerson',
      header: 'Contact Person',
      render: (row) => (
        <div>
          <p className="text-txt-secondary">{row.contactPerson || '-'}</p>
          <p className="text-xs text-txt-muted">{row.phone || '-'}</p>
        </div>
      ),
    },
    {
      key: 'billingTerms',
      header: 'Billing Terms',
      render: (row) => <span className="uppercase text-xs font-mono text-txt-secondary">{row.billingTerms}</span>,
    },
    {
      key: 'rateCards',
      header: 'Rate Cards',
      render: (row) => (
        <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">
          {row.rateCards?.length || 0} Positions Configured
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'neutral'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (row) => <span className="text-xs text-txt-muted">{formatDate(row.createdAt)}</span>,
    },
  ];

  const clients = (response?.data as unknown as ClientData[]) || [];
  const meta = response?.meta || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Accounts & Contracts"
        description="Manage enterprise clients, service level agreements, and position rate cards."
        actions={
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" /> Add Client
          </Button>
        }
      />

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={clients as unknown as Record<string, unknown>[]}
        isLoading={isLoading}
        searchPlaceholder="Search by company name, contact, email..."
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        page={meta.page}
        totalPages={meta.totalPages}
        totalItems={meta.total}
        onPageChange={setPage}
        emptyMessage="No clients found."
      />
    </div>
  );
};
