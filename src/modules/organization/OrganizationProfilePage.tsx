import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api.client.js';
import { PageHeader } from '../../common/components/layout/PageHeader.js';
import { Card } from '../../common/components/ui/Card.js';
import { Badge } from '../../common/components/ui/Badge.js';
import { Spinner } from '../../common/components/ui/Spinner.js';
import { Building2, Globe, Shield, Calendar } from 'lucide-react';
import { formatDate } from '../../common/utils/formatters.js';

export const OrganizationProfilePage: React.FC = () => {
  const { data: org, isLoading } = useQuery({
    queryKey: ['organization-profile'],
    queryFn: async () => {
      const res = await apiClient.get('/organizations/profile');
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Settings"
        description="Manage company details, subscription plan, and multi-tenant environment."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 space-y-6">
          <div className="flex items-center space-x-4 pb-6 border-b border-subtle">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-txt-primary">{org?.name}</h3>
              <p className="text-xs text-txt-muted">Organization Tenant Identifier: <span className="font-mono text-brand-600 dark:text-brand-400">{org?._id}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-txt-muted flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-brand-500" /> Default Timezone:
              </span>
              <p className="font-medium text-txt-primary">{org?.timezone || 'UTC'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-txt-muted flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-500" /> Member Since:
              </span>
              <p className="font-medium text-txt-primary">{formatDate(org?.createdAt)}</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 bg-card border-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-txt-muted uppercase tracking-wider">
              Subscription
            </span>
            <Badge variant="primary">{org?.subscriptionPlan || 'Trial'}</Badge>
          </div>
          <h4 className="text-lg font-bold text-txt-primary">Enterprise Plan</h4>
          <p className="text-xs text-txt-muted leading-relaxed">
            Unlimited employee headcount, automated payroll runs, custom rate card versioning, and ACID-compliant billing.
          </p>
          <div className="pt-3 border-t border-subtle flex items-center space-x-2 text-xs text-status-success font-medium">
            <Shield className="w-4 h-4" /> Multi-Tenant Active & Secure
          </div>
        </Card>
      </div>
    </div>
  );
};
