import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/sidebar";
import { 
  MapPin, 
  Search, 
  Filter,
  Plane,
  TowerControl,
  Fuel,
  Users,
  Clock,
  Cloud,
  Wind
} from "lucide-react";
import { useAircraft } from "@/hooks/use-aircraft";
import type { Flight, Airport } from "@shared/schema";

export default function AirportsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [selectedAirport, setSelectedAirport] = useState<string | null>("KLAX");

  const { data: flights } = useQuery({
    queryKey: ["/api/flights"],
  });

  const { data: airports } = useQuery({
    queryKey: ["/api/airports"],
  });

  const currentFlight = flights && Array.isArray(flights) ? flights[0] : undefined;
  const { aircraft } = useAircraft(currentFlight?.aircraftId);

  const airportDetails = {
    KLAX: {
      name: "Los Angeles International Airport",
      city: "Los Angeles, CA",
      elevation: "125 ft",
      runways: [
        { name: "06L/24R", length: "10,285 ft", surface: "Concrete", status: "Open" },
        { name: "06R/24L", length: "12,091 ft", surface: "Concrete", status: "Open" },
        { name: "07L/25R", length: "8,926 ft", surface: "Concrete", status: "Closed - Maintenance" },
        { name: "07R/25L", length: "11,095 ft", surface: "Concrete", status: "Open" }
      ],
      weather: {
        visibility: "10+ SM",
        ceiling: "Clear",
        wind: "240° at 8 kts",
        temperature: "22°C",
        altimeter: "30.12 inHg"
      },
      frequencies: {
        tower: "121.9",
        ground: "121.7",
        approach: "119.1",
        departure: "120.9",
        atis: "128.05"
      },
      services: {
        fuel: "24/7",
        catering: "Available",
        maintenance: "Full Service",
        customs: "Available"
      }
    }
  };

  const ptfsAirports = [
    { icao: "KLAX", name: "Los Angeles Intl", region: "West Coast", active: true },
    { icao: "KJFK", name: "John F Kennedy Intl", region: "East Coast", active: true },
    { icao: "KORD", name: "Chicago O'Hare Intl", region: "Midwest", active: true },
    { icao: "KDFW", name: "Dallas/Fort Worth Intl", region: "South", active: true },
    { icao: "KDEN", name: "Denver Intl", region: "Mountain", active: true },
    { icao: "KSEA", name: "Seattle-Tacoma Intl", region: "Northwest", active: false },
    { icao: "KMIA", name: "Miami Intl", region: "Southeast", active: true },
    { icao: "KLAS", name: "Las Vegas McCarran", region: "West", active: true },
  ];

  const filteredAirports = ptfsAirports.filter(airport => {
    const matchesSearch = airport.icao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         airport.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === "all" || airport.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  const selectedAirportData = airportDetails[selectedAirport as keyof typeof airportDetails];

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
              <h1 className="text-2xl font-bold" data-testid="text-page-title">PTFS Airport Directory</h1>
              <p className="text-muted-foreground">Comprehensive airport information and operational data</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-chart-5/20 text-chart-5 border-chart-5">
                <MapPin className="h-3 w-3 mr-1" />
                {ptfsAirports.filter(a => a.active).length} ACTIVE
              </Badge>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Airport List */}
          <div className="w-96 bg-card border-r border-border p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Airport Directory</h3>
            
            {/* Search & Filter */}
            <div className="space-y-3 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search airports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-airports"
                />
              </div>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger data-testid="select-region-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="West Coast">West Coast</SelectItem>
                  <SelectItem value="East Coast">East Coast</SelectItem>
                  <SelectItem value="Midwest">Midwest</SelectItem>
                  <SelectItem value="South">South</SelectItem>
                  <SelectItem value="Mountain">Mountain</SelectItem>
                  <SelectItem value="Northwest">Northwest</SelectItem>
                  <SelectItem value="Southeast">Southeast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Airport List */}
            <div className="space-y-2">
              {filteredAirports.map((airport) => (
                <Card 
                  key={airport.icao}
                  className={`cursor-pointer transition-colors ${
                    selectedAirport === airport.icao ? "ring-2 ring-accent" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedAirport(airport.icao)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-mono font-bold text-lg">{airport.icao}</div>
                      <Badge 
                        variant={airport.active ? "default" : "secondary"}
                        className={airport.active ? "bg-green-500/20 text-green-500 border-green-500" : ""}
                      >
                        {airport.active ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </div>
                    <div className="font-medium">{airport.name}</div>
                    <div className="text-sm text-muted-foreground">{airport.region}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Panel - Airport Details */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedAirportData ? (
              <div className="space-y-6">
                {/* Airport Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      {selectedAirport} - {selectedAirportData.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Location</h4>
                        <p className="text-muted-foreground">{selectedAirportData.city}</p>
                        <p className="text-sm">Elevation: {selectedAirportData.elevation}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Weather</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center">
                            <Cloud className="h-4 w-4 mr-2" />
                            {selectedAirportData.weather.ceiling}
                          </div>
                          <div className="flex items-center">
                            <Wind className="h-4 w-4 mr-2" />
                            {selectedAirportData.weather.wind}
                          </div>
                          <p>Temp: {selectedAirportData.weather.temperature}</p>
                          <p>Alt: {selectedAirportData.weather.altimeter}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Services</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Fuel:</span>
                            <span className="text-green-500">{selectedAirportData.services.fuel}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Catering:</span>
                            <span className="text-green-500">{selectedAirportData.services.catering}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Maintenance:</span>
                            <span className="text-green-500">{selectedAirportData.services.maintenance}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Customs:</span>
                            <span className="text-green-500">{selectedAirportData.services.customs}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Runways */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plane className="h-5 w-5 mr-2" />
                      Runway Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedAirportData.runways.map((runway, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <div className="font-mono font-bold">{runway.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {runway.length} • {runway.surface}
                            </div>
                          </div>
                          <Badge 
                            variant={runway.status === "Open" ? "default" : "destructive"}
                            className={runway.status === "Open" ? "bg-green-500/20 text-green-500 border-green-500" : ""}
                          >
                            {runway.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Frequencies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TowerControl className="h-5 w-5 mr-2" />
                      Communication Frequencies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(selectedAirportData.frequencies).map(([type, freq]) => (
                        <div key={type} className="text-center p-3 bg-muted rounded-lg">
                          <div className="font-mono font-bold text-lg">{freq}</div>
                          <div className="text-sm text-muted-foreground capitalize">{type}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Select an Airport</h3>
                  <p>Choose an airport from the list to view detailed information</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}