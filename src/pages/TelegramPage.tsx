import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash, MessageCircle, Plus, Loader2 } from "lucide-react";
import { useTelegramConnection, useTelegramChannels } from '@/integrations/telegram/hooks';

export default function TelegramPage() {
  const { toast } = useToast();
  const { 
    token, 
    isConnected, 
    isLoading: isConnecting, 
    error: connectionError, 
    connect 
  } = useTelegramConnection();
  
  const {
    channels,
    isLoading: isLoadingChannels,
    fetchChannels,
    toggleChannelActive,
    removeChannel,
    updateChannels
  } = useTelegramChannels();
  
  const [botToken, setBotToken] = useState("");
  const [channelUrl, setChannelUrl] = useState("");
  const [showPinnedChannels, setShowPinnedChannels] = useState(false);
  const [pinnedChannels, setPinnedChannels] = useState<{ name: string, url: string }[]>([]);

  // Carregar token salvo
  useEffect(() => {
    if (token) {
      setBotToken(token);
    }
  }, [token]);

  // Carregar canais quando conectado
  useEffect(() => {
    if (isConnected) {
      fetchChannels().catch(console.error);
    }
  }, [isConnected, fetchChannels]);

  const handleConnect = async () => {
    if (!botToken) {
      toast({
        title: "Erro",
        description: "Por favor, informe um Token de Bot do Telegram",
        variant: "destructive",
      });
      return;
    }

    try {
      await connect(botToken);
      
      toast({
        title: "Sucesso",
        description: "Conectado ao Telegram com sucesso",
      });
      
      // Simular canais fixados para manter a compatibilidade com a interface
      const mockPinnedChannels = [
        { name: "Canal de Apostas Esportivas", url: "@aposta_esporte" },
        { name: "Grupo VIP de Traders", url: "@vip_traders" },
        { name: "Sinais de Futebol", url: "@sinais_fut" },
        { name: "Tips Diárias de Apostas", url: "@tips_apostas" },
        { name: "Comunidade de Apostadores", url: "@apostadores" }
      ];
      
      setPinnedChannels(mockPinnedChannels);
      setShowPinnedChannels(true);
    } catch (error) {
      console.error("Error connecting to Telegram:", error);
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
      // Atualizar canais para buscar novos
      await updateChannels();
      
      toast({
        title: "Canal Adicionado",
        description: "Novo canal foi adicionado para monitoramento",
      });
      
      setChannelUrl("");
      setShowPinnedChannels(false);
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

      await toggleChannelActive(id, !channelToUpdate.active);
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
      await removeChannel(id);
      
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
    
    try {
      await updateChannels();
      
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
                disabled={isConnecting}
              />
              <Button 
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? (
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
                  {isLoadingChannels ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <p className="mt-2 text-muted-foreground">Carregando canais...</p>
                      </TableCell>
                    </TableRow>
                  ) : channels.length > 0 ? (
                    channels.map((channel) => (
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
                        <TableCell>{channel.messages_count}</TableCell>
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
                    ))
                  ) : (
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
