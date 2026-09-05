import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { payrollApiService, PayrollRunData } from '../../services/endpoints/payroll.service.js';
import { PageHeader } from '../../common/components/layout/PageHeader.js';
import { DataTable, Column } from '../../common/components/data-table/DataTable.js';
import { Badge } from '../../common/components/ui/Badge.js';
import { Button } from '../../common/components/ui/Button.js';
import { Plus, CheckCircle, Calculator } from 'lucide-react';
import { formatCurrency, formatDate } from '../../common/utils/formatters.js';
import toast from 'react-hot-toast';

export const PayrollListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ['payroll-runs', page],
    queryFn: () => payrollApiService.getRuns({ page, limit: 15 }),
  });

  const finalizeMutation = useMutation({
    mutationFn: (id: string) => payrollApiService.finalize(id),
    onSuccess: () => {
      toast.success('Payroll run calculated and finalized atomically!');
      queryClient.invalidateQueries({ queryKey: ['payroll-runs'] });
      queryClient.invalidateQueries({ queryKey: ['executive-metrics'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to finalize payroll';
      toast.error(msg);
    },
  });

  const columns: Column<PayrollRunData>[] = [
    {
      key: 'period',
      header: 'Payroll Period',
      render: (row) => (
        <span className="font-medium text-txt-primary">
          {formatDate(row.periodStart)} – {formatDate(row.periodEnd)}
        </span>
      ),
    },
    {
      key: 'totalEmployees',
      header: 'Staff Count',
      render: (row) => <span className="text-txt-secondary font-semibold">{row.totalEmployees || 0} employees</span>,
    },
    {
      key: 'totalGrossPay',
      header: 'Gross Total',
      render: (row) => <span className="text-txt-secondary">{formatCurrency(row.totalGrossPay || 0)}</span>,
    },
    {
      key: 'totalNetPay',
      header: 'Net Payout',
      render: (row) => (
        <span className="font-bold text-status-success font-mono">
          {formatCurrency(row.totalNetPay || 0)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const variant =
          row.status === 'finalized'
            ? 'success'
            : row.status === 'paid'
            ? 'primary'
            : row.status === 'processing'
            ? 'warning'
            : 'neutral';
        return <Badge variant={variant}>{row.status}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          {row.status === 'draft' && (
            <Button
              variant="success"
              size="sm"
              isLoading={finalizeMutation.isPending}
              onClick={() => finalizeMutation.mutate(row._id)}
            >
              <Calculator className="w-3.5 h-3.5 mr-1" />
              Calculate & Finalize
            </Button>
          )}
          {row.status === 'finalized' && (
            <span className="text-xs text-status-success flex items-center gap-1 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Ready for Disbursal
            </span>
          )}
        </div>
      ),
    },
  ];

  const runs = (response?.data as unknown as PayrollRunData[]) || [];
  const meta = response?.meta || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll & Compensation Processing"
        description="Calculate hours, overtime multipliers, allowances, and generate compliant payslips."
        actions={
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" /> Generate Payroll Run
          </Button>
        }
      />

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={runs as unknown as Record<string, unknown>[]}
        isLoading={isLoading}
        page={meta.page}
        totalPages={meta.totalPages}
        totalItems={meta.total}
        onPageChange={setPage}
        emptyMessage="No payroll runs generated yet."
      />
    </div>
  );
};
