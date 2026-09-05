import { format, parseISO } from 'date-fns';

export const formatCurrency = (amount = 0, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: string | Date | null | undefined, formatStr = 'MMM dd, yyyy'): string => {
  if (!date) return '-';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, formatStr);
  } catch {
    return '-';
  }
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  return formatDate(date, 'MMM dd, yyyy hh:mm a');
};

export const formatStatus = (status = ''): string => {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
