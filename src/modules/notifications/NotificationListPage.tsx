import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api.client.js';
import { PageHeader } from '../../common/components/layout/PageHeader.js';
import { Card } from '../../common/components/ui/Card.js';
import { Spinner } from '../../common/components/ui/Spinner.js';
import { Bell, CheckCircle } from 'lucide-react';
import { formatDateTime } from '../../common/utils/formatters.js';

export const NotificationListPage: React.FC = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications-my'],
    queryFn: async () => {
      const res = await apiClient.get('/notifications/my');
      return res.data.data;
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts & System Notifications"
        description="Real-time compliance alerts, payroll notices, and operational events."
      />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-3">
          {notifications && notifications.length > 0 ? (
            notifications.map((item: any) => (
              <Card key={item._id} className="flex items-start justify-between p-4">
                <div className="flex items-start space-x-3.5">
                  <div className="p-2 rounded-lg bg-brand-500/15 text-brand-600 dark:text-brand-400 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-txt-primary">{item.type.replace('_', ' ').toUpperCase()}</h4>
                    <p className="text-xs text-txt-secondary mt-0.5">{item.message}</p>
                    <span className="text-[11px] text-txt-muted mt-1 block">
                      {formatDateTime(item.createdAt)}
                    </span>
                  </div>
                </div>
                {item.isRead ? (
                  <span className="text-[11px] text-txt-muted flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-status-success" /> Read
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                )}
              </Card>
            ))
          ) : (
            <Card className="py-12 text-center text-txt-muted text-sm">
              You are all caught up! No notifications right now.
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
