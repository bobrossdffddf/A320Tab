import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plane, MapPin, Clock, Users, Fuel, Weight } from 'lucide-react';

interface FlightPlan {
  id: string;
  flightNumber: string;
  aircraft: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  passengers: number;
  cargoWeight: number;
  fuelRequired: number;
  status: 'planning' | 'approved' | 'filed' | 'active';
}

const mockFlightPlans: FlightPlan[] = [
  {
    id: '1',
    flightNumber: 'PTFS001',
    aircraft: 'N737AB',
    departure: 'KJFK',
    arrival: 'KLAX',
    departureTime: '14:30',
    arrivalTime: '17:45',
    passengers: 156,
    cargoWeight: 2500,
    fuelRequired: 18500,
    status: 'planning'
  },
  {
    id: '2',
    flightNumber: 'PTFS002',
    aircraft: 'N320CD',
    departure: 'KORD',
    arrival: 'KDEN',
    departureTime: '16:15',
    arrivalTime: '18:30',
    passengers: 142,
    cargoWeight: 1800,
    fuelRequired: 12300,
    status: 'approved'
  }
];

interface FlightPlanSelectorProps {
  onSelectFlight: (flight: FlightPlan) => void;
}

export function FlightPlanSelector({ onSelectFlight }: FlightPlanSelectorProps) {
  const [selectedAirport, setSelectedAirport] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFlights = mockFlightPlans.filter(flight => 
    flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flight.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flight.arrival.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-500/20 text-yellow-400';
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'filed': return 'bg-blue-500/20 text-blue-400';
      case 'active': return 'bg-cyan-500/20 text-cyan-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Plane className="h-5 w-5 mr-2 text-cyan-400" />
            Flight Plan Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="Search flights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              data-testid="input-flight-search"
            />
            <Select value={selectedAirport} onValueChange={setSelectedAirport}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-airport">
                <SelectValue placeholder="Filter by airport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Airports</SelectItem>
                <SelectItem value="KJFK">KJFK - John F. Kennedy</SelectItem>
                <SelectItem value="KLAX">KLAX - Los Angeles</SelectItem>
                <SelectItem value="KORD">KORD - O'Hare</SelectItem>
                <SelectItem value="KDEN">KDEN - Denver</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-cyan-600 hover:bg-cyan-700" data-testid="button-create-flight">
              Create New Flight Plan
            </Button>
          </div>
          
          <div className="space-y-4">
            {filteredFlights.map((flight) => (
              <Card key={flight.id} className="bg-slate-700/50 border-slate-600 hover:bg-slate-700/70 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{flight.flightNumber}</h3>
                      <p className="text-slate-300">{flight.aircraft}</p>
                    </div>
                    <Badge className={getStatusColor(flight.status)}>
                      {flight.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-slate-300">
                        <MapPin className="h-4 w-4 mr-2" />
                        Route
                      </div>
                      <p className="text-white">{flight.departure} → {flight.arrival}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-slate-300">
                        <Clock className="h-4 w-4 mr-2" />
                        Departure
                      </div>
                      <p className="text-white">{flight.departureTime}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-slate-300">
                        <Users className="h-4 w-4 mr-2" />
                        Passengers
                      </div>
                      <p className="text-white">{flight.passengers}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-slate-300">
                        <Fuel className="h-4 w-4 mr-2" />
                        Fuel Required
                      </div>
                      <p className="text-white">{flight.fuelRequired.toLocaleString()} lbs</p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => onSelectFlight(flight)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    data-testid={`button-select-flight-${flight.id}`}
                  >
                    Select Flight Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}