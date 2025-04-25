import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, LinkIcon, Lock, DollarSign, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

export default function SettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados para as configurações
  const [betUrl, setBetUrl] = useState("https://esportiva.bet.br/games/evolution/futebol-studio-ao-vivo") ;
  const [maxBetAmount, setMaxBetAmount] = useState(100);
  const [dailyLimit, setDailyLimit] = useState(500);
  const [autoLogin, setAutoLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [delayBetween, setDelayBetween] = useState(5);
  const [defaultBet, setDefaultBet] = useState(25);
  const [useMartingale, setUseMartingale] = useState(false);
  const [resetOnWin, setResetOnWin] = useState(true);

  // Carregar configurações do Supabase
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      
      try {
        // Verificar se há um usuário autenticado
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Buscar configurações do usuário
          const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            // Atualizar estados com os dados do Supabase
            setBetUrl(data.bet_url || betUrl);
            setMaxBetAmount(data.max_bet_amount || maxBetAmount);
            setDailyLimit(data.daily_limit || dailyLimit);
            setAutoLogin(data.auto_login !== null ? data.auto_login : autoLogin);
            setUsername(data.username || '');
            setPassword(data.password || '');
            setConfirmPassword(data.password || '');
            setDelayBetween(data.delay_between_bets || delayBetween);
            setDefaultBet(data.default_bet || defaultBet);
            setUseMartingale(data.use_martingale !== null ? data.use_martingale : useMartingale);
            setResetOnWin(data.reset_on_win !== null ? data.reset_on_win : resetOnWin);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar configurações:', err);
        toast({
          title: "Erro",
          description: "Falha ao carregar configurações",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSaveBetting = async () => {
    setIsSaving(true);
    
    try {
      // Verificar se há um usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      // Verificar se já existe configuração para o usuário
      const { data } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      const settingsData = {
        bet_url: betUrl,
        max_bet_amount: maxBetAmount,
        daily_limit: dailyLimit,
        auto_login: autoLogin,
        delay_between_bets: delayBetween,
        default_bet: defaultBet,
        use_martingale: useMartingale,
        reset_on_win: resetOnWin,
        updated_at: new Date().toISOString()
      };
      
      if (data) {
        // Atualizar configuração existente
        await supabase
          .from('user_settings')
          .update(settingsData)
          .eq('id', data.id);
      } else {
        // Criar nova configuração
        await supabase
          .from('user_settings')
          .insert({ 
            ...settingsData,
            user_id: user.id,
            username: '',
            password: ''
          });
      }
      
      toast({
        title: "Configurações Salvas",
        description: "Suas configurações de apostas foram atualizadas",
      });
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAccount = async () => {
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Verificar se há um usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      // Verificar se já existe configuração para o usuário
      const { data } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      const accountData = {
        username,
        password,
        updated_at: new Date().toISOString()
      };
      
      if (data) {
        // Atualizar configuração existente
        await supabase
          .from('user_settings')
          .update(accountData)
          .eq('id', data.id);
      } else {
        // Criar nova configuração
        await supabase
          .from('user_settings')
          .insert({ 
            ...accountData,
            user_id: user.id,
            bet_url: betUrl,
            max_bet_amount: maxBetAmount,
            daily_limit: dailyLimit,
            auto_login: autoLogin,
            delay_between_bets: delayBetween,
            default_bet: defaultBet,
            use_martingale: useMartingale,
            reset_on_win: resetOnWin
          });
      }
      
      toast({
        title: "Conta Salva",
        description: "Suas configurações de conta foram atualizadas",
      });
    } catch (err) {
      console.error('Erro ao salvar conta:', err);
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações de conta",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-muted-foreground">Carregando configurações...</p>
      </div>
    );
  }

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
              <Button onClick={handleSaveBetting} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : "Salvar Alterações"}
              </Button>
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
                    Suas credenciais são armazenadas com segurança no banco de dados e são usadas apenas para automatizar apostas em seu nome.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveAccount} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : "Salvar Credenciais"}
              </Button>
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
                  value={defaultBet}
                  onChange={(e) => setDefaultBet(Number(e.target.value))}
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
                    <Switch 
                      id="martingale" 
                      checked={useMartingale}
                      onCheckedChange={setUseMartingale}
                    />
                    <Label htmlFor="martingale" className="text-sm">Usar Martingale</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dobrar aposta após cada perda
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Estratégia de Ganho</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="resetOnWin" 
                      checked={resetOnWin}
                      onCheckedChange={setResetOnWin}
                    />
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
