
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Use an interface that matches the structure in the database
interface Message {
  id: string;
  sender: string | null;
  content: string;
  timestamp: string | null;
  has_action: boolean | null;
  action_taken: boolean | null;
}

export function TelegramMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchMessages = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('telegram_messages')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar mensagens do Telegram",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:telegram_messages')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'telegram_messages' 
      }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRefresh = () => {
    fetchMessages();
  };

  const takeBetAction = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('telegram_messages')
        .update({ action_taken: true })
        .eq('id', messageId);

      if (error) {
        throw error;
      }

      // Update local state to reflect the change
      setMessages(
        messages.map((msg) =>
          msg.id === messageId ? { ...msg, action_taken: true } : msg
        )
      );

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
  const addSampleMessage = async () => {
    if (messages.length === 0) {
      try {
        const sampleMessage = {
          content: "Oportunidade de aposta: Barcelona vs Real Madrid, Mais de 2.5 gols @1.85",
          sender: "Canal de Apostas",
          has_action: true,
          action_taken: false,
          timestamp: new Date().toISOString()
        };
        
        const { data, error } = await supabase
          .from('telegram_messages')
          .insert(sampleMessage)
          .select();
          
        if (error) throw error;
        
        if (data) {
          fetchMessages();
          toast({
            title: "Mensagem de exemplo",
            description: "Uma mensagem de exemplo foi adicionada para demonstração",
          });
        }
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
