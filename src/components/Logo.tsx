
import { FileText } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white" | "orange";
  showText?: boolean;
}

export function Logo({ 
  size = "md", 
  variant = "default", 
  showText = false 
}: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const colorClasses = {
    default: "text-foreground",
    white: "text-white",
    orange: "text-[#9DC8FF]",
  };

  return (
    <div className="flex items-center gap-2">
      <div className="bg-[#253F8F] p-1.5 rounded">
        <img src="/logo.png" alt="Logo" className={`
          ${size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6"}
        `} />
      </div>
      {showText && (
        <span
          className={`font-bold ${sizeClasses[size]} ${colorClasses[variant]}`}
        >
          Invoicing
        </span>
      )}
    </div>
  );
}
