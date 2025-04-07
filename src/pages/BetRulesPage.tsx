
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
        title: "Error",
        description: "Please fill all required fields",
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
      title: "Rule Added",
      description: "New betting rule has been created",
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
      title: "Rule Removed",
      description: "Betting rule has been removed",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bet Rules</h2>
        <p className="text-muted-foreground">
          Configure your betting rules for automatic bet placement
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New Rule</CardTitle>
            <CardDescription>
              Define the triggers and conditions for automatic betting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="E.g., Football Studio Home"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trigger">Message Trigger</Label>
                <Input
                  id="trigger"
                  name="trigger"
                  placeholder="E.g., Entrada: Futebol Studio - Casa"
                  value={formData.trigger}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  The text pattern that will trigger this bet rule
                </p>
              </div>

              <Separator />
              
              <div className="space-y-2">
                <Label>Bet Type</Label>
                <Select value={formData.betType} onValueChange={handleBetTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Casa">Casa (Home)</SelectItem>
                    <SelectItem value="Fora">Fora (Away)</SelectItem>
                    <SelectItem value="Empate">Empate (Draw)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="betAmount">Bet Amount (R$)</Label>
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
                Create Rule
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Information</CardTitle>
            <CardDescription>
              How the betting rules work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-semibold flex items-center mb-2">
                <Book className="mr-2 h-4 w-4" />
                How It Works
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="font-medium">1. Message Monitoring:</span> The system watches for messages matching your triggers in Telegram channels.
                </li>
                <li>
                  <span className="font-medium">2. Pattern Recognition:</span> When a message matches a trigger pattern, the system identifies the bet details.
                </li>
                <li>
                  <span className="font-medium">3. Automatic Betting:</span> The system places bets according to your rules at <span className="font-semibold">esportiva.bet.br</span>
                </li>
                <li>
                  <span className="font-medium">4. Results Tracking:</span> Track performance and adjust your rules as needed.
                </li>
              </ul>
            </div>
            
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold mb-2">Example Patterns</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Basic pattern:</span> "Entrada: Futebol Studio - Casa"</p>
                <p><span className="font-medium">With timeframe:</span> "Entrada: Futebol Studio - Fora - 2 minutos"</p>
                <p><span className="font-medium">With stake:</span> "Entrada: R$50 Futebol Studio - Empate"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Rules</CardTitle>
          <CardDescription>
            Manage and edit your configured betting rules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Trigger Pattern</TableHead>
                <TableHead>Bet Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                        {rule.active ? "Active" : "Inactive"}
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
                    No rules created yet. Create a rule to start automating bets.
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
