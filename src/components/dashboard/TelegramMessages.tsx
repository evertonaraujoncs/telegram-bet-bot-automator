
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  hasAction: boolean;
  actionTaken: boolean;
}

const SAMPLE_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "BetAdvisor",
    content: "Entrada: Futebol Studio - Casa - 2 minutos",
    timestamp: "10:32",
    hasAction: true,
    actionTaken: true,
  },
  {
    id: "2",
    sender: "BetAdvisor",
    content: "Entrada: Futebol Studio - Fora - 5 minutos",
    timestamp: "10:45",
    hasAction: true,
    actionTaken: true,
  },
  {
    id: "3",
    sender: "BetAdvisor",
    content: "GREEN! Parabéns a todos que seguiram.",
    timestamp: "10:47",
    hasAction: false,
    actionTaken: false,
  },
  {
    id: "4",
    sender: "BetAdvisor",
    content: "Aguardando próxima oportunidade...",
    timestamp: "11:05",
    hasAction: false,
    actionTaken: false,
  },
  {
    id: "5",
    sender: "BetAdvisor",
    content: "Entrada: Futebol Studio - Empate - 1 minuto",
    timestamp: "11:15",
    hasAction: true,
    actionTaken: false,
  },
];

export function TelegramMessages() {
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulating fetch delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const takeBetAction = (messageId: string) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId ? { ...msg, actionTaken: true } : msg
      )
    );
  };

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Telegram Messages</CardTitle>
          <CardDescription>Recent messages from your channels</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[320px] px-6">
          <div className="space-y-4 py-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-lg p-3 text-sm ${
                  message.hasAction
                    ? "bg-muted/50 border border-border"
                    : "bg-background"
                }`}
              >
                <div className="flex justify-between">
                  <div className="font-medium">{message.sender}</div>
                  <div className="text-xs text-muted-foreground">{message.timestamp}</div>
                </div>
                <p className="mt-1">{message.content}</p>
                {message.hasAction && (
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <div
                        className={`mr-2 h-2 w-2 rounded-full ${
                          message.actionTaken ? "bg-betting-secondary" : "bg-betting-accent"
                        }`}
                      ></div>
                      <span className="text-xs text-muted-foreground">
                        {message.actionTaken ? "Bet Placed" : "Action Required"}
                      </span>
                    </div>
                    {!message.actionTaken && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => takeBetAction(message.id)}
                      >
                        Place Bet
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
