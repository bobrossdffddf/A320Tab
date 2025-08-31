import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { AircraftDiagram } from "@/components/aircraft-diagram";
import { FuelManagement } from "@/components/fuel-management";
import { SeatingChart } from "@/components/seating-chart";
import { ChecklistPanel } from "@/components/checklist-panel";
import { CommunicationsPanel } from "@/components/communications-panel";
import { ServiceStatus } from "@/components/service-status";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plane, Wifi, Phone, AlertTriangle } from "lucide-react";
import { useAircraft } from "@/hooks/use-aircraft";

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState("KLAX");
  
  const { data: airports } = useQuery({
    queryKey: ["/api/airports", { ptfsOnly: true }],
  });

  const { data: flights } = useQuery({
    queryKey: ["/api/flights"],
  });

  const currentFlight = flights?.[0]; // Get the first flight for demo
  
  const { aircraft, isLoading } = useAircraft(currentFlight?.aircraftId);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toISOString().substr(11, 5) + 'Z';
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Plane className="h-8 w-8 text-accent mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading PTFS Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentFlight={currentFlight}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border p-4 flex items-center justify-between" data-testid="header-topbar">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold" data-testid="text-page-title">Ground Operations</h1>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <i className="fas fa-calendar"></i>
              <span data-testid="text-current-date">{getCurrentDate()}</span>
              <span className="mx-2">|</span>
              <span className="font-mono" data-testid="text-current-time">{getCurrentTime()}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Airport Selector */}
            <Select value={selectedAirport} onValueChange={setSelectedAirport}>
              <SelectTrigger className="w-48" data-testid="select-airport">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {airports?.map((airport) => (
                  <SelectItem key={airport.icao} value={airport.icao}>
                    {airport.icao} - {airport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Status Indicators */}
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-chart-5/20 text-chart-5 border-chart-5">
                <div className="w-2 h-2 bg-chart-5 rounded-full mr-2 status-indicator"></div>
                ONLINE
              </Badge>
              <div className="flex items-center space-x-1">
                <Wifi className="h-4 w-4 text-chart-5" />
                <span className="text-xs font-mono">100%</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <div className="flex-1 flex overflow-hidden">
          {/* Central Content */}
          <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
            {/* Aircraft Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Aircraft Diagram */}
              <div className="lg:col-span-2">
                <AircraftDiagram 
                  aircraft={aircraft} 
                  flight={currentFlight}
                />
              </div>
              
              {/* Service Status Panel */}
              <ServiceStatus flightId={currentFlight?.id} />
            </div>
            
            {/* Fuel and Weight Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FuelManagement flight={currentFlight} />
              
              {/* Weight & Balance */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-4">Weight & Balance</h3>
                <div className="space-y-4">
                  {/* Weight Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Empty Weight</span>
                      <span className="font-mono text-sm">41,413 KGS</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Passengers</span>
                      <span className="font-mono text-sm">12,800 KGS</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cargo</span>
                      <span className="font-mono text-sm">2,340 KGS</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fuel</span>
                      <span className="font-mono text-sm">{currentFlight?.fuelData?.total || 20032} KGS</span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total Weight</span>
                      <span className="font-mono">76,585 KGS</span>
                    </div>
                  </div>
                  
                  {/* CG Position */}
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Center of Gravity</span>
                      <span className="font-mono text-sm">27.4%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3 relative">
                      <div className="absolute left-0 top-0 h-full w-1 bg-destructive rounded-full"></div>
                      <div className="absolute right-0 top-0 h-full w-1 bg-destructive rounded-full"></div>
                      <div className="bg-chart-5 h-3 rounded-full" style={{ width: "27.4%", marginLeft: "15%" }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>FWD</span>
                      <span>AFT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Seating Chart */}
            <SeatingChart flight={currentFlight} aircraft={aircraft} />
          </div>
          
          {/* Right Sidebar */}
          <div className="w-80 bg-card border-l border-border flex flex-col">
            <ChecklistPanel flightId={currentFlight?.id} aircraftType={aircraft?.type} />
            <CommunicationsPanel flightId={currentFlight?.id} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="fixed bottom-6 right-6 space-y-3">
        <Button 
          size="icon" 
          className="w-12 h-12 rounded-full shadow-lg bg-accent text-accent-foreground hover:bg-accent/90"
          data-testid="button-quick-atc"
        >
          <Phone className="h-5 w-5" />
        </Button>
        <Button 
          size="icon" 
          className="w-12 h-12 rounded-full shadow-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
          data-testid="button-emergency"
        >
          <AlertTriangle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
