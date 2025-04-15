
import { FileText } from "lucide-react";

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'white' | 'orange';
}

export function Logo({ size = 'md', variant = 'default' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };
  
  const colorClasses = {
    default: 'text-foreground',
    white: 'text-white',
    orange: 'text-orange-500'
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="bg-orange-500 p-1.5 rounded">
        <FileText className="text-white" size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
      </div>
      <span className={`font-bold ${sizeClasses[size]} ${colorClasses[variant]}`}>
        Invoicing
      </span>
    </div>
  );
}
