import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/sidebar";
import { CommunicationsPanel } from "@/components/communications-panel";
import { 
  MessageSquare, 
  Send, 
  Users, 
  Bell,
  Phone,
  Mail,
  AlertTriangle,
  Clock
} from "lucide-react";
import { useAircraft } from "@/hooks/use-aircraft";
import type { Flight } from "@shared/schema";

export default function CommunicationsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("ground-crew");
  const [newMessage, setNewMessage] = useState("");

  const { data: flights } = useQuery({
    queryKey: ["/api/flights"],
  });

  const currentFlight = flights && Array.isArray(flights) ? flights[0] : undefined;
  const { aircraft } = useAircraft(currentFlight?.aircraftId);

  const channels = [
    { id: "ground-crew", name: "Ground Crew", active: 12, unread: 3 },
    { id: "cabin-crew", name: "Cabin Crew", active: 8, unread: 1 },
    { id: "maintenance", name: "Maintenance", active: 4, unread: 0 },
    { id: "catering", name: "Catering", active: 2, unread: 2 },
    { id: "fueling", name: "Fueling", active: 3, unread: 0 },
    { id: "security", name: "Security", active: 6, unread: 1 },
  ];

  const announcements = [
    {
      id: 1,
      type: "info",
      title: "Weather Update",
      message: "Light rain expected in 30 minutes, ground operations may be affected",
      time: "14:25",
      priority: "medium"
    },
    {
      id: 2,
      type: "warning",
      title: "Runway Closure",
      message: "Runway 24R closed for maintenance from 15:00-16:00",
      time: "14:20",
      priority: "high"
    },
    {
      id: 3,
      type: "success",
      title: "Fuel Delivery Complete",
      message: "Aircraft fully fueled and ready for departure",
      time: "14:15",
      priority: "low"
    },
  ];

  const quickMessages = [
    "Ready for pushback",
    "Request ground power",
    "Catering complete",
    "Passengers boarded",
    "Maintenance required",
    "Weather delay",
    "All clear",
    "Emergency assistance needed"
  ];

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentFlight={currentFlight}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Communications Center</h1>
              <p className="text-muted-foreground">Real-time coordination between all ground operations teams</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-chart-5/20 text-chart-5 border-chart-5">
                <Users className="h-3 w-3 mr-1" />
                35 ONLINE
              </Badge>
              <Button variant="outline" size="sm" data-testid="button-emergency-broadcast">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency Broadcast
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Channels & Announcements */}
          <div className="w-80 bg-card border-r border-border p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Communication Channels</h3>
            
            {/* Channels */}
            <div className="space-y-2 mb-6">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChannel === channel.id
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedChannel(channel.id)}
                  data-testid={`channel-${channel.id}`}
                >
                  <div>
                    <div className="font-medium">{channel.name}</div>
                    <div className="text-sm text-muted-foreground">{channel.active} active</div>
                  </div>
                  {channel.unread > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {channel.unread}
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Announcements */}
            <h3 className="font-semibold mb-4">System Announcements</h3>
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{announcement.title}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          announcement.priority === "high" 
                            ? "border-red-500 text-red-500" 
                            : announcement.priority === "medium"
                            ? "border-yellow-500 text-yellow-500"
                            : "border-green-500 text-green-500"
                        }`}
                      >
                        {announcement.priority.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {announcement.time}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{announcement.message}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Center Panel - Chat */}
          <div className="flex-1 flex flex-col">
            <CommunicationsPanel flightId={currentFlight?.id} />
          </div>

          {/* Right Panel - Quick Actions */}
          <div className="w-80 bg-card border-l border-border p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            
            {/* Quick Messages */}
            <div className="space-y-2 mb-6">
              <h4 className="text-sm font-medium text-muted-foreground">Quick Messages</h4>
              <div className="grid grid-cols-1 gap-2">
                {quickMessages.map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto py-2 px-3"
                    onClick={() => setNewMessage(message)}
                    data-testid={`quick-message-${index}`}
                  >
                    {message}
                  </Button>
                ))}
              </div>
            </div>

            {/* Message Composer */}
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-medium text-muted-foreground">Compose Message</h4>
              <Select>
                <SelectTrigger data-testid="select-message-recipient">
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="ground">Ground Crew</SelectItem>
                  <SelectItem value="cabin">Cabin Crew</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="catering">Catering</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-24"
                data-testid="textarea-new-message"
              />
              <Button className="w-full" data-testid="button-send-message">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>

            {/* Contact Directory */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Contact Directory</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" data-testid="button-contact-atc">
                  <Phone className="h-4 w-4 mr-2" />
                  ATC Tower: 121.9
                </Button>
                <Button variant="outline" className="w-full justify-start" data-testid="button-contact-ground">
                  <Phone className="h-4 w-4 mr-2" />
                  Ground: 121.7
                </Button>
                <Button variant="outline" className="w-full justify-start" data-testid="button-contact-ops">
                  <Mail className="h-4 w-4 mr-2" />
                  Operations Center
                </Button>
                <Button variant="outline" className="w-full justify-start" data-testid="button-contact-emergency">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Services
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}