
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
          Monitore o desempenho da sua automação de apostas
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Lucro Total"
          value="R$ 1.250,00"
          trend="up"
          trendValue="12%"
          description="vs. semana passada"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatsCard
          title="Taxa de Vitória"
          value="68%"
          trend="up"
          trendValue="5%"
          description="vs. semana passada"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatsCard
          title="Total de Apostas"
          value="56"
          trend="neutral"
          trendValue="2%"
          description="vs. semana passada"
          icon={<Zap className="h-4 w-4" />}
        />
        <StatsCard
          title="Tempo Médio de Resposta"
          value="3,2s"
          trend="down"
          trendValue="0,5s"
          description="vs. semana passada"
          icon={<CalendarClock className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TelegramMessages />
        <ActiveBetsCard />
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Guia de Início Rápido</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <span className="font-medium">Configure o Telegram:</span> Conecte sua conta do Telegram e adicione canais de apostas
          </li>
          <li>
            <span className="font-medium">Defina Regras de Apostas:</span> Configure padrões para identificar recomendações de apostas
          </li>
          <li>
            <span className="font-medium">Configure Limites de Apostas:</span> Defina suas preferências de risco e valores de apostas
          </li>
          <li>
            <span className="font-medium">Inicie a Automação:</span> Ligue o sistema e monitore o desempenho
          </li>
        </ol>
      </Card>
    </div>
  );
}
