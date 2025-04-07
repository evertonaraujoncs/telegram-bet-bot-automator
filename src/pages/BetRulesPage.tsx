
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash, Edit, Book, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

export default function BetRulesPage() {
  const { toast } = useToast();
  const [rules, setRules] = useState<BetRule[]>([
    {
      id: "rule-1",
      name: "Futebol Studio Casa",
      active: true,
      trigger: "Entrada: Futebol Studio - Casa",
      betType: "Casa",
      betAmount: 25,
      useMartingale: true,
      martingaleLevel: 2,
      martingaleMultiplier: 2.0,
    },
    {
      id: "rule-2",
      name: "Futebol Studio Fora",
      active: true,
      trigger: "Entrada: Futebol Studio - Fora",
      betType: "Fora",
      betAmount: 25,
      useMartingale: false,
      martingaleLevel: 0,
      martingaleMultiplier: 1.0,
    },
    {
      id: "rule-3",
      name: "Futebol Studio Empate",
      active: false,
      trigger: "Entrada: Futebol Studio - Empate",
      betType: "Empate",
      betAmount: 50,
      useMartingale: true,
      martingaleLevel: 3,
      martingaleMultiplier: 1.5,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    trigger: "",
    betType: "Casa",
    betAmount: 25,
    useMartingale: false,
    martingaleLevel: 1,
    martingaleMultiplier: 2.0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, useMartingale: checked });
  };

  const handleBetTypeChange = (value: string) => {
    setFormData({ ...formData, betType: value });
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const value = Number(e.target.value);
    setFormData({ ...formData, [fieldName]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.trigger) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newRule: BetRule = {
      id: `rule-${Date.now()}`,
      name: formData.name,
      active: true,
      trigger: formData.trigger,
      betType: formData.betType,
      betAmount: Number(formData.betAmount),
      useMartingale: formData.useMartingale,
      martingaleLevel: Number(formData.martingaleLevel),
      martingaleMultiplier: Number(formData.martingaleMultiplier),
    };

    setRules([...rules, newRule]);
    setFormData({
      name: "",
      trigger: "",
      betType: "Casa",
      betAmount: 25,
      useMartingale: false,
      martingaleLevel: 1,
      martingaleMultiplier: 2.0,
    });

    toast({
      title: "Regra Adicionada",
      description: "Nova regra de apostas foi criada",
    });
  };

  const handleToggleRule = (id: string) => {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, active: !rule.active } : rule
      )
    );
  };

  const handleRemoveRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id));
    toast({
      title: "Regra Removida",
      description: "Regra de apostas foi removida",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Regras de Apostas</h2>
        <p className="text-muted-foreground">
          Configure suas regras de apostas para realizar apostas automáticas
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Criar Nova Regra</CardTitle>
            <CardDescription>
              Defina os gatilhos e condições para apostas automáticas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Regra</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex.: Football Studio Casa"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trigger">Gatilho de Mensagem</Label>
                <Input
                  id="trigger"
                  name="trigger"
                  placeholder="Ex.: Entrada: Futebol Studio - Casa"
                  value={formData.trigger}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  O padrão de texto que acionará esta regra de aposta
                </p>
              </div>

              <Separator />
              
              <div className="space-y-2">
                <Label>Tipo de Aposta</Label>
                <Select value={formData.betType} onValueChange={handleBetTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de aposta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Fora">Fora</SelectItem>
                    <SelectItem value="Empate">Empate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="betAmount">Valor da Aposta (R$)</Label>
                <Input
                  id="betAmount"
                  name="betAmount"
                  type="number"
                  min="1"
                  placeholder="25"
                  value={formData.betAmount}
                  onChange={handleInputChange}
                />
              </div>
              
              <Separator />
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="martingale">
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center space-x-2">
                      <span>Configuração de Martingale</span>
                      {formData.useMartingale && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          Ativo
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="useMartingale" className="cursor-pointer">Usar Martingale</Label>
                        <Switch 
                          id="useMartingale"
                          checked={formData.useMartingale} 
                          onCheckedChange={handleSwitchChange}
                        />
                      </div>
                      
                      {formData.useMartingale && (
                        <>
                          <div className="grid gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="martingaleLevel">
                                Níveis de Martingale
                                <span className="text-xs text-muted-foreground ml-2">
                                  (1-5)
                                </span>
                              </Label>
                              <Input
                                id="martingaleLevel"
                                type="number"
                                min="1"
                                max="5"
                                value={formData.martingaleLevel}
                                onChange={(e) => handleNumberInputChange(e, "martingaleLevel")}
                              />
                              <p className="text-xs text-muted-foreground">
                                Número máximo de apostas consecutivas em caso de perda
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="martingaleMultiplier">
                                Multiplicador
                                <span className="text-xs text-muted-foreground ml-2">
                                  (1.0-5.0)
                                </span>
                              </Label>
                              <Input
                                id="martingaleMultiplier"
                                type="number"
                                min="1.0"
                                max="5.0"
                                step="0.1"
                                value={formData.martingaleMultiplier}
                                onChange={(e) => handleNumberInputChange(e, "martingaleMultiplier")}
                              />
                              <p className="text-xs text-muted-foreground">
                                Valor pelo qual a aposta será multiplicada após cada perda
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-800 dark:text-amber-300">
                              O Martingale aumenta suas apostas após cada perda. Use com cuidado pois pode resultar em perdas significativas.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar Regra
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
            <CardDescription>
              Como funcionam as regras de apostas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-semibold flex items-center mb-2">
                <Book className="mr-2 h-4 w-4" />
                Como Funciona
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="font-medium">1. Monitoramento de Mensagens:</span> O sistema observa mensagens que correspondem aos seus gatilhos nos canais do Telegram.
                </li>
                <li>
                  <span className="font-medium">2. Reconhecimento de Padrões:</span> Quando uma mensagem corresponde a um padrão de gatilho, o sistema identifica os detalhes da aposta.
                </li>
                <li>
                  <span className="font-medium">3. Apostas Automáticas:</span> O sistema realiza apostas de acordo com suas regras em <span className="font-semibold">esportiva.bet.br</span>
                </li>
                <li>
                  <span className="font-medium">4. Acompanhamento de Resultados:</span> Acompanhe o desempenho e ajuste suas regras conforme necessário.
                </li>
              </ul>
            </div>
            
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold mb-2">Martingale Explicado</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">O que é:</span> Uma estratégia de apostas que dobra o valor após cada perda para recuperar perdas anteriores.</p>
                <p><span className="font-medium">Níveis:</span> Número máximo de apostas consecutivas usando a estratégia.</p>
                <p><span className="font-medium">Multiplicador:</span> Fator pelo qual a aposta aumenta após cada perda (normalmente 2.0).</p>
                <p><span className="font-medium">Exemplo:</span> Com aposta inicial de R$10 e multiplicador 2x:
                  <br />- 1ª perda: próxima aposta = R$20
                  <br />- 2ª perda: próxima aposta = R$40
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regras Ativas</CardTitle>
          <CardDescription>
            Gerencie e edite suas regras de apostas configuradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Regra</TableHead>
                <TableHead>Padrão de Gatilho</TableHead>
                <TableHead>Detalhes da Aposta</TableHead>
                <TableHead>Martingale</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <span title={rule.trigger}>{rule.trigger}</span>
                  </TableCell>
                  <TableCell>
                    {rule.betType} - R${rule.betAmount}
                  </TableCell>
                  <TableCell>
                    {rule.useMartingale ? (
                      <div className="text-xs">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          Ativo
                        </span>
                        <div className="mt-1">
                          Níveis: {rule.martingaleLevel}x<br />
                          Multiplicador: {rule.martingaleMultiplier}x
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Desativado</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={rule.active} 
                        onCheckedChange={() => handleToggleRule(rule.id)} 
                      />
                      <span className="text-xs text-muted-foreground">
                        {rule.active ? "Ativa" : "Inativa"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveRule(rule.id)}
                    >
                      <Trash className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {rules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Nenhuma regra criada ainda. Crie uma regra para começar a automatizar apostas.
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
