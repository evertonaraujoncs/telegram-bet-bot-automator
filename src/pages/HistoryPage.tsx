
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { CalendarIcon, ChevronLeft, ChevronRight, Download, Filter } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface BetHistory {
  id: string;
  date: string;
  time: string;
  game: string;
  betType: string;
  amount: number;
  result: "win" | "loss" | "pending";
  profit?: number;
  source: string;
}

const SAMPLE_HISTORY: BetHistory[] = [
  {
    id: "bet-1",
    date: "2025-04-07",
    time: "10:30",
    game: "Football Studio",
    betType: "Casa",
    amount: 25,
    result: "win",
    profit: 22.5,
    source: "BetAdvisor",
  },
  {
    id: "bet-2",
    date: "2025-04-07",
    time: "11:15",
    game: "Football Studio",
    betType: "Fora",
    amount: 50,
    result: "loss",
    profit: -50,
    source: "BetAdvisor",
  },
  {
    id: "bet-3",
    date: "2025-04-06",
    time: "15:20",
    game: "Football Studio",
    betType: "Empate",
    amount: 25,
    result: "win",
    profit: 200,
    source: "BetMaster",
  },
  {
    id: "bet-4",
    date: "2025-04-06",
    time: "16:45",
    game: "Football Studio",
    betType: "Casa",
    amount: 100,
    result: "win",
    profit: 90,
    source: "BetMaster",
  },
  {
    id: "bet-5",
    date: "2025-04-05",
    time: "09:30",
    game: "Football Studio",
    betType: "Fora",
    amount: 50,
    result: "loss",
    profit: -50,
    source: "BetAdvisor",
  },
  {
    id: "bet-6",
    date: "2025-04-05",
    time: "14:15",
    game: "Football Studio",
    betType: "Casa",
    amount: 75,
    result: "win",
    profit: 67.5,
    source: "BetAdvisor",
  },
];

const CHART_DATA = [
  { date: "Apr 1", profit: 150, bets: 10 },
  { date: "Apr 2", profit: -50, bets: 8 },
  { date: "Apr 3", profit: 200, bets: 12 },
  { date: "Apr 4", profit: 100, bets: 5 },
  { date: "Apr 5", profit: 17.5, bets: 7 },
  { date: "Apr 6", profit: 290, bets: 15 },
  { date: "Apr 7", profit: -27.5, bets: 10 },
];

export default function HistoryPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Betting History</h2>
        <p className="text-muted-foreground">
          View and analyze your past bets and performance
        </p>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="chart">Chart View</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="table" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Bet History</CardTitle>
              <CardDescription>
                A record of all your automated and manual bets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Game</TableHead>
                    <TableHead>Bet Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Profit/Loss</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_HISTORY.map((bet) => (
                    <TableRow key={bet.id}>
                      <TableCell>
                        {format(new Date(bet.date), "dd MMM yyyy")} <span className="text-muted-foreground">{bet.time}</span>
                      </TableCell>
                      <TableCell>{bet.game}</TableCell>
                      <TableCell>{bet.betType}</TableCell>
                      <TableCell>R${bet.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            bet.result === "win" 
                              ? "bg-betting-secondary/10 text-betting-secondary border-betting-secondary/20" 
                              : bet.result === "loss" 
                              ? "bg-betting-danger/10 text-betting-danger border-betting-danger/20"
                              : "bg-gray-100 text-gray-500 border-gray-200"
                          }
                        >
                          {bet.result === "win" ? "Win" : bet.result === "loss" ? "Loss" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className={
                        bet.profit && bet.profit > 0 
                          ? "text-betting-secondary" 
                          : bet.profit && bet.profit < 0 
                          ? "text-betting-danger"
                          : ""
                      }>
                        {bet.profit ? (bet.profit > 0 ? "+" : "") + "R$" + Math.abs(bet.profit).toFixed(2) : "-"}
                      </TableCell>
                      <TableCell>{bet.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>6</strong> of <strong>124</strong> entries
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" disabled>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">1</Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-muted">2</Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">3</Button>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profit/Loss Trend</CardTitle>
              <CardDescription>
                View your betting performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={CHART_DATA}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#0f9d58" 
                      activeDot={{ r: 8 }} 
                      name="Profit/Loss (R$)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Number of Bets</CardTitle>
              <CardDescription>
                View your betting frequency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={CHART_DATA}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bets" fill="#1a5d97" name="Number of Bets" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
