
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Bell, Menu, Wallet } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { toast } = useToast();
  const [isAutomationActive, setIsAutomationActive] = useState(false);
  const [bankType, setBankType] = useState<"real" | "virtual">("real");
  const [bankBalance, setBankBalance] = useState({
    real: 1250.75, // Valor da banca real (simulando integração com plataforma)
    virtual: 1000.00 // Valor inicial da banca virtual
  });
  
  const [virtualBankInput, setVirtualBankInput] = useState(bankBalance.virtual.toString());

  const toggleAutomation = () => {
    setIsAutomationActive(!isAutomationActive);
    toast({
      title: isAutomationActive ? "Automação Pausada" : "Automação Ativa",
      description: isAutomationActive 
        ? "A automação de apostas foi pausada" 
        : "A automação de apostas está em execução",
      variant: isAutomationActive ? "destructive" : "default",
    });
  };

  const handleBankTypeChange = (value: string) => {
    setBankType(value as "real" | "virtual");
    
    toast({
      title: value === "real" ? "Banca Real Selecionada" : "Banca Virtual Selecionada",
      description: value === "real" 
        ? "Apostas serão realizadas com dinheiro real da plataforma" 
        : "Apostas serão simuladas sem usar dinheiro real",
      variant: value === "real" ? "destructive" : "default",
    });
  };

  const handleVirtualBankChange = () => {
    const newAmount = parseFloat(virtualBankInput);
    
    if (isNaN(newAmount) || newAmount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido maior que zero",
        variant: "destructive",
      });
      setVirtualBankInput(bankBalance.virtual.toString());
      return;
    }
    
    setBankBalance(prev => ({
      ...prev,
      virtual: newAmount
    }));
    
    toast({
      title: "Banca Virtual Atualizada",
      description: `Valor da banca virtual alterado para R$ ${newAmount.toFixed(2)}`,
    });
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onToggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-betting-primary flex items-center justify-center text-white font-bold">TB</span>
            <h1 className="text-xl font-bold">Automatizador de Apostas</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-background/80 p-1.5 rounded-md border">
            <Wallet className="h-5 w-5 text-gray-500" />
            <div className="flex flex-col">
              <Select value={bankType} onValueChange={handleBankTypeChange}>
                <SelectTrigger className="w-[120px] h-7 border-0 bg-transparent p-0 text-sm">
                  <SelectValue placeholder="Tipo de Banca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="real">Banca Real</SelectItem>
                  <SelectItem value="virtual">Banca Virtual</SelectItem>
                </SelectContent>
              </Select>
              
              {bankType === "real" ? (
                <span className="text-sm font-medium">{formatCurrency(bankBalance.real)}</span>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <span className="text-sm font-medium cursor-pointer hover:text-betting-primary">
                      {formatCurrency(bankBalance.virtual)}
                    </span>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Definir valor da banca virtual</h4>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          min="1"
                          step="any"
                          value={virtualBankInput}
                          onChange={(e) => setVirtualBankInput(e.target.value)}
                          className="h-8"
                        />
                        <Button size="sm" onClick={handleVirtualBankChange}>
                          OK
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
          
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-betting-danger flex items-center justify-center text-[10px] text-white">3</span>
          </Button>
          
          <Button 
            variant={isAutomationActive ? "destructive" : "default"}
            onClick={toggleAutomation}
            className={isAutomationActive ? "bg-betting-danger hover:bg-betting-danger/90" : "bg-betting-secondary hover:bg-betting-secondary/90"}
          >
            <div className="mr-2 flex h-2 w-2 items-center justify-center">
              <div className={`h-2 w-2 rounded-full ${isAutomationActive ? "animate-pulse-betting bg-white" : "bg-white"}`}></div>
            </div>
            {isAutomationActive ? "Parar Automação" : "Iniciar Automação"}
          </Button>
        </div>
      </div>
    </header>
  );
}
