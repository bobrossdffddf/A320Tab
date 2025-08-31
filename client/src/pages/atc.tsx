import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/sidebar";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Radio, 
  Plane, 
  TowerControl,
  MapPin,
  Clock
} from "lucide-react";
import { useAircraft } from "@/hooks/use-aircraft";
import type { Flight } from "@shared/schema";

export default function ATCPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [selectedFrequency, setSelectedFrequency] = useState("121.9");

  const { data: flights } = useQuery({
    queryKey: ["/api/flights"],
  });

  const currentFlight = flights && Array.isArray(flights) ? flights[0] : undefined;
  const { aircraft } = useAircraft(currentFlight?.aircraftId);

  const frequencies = [
    { name: "Tower", freq: "121.9", active: true },
    { name: "Ground", freq: "121.7", active: false },
    { name: "Approach", freq: "119.1", active: false },
    { name: "Departure", freq: "120.9", active: false },
    { name: "ATIS", freq: "128.05", active: false },
  ];

  const atcMessages = [
    {
      id: 1,
      time: "14:32:15",
      callsign: "LAX Tower",
      message: "PTFS001, taxi to runway 24L via Alpha, Charlie",
      type: "instruction"
    },
    {
      id: 2,
      time: "14:31:45",
      callsign: "PTFS001",
      message: "Roger, taxi to 24L via Alpha, Charlie, PTFS001",
      type: "pilot"
    },
    {
      id: 3,
      time: "14:31:20",
      callsign: "LAX Ground",
      message: "PTFS001, pushback approved, contact ground when ready to taxi",
      type: "instruction"
    },
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
              <h1 className="text-2xl font-bold" data-testid="text-page-title">ATC Assistant</h1>
              <p className="text-muted-foreground">Air Traffic Control Communications</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-chart-5/20 text-chart-5 border-chart-5">
                <div className="w-2 h-2 bg-chart-5 rounded-full mr-2"></div>
                ATC ONLINE
              </Badge>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Radio Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Frequency Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Radio className="h-5 w-5 mr-2" />
                  Radio Frequencies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {frequencies.map((freq) => (
                  <div
                    key={freq.freq}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedFrequency === freq.freq
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedFrequency(freq.freq)}
                    data-testid={`freq-${freq.name.toLowerCase()}`}
                  >
                    <div>
                      <div className="font-medium">{freq.name}</div>
                      <div className="text-sm text-muted-foreground">{freq.freq} MHz</div>
                    </div>
                    {freq.active && (
                      <Badge variant="outline" className="bg-chart-5/20 text-chart-5">
                        ACTIVE
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Audio Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Audio Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Microphone</span>
                  <Button
                    variant={micEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMicEnabled(!micEnabled)}
                    data-testid="button-microphone"
                  >
                    {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Speakers</span>
                  <Button
                    variant={speakerEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSpeakerEnabled(!speakerEnabled)}
                    data-testid="button-speakers"
                  >
                    {speakerEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="75"
                    className="w-full"
                    data-testid="slider-volume"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Flight Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plane className="h-5 w-5 mr-2" />
                  Current Flight
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Callsign:</span>
                    <span className="font-mono">{currentFlight?.flightNumber || "PTFS001"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Aircraft:</span>
                    <span>{aircraft?.type || "Boeing 737-800"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Departure:</span>
                    <span>{currentFlight?.departureAirport || "KLAX"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Arrival:</span>
                    <span>{currentFlight?.arrivalAirport || "KJFK"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Communication Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TowerControl className="h-5 w-5 mr-2" />
                ATC Communications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Messages */}
                <div className="bg-muted rounded-lg p-4 h-64 overflow-y-auto space-y-3">
                  {atcMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${
                        msg.type === "pilot"
                          ? "bg-accent/50 ml-8"
                          : "bg-background border mr-8"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{msg.callsign}</span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  ))}
                </div>

                {/* Quick Responses */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button variant="outline" size="sm" data-testid="button-roger">
                    Roger
                  </Button>
                  <Button variant="outline" size="sm" data-testid="button-wilco">
                    Wilco
                  </Button>
                  <Button variant="outline" size="sm" data-testid="button-standby">
                    Standby
                  </Button>
                  <Button variant="outline" size="sm" data-testid="button-request">
                    Request
                  </Button>
                </div>

                {/* Custom Message Input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type custom message..."
                    className="flex-1"
                    data-testid="input-custom-message"
                  />
                  <Button data-testid="button-send-message">Send</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}