
import { Card } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TelegramMessages } from "@/components/dashboard/TelegramMessages";
import { ActiveBetsCard } from "@/components/dashboard/ActiveBetsCard";
import { DollarSign, TrendingUp, CalendarClock, Zap } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor your betting automation performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Profit"
          value="R$ 1,250.00"
          trend="up"
          trendValue="12%"
          description="vs. last week"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatsCard
          title="Win Rate"
          value="68%"
          trend="up"
          trendValue="5%"
          description="vs. last week"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Bets"
          value="56"
          trend="neutral"
          trendValue="2%"
          description="vs. last week"
          icon={<Zap className="h-4 w-4" />}
        />
        <StatsCard
          title="Avg. Response Time"
          value="3.2s"
          trend="down"
          trendValue="0.5s"
          description="vs. last week"
          icon={<CalendarClock className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TelegramMessages />
        <ActiveBetsCard />
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Quick Start Guide</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <span className="font-medium">Configure Telegram:</span> Connect your Telegram account and add betting channels
          </li>
          <li>
            <span className="font-medium">Define Bet Rules:</span> Set up patterns to identify betting recommendations
          </li>
          <li>
            <span className="font-medium">Configure Betting Limits:</span> Set your risk preferences and bet amounts
          </li>
          <li>
            <span className="font-medium">Start Automation:</span> Turn on the system and monitor performance
          </li>
        </ol>
      </Card>
    </div>
  );
}
