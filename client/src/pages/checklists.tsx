import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/sidebar";
import { ChecklistPanel } from "@/components/checklist-panel";
import { 
  ClipboardCheck, 
  CheckSquare, 
  Square, 
  Clock,
  AlertTriangle,
  Play,
  Pause
} from "lucide-react";
import { useAircraft } from "@/hooks/use-aircraft";
import type { Flight, Checklist } from "@shared/schema";

export default function ChecklistsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<string | null>(null);

  const { data: flights } = useQuery({
    queryKey: ["/api/flights"],
  });

  const currentFlight = flights && Array.isArray(flights) ? flights[0] : undefined;
  const { aircraft } = useAircraft(currentFlight?.aircraftId);

  const { data: checklists } = useQuery({
    queryKey: [`/api/checklists?aircraftType=${aircraft?.type}`],
    enabled: !!aircraft?.type,
  });

  const checklistCategories = [
    { 
      name: "Pre-Flight", 
      color: "bg-blue-500/20 text-blue-500 border-blue-500",
      description: "Essential checks before engine start"
    },
    { 
      name: "Start-Up", 
      color: "bg-yellow-500/20 text-yellow-500 border-yellow-500",
      description: "Engine start and system initialization"
    },
    { 
      name: "Taxi", 
      color: "bg-orange-500/20 text-orange-500 border-orange-500",
      description: "Ground movement and pre-takeoff checks"
    },
    { 
      name: "Takeoff", 
      color: "bg-green-500/20 text-green-500 border-green-500",
      description: "Final checks before departure"
    },
    { 
      name: "Emergency", 
      color: "bg-red-500/20 text-red-500 border-red-500",
      description: "Emergency procedures and responses"
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
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Flight Checklists</h1>
              <p className="text-muted-foreground">Standard Operating Procedures - {aircraft?.type || "Boeing 737-800"}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-chart-5/20 text-chart-5 border-chart-5">
                <CheckSquare className="h-3 w-3 mr-1" />
                ACTIVE
              </Badge>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Checklist Categories */}
          <div className="w-80 bg-card border-r border-border p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Checklist Categories</h3>
            <div className="space-y-3">
              {checklistCategories.map((category) => (
                <Card key={category.name} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{category.name}</h4>
                      <Badge variant="outline" className={category.color}>
                        <ClipboardCheck className="h-3 w-3 mr-1" />
                        3/5
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <Progress value={60} className="h-2" />
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>3 of 5 completed</span>
                      <span>60%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-2">
              <Button className="w-full" variant="outline" data-testid="button-start-checklist">
                <Play className="h-4 w-4 mr-2" />
                Start Next Checklist
              </Button>
              <Button className="w-full" variant="outline" data-testid="button-pause-checklist">
                <Pause className="h-4 w-4 mr-2" />
                Pause Current
              </Button>
            </div>
          </div>

          {/* Right Panel - Detailed Checklist */}
          <div className="flex-1 p-6 overflow-y-auto">
            <ChecklistPanel 
              flightId={currentFlight?.id} 
              aircraftType={aircraft?.type}
            />

            {/* Emergency Procedures */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Emergency Procedures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="destructive" className="h-20 flex flex-col" data-testid="button-emergency-engine">
                    <span className="font-bold">ENGINE FAILURE</span>
                    <span className="text-sm opacity-90">Single/Multiple Engine</span>
                  </Button>
                  <Button variant="destructive" className="h-20 flex flex-col" data-testid="button-emergency-fire">
                    <span className="font-bold">FIRE/SMOKE</span>
                    <span className="text-sm opacity-90">Engine/Cabin/Cargo</span>
                  </Button>
                  <Button variant="destructive" className="h-20 flex flex-col" data-testid="button-emergency-pressurization">
                    <span className="font-bold">PRESSURIZATION</span>
                    <span className="text-sm opacity-90">Cabin Pressure Loss</span>
                  </Button>
                  <Button variant="destructive" className="h-20 flex flex-col" data-testid="button-emergency-medical">
                    <span className="font-bold">MEDICAL</span>
                    <span className="text-sm opacity-90">Passenger/Crew Emergency</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}