
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
      name: "Football Betting Tips",
      active: true,
      messages: 235,
    },
    {
      id: "channel-2",
      name: "VIP Bet Signals",
      active: true,
      messages: 120,
    },
  ]);

  const handleConnect = () => {
    if (!botToken) {
      toast({
        title: "Error",
        description: "Please enter a Telegram Bot Token",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would validate the token with Telegram API
    toast({
      title: "Success",
      description: "Connected to Telegram successfully",
    });
    setIsConnected(true);
  };

  const handleAddChannel = () => {
    if (!channelUrl) {
      toast({
        title: "Error", 
        description: "Please enter a channel URL or username", 
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would validate the channel with Telegram API
    const newChannel: Channel = {
      id: `channel-${Date.now()}`,
      name: `New Channel (${channelUrl})`,
      active: true,
      messages: 0,
    };
    
    setChannels([...channels, newChannel]);
    setChannelUrl("");
    toast({
      title: "Channel Added",
      description: "New channel has been added for monitoring",
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
      title: "Channel Removed",
      description: "Channel has been removed from monitoring",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Telegram Connection</h2>
        <p className="text-muted-foreground">
          Connect to Telegram and monitor betting channels
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Telegram Bot Setup</CardTitle>
          <CardDescription>
            Configure your Telegram bot to read messages from channels and groups
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot-token">Telegram Bot Token</Label>
            <div className="flex space-x-2">
              <Input
                id="bot-token"
                type="password"
                placeholder="Enter your bot token"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                disabled={isConnected}
              />
              <Button 
                onClick={handleConnect}
                disabled={isConnected}
              >
                {isConnected ? "Connected" : "Connect"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Create a new bot with @BotFather and paste the token here
            </p>
          </div>

          {isConnected && (
            <>
              <Separator />

              <div className="space-y-2">
                <Label>Connection Status</Label>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-betting-secondary"></div>
                  <span>Connected to Telegram API</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Channels & Groups</CardTitle>
            <CardDescription>
              Manage the channels and groups that the bot will monitor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="channel">Add Channel or Group</Label>
                <Input
                  id="channel"
                  placeholder="Enter channel URL or username (e.g., @betting_channel)"
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                />
              </div>
              <Button onClick={handleAddChannel}>
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>

            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                            {channel.active ? "Monitoring" : "Paused"}
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
                        No channels added yet. Add a channel to start monitoring.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Monitoring {channels.filter(c => c.active).length} of {channels.length} channels
            </p>
            <Button variant="outline">Refresh Channels</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
