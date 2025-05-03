
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
    orange: 'text-[#9DC8FF]'
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="bg-[#253F8F] p-1.5 rounded">
        <img 
          src="/lovable-uploads/5d896be1-da6e-431d-aa1e-2d81a240e995.png" 
          alt="Logo" 
          className="h-5 w-5"
        />
      </div>
      <span className={`font-bold ${sizeClasses[size]} ${colorClasses[variant]}`}>
        Invoicing
      </span>
    </div>
  );
}
