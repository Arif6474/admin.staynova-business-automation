import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveApiService, LeaveRequestData } from '../../services/endpoints/leave.service.js';
import { PageHeader } from '../../common/components/layout/PageHeader.js';
import { DataTable, Column } from '../../common/components/data-table/DataTable.js';
import { Badge } from '../../common/components/ui/Badge.js';
import { Button } from '../../common/components/ui/Button.js';
import { Check, X } from 'lucide-react';
import { formatDate } from '../../common/utils/formatters.js';
import toast from 'react-hot-toast';

export const LeaveListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ['leave-requests', page],
    queryFn: () => leaveApiService.getRequests({ page, limit: 15 }),
  });

  const approvalMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) =>
      leaveApiService.approveOrReject(id, { status }),
    onSuccess: (_, variables) => {
      toast.success(`Leave request ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      queryClient.invalidateQueries({ queryKey: ['executive-metrics'] });
    },
  });

  const columns: Column<LeaveRequestData>[] = [
    {
      key: 'employee',
      header: 'Employee',
      render: (row) => (
        <div>
          <p className="font-semibold text-txt-primary">
            {row.employeeId?.firstName} {row.employeeId?.lastName}
          </p>
          <span className="font-mono text-xs text-brand-600 dark:text-brand-400 font-medium">
            {row.employeeId?.employeeCode}
          </span>
        </div>
      ),
    },
    {
      key: 'leaveType',
      header: 'Leave Type',
      render: (row) => <span className="text-txt-secondary font-medium">{row.leaveTypeId?.name}</span>,
    },
    {
      key: 'dates',
      header: 'Duration',
      render: (row) => (
        <div>
          <p className="text-xs text-txt-secondary">
            {formatDate(row.startDate)} – {formatDate(row.endDate)}
          </p>
          <p className="text-[11px] text-txt-muted font-semibold">{row.totalDays} Day(s)</p>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (row) => <span className="text-xs text-txt-muted italic">{row.reason || 'None provided'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const variant =
          row.status === 'approved'
            ? 'success'
            : row.status === 'rejected'
            ? 'danger'
            : 'warning';
        return <Badge variant={variant}>{row.status}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Decision',
      render: (row) => (
        <div className="flex items-center space-x-1.5">
          {row.status === 'pending' ? (
            <>
              <Button
                variant="success"
                size="sm"
                isLoading={approvalMutation.isPending}
                onClick={() => approvalMutation.mutate({ id: row._id, status: 'approved' })}
              >
                <Check className="w-3.5 h-3.5 mr-1" /> Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={approvalMutation.isPending}
                onClick={() => approvalMutation.mutate({ id: row._id, status: 'rejected' })}
              >
                <X className="w-3.5 h-3.5 mr-1" /> Reject
              </Button>
            </>
          ) : (
            <span className="text-xs text-txt-muted capitalize">{row.status}</span>
          )}
        </div>
      ),
    },
  ];

  const requests = (response?.data as unknown as LeaveRequestData[]) || [];
  const meta = response?.meta || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management & Approvals"
        description="Review time-off requests, balances, and statutory paid/unpaid leaves."
      />

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={requests as unknown as Record<string, unknown>[]}
        isLoading={isLoading}
        page={meta.page}
        totalPages={meta.totalPages}
        totalItems={meta.total}
        onPageChange={setPage}
        emptyMessage="No leave requests pending."
      />
    </div>
  );
};
