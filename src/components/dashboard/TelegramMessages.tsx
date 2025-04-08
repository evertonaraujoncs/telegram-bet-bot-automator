
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

// Use a simpler local interface for messages
interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  has_action: boolean;
  action_taken: boolean;
}

export function TelegramMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Mock function to fetch messages without database
  const fetchMessages = async () => {
    setIsRefreshing(true);
    try {
      // Using setTimeout to simulate network delay
      setTimeout(() => {
        // Check if there are saved messages in localStorage
        const savedMessages = localStorage.getItem('telegram_messages');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
        setIsRefreshing(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar mensagens do Telegram",
        variant: "destructive"
      });
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Set up a mock polling mechanism instead of real-time subscriptions
    const interval = setInterval(() => {
      fetchMessages();
    }, 30000); // Poll every 30 seconds
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleRefresh = () => {
    fetchMessages();
  };

  const takeBetAction = async (messageId: string) => {
    try {
      // Update local state to reflect the change
      const updatedMessages = messages.map((msg) =>
        msg.id === messageId ? { ...msg, action_taken: true } : msg
      );
      
      setMessages(updatedMessages);
      
      // Save to localStorage
      localStorage.setItem('telegram_messages', JSON.stringify(updatedMessages));

      toast({
        title: "Sucesso",
        description: "Aposta realizada com sucesso",
      });
    } catch (error) {
      console.error("Error updating message:", error);
      toast({
        title: "Erro",
        description: "Falha ao realizar aposta",
        variant: "destructive"
      });
    }
  };

  // Add a function to simulate message retrieval if there are no messages
  const addSampleMessage = () => {
    if (messages.length === 0) {
      try {
        const sampleMessage = {
          id: Date.now().toString(),
          content: "Oportunidade de aposta: Barcelona vs Real Madrid, Mais de 2.5 gols @1.85",
          sender: "Canal de Apostas",
          has_action: true,
          action_taken: false,
          timestamp: new Date().toISOString()
        };
        
        const newMessages = [sampleMessage, ...messages];
        setMessages(newMessages);
        
        // Save to localStorage
        localStorage.setItem('telegram_messages', JSON.stringify(newMessages));
        
        toast({
          title: "Mensagem de exemplo",
          description: "Uma mensagem de exemplo foi adicionada para demonstração",
        });
      } catch (error) {
        console.error("Error adding sample message:", error);
      }
    }
  };

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Mensagens do Telegram</CardTitle>
          <CardDescription>Mensagens recentes dos seus canais</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[320px] px-6">
          <div className="space-y-4 py-2">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-lg p-3 text-sm ${
                    message.has_action
                      ? "bg-muted/50 border border-border"
                      : "bg-background"
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="font-medium">{message.sender || "Desconhecido"}</div>
                    <div className="text-xs text-muted-foreground">
                      {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ""}
                    </div>
                  </div>
                  <p className="mt-1">{message.content}</p>
                  {message.has_action && (
                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex items-center">
                        <div
                          className={`mr-2 h-2 w-2 rounded-full ${
                            message.action_taken ? "bg-betting-secondary" : "bg-betting-accent"
                          }`}
                        ></div>
                        <span className="text-xs text-muted-foreground">
                          {message.action_taken ? "Aposta Realizada" : "Ação Necessária"}
                        </span>
                      </div>
                      {!message.action_taken && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => takeBetAction(message.id)}
                        >
                          Realizar Aposta
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
                <p>Nenhuma mensagem encontrada</p>
                <p className="text-sm mt-2">Adicione canais do Telegram na página de configuração</p>
                <Button 
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={addSampleMessage}
                >
                  Adicionar mensagem de exemplo
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
