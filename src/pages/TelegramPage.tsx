
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash, MessageCircle, Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Channel {
  id: string;
  name: string;
  active: boolean;
  messages: number;
  url?: string;
}

export default function TelegramPage() {
  const { toast } = useToast();
  const [botToken, setBotToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [channelUrl, setChannelUrl] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [pinnedChannels, setPinnedChannels] = useState<{ name: string, url: string }[]>([]);
  const [showPinnedChannels, setShowPinnedChannels] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Load saved bot token and connection status and channels from localStorage
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Try to get saved bot token from localStorage
        const savedToken = localStorage.getItem('telegram_bot_token');
        if (savedToken) {
          setBotToken(savedToken);
          setIsConnected(true);
        }

        // Load channels from localStorage
        const savedChannels = localStorage.getItem('telegram_channels');
        if (savedChannels) {
          setChannels(JSON.parse(savedChannels));
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar dados salvos",
          variant: "destructive",
        });
      }
    };

    loadSavedData();
  }, [toast]);

  const handleConnect = async () => {
    if (!botToken) {
      toast({
        title: "Erro",
        description: "Por favor, informe um Token de Bot do Telegram",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingChannels(true);
    setShowPinnedChannels(false);
    setConnectionError(null);

    try {
      // Save token to localStorage for persistence
      localStorage.setItem('telegram_bot_token', botToken);

      // Here we would normally make an API call to Telegram
      // For now, we'll simulate the connection with a timeout
      // and check if the token format is valid
      
      if (!botToken.includes(":")) {
        throw new Error("Token inválido. O formato correto deve incluir ':'");
      }

      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock pinned channels (in a real app, these would come from Telegram API)
      const mockPinnedChannels = [
        { name: "Canal de Apostas Esportivas", url: "@aposta_esporte" },
        { name: "Grupo VIP de Traders", url: "@vip_traders" },
        { name: "Sinais de Futebol", url: "@sinais_fut" },
        { name: "Tips Diárias de Apostas", url: "@tips_apostas" },
        { name: "Comunidade de Apostadores", url: "@apostadores" }
      ];
      
      setPinnedChannels(mockPinnedChannels);
      setShowPinnedChannels(true);
      setIsConnected(true);
      setIsLoadingChannels(false);
      
      toast({
        title: "Sucesso",
        description: "Conectado ao Telegram com sucesso",
      });

      // Check if we already have these channels in our localStorage
      const existingChannelUrls = channels.map(c => c.url);
      const newChannels = mockPinnedChannels.filter(c => !existingChannelUrls.includes(c.url));
      
      // If we have new channels, ask the user if they want to add them
      if (newChannels.length > 0) {
        toast({
          title: "Canais Encontrados",
          description: `Encontramos ${newChannels.length} novos canais para monitorar`,
        });
      }
    } catch (error) {
      console.error("Error connecting to Telegram:", error);
      setIsLoadingChannels(false);
      setConnectionError(error instanceof Error ? error.message : "Erro desconhecido");
      toast({
        title: "Erro",
        description: "Falha ao conectar com o Telegram",
        variant: "destructive",
      });
    }
  };

  const handleAddChannel = async (channelToAdd: string, channelName: string) => {
    if (!channelToAdd) {
      toast({
        title: "Erro", 
        description: "Por favor, informe uma URL ou nome de usuário do canal", 
        variant: "destructive",
      });
      return;
    }

    try {
      // Add to localStorage
      const newChannel: Channel = {
        id: Date.now().toString(),
        name: channelName || `Canal (${channelToAdd})`,
        url: channelToAdd,
        active: true,
        messages: 0
      };
      
      const updatedChannels = [...channels, newChannel];
      setChannels(updatedChannels);
      
      // Save to localStorage
      localStorage.setItem('telegram_channels', JSON.stringify(updatedChannels));
      
      setChannelUrl("");
      setShowPinnedChannels(false);
      
      toast({
        title: "Canal Adicionado",
        description: "Novo canal foi adicionado para monitoramento",
      });
    } catch (error) {
      console.error("Error adding channel:", error);
      toast({
        title: "Erro",
        description: "Falha ao adicionar canal",
        variant: "destructive",
      });
    }
  };

  const handleToggleChannel = async (id: string) => {
    try {
      const channelToUpdate = channels.find(channel => channel.id === id);
      if (!channelToUpdate) return;

      const newActiveState = !channelToUpdate.active;

      // Update in localStorage
      const updatedChannels = channels.map((channel) =>
        channel.id === id ? { ...channel, active: newActiveState } : channel
      );
      
      setChannels(updatedChannels);
      localStorage.setItem('telegram_channels', JSON.stringify(updatedChannels));
    } catch (error) {
      console.error("Error toggling channel:", error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar o status do canal",
        variant: "destructive",
      });
    }
  };

  const handleRemoveChannel = async (id: string) => {
    try {
      // Remove from localStorage
      const updatedChannels = channels.filter((channel) => channel.id !== id);
      setChannels(updatedChannels);
      localStorage.setItem('telegram_channels', JSON.stringify(updatedChannels));
      
      toast({
        title: "Canal Removido",
        description: "Canal foi removido do monitoramento",
      });
    } catch (error) {
      console.error("Error removing channel:", error);
      toast({
        title: "Erro",
        description: "Falha ao remover canal",
        variant: "destructive",
      });
    }
  };

  const handleUpdateChannels = async () => {
    toast({
      title: "Atualizando Canais",
      description: "Buscando novas mensagens dos canais...",
    });
    
    // Simulate updating messages counts
    try {
      const updatedChannels = channels.map(channel => {
        if (channel.active) {
          // Random number between 1-5 new messages
          const newMessages = Math.floor(Math.random() * 5) + 1;
          return {
            ...channel,
            messages: channel.messages + newMessages
          };
        }
        return channel;
      });
      
      // Update local state
      setChannels(updatedChannels);
      
      // Update in localStorage
      localStorage.setItem('telegram_channels', JSON.stringify(updatedChannels));
      
      // Generate some sample messages for the active channels
      const existingMessages = JSON.parse(localStorage.getItem('telegram_messages') || '[]');
      const newMessages = updatedChannels
        .filter(channel => channel.active)
        .flatMap(channel => {
          const messagesToCreate = Math.floor(Math.random() * 3) + (channel.messages > 0 ? 0 : 1);
          return Array.from({ length: messagesToCreate }, (_, i) => ({
            id: `${Date.now()}-${channel.id}-${i}`,
            sender: channel.name,
            content: `Oportunidade de aposta ${i + 1}: Time A vs Time B, Odd @${(1.5 + Math.random()).toFixed(2)}`,
            timestamp: new Date().toISOString(),
            has_action: Math.random() > 0.5,
            action_taken: false
          }));
        });
      
      if (newMessages.length > 0) {
        localStorage.setItem('telegram_messages', JSON.stringify([...newMessages, ...existingMessages]));
      }
      
      toast({
        title: "Canais Atualizados",
        description: "Novas mensagens foram encontradas",
      });
    } catch (error) {
      console.error("Error updating channels:", error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar canais",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Conexão com Telegram</h2>
        <p className="text-muted-foreground">
          Conecte ao Telegram e monitore canais de apostas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração do Bot Telegram</CardTitle>
          <CardDescription>
            Configure seu bot do Telegram para ler mensagens de canais e grupos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot-token">Token do Bot Telegram</Label>
            <div className="flex space-x-2">
              <Input
                id="bot-token"
                type="password"
                placeholder="Digite o token do seu bot"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                disabled={isConnected && isLoadingChannels}
              />
              <Button 
                onClick={handleConnect}
                disabled={isLoadingChannels}
              >
                {isLoadingChannels ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : isConnected ? "Reconectar" : "Conectar"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Crie um novo bot com @BotFather e cole o token aqui
            </p>
            {connectionError && (
              <p className="text-xs text-destructive mt-2">
                Erro: {connectionError}
              </p>
            )}
          </div>

          {isConnected && (
            <>
              <Separator />

              <div className="space-y-2">
                <Label>Status da Conexão</Label>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-betting-secondary"></div>
                  <span>Conectado à API do Telegram</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Canais e Grupos</CardTitle>
            <CardDescription>
              Gerencie os canais e grupos que o bot irá monitorar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showPinnedChannels && pinnedChannels.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Canais fixados detectados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {pinnedChannels.slice(0, 5).map((channel, idx) => (
                    <Button 
                      key={idx} 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => handleAddChannel(channel.url, channel.name)}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {channel.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-end gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="channel">Adicionar Canal ou Grupo</Label>
                <Input
                  id="channel"
                  placeholder="Digite a URL ou nome de usuário do canal (ex: @canal_apostas)"
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                />
              </div>
              <Button onClick={() => handleAddChannel(channelUrl, "")}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>

            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Canal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Mensagens</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channels.map((channel) => (
                    <TableRow key={channel.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <MessageCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                          {channel.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={channel.active} 
                            onCheckedChange={() => handleToggleChannel(channel.id)} 
                          />
                          <span className="text-xs text-muted-foreground">
                            {channel.active ? "Monitorando" : "Pausado"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{channel.messages}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveChannel(channel.id)}
                        >
                          <Trash className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {channels.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        Nenhum canal adicionado ainda. Adicione um canal para começar o monitoramento.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Monitorando {channels.filter(c => c.active).length} de {channels.length} canais
            </p>
            <Button variant="outline" onClick={handleUpdateChannels}>Atualizar Canais</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
