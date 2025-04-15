
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  percentageChange?: number;
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  percentageChange, 
  icon: Icon,
  iconColor = "text-primary",
  className
}: StatCardProps) {
  const isPositiveChange = percentageChange && percentageChange > 0;
  const isNegativeChange = percentageChange && percentageChange < 0;
  
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          
          {percentageChange !== undefined && (
            <div className="flex items-center mt-2">
              <div 
                className={cn(
                  "flex items-center text-xs font-medium",
                  isPositiveChange ? "text-emerald-500" : "",
                  isNegativeChange ? "text-rose-500" : ""
                )}
              >
                {isPositiveChange && <ArrowUp className="mr-1" size={12} />}
                {isNegativeChange && <ArrowDown className="mr-1" size={12} />}
                {Math.abs(percentageChange)}% from last month
              </div>
            </div>
          )}
        </div>
        
        <div className={cn("p-2 rounded-md", iconColor)}>
          <Icon className="text-white" />
        </div>
      </div>
    </Card>
  );
}
