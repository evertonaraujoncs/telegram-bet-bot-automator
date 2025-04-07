
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play, StopCircle } from "lucide-react";

interface Bet {
  id: string;
  type: string;
  outcome: string;
  game: string;
  amount: number;
  timestamp: string;
  status: "active" | "complete" | "canceled";
}

const SAMPLE_BETS: Bet[] = [
  {
    id: "bet-1",
    type: "Football Studio",
    outcome: "Casa",
    game: "Football Studio",
    amount: 25,
    timestamp: "3 min atrás",
    status: "active",
  },
  {
    id: "bet-2",
    type: "Football Studio",
    outcome: "Fora",
    game: "Football Studio",
    amount: 50,
    timestamp: "15 min atrás",
    status: "complete",
  },
  {
    id: "bet-3",
    type: "Football Studio",
    outcome: "Empate",
    game: "Football Studio",
    amount: 100,
    timestamp: "30 min atrás",
    status: "canceled",
  },
];

export function ActiveBetsCard() {
  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle>Apostas Ativas</CardTitle>
        <CardDescription>Monitore suas apostas atuais</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {SAMPLE_BETS.map((bet) => (
            <div
              key={bet.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    bet.status === "active"
                      ? "bg-betting-primary/10 text-betting-primary"
                      : bet.status === "complete"
                      ? "bg-betting-secondary/10 text-betting-secondary"
                      : "bg-betting-danger/10 text-betting-danger"
                  }`}
                >
                  {bet.status === "active" ? (
                    <Play className="h-5 w-5" />
                  ) : bet.status === "complete" ? (
                    <ChevronRight className="h-5 w-5" />
                  ) : (
                    <StopCircle className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {bet.type} - {bet.outcome}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    R${bet.amount.toFixed(2)} • {bet.timestamp}
                  </p>
                </div>
              </div>
              
              {bet.status === "active" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-betting-danger/20 text-betting-danger hover:bg-betting-danger/10 hover:text-betting-danger"
                >
                  Cancelar
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <Button variant="outline" className="w-full">Ver Todas as Apostas</Button>
        </div>
      </CardContent>
    </Card>
  );
}
