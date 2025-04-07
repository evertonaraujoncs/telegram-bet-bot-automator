
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
      title: "Settings Saved",
      description: "Your betting settings have been updated",
    });
  };

  const handleSaveAccount = () => {
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Account Saved",
      description: "Your account settings have been updated",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Configure your betting automation preferences
        </p>
      </div>

      <Tabs defaultValue="betting" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="betting">Betting Settings</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="betting" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Betting Website</CardTitle>
              <CardDescription>
                Configure the betting website URL and automation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="betUrl">Betting URL</Label>
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
                  URL of the betting website where bets will be placed
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="autoLogin" 
                  checked={autoLogin}
                  onCheckedChange={setAutoLogin}
                />
                <Label htmlFor="autoLogin">Automatic login</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delayBetween">Delay between bets (seconds)</Label>
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
                  Add delay between consecutive bets to avoid detection
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bet Limits</CardTitle>
              <CardDescription>
                Set limits to control your betting activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="maxBetAmount">Maximum bet amount (R$)</Label>
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
                  <Label htmlFor="dailyLimit">Daily betting limit (R$)</Label>
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
                  <h4 className="font-medium mb-1">Responsible Gambling</h4>
                  <p className="text-sm text-muted-foreground">
                    Set reasonable limits to ensure responsible betting. The automation will stop once your daily limit is reached.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Reset to Default</Button>
              <Button onClick={handleSaveBetting}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Betting Site Credentials</CardTitle>
              <CardDescription>
                Your login details for the betting website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username/Email</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your betting site username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your betting site password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
              </div>

              <div className="rounded-lg bg-muted p-4 flex items-start space-x-3">
                <Lock className="h-5 w-5 text-betting-primary mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Security Notice</h4>
                  <p className="text-sm text-muted-foreground">
                    Your credentials are stored securely on your device and are only used to automate bets on your behalf.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveAccount}>Save Credentials</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Default Betting Settings</CardTitle>
              <CardDescription>
                Configure your default betting preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultBet">Default Bet Amount (R$)</Label>
                <Input
                  id="defaultBet"
                  type="number"
                  min="1"
                  placeholder="25"
                  defaultValue="25"
                />
                <p className="text-xs text-muted-foreground">
                  This amount will be used when no specific amount is defined in a rule
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loss Strategy</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="martingale" />
                    <Label htmlFor="martingale" className="text-sm">Use Martingale</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Double bet after each loss
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Win Strategy</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="resetOnWin" />
                    <Label htmlFor="resetOnWin" className="text-sm">Reset after win</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Return to default bet after a win
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bet Placement</Label>
                    <p className="text-xs text-muted-foreground">
                      Notify when a bet is placed
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bet Results</Label>
                    <p className="text-xs text-muted-foreground">
                      Notify about bet outcomes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Errors & Warnings</Label>
                    <p className="text-xs text-muted-foreground">
                      Notify about system errors or warnings
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Summary</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive a daily summary of your betting activity
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Browser Notifications</CardTitle>
              <CardDescription>
                Configure browser notifications for desktop alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="enableBrowserNotifications" defaultChecked />
                  <Label htmlFor="enableBrowserNotifications">Enable browser notifications</Label>
                </div>
                
                <Button variant="outline" className="w-full">
                  Test Notification
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  You may need to grant permission for notifications in your browser settings
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
