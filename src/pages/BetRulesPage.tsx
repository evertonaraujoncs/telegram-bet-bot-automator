
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash, Edit, Book } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BetRule {
  id: string;
  name: string;
  active: boolean;
  trigger: string;
  betType: string;
  betAmount: number;
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
    },
    {
      id: "rule-2",
      name: "Futebol Studio Fora",
      active: true,
      trigger: "Entrada: Futebol Studio - Fora",
      betType: "Fora",
      betAmount: 25,
    },
    {
      id: "rule-3",
      name: "Futebol Studio Empate",
      active: false,
      trigger: "Entrada: Futebol Studio - Empate",
      betType: "Empate",
      betAmount: 50,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    trigger: "",
    betType: "Casa",
    betAmount: 25,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBetTypeChange = (value: string) => {
    setFormData({ ...formData, betType: value });
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
    };

    setRules([...rules, newRule]);
    setFormData({
      name: "",
      trigger: "",
      betType: "Casa",
      betAmount: 25,
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
              <h4 className="font-semibold mb-2">Exemplos de Padrões</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Padrão básico:</span> "Entrada: Futebol Studio - Casa"</p>
                <p><span className="font-medium">Com prazo:</span> "Entrada: Futebol Studio - Fora - 2 minutos"</p>
                <p><span className="font-medium">Com valor:</span> "Entrada: R$50 Futebol Studio - Empate"</p>
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
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
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
