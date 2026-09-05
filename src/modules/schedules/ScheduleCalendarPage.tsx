import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api.client.js';
import { PageHeader } from '../../common/components/layout/PageHeader.js';
import { Card } from '../../common/components/ui/Card.js';
import { Button } from '../../common/components/ui/Button.js';
import { Spinner } from '../../common/components/ui/Spinner.js';
import { Plus, Calendar, Clock, MapPin } from 'lucide-react';
import { formatDate } from '../../common/utils/formatters.js';

export const ScheduleCalendarPage: React.FC = () => {
  const [startDate] = useState(new Date().toISOString());

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['schedules-calendar', startDate],
    queryFn: async () => {
      const res = await apiClient.get('/schedules/calendar');
      return res.data.data;
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Rosters & Shift Calendars"
        description="View employee shift assignments, locations, and prevent scheduling overlaps."
        actions={
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" /> Assign Shift
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules && schedules.length > 0 ? (
            schedules.map((item: any) => (
              <Card key={item._id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-500/15 px-2.5 py-1 rounded-md border border-brand-500/30 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.workDate)}
                  </span>
                  <span className="text-xs capitalize font-medium text-txt-secondary">
                    {item.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-txt-primary">
                    {item.employeeId?.firstName} {item.employeeId?.lastName}
                  </h4>
                  <p className="text-xs text-txt-muted font-mono">{item.employeeId?.employeeCode}</p>
                </div>

                <div className="pt-2 border-t border-subtle text-xs text-txt-secondary space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-txt-muted flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-500" /> Shift:
                    </span>
                    <span className="font-medium text-txt-primary">
                      {item.shiftId?.name} ({item.shiftId?.startTime} - {item.shiftId?.endTime})
                    </span>
                  </div>
                  {item.location && (
                    <div className="flex items-center justify-between">
                      <span className="text-txt-muted flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-txt-muted" /> Location:
                      </span>
                      <span className="font-medium text-txt-primary">{item.location}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-txt-muted">
              No shifts scheduled for this period. Click "Assign Shift" to schedule staff.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
