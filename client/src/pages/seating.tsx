import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/sidebar";
import { SeatingChart } from "@/components/seating-chart";
import { AircraftConfig } from "@/components/aircraft-config";
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Search,
  Filter,
  Download,
  Upload
} from "lucide-react";
import { useAircraft } from "@/hooks/use-aircraft";
import type { Flight } from "@shared/schema";

export default function SeatingPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [seatClassFilter, setSeatClassFilter] = useState("all");

  const { data: flights } = useQuery({
    queryKey: ["/api/flights"],
  });

  const currentFlight = flights && Array.isArray(flights) ? flights[0] : undefined;
  const { aircraft } = useAircraft(currentFlight?.aircraftId);

  const passengerStats = {
    total: 162,
    occupied: 136,
    available: 26,
    firstClass: { total: 8, occupied: 6 },
    business: { total: 24, occupied: 20 },
    economy: { total: 130, occupied: 110 }
  };

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
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Passenger Seating</h1>
              <p className="text-muted-foreground">Manage passenger seating and aircraft configuration</p>
            </div>
            <div className="flex items-center space-x-4">
              <AircraftConfig onConfigSave={(config) => {
                console.log("Aircraft configuration updated:", config);
              }} />
              <Badge variant="outline" className="bg-chart-5/20 text-chart-5 border-chart-5">
                <Users className="h-3 w-3 mr-1" />
                {passengerStats.occupied}/{passengerStats.total} PAX
              </Badge>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Passenger Management */}
          <div className="w-80 bg-card border-r border-border p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Passenger Management</h3>
            
            {/* Search & Filter */}
            <div className="space-y-3 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search passengers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-passengers"
                />
              </div>
              <Select value={seatClassFilter} onValueChange={setSeatClassFilter}>
                <SelectTrigger data-testid="select-seat-class-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="economy">Economy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Statistics */}
            <div className="space-y-3 mb-6">
              <Card>
                <CardContent className="p-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-5">{passengerStats.occupied}</div>
                    <div className="text-sm text-muted-foreground">Passengers Boarded</div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 gap-2">
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="font-bold text-green-500">{passengerStats.available}</div>
                    <div className="text-xs text-muted-foreground">Available</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="font-bold text-blue-500">{Math.round((passengerStats.occupied / passengerStats.total) * 100)}%</div>
                    <div className="text-xs text-muted-foreground">Load Factor</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Class Breakdown */}
            <div className="space-y-3 mb-6">
              <h4 className="font-medium text-sm">Class Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-sm">First Class</span>
                  <Badge variant="outline">{passengerStats.firstClass.occupied}/{passengerStats.firstClass.total}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-sm">Business</span>
                  <Badge variant="outline">{passengerStats.business.occupied}/{passengerStats.business.total}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-sm">Economy</span>
                  <Badge variant="outline">{passengerStats.economy.occupied}/{passengerStats.economy.total}</Badge>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button className="w-full" variant="outline" data-testid="button-add-passenger">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Passenger
              </Button>
              <Button className="w-full" variant="outline" data-testid="button-remove-passenger">
                <UserMinus className="h-4 w-4 mr-2" />
                Remove Passenger
              </Button>
              <Button className="w-full" variant="outline" data-testid="button-export-manifest">
                <Download className="h-4 w-4 mr-2" />
                Export Manifest
              </Button>
              <Button className="w-full" variant="outline" data-testid="button-import-manifest">
                <Upload className="h-4 w-4 mr-2" />
                Import Manifest
              </Button>
            </div>
          </div>

          {/* Right Panel - Seating Chart */}
          <div className="flex-1 p-6 overflow-y-auto">
            <SeatingChart 
              flight={currentFlight} 
              aircraft={aircraft}
            />

            {/* Special Requirements */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Special Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="font-bold text-orange-500">3</div>
                    <div className="text-sm text-muted-foreground">Wheelchair Assistance</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="font-bold text-red-500">2</div>
                    <div className="text-sm text-muted-foreground">Service Animals</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="font-bold text-blue-500">5</div>
                    <div className="text-sm text-muted-foreground">Unaccompanied Minors</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}