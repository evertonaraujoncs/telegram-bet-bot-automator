
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash, MessageCircle, Plus } from "lucide-react";
import { useState } from "react";

interface Channel {
  id: string;
  name: string;
  active: boolean;
  messages: number;
}

export default function TelegramPage() {
  const { toast } = useToast();
  const [botToken, setBotToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [channelUrl, setChannelUrl] = useState("");
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: "channel-1",
      name: "Dicas de Apostas Futebol",
      active: true,
      messages: 235,
    },
    {
      id: "channel-2",
      name: "Sinais VIP de Apostas",
      active: true,
      messages: 120,
    },
  ]);

  const handleConnect = () => {
    if (!botToken) {
      toast({
        title: "Erro",
        description: "Por favor, informe um Token de Bot do Telegram",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would validate the token with Telegram API
    toast({
      title: "Sucesso",
      description: "Conectado ao Telegram com sucesso",
    });
    setIsConnected(true);
  };

  const handleAddChannel = () => {
    if (!channelUrl) {
      toast({
        title: "Erro", 
        description: "Por favor, informe uma URL ou nome de usuário do canal", 
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would validate the channel with Telegram API
    const newChannel: Channel = {
      id: `channel-${Date.now()}`,
      name: `Novo Canal (${channelUrl})`,
      active: true,
      messages: 0,
    };
    
    setChannels([...channels, newChannel]);
    setChannelUrl("");
    toast({
      title: "Canal Adicionado",
      description: "Novo canal foi adicionado para monitoramento",
    });
  };

  const handleToggleChannel = (id: string) => {
    setChannels(
      channels.map((channel) =>
        channel.id === id ? { ...channel, active: !channel.active } : channel
      )
    );
  };

  const handleRemoveChannel = (id: string) => {
    setChannels(channels.filter((channel) => channel.id !== id));
    toast({
      title: "Canal Removido",
      description: "Canal foi removido do monitoramento",
    });
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
                disabled={isConnected}
              />
              <Button 
                onClick={handleConnect}
                disabled={isConnected}
              >
                {isConnected ? "Conectado" : "Conectar"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Crie um novo bot com @BotFather e cole o token aqui
            </p>
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
              <Button onClick={handleAddChannel}>
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
            <Button variant="outline">Atualizar Canais</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
