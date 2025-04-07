
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Settings, MessageCircle, DollarSign, BarChart3, BookOpen } from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const routes = [
    {
      name: "Dashboard",
      path: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Telegram",
      path: "/telegram",
      icon: <MessageCircle className="h-5 w-5" />,
    },
    {
      name: "Bet Rules",
      path: "/bet-rules",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "History",
      path: "/history",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Bet Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-sidebar transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="border-b border-sidebar-border p-6">
        <div className="flex items-center justify-center gap-2">
          <DollarSign className="h-8 w-8 text-betting-accent" />
          <h1 className="text-xl font-bold text-sidebar-foreground">BetAutomator</h1>
        </div>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-2 px-2">
          {routes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )
              }
              onClick={() => window.innerWidth < 768 && onClose()}
            >
              {route.icon}
              {route.name}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-md bg-sidebar-accent/50 p-4">
          <h3 className="mb-1 text-sm font-medium text-sidebar-foreground">Automation Status</h3>
          <div className="flex items-center gap-2 text-xs text-sidebar-foreground/70">
            <div className="status-indicator status-active"></div>
            System active
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-sidebar-foreground/70">
            <div className="status-indicator status-inactive"></div>
            Last bet: 15 min ago
          </div>
        </div>
      </div>
    </aside>
  );
}
