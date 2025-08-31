import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { AircraftConfig } from "./aircraft-config";
import type { Aircraft, Flight, SeatingData } from "@shared/schema";

interface SeatingChartProps {
  flight?: Flight;
  aircraft?: Aircraft;
}

export function SeatingChart({ flight, aircraft }: SeatingChartProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const { data: seatingData } = useQuery({
    queryKey: ["/api/flights", flight?.id, "seating"],
    enabled: !!flight?.id,
  });

  const updateSeatMutation = useMutation({
    mutationFn: async ({ seatNumber, status }: { seatNumber: string; status: string }) => {
      const response = await apiRequest(
        "PATCH",
        `/api/flights/${flight?.id}/seating/${seatNumber}`,
        { status }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/flights", flight?.id, "seating"] 
      });
    },
  });

  const getSeatStatus = (seatNumber: string): string => {
    if (!seatingData || !Array.isArray(seatingData)) return "available";
    const seat = seatingData.find((s: SeatingData) => s.seatNumber === seatNumber);
    return seat?.status || "available";
  };

  const handleSeatClick = (seatNumber: string) => {
    const currentStatus = getSeatStatus(seatNumber);
    const newStatus = currentStatus === "available" ? "occupied" : "available";
    
    updateSeatMutation.mutate({ seatNumber, status: newStatus });
    setSelectedSeat(seatNumber);
  };

  const getSeatClass = (status: string) => {
    return cn(
      "aircraft-seat w-4 h-4 rounded-sm border border-background cursor-pointer",
      {
        "bg-chart-5 available": status === "available",
        "bg-destructive occupied": status === "occupied",
        "bg-chart-4 selected": status === "selected",
      }
    );
  };

  // Generate seat layout based on aircraft configuration
  const generateSeats = () => {
    const seats: JSX.Element[] = [];
    const config = aircraft?.configuration && typeof aircraft.configuration === 'object' && aircraft.configuration !== null 
      ? (aircraft.configuration as any).seatingLayout 
      : null;
    
    if (!config) return seats;

    // First Class
    if (config.firstClass) {
      for (let row = 1; row <= config.firstClass.rows; row++) {
        const rowSeats = [];
        const letters = ['A', 'B', 'C', 'D'];
        
        letters.forEach((letter, index) => {
          const seatNumber = `${row}${letter}`;
          const status = getSeatStatus(seatNumber);
          
          rowSeats.push(
            <div
              key={seatNumber}
              className={getSeatClass(status)}
              onClick={() => handleSeatClick(seatNumber)}
              data-testid={`seat-${seatNumber}`}
              title={`Seat ${seatNumber} - ${status}`}
            />
          );
          
          // Add aisle gap after B
          if (index === 1) {
            rowSeats.push(<div key={`aisle-${row}`} className="w-8" />);
          }
        });
        
        seats.push(
          <div key={`first-row-${row}`} className="flex justify-center space-x-2">
            {rowSeats}
          </div>
        );
      }
    }

    return seats;
  };

  const generateEconomySeats = () => {
    const seats: JSX.Element[] = [];
    const config = aircraft?.configuration && typeof aircraft.configuration === 'object' && aircraft.configuration !== null 
      ? (aircraft.configuration as any).seatingLayout 
      : null;
    
    if (!config?.economy) return seats;

    for (let row = 10; row < 10 + config.economy.rows; row++) {
      const rowSeats = [];
      const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
      
      letters.forEach((letter, index) => {
        const seatNumber = `${row}${letter}`;
        const status = getSeatStatus(seatNumber);
        
        rowSeats.push(
          <div
            key={seatNumber}
            className={getSeatClass(status)}
            onClick={() => handleSeatClick(seatNumber)}
            data-testid={`seat-${seatNumber}`}
            title={`Seat ${seatNumber} - ${status}`}
          />
        );
        
        // Add aisle gap after C
        if (index === 2) {
          rowSeats.push(<div key={`aisle-${row}`} className="w-4" />);
        }
      });
      
      seats.push(
        <div key={`economy-row-${row}`} className="flex justify-center space-x-1">
          {rowSeats}
        </div>
      );
    }

    return seats.slice(0, 15); // Show only first 15 rows
  };

  const totalSeats = 162;
  const occupiedSeats = seatingData && Array.isArray(seatingData) ? seatingData.filter((s: SeatingData) => s.status === "occupied").length : 136;
  const availableSeats = totalSeats - occupiedSeats;
  const loadFactor = Math.round((occupiedSeats / totalSeats) * 100);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold" data-testid="text-seating-title">
            Passenger Seating - {aircraft?.type || "Boeing 737-800"}
          </CardTitle>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <AircraftConfig onConfigSave={(config) => {
              console.log("New aircraft configuration:", config);
              // Here you would typically save the configuration to your backend
            }} />
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-chart-5 rounded aircraft-seat"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-destructive rounded aircraft-seat"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-chart-4 rounded aircraft-seat"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Aircraft Cabin Layout */}
        <div className="bg-muted rounded-lg p-3 sm:p-6 overflow-x-auto" data-testid="container-seating-chart">
          <div className="aircraft-cabin min-w-max">
            <div className="space-y-8">
              {/* First Class */}
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-4">First Class</div>
                <div className="space-y-2">
                  {generateSeats()}
                </div>
              </div>
              
              {/* Economy */}
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-4">Economy</div>
                <div className="space-y-1">
                  {generateEconomySeats()}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Passenger Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-4">
          <div className="text-center p-2 sm:p-3 bg-muted rounded-lg">
            <div className="font-mono text-lg sm:text-xl font-semibold" data-testid="text-total-passengers">
              {totalSeats}
            </div>
            <div className="text-xs text-muted-foreground">Total PAX</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-muted rounded-lg">
            <div className="font-mono text-lg sm:text-xl font-semibold text-chart-5" data-testid="text-available-seats">
              {availableSeats}
            </div>
            <div className="text-xs text-muted-foreground">Available</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-muted rounded-lg">
            <div className="font-mono text-lg sm:text-xl font-semibold text-destructive" data-testid="text-occupied-seats">
              {occupiedSeats}
            </div>
            <div className="text-xs text-muted-foreground">Occupied</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-muted rounded-lg">
            <div className="font-mono text-lg sm:text-xl font-semibold" data-testid="text-load-factor">
              {loadFactor}%
            </div>
            <div className="text-xs text-muted-foreground">Load Factor</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
