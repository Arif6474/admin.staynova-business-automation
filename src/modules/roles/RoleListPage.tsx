import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { roleApiService, RoleData } from '../../services/endpoints/role.service.js';
import { PageHeader } from '../../common/components/layout/PageHeader.js';
import { DataTable, Column } from '../../common/components/data-table/DataTable.js';
import { Badge } from '../../common/components/ui/Badge.js';
import { Shield } from 'lucide-react';

export const RoleListPage: React.FC = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleApiService.getAll(),
  });

  const columns: Column<RoleData>[] = [
    {
      key: 'name',
      header: 'Role Name',
      render: (row) => (
        <span className="font-semibold text-txt-primary flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-500" />
          {row.name}
        </span>
      ),
    },
    {
      key: 'permissions',
      header: 'Assigned Permissions',
      render: (row) => (
        <div className="flex flex-wrap gap-1 max-w-xl">
          {row.permissions?.slice(0, 6).map((p) => (
            <span
              key={p.module}
              className="px-2 py-0.5 rounded text-[11px] bg-muted text-txt-secondary border border-subtle font-mono"
            >
              {p.module} ({p.actions.join(', ')})
            </span>
          ))}
          {(row.permissions?.length || 0) > 6 && (
            <span className="text-[11px] text-txt-muted self-center">
              +{(row.permissions?.length || 0) - 6} more
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'isSystemRole',
      header: 'Type',
      render: (row) => (
        <Badge variant={row.isSystemRole ? 'primary' : 'neutral'}>
          {row.isSystemRole ? 'System Built-in' : 'Custom'}
        </Badge>
      ),
    },
  ];

  const roles = (response?.data as unknown as RoleData[]) || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Access Control"
        description="Configure granular module permissions and system-level access matrices."
      />

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={roles as unknown as Record<string, unknown>[]}
        isLoading={isLoading}
        emptyMessage="No roles configured."
      />
    </div>
  );
};
