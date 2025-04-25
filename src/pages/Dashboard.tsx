import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useTelegramMessages } from '@/integrations/telegram/hooks';
import { useBettingAutomator } from '@/integrations/betting/automator';
import { supabase } from '@/integrations/supabase/client';

interface BetRule {
  id: string;
  name: string;
  active: boolean;
  trigger: string;
  betType: string;
  betAmount: number;
  useMartingale: boolean;
  martingaleLevel: number;
  martingaleMultiplier: number;
}

export default function Dashboard() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAutomationActive, setIsAutomationActive] = useState(false);
  const [rules, setRules] = useState<BetRule[]>([]);
  const [recentBets, setRecentBets] = useState<any[]>([]);
  const [isLoadingRules, setIsLoadingRules] = useState(false);
  const [isLoadingBets, setIsLoadingBets] = useState(false);
  
  const { 
    messages, 
    isLoading: isLoadingMessages, 
    fetchMessages, 
    markMessageAsProcessed 
  } = useTelegramMessages();
  
  const {
    automator,
    isInitialized,
    isLoading: isLoadingAutomator,
    initialize
  } = useBettingAutomator();

  // Carregar regras de apostas do Supabase
  useEffect(() => {
    const loadRules = async () => {
      setIsLoadingRules(true);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('bet_rules')
            .select('*')
            .eq('user_id', user.id);
          
          if (error) throw error;
          
          setRules(data || []);
        }
      } catch (err) {
        console.error('Erro ao carregar regras de apostas:', err);
        toast({
          title: "Erro",
          description: "Falha ao carregar regras de apostas",
          variant: "destructive",
        });
      } finally {
        setIsLoadingRules(false);
      }
    };
    
    loadRules();
  }, [toast]);

  // Carregar apostas recentes do Supabase
  useEffect(() => {
    const loadRecentBets = async () => {
      setIsLoadingBets(true);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('bets')
            .select('*, telegram_messages(content, sender)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);
          
          if (error) throw error;
          
          setRecentBets(data || []);
        }
      } catch (err) {
        console.error('Erro ao carregar apostas recentes:', err);
        toast({
          title: "Erro",
          description: "Falha ao carregar apostas recentes",
          variant: "destructive",
        });
      } finally {
        setIsLoadingBets(false);
      }
    };
    
    loadRecentBets();
  }, [toast]);

  // Inicializar o automatizador quando necessário
  useEffect(() => {
    if (isAutomationActive && !isInitialized && !isLoadingAutomator) {
      initialize().catch(err => {
        console.error('Erro ao inicializar automatizador:', err);
        setIsAutomationActive(false);
        toast({
          title: "Erro",
          description: "Falha ao inicializar automatizador de apostas",
          variant: "destructive",
        });
      });
    }
  }, [isAutomationActive, isInitialized, isLoadingAutomator, initialize, toast]);

  // Processar mensagens quando a automação estiver ativa
  useEffect(() => {
    if (isAutomationActive && isInitialized && automator && messages.length > 0 && rules.length > 0) {
      const processMessages = async () => {
        setIsProcessing(true);
        
        try {
          for (const message of messages) {
            // Verificar se a mensagem já foi processada
            if (message.action_taken) continue;
            
            // Verificar se a mensagem corresponde a alguma regra
            const matchingRule = rules.find(rule => 
              rule.active && message.content.includes(rule.trigger)
            );
            
            if (matchingRule) {
              // Realizar a aposta
              await automator.placeBet({
                betType: matchingRule.betType,
                amount: matchingRule.betAmount,
                useMartingale: matchingRule.useMartingale,
                martingaleLevel: matchingRule.martingaleLevel,
                martingaleMultiplier: matchingRule.martingaleMultiplier
              });
              
              // Registrar a aposta no Supabase
              const { data: { user } } = await supabase.auth.getUser();
              
              if (user) {
                await supabase
                  .from('bets')
                  .insert({
                    user_id: user.id,
                    message_id: message.id,
                    bet_type: matchingRule.betType,
                    amount: matchingRule.betAmount,
                    outcome: 'pending',
                    profit: 0
                  });
              }
              
              // Marcar a mensagem como processada
              await markMessageAsProcessed(message.id);
              
              toast({
                title: "Aposta Realizada",
                description: `Aposta de R$${matchingRule.betAmount} em ${matchingRule.betType} foi realizada`,
              });
            }
          }
        } catch (err) {
          console.error('Erro ao processar mensagens:', err);
          toast({
            title: "Erro",
            description: "Falha ao processar mensagens e realizar apostas",
            variant: "destructive",
          });
          setIsAutomationActive(false);
        } finally {
          setIsProcessing(false);
        }
      };
      
      processMessages();
    }
  }, [isAutomationActive, isInitialized, automator, messages, rules, markMessageAsProcessed, toast]);

  // Atualizar mensagens periodicamente quando a automação estiver ativa
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutomationActive) {
      // Buscar mensagens imediatamente
      fetchMessages().catch(console.error);
      
      // Configurar intervalo para buscar mensagens a cada 30 segundos
      interval = setInterval(() => {
        fetchMessages().catch(console.error);
      }, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutomationActive, fetchMessages]);

  const handleToggleAutomation = () => {
    if (isAutomationActive) {
      // Desativar automação
      setIsAutomationActive(false);
      
      // Fechar o automatizador se estiver inicializado
      if (isInitialized && automator) {
        automator.close().catch(console.error);
      }
      
      toast({
        title: "Automação Desativada",
        description: "O automatizador de apostas foi desativado",
      });
    } else {
      // Ativar automação
      setIsAutomationActive(true);
      
      toast({
        title: "Automação Ativada",
        description: "O automatizador de apostas foi ativado",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Monitore e controle suas apostas automáticas
          </p>
        </div>
        <Button 
          size="lg"
          variant={isAutomationActive ? "destructive" : "default"}
          onClick={handleToggleAutomation}
          disabled={isLoadingAutomator || isProcessing}
        >
          {isLoadingAutomator || isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {isLoadingAutomator ? "Inicializando..." : "Processando..."}
            </>
          ) : isAutomationActive ? (
            "Parar Automação"
          ) : (
            "Iniciar Automação"
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Regras Ativas</CardTitle>
            <CardDescription>
              Regras de apostas configuradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoadingRules ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                rules.filter(r => r.active).length
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              de {rules.length} regras configuradas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Mensagens Não Processadas</CardTitle>
            <CardDescription>
              Mensagens aguardando processamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoadingMessages ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                messages.filter(m => !m.action_taken).length
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              de {messages.length} mensagens recebidas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Status da Automação</CardTitle>
            <CardDescription>
              Estado atual do automatizador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {isAutomationActive ? (
                <>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="font-medium">Ativo</span>
                </>
              ) : (
                <>
                  <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                  <span className="font-medium">Inativo</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isAutomationActive 
                ? "Monitorando mensagens e realizando apostas automaticamente" 
                : "Clique em Iniciar Automação para começar"
              }
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Apostas Recentes</CardTitle>
          <CardDescription>
            Últimas apostas realizadas pelo automatizador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Lucro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingBets ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="mt-2 text-muted-foreground">Carregando apostas recentes...</p>
                  </TableCell>
                </TableRow>
              ) : recentBets.length > 0 ? (
                recentBets.map((bet) => (
                  <TableRow key={bet.id}>
                    <TableCell>
                      {new Date(bet.created_at).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      <span title={bet.telegram_messages?.content}>
                        {bet.telegram_messages?.content || "Mensagem não disponível"}
                      </span>
                    </TableCell>
                    <TableCell>{bet.bet_type}</TableCell>
                    <TableCell>R${bet.amount}</TableCell>
                    <TableCell>
                      {bet.outcome === 'win' ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Ganhou
                        </div>
                      ) : bet.outcome === 'loss' ? (
                        <div className="flex items-center text-red-600">
                          <XCircle className="mr-1 h-4 w-4" />
                          Perdeu
                        </div>
                      ) : (
                        <div className="flex items-center text-amber-600">
                          <Clock className="mr-1 h-4 w-4" />
                          Pendente
                        </div>
                      )}
                    </TableCell>
                    <TableCell className={
                      bet.profit > 0 
                        ? "text-green-600 font-medium" 
                        : bet.profit < 0 
                          ? "text-red-600 font-medium" 
                          : ""
                    }>
                      {bet.profit > 0 ? `+R$${bet.profit}` : bet.profit < 0 ? `-R$${Math.abs(bet.profit)}` : "R$0"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Nenhuma aposta realizada ainda. Inicie a automação para começar a apostar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
