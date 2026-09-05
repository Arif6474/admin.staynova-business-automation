import React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '../ui/Button.js';
import { Input } from '../ui/Input.js';
import { Spinner } from '../ui/Spinner.js';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  actions?: React.ReactNode;
  page?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = 'Search records...',
  searchValue,
  onSearchChange,
  actions,
  page = 1,
  totalPages = 1,
  totalItems,
  onPageChange,
  emptyMessage = 'No records found',
}: DataTableProps<T>) {
  return (
    <div className="rounded-xl glass-card bg-card border border-subtle overflow-hidden flex flex-col shadow-md">
      {/* Top Toolbar */}
      {(onSearchChange || actions) && (
        <div className="p-4 border-b border-subtle flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/40">
          {onSearchChange && (
            <div className="w-full sm:w-72">
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                className="py-1.5 text-xs"
              />
            </div>
          )}
          {actions && <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">{actions}</div>}
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/50 backdrop-blur-xs z-10">
            <Spinner size="lg" />
          </div>
        ) : null}

        <table className="w-full text-left text-sm text-txt-secondary">
          <thead className="bg-muted/80 text-xs font-semibold text-txt-muted uppercase tracking-wider border-b border-subtle">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={`px-5 py-3.5 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle">
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr
                  key={String(row._id || idx)}
                  className="hover:bg-muted/50 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-5 py-3.5 ${col.className || ''}`}>
                      {col.render ? col.render(row) : String(row[col.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            ) : !isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-txt-muted">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {onPageChange && (
        <div className="px-5 py-3 border-t border-subtle flex items-center justify-between text-xs text-txt-muted bg-muted/30">
          <div>
            {totalItems !== undefined ? (
              <span>
                Showing <strong className="text-txt-primary">{data.length}</strong> of{' '}
                <strong className="text-txt-primary">{totalItems}</strong> results
              </span>
            ) : (
              <span>
                Page <strong className="text-txt-primary">{page}</strong> of{' '}
                <strong className="text-txt-primary">{totalPages}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isLoading}
              onClick={() => onPageChange(page + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
