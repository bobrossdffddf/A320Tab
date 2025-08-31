import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Settings, Fuel } from "lucide-react";
import type { Flight } from "@shared/schema";

interface FuelManagementProps {
  flight?: Flight;
}

export function FuelManagement({ flight }: FuelManagementProps) {
  const fuelData = flight?.fuelData && typeof flight.fuelData === 'object' && flight.fuelData !== null 
    ? flight.fuelData as any
    : {
        leftWing: 5746,
        center: 8540,
        rightWing: 5746,
        total: 20032
      };

  const maxCapacity = 26000; // Example max capacity

  const getPercentage = (amount: number) => (amount / maxCapacity) * 100;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold" data-testid="text-fuel-title">
          Fuel Management
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Fuel Tanks */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Left Wing</div>
            <div className="font-mono text-sm" data-testid="text-fuel-left">
              {fuelData.leftWing} KGS
            </div>
            <Progress 
              value={getPercentage(fuelData.leftWing)} 
              className="mt-2 h-2"
            />
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Center</div>
            <div className="font-mono text-sm" data-testid="text-fuel-center">
              {fuelData.center} KGS
            </div>
            <Progress 
              value={getPercentage(fuelData.center)} 
              className="mt-2 h-2"
            />
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Right Wing</div>
            <div className="font-mono text-sm" data-testid="text-fuel-right">
              {fuelData.rightWing} KGS
            </div>
            <Progress 
              value={getPercentage(fuelData.rightWing)} 
              className="mt-2 h-2"
            />
          </div>
        </div>
        
        {/* Total Fuel */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Fuel</span>
            <span className="font-mono font-semibold" data-testid="text-fuel-total">
              {fuelData.total} KGS
            </span>
          </div>
        </div>
        
        {/* Fuel Controls */}
        <div className="flex space-x-2">
          <Button 
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            data-testid="button-request-fuel"
          >
            <Fuel className="h-4 w-4 mr-2" />
            Request Fuel
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            data-testid="button-fuel-settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
