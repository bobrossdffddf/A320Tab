import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Expand, Fuel, UtensilsCrossed, Luggage, DoorOpen } from "lucide-react";
import type { Aircraft, Flight } from "@shared/schema";

interface AircraftDiagramProps {
  aircraft?: Aircraft;
  flight?: Flight;
}

export function AircraftDiagram({ aircraft, flight }: AircraftDiagramProps) {
  const servicePoints = aircraft?.configuration && typeof aircraft.configuration === 'object' && aircraft.configuration !== null ? (aircraft.configuration as any).servicePoints || [] : [];

  return (
    <Card className="bg-card border-border aircraft-diagram">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold" data-testid="text-aircraft-title">
            Aircraft Status
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground hover:text-accent"
            data-testid="button-expand-diagram"
          >
            <Expand className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Aircraft Top View */}
        <div 
          className="relative bg-muted rounded-lg p-8 grid-pattern min-h-[300px]"
          data-testid="diagram-aircraft-view"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Aircraft Body */}
            <div className="relative">
              {/* Fuselage */}
              <div className="w-80 h-24 bg-secondary border border-accent rounded-full relative">
                {/* Wings */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-12 w-24 h-2 bg-accent rounded"></div>
                <div className="absolute top-1/2 -translate-y-1/2 -right-12 w-24 h-2 bg-accent rounded"></div>
                
                {/* Service Points */}
                <div 
                  className="absolute -top-8 left-16 bg-chart-5 w-4 h-4 rounded border-2 border-background flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                  data-testid="service-point-door"
                >
                  <DoorOpen className="w-3 h-3" />
                </div>
                <div 
                  className="absolute -bottom-8 left-16 bg-chart-2 w-4 h-4 rounded border-2 border-background flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                  data-testid="service-point-fuel"
                >
                  <Fuel className="w-3 h-3" />
                </div>
                <div 
                  className="absolute -top-8 right-16 bg-chart-3 w-4 h-4 rounded border-2 border-background flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                  data-testid="service-point-catering"
                >
                  <UtensilsCrossed className="w-3 h-3" />
                </div>
                <div 
                  className="absolute -bottom-8 right-16 bg-chart-4 w-4 h-4 rounded border-2 border-background flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                  data-testid="service-point-baggage"
                >
                  <Luggage className="w-3 h-3" />
                </div>
              </div>
              
              {/* Service Labels */}
              <div className="absolute -top-16 left-12 text-xs text-center">
                <div className="text-chart-5">Door Fwd</div>
              </div>
              <div className="absolute top-12 left-12 text-xs text-center">
                <div className="text-chart-2">Fuel Truck</div>
              </div>
              <div className="absolute -top-16 right-12 text-xs text-center">
                <div className="text-chart-3">Catering</div>
              </div>
              <div className="absolute top-12 right-12 text-xs text-center">
                <div className="text-chart-4">Baggage</div>
              </div>
            </div>
          </div>
        </div>

        {/* Aircraft Info */}
        {aircraft && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">Registration</div>
              <div className="font-mono font-semibold" data-testid="text-aircraft-registration">
                {aircraft.registration}
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">Type</div>
              <div className="font-semibold" data-testid="text-aircraft-type">
                {aircraft.type}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
