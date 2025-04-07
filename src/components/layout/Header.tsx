
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Bell, Menu } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { toast } = useToast();
  const [isAutomationActive, setIsAutomationActive] = useState(false);

  const toggleAutomation = () => {
    setIsAutomationActive(!isAutomationActive);
    toast({
      title: isAutomationActive ? "Automation Paused" : "Automation Active",
      description: isAutomationActive 
        ? "Betting automation has been paused" 
        : "Betting automation is now running",
      variant: isAutomationActive ? "destructive" : "default",
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onToggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-betting-primary flex items-center justify-center text-white font-bold">TB</span>
            <h1 className="text-xl font-bold">Telegram Bet Automator</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-betting-danger flex items-center justify-center text-[10px] text-white">3</span>
          </Button>
          
          <Button 
            variant={isAutomationActive ? "destructive" : "default"}
            onClick={toggleAutomation}
            className={isAutomationActive ? "bg-betting-danger hover:bg-betting-danger/90" : "bg-betting-secondary hover:bg-betting-secondary/90"}
          >
            <div className="mr-2 flex h-2 w-2 items-center justify-center">
              <div className={`h-2 w-2 rounded-full ${isAutomationActive ? "animate-pulse-betting bg-white" : "bg-white"}`}></div>
            </div>
            {isAutomationActive ? "Stop Automation" : "Start Automation"}
          </Button>
        </div>
      </div>
    </header>
  );
}
