
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, LinkIcon, Lock, DollarSign, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [betUrl, setBetUrl] = useState("https://esportiva.bet.br/games/evolution/futebol-studio-ao-vivo");
  const [maxBetAmount, setMaxBetAmount] = useState(100);
  const [dailyLimit, setDailyLimit] = useState(500);
  const [autoLogin, setAutoLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [delayBetween, setDelayBetween] = useState(5);

  const handleSaveBetting = () => {
    toast({
      title: "Configurações Salvas",
      description: "Suas configurações de apostas foram atualizadas",
    });
  };

  const handleSaveAccount = () => {
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Conta Salva",
      description: "Suas configurações de conta foram atualizadas",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Configure suas preferências de automação de apostas
        </p>
      </div>

      <Tabs defaultValue="betting" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="betting">Configurações de Apostas</TabsTrigger>
          <TabsTrigger value="account">Configurações de Conta</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="betting" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site de Apostas</CardTitle>
              <CardDescription>
                Configure a URL do site de apostas e configurações de automação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="betUrl">URL de Apostas</Label>
                <div className="flex">
                  <Input
                    id="betUrl"
                    value={betUrl}
                    onChange={(e) => setBetUrl(e.target.value)}
                  />
                  <Button variant="outline" className="ml-2" onClick={() => window.open(betUrl, "_blank")}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  URL do site de apostas onde as apostas serão feitas
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="autoLogin" 
                  checked={autoLogin}
                  onCheckedChange={setAutoLogin}
                />
                <Label htmlFor="autoLogin">Login automático</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delayBetween">Atraso entre apostas (segundos)</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    id="delayBetween"
                    min={0}
                    max={30}
                    step={1}
                    value={[delayBetween]}
                    onValueChange={(values) => setDelayBetween(values[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{delayBetween}s</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Adicione atraso entre apostas consecutivas para evitar detecção
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limites de Apostas</CardTitle>
              <CardDescription>
                Defina limites para controlar sua atividade de apostas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="maxBetAmount">Valor máximo de aposta (R$)</Label>
                  <span className="text-sm font-medium">R${maxBetAmount}</span>
                </div>
                <Slider
                  id="maxBetAmount"
                  min={10}
                  max={1000}
                  step={10}
                  value={[maxBetAmount]}
                  onValueChange={(values) => setMaxBetAmount(values[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="dailyLimit">Limite diário de apostas (R$)</Label>
                  <span className="text-sm font-medium">R${dailyLimit}</span>
                </div>
                <Slider
                  id="dailyLimit"
                  min={100}
                  max={5000}
                  step={100}
                  value={[dailyLimit]}
                  onValueChange={(values) => setDailyLimit(values[0])}
                />
              </div>

              <div className="rounded-lg bg-muted p-4 flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Jogo Responsável</h4>
                  <p className="text-sm text-muted-foreground">
                    Defina limites razoáveis para garantir apostas responsáveis. A automação será interrompida quando o limite diário for atingido.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Restaurar Padrões</Button>
              <Button onClick={handleSaveBetting}>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Credenciais do Site de Apostas</CardTitle>
              <CardDescription>
                Seus dados de login para o site de apostas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário/Email</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu nome de usuário no site de apostas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha do site de apostas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua senha"
                />
              </div>

              <div className="rounded-lg bg-muted p-4 flex items-start space-x-3">
                <Lock className="h-5 w-5 text-betting-primary mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Aviso de Segurança</h4>
                  <p className="text-sm text-muted-foreground">
                    Suas credenciais são armazenadas com segurança no seu dispositivo e são usadas apenas para automatizar apostas em seu nome.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveAccount}>Salvar Credenciais</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações Padrão de Apostas</CardTitle>
              <CardDescription>
                Configure suas preferências padrão de apostas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultBet">Valor Padrão de Aposta (R$)</Label>
                <Input
                  id="defaultBet"
                  type="number"
                  min="1"
                  placeholder="25"
                  defaultValue="25"
                />
                <p className="text-xs text-muted-foreground">
                  Este valor será usado quando nenhum valor específico for definido em uma regra
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estratégia de Perda</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="martingale" />
                    <Label htmlFor="martingale" className="text-sm">Usar Martingale</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dobrar aposta após cada perda
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Estratégia de Ganho</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="resetOnWin" />
                    <Label htmlFor="resetOnWin" className="text-sm">Reiniciar após ganho</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Voltar para a aposta padrão após um ganho
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Configure como e quando você recebe notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Realização de Apostas</Label>
                    <p className="text-xs text-muted-foreground">
                      Notificar quando uma aposta for realizada
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Resultados de Apostas</Label>
                    <p className="text-xs text-muted-foreground">
                      Notificar sobre resultados de apostas
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Erros e Avisos</Label>
                    <p className="text-xs text-muted-foreground">
                      Notificar sobre erros de sistema ou avisos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Resumo Diário</Label>
                    <p className="text-xs text-muted-foreground">
                      Receber um resumo diário da sua atividade de apostas
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notificações do Navegador</CardTitle>
              <CardDescription>
                Configure notificações do navegador para alertas no desktop
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="enableBrowserNotifications" defaultChecked />
                  <Label htmlFor="enableBrowserNotifications">Ativar notificações do navegador</Label>
                </div>
                
                <Button variant="outline" className="w-full">
                  Testar Notificação
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  Pode ser necessário conceder permissão para notificações nas configurações do seu navegador
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
