
import { ArrowLeft, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardHeader() {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="text-gray-500">
          <ArrowLeft size={18} />
          <span className="ml-2">Retour</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Bell size={18} />
        </Button>
        
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80" alt="User" />
          <AvatarFallback>JP</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
