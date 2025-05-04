
import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string;
  trend?: string; // Make trend optional but available
  trendDirection?: 'up' | 'down';
  description?: string;
}

export const StatCard = ({
  title,
  value,
  trend,
  trendDirection,
  description,
}: StatCardProps) => {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6">
        <div className="flex flex-col space-y-1.5">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{value}</div>
            {trend && (
              <span
                className={`flex items-center text-xs font-medium ${
                  trendDirection === 'up' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {trendDirection === 'up' ? (
                  <ArrowUp className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDown className="mr-1 h-4 w-4" />
                )}
                {trend}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
