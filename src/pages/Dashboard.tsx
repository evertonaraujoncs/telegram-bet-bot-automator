
import { Card } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TelegramMessages } from "@/components/dashboard/TelegramMessages";
import { ActiveBetsCard } from "@/components/dashboard/ActiveBetsCard";
import { DollarSign, TrendingUp, CalendarClock, Zap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const { toast } = useToast();

  const handleDownload = () => {
    // In a real app, this would be your actual download URL
    const downloadUrl = "https://exemplo.com/download/telegram-bet-bot-win64.exe";
    
    window.open(downloadUrl, "_blank");
    
    toast({
      title: "Download iniciado",
      description: "O download da versão Windows começou. Abra o arquivo após o download para instalar.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Monitore o desempenho da sua automação de apostas
        </p>
      </div>

      <Card className="p-6 border-betting-primary/20 bg-gradient-to-r from-betting-primary/5 to-betting-secondary/5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold flex items-center">
              <Download className="mr-2 h-5 w-5 text-betting-primary" />
              Versão para Windows
            </h3>
            <p className="text-sm text-muted-foreground">
              Baixe a versão completa para Windows e execute o programa em seu computador
            </p>
          </div>
          <Button 
            size="lg" 
            className="bg-betting-primary hover:bg-betting-primary/90"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar para Windows (64-bit)
          </Button>
        </div>
      </Card>

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
