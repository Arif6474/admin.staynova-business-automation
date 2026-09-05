import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { dashboardApiService } from '../../services/endpoints/dashboard.service.js';
import { employeeApiService } from '../../services/endpoints/employee.service.js';
import { useAuth } from '../../common/hooks/useAuth.js';
import { Card } from '../../common/components/ui/Card.js';
import { Spinner } from '../../common/components/ui/Spinner.js';
import { formatCurrency } from '../../common/utils/formatters.js';
import {
  Users,
  Calendar,
  Activity,
  ArrowUpRight,
  AlertTriangle,
  Clock,
  Building2,
  Briefcase,
  FileSpreadsheet,
  Receipt,
  CalendarDays,
  CheckCircle2,
  Info,
  Plus,
  Settings,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface ToDoItem {
  id: string;
  title: string;
  assignee: string;
  status: 'OVERDUE' | 'PENDING' | 'IN PROGRESS' | 'COMPLETED';
  completed: boolean;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['executive-metrics'],
    queryFn: dashboardApiService.getExecutiveMetrics,
    refetchInterval: 30000,
  });

  const { data: expiringDocs } = useQuery({
    queryKey: ['expiring-documents-alert'],
    queryFn: () => employeeApiService.getExpiringDocuments(30),
  });

  // To Do State Management
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [tasks, setTasks] = useState<ToDoItem[]>([
    {
      id: '1',
      title: 'Review Jumeirah Beach Banquet shift allocations',
      assignee: 'SA',
      status: 'OVERDUE',
      completed: false,
    },
    {
      id: '2',
      title: 'Verify Dubai Police security clearance for 12 new stewards',
      assignee: 'MK',
      status: 'OVERDUE',
      completed: false,
    },
    {
      id: '3',
      title: 'Approve Atlantis The Royal weekend overtime roster',
      assignee: 'JD',
      status: 'IN PROGRESS',
      completed: false,
    },
    {
      id: '4',
      title: 'Generate monthly client invoice for Burj Al Arab',
      assignee: 'SA',
      status: 'PENDING',
      completed: false,
    },
    {
      id: '5',
      title: 'Conduct quarterly HSE briefing for F&B staff',
      assignee: 'AL',
      status: 'COMPLETED',
      completed: true,
    },
  ]);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              status: !task.completed ? 'COMPLETED' : 'PENDING',
            }
          : task
      )
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks((prev) => [
      {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        assignee: user?.role ? user.role.slice(0, 2).toUpperCase() : 'SA',
        status: 'PENDING',
        completed: false,
      },
      ...prev,
    ]);
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const filteredTasks = tasks.filter((task) =>
    activeTab === 'pending' ? !task.completed : task.completed
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const workforce = metrics?.workforce || {
    totalEmployees: 0,
    activeEmployees: 824,
    activeAssignments: 18,
    pendingManpowerRequests: 3,
    pendingLeaveApprovals: 2,
    todayAttendanceBreakdown: [],
  };

  const financials = metrics?.financials || {
    totalBilled: 37468.35,
    totalCollected: 28940.0,
    outstandingBalance: 8528.35,
    overdueInvoices: 1,
  };

  // 30-Day Revenue Trend
  const revenueTrendData = [
    { date: 'Aug 05', amount: 3200 },
    { date: 'Aug 09', amount: 7200 },
    { date: 'Aug 13', amount: 4800 },
    { date: 'Aug 17', amount: 9600 },
    { date: 'Aug 21', amount: 6200 },
    { date: 'Aug 25', amount: 11800 },
    { date: 'Aug 29', amount: 8900 },
    { date: 'Sep 02', amount: 14200 },
    { date: 'Sep 05', amount: 12500 },
  ];

  // Quick Access Items matching Image 1
  const quickAccessItems = [
    { title: 'Employees', href: '/employees', icon: Users },
    { title: 'Clients & Contacts', href: '/clients', icon: Building2 },
    { title: 'Assignments', href: '/assignments', icon: Briefcase },
    { title: 'Attendance Report', href: '/attendance', icon: Clock },
    { title: 'Rosters & Schedules', href: '/schedules', icon: CalendarDays },
    { title: 'Manpower Requests', href: '/manpower-requests', icon: FileSpreadsheet },
    { title: 'Payroll & Invoices', href: '/payroll', icon: Receipt },
    { title: 'Audit Logs', href: '/audit-logs', icon: Activity },
  ];

  // Real-time Notifications matching Image 1
  const notifications = [
    {
      id: 'n1',
      title: 'Task Overdue',
      description: 'Jay bangla, Thela Shamla contract verification is overdue',
      time: '2 hours ago',
      type: 'danger',
      icon: Clock,
    },
    {
      id: 'n2',
      title: 'New Task Assigned',
      description: 'Review Atlantis The Royal weekend stewarding allocation',
      time: '5 hours ago',
      type: 'info',
      icon: Info,
    },
    {
      id: 'n3',
      title: 'Weekly Update',
      description: 'Your weekly workforce & payroll performance summary is ready',
      time: 'Yesterday',
      type: 'success',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Compliance Alert Banner if expiring documents exist */}
      {expiringDocs && expiringDocs.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-amber-500 text-xs sm:text-sm">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <strong className="font-semibold text-txt-primary">Compliance Alert:</strong>{' '}
              {expiringDocs.length} employee documents (Visas/IDs) are expiring within 30 days.
            </div>
          </div>
          <Link
            to="/employees"
            className="px-3 py-1 bg-brand-500/20 hover:bg-brand-500/30 text-brand-500 font-semibold rounded-lg transition-colors text-xs"
          >
            Review Documents
          </Link>
        </div>
      )}

      {/* =========================================================
          1. MAIN 3-COLUMN EXECUTIVE GRID (Exact Layout from Image 1)
         ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 Cols on LG): Welcome Profile Card + To Do Widget */}
        <div className="lg:col-span-5 space-y-6">
          {/* Welcome Card matching Image 1 */}
          <div className="bg-card border border-subtle rounded-3xl p-6 relative overflow-hidden shadow-xs flex items-center space-x-5">
            {/* Glowing Gear Graphic Container */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-2xl bg-surface/60 border border-white/[0.04] flex flex-col items-center justify-center p-2 shadow-inner group">
                <div className="w-13 h-13 rounded-2xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-500 shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <Settings className="w-7 h-7 text-[#dfa745]" />
                </div>
                <div className="w-14 h-3 bg-muted/60 rounded-full mt-2" />
              </div>
            </div>

            {/* Hello Greeting & Super Admin */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-txt-muted font-medium tracking-wide">Hello,</p>
              <h2 className="text-xl sm:text-2xl font-black text-txt-primary tracking-tight truncate font-sans">
                {user?.role || 'Super Admin'}
              </h2>
              <div className="flex items-center space-x-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-semibold text-brand-500 uppercase tracking-widest font-mono">
                  StayNova Operations Active
                </span>
              </div>
            </div>
          </div>

          {/* To Do Interactive Widget matching Image 1 */}
          <div className="bg-card border border-subtle rounded-3xl p-6 shadow-xs space-y-4">
            {/* Header with Tabs & Action Buttons */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-txt-primary tracking-tight">To Do</h3>
                <p className="text-xs text-txt-muted">{tasks.filter((t) => !t.completed).length} tasks pending</p>
              </div>

              <div className="flex items-center space-x-2">
                {/* Pending / Completed Switcher */}
                <div className="p-1 rounded-xl bg-surface/60 border border-white/[0.05] flex items-center space-x-1">
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === 'pending'
                        ? 'bg-muted text-txt-primary shadow-xs'
                        : 'text-txt-muted hover:text-txt-primary'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setActiveTab('completed')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === 'completed'
                        ? 'bg-muted text-txt-primary shadow-xs'
                        : 'text-txt-muted hover:text-txt-primary'
                    }`}
                  >
                    Completed
                  </button>
                </div>

                {/* Add Task Button */}
                <button
                  onClick={() => setIsAddingTask((prev) => !prev)}
                  title="Add Task"
                  className="w-8 h-8 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 border border-brand-500/25 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* All -> Link */}
                <Link
                  to="/assignments"
                  className="px-2 py-1 text-xs font-semibold text-txt-muted hover:text-brand-500 flex items-center gap-0.5 transition-colors"
                >
                  All <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Quick Add Task Input Form */}
            {isAddingTask && (
              <form onSubmit={handleAddTask} className="flex gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter task description..."
                  autoFocus
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-input border border-subtle focus:border-brand-500 focus:outline-hidden text-txt-primary"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-brand-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-brand-400 transition-colors"
                >
                  Add
                </button>
              </form>
            )}

            {/* Task Item Rows */}
            <div className="space-y-2">
              {filteredTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-txt-dimmed">
                  No {activeTab} tasks right now
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="p-3 rounded-2xl bg-surface/50 border border-white/[0.04] hover:border-white/[0.09] hover:bg-surface/80 flex items-center justify-between cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {/* Priority Dot */}
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          task.status === 'OVERDUE'
                            ? 'bg-rose-500'
                            : task.status === 'COMPLETED'
                            ? 'bg-emerald-500'
                            : 'bg-brand-500'
                        }`}
                      />

                      {/* Assignee Avatar */}
                      <div className="w-6 h-6 rounded-full bg-muted/80 flex items-center justify-center text-[10px] font-bold text-txt-muted shrink-0">
                        {task.assignee}
                      </div>

                      {/* Title */}
                      <span
                        className={`text-xs truncate ${
                          task.completed
                            ? 'line-through text-txt-dimmed'
                            : 'text-txt-secondary group-hover:text-txt-primary font-medium'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0 ml-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-lg uppercase tracking-wider font-mono ${
                          task.status === 'OVERDUE'
                            ? 'bg-rose-500/15 text-rose-400'
                            : task.status === 'COMPLETED'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-brand-500/15 text-brand-500'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Middle Column (4 Cols on LG): QUICK ACCESS matching Image 1 */}
        <div className="lg:col-span-4 bg-card border border-subtle rounded-3xl p-5 shadow-xs space-y-3">
          <div className="px-2 pb-1 border-b border-subtle">
            <h3 className="text-xs font-bold text-txt-muted uppercase tracking-widest font-mono">
              QUICK ACCESS
            </h3>
          </div>

          <div className="space-y-1.5">
            {quickAccessItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="p-3 rounded-2xl bg-surface/50 border border-white/[0.04] hover:border-brand-500/30 hover:bg-surface/90 flex items-center justify-between transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center text-txt-muted group-hover:text-brand-500 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-txt-secondary group-hover:text-txt-primary transition-colors">
                      {item.title}
                    </span>
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-txt-dimmed group-hover:text-brand-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column (3 Cols on LG): NOTIFICATIONS matching Image 1 */}
        <div className="lg:col-span-3 bg-card border border-subtle rounded-3xl p-5 shadow-xs space-y-3">
          <div className="px-2 pb-1 border-b border-subtle">
            <h3 className="text-xs font-bold text-txt-muted uppercase tracking-widest font-mono">
              NOTIFICATIONS
            </h3>
          </div>

          <div className="space-y-2.5">
            {notifications.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  className="p-3.5 rounded-2xl bg-surface/50 border border-white/[0.04] space-y-2 hover:border-white/[0.08] hover:bg-surface/80 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          n.type === 'danger'
                            ? 'bg-rose-500/15 text-rose-500'
                            : n.type === 'success'
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : 'bg-sky-500/15 text-sky-500'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-bold text-txt-primary">{n.title}</h4>
                    </div>

                    <span className="text-[10px] text-txt-dimmed font-mono">{n.time}</span>
                  </div>

                  <p className="text-[11px] text-txt-muted leading-relaxed pl-9">{n.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================
          2. EXECUTIVE PERFORMANCE & REVENUE TREND CHART
         ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Glowing Curved Revenue Trend AreaChart */}
        <Card className="lg:col-span-2 bg-card border-subtle flex flex-col justify-between rounded-3xl p-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-bold text-txt-primary tracking-widest uppercase font-mono">
                REVENUE TREND (30 DAYS)
              </h4>
              <span className="text-xs font-bold text-brand-500 font-mono">
                {formatCurrency(financials.totalBilled || 37468.35)} Total
              </span>
            </div>
            <p className="text-[11px] text-txt-muted mb-6">
              Daily hospitality client billing and service contract transactions
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueTrendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dfa745" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#dfa745" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border-subtle)"
                  opacity={0.4}
                />
                <XAxis
                  dataKey="date"
                  stroke="var(--color-text-dimmed)"
                  fontSize={10}
                  tickLine={false}
                  fontFamily="monospace"
                />
                <YAxis
                  stroke="var(--color-text-dimmed)"
                  fontSize={10}
                  tickLine={false}
                  fontFamily="monospace"
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-card)',
                    borderColor: 'var(--color-border-subtle)',
                    borderRadius: '16px',
                    color: 'var(--color-text-primary)',
                    boxShadow: 'var(--panel-shadow)',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                  }}
                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#dfa745"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#goldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right: Quick KPI Summary Cards */}
        <div className="space-y-4">
          <Card className="bg-card border-subtle rounded-3xl p-5 hover:border-brand-500/20 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-txt-muted uppercase tracking-widest font-mono">
                  ACTIVE DEPLOYED WORKFORCE
                </p>
                <h3 className="text-2xl font-black text-txt-primary mt-1 font-mono">
                  {workforce.activeEmployees || 824}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-500">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-txt-muted mt-2">Hospitality staff across UAE client sites</p>
          </Card>

          <Card className="bg-card border-subtle rounded-3xl p-5 hover:border-brand-500/20 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-txt-muted uppercase tracking-widest font-mono">
                  ACTIVE ROSTERS & SHIFTS
                </p>
                <h3 className="text-2xl font-black text-txt-primary mt-1 font-mono">
                  {workforce.activeAssignments || 18}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-500/20 flex items-center justify-center text-sky-500">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-txt-muted mt-2">Active shifts scheduled for today</p>
          </Card>

          <Card className="bg-card border-subtle rounded-3xl p-5 hover:border-brand-500/20 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-txt-muted uppercase tracking-widest font-mono">
                  GPS CHECK-INS TODAY
                </p>
                <h3 className="text-2xl font-black text-txt-primary mt-1 font-mono">94</h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-txt-muted mt-2">Scanned and verified on mobile apps</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
