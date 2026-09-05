import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApiService, AttendanceData } from '../../services/endpoints/attendance.service.js';
import { PageHeader } from '../../common/components/layout/PageHeader.js';
import { DataTable, Column } from '../../common/components/data-table/DataTable.js';
import { Badge } from '../../common/components/ui/Badge.js';
import { Button } from '../../common/components/ui/Button.js';
import { Check, Clock, MapPin } from 'lucide-react';
import { formatDateTime } from '../../common/utils/formatters.js';
import toast from 'react-hot-toast';

export const AttendanceListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ['attendance', page],
    queryFn: () => attendanceApiService.getAll({ page, limit: 15 }),
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) => attendanceApiService.verify(id),
    onSuccess: () => {
      toast.success('Attendance verified');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });

  const columns: Column<AttendanceData>[] = [
    {
      key: 'employee',
      header: 'Staff Member',
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
      key: 'checkIn',
      header: 'Check-In (GPS)',
      render: (row) => (
        <div>
          <p className="text-xs text-txt-secondary">{formatDateTime(row.checkIn?.time)}</p>
          {row.checkIn?.lat ? (
            <p className="text-[10px] text-txt-muted flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-brand-500" />
              {row.checkIn.lat.toFixed(4)}, {row.checkIn.lng?.toFixed(4)}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      key: 'checkOut',
      header: 'Check-Out (GPS)',
      render: (row) => (
        <div>
          {row.checkOut?.time ? (
            <>
              <p className="text-xs text-txt-secondary">{formatDateTime(row.checkOut.time)}</p>
              {row.checkOut.lat ? (
                <p className="text-[10px] text-txt-muted flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-brand-500" />
                  {row.checkOut.lat.toFixed(4)}, {row.checkOut.lng?.toFixed(4)}
                </p>
              ) : null}
            </>
          ) : (
            <span className="text-xs text-status-warning font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" /> Shift in progress
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'hoursWorked',
      header: 'Hours Worked',
      render: (row) => (
        <span className="font-bold text-txt-primary font-mono">
          {row.hoursWorked ? `${row.hoursWorked} hrs` : '-'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const variant =
          row.status === 'present'
            ? 'success'
            : row.status === 'late'
            ? 'warning'
            : 'danger';
        return <Badge variant={variant}>{row.status}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Verification',
      render: (row) => (
        <Button
          variant="secondary"
          size="sm"
          isLoading={verifyMutation.isPending}
          onClick={() => verifyMutation.mutate(row._id)}
        >
          <Check className="w-3.5 h-3.5 mr-1 text-status-success" />
          Verify
        </Button>
      ),
    },
  ];

  const attendance = (response?.data as unknown as AttendanceData[]) || [];
  const meta = response?.meta || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Attendance & Shift Verification"
        description="Monitor real-time worker check-ins with geo-coordinates and verify work hours."
      />

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={attendance as unknown as Record<string, unknown>[]}
        isLoading={isLoading}
        page={meta.page}
        totalPages={meta.totalPages}
        totalItems={meta.total}
        onPageChange={setPage}
        emptyMessage="No attendance logs recorded yet."
      />
    </div>
  );
};
