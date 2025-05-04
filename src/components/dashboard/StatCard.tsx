import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import "@/styles/dashboard.css";

export interface StatCardProps {
  title: string;
  value: string;
  trend?: string; // Make trend optional but available
  trendDirection?: "up" | "down";
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
    <div className="stat-card">
      <div className="stat-card-title">{title}</div>
      <div className="flex items-center justify-between">
        <div className="stat-card-value">{value}</div>
        {trend && (
          <span
            className={`stat-card-trend ${
              trendDirection === "up" ? "trend-up" : "trend-down"
            }`}
          >
            {trendDirection === "up" ? (
              <ArrowUp className="trend-icon" />
            ) : (
              <ArrowDown className="trend-icon" />
            )}
            {trend}
          </span>
        )}
      </div>
      {description && <p className="stat-card-description">{description}</p>}
    </div>
  );
};
