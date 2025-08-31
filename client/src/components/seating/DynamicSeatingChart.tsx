import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  User, 
  UserCheck, 
  UserX,
  Package,
  Weight,
  RefreshCw
} from 'lucide-react';

interface SeatData {
  seatNumber: string;
  status: 'available' | 'occupied' | 'blocked' | 'selected';
  passengerName?: string;
  seatClass: 'first' | 'business' | 'economy';
  row: number;
  column: string;
}

interface AircraftConfiguration {
  totalSeats: number;
  firstClassRows: number;
  businessClassRows: number;
  economyClassRows: number;
  seatsPerRow: number;
}

const mockConfiguration: AircraftConfiguration = {
  totalSeats: 156,
  firstClassRows: 2,
  businessClassRows: 4,
  economyClassRows: 20,
  seatsPerRow: 6
};

interface DynamicSeatingChartProps {
  flightId?: string;
}

export function DynamicSeatingChart({ flightId }: DynamicSeatingChartProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [passengerFilter, setPassengerFilter] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  // Generate seat data
  const generateSeats = (): SeatData[] => {
    const seats: SeatData[] = [];
    const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    // Generate all seats
    for (let row = 1; row <= mockConfiguration.firstClassRows + mockConfiguration.businessClassRows + mockConfiguration.economyClassRows; row++) {
      let seatClass: 'first' | 'business' | 'economy';
      
      if (row <= mockConfiguration.firstClassRows) {
        seatClass = 'first';
      } else if (row <= mockConfiguration.firstClassRows + mockConfiguration.businessClassRows) {
        seatClass = 'business';
      } else {
        seatClass = 'economy';
      }
      
      columns.forEach(column => {
        const seatNumber = `${row}${column}`;
        const occupied = Math.random() > 0.4; // 60% occupancy
        
        seats.push({
          seatNumber,
          status: occupied ? 'occupied' : 'available',
          passengerName: occupied ? `Passenger ${Math.floor(Math.random() * 1000)}` : undefined,
          seatClass,
          row,
          column
        });
      });
    }
    
    return seats;
  };

  const [seats, setSeats] = useState<SeatData[]>(generateSeats());

  const getSeatColor = (seat: SeatData) => {
    if (seat.seatNumber === selectedSeat) return 'bg-cyan-500';
    
    switch (seat.status) {
      case 'available': 
        switch (seat.seatClass) {
          case 'first': return 'bg-purple-600';
          case 'business': return 'bg-blue-600';
          case 'economy': return 'bg-green-600';
          default: return 'bg-gray-600';
        }
      case 'occupied': return 'bg-red-500';
      case 'blocked': return 'bg-yellow-500';
      default: return 'bg-gray-600';
    }
  };

  const getSeatIcon = (seat: SeatData) => {
    switch (seat.status) {
      case 'available': return <User className="h-3 w-3" />;
      case 'occupied': return <UserCheck className="h-3 w-3" />;
      case 'blocked': return <UserX className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  const getClassCounts = () => {
    const occupied = seats.filter(s => s.status === 'occupied');
    return {
      first: occupied.filter(s => s.seatClass === 'first').length,
      business: occupied.filter(s => s.seatClass === 'business').length,
      economy: occupied.filter(s => s.seatClass === 'economy').length,
      total: occupied.length
    };
  };

  const counts = getClassCounts();

  const filteredSeats = seats.filter(seat => {
    const matchesPassenger = !passengerFilter || 
      (seat.passengerName && seat.passengerName.toLowerCase().includes(passengerFilter.toLowerCase()));
    const matchesClass = classFilter === 'all' || seat.seatClass === classFilter;
    return matchesPassenger && matchesClass;
  });

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2 text-cyan-400" />
              Dynamic Seating Chart
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-500/20 text-blue-400">
                {counts.total}/{mockConfiguration.totalSeats} Passengers
              </Badge>
              <Button size="sm" variant="outline" data-testid="button-refresh-seating">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Seating Chart */}
            <div className="lg:col-span-3">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-medium">Boeing 737-800 Seating Layout</h3>
                    <div className="flex space-x-4 text-sm">
                      <Input
                        placeholder="Search passenger..."
                        value={passengerFilter}
                        onChange={(e) => setPassengerFilter(e.target.value)}
                        className="w-48 bg-slate-600 border-slate-500 text-white text-sm"
                        data-testid="input-passenger-search"
                      />
                      <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger className="w-32 bg-slate-600 border-slate-500 text-white text-sm" data-testid="select-class-filter">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Classes</SelectItem>
                          <SelectItem value="first">First</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="economy">Economy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="space-y-1" data-testid="seating-chart">
                      {/* First Class */}
                      <div className="mb-4">
                        <div className="text-xs text-purple-400 mb-2 font-medium">FIRST CLASS</div>
                        <div className="space-y-1">
                          {[1, 2].map(row => (
                            <div key={row} className="flex items-center space-x-1">
                              <span className="text-xs text-slate-400 w-6">{row}</span>
                              <div className="flex space-x-1">
                                {['A', 'B'].map(col => {
                                  const seat = seats.find(s => s.seatNumber === `${row}${col}`);
                                  return seat && (classFilter === 'all' || seat.seatClass === classFilter) ? (
                                    <button
                                      key={`${row}${col}`}
                                      onClick={() => setSelectedSeat(seat.seatNumber)}
                                      className={`w-8 h-8 rounded ${getSeatColor(seat)} text-white text-xs hover:opacity-80 transition-opacity`}
                                      title={seat.passengerName || 'Available'}
                                      data-testid={`seat-${seat.seatNumber}`}
                                    >
                                      {getSeatIcon(seat)}
                                    </button>
                                  ) : null;
                                })}
                              </div>
                              <div className="w-4"></div>
                              <div className="flex space-x-1">
                                {['C', 'D'].map(col => {
                                  const seat = seats.find(s => s.seatNumber === `${row}${col}`);
                                  return seat && (classFilter === 'all' || seat.seatClass === classFilter) ? (
                                    <button
                                      key={`${row}${col}`}
                                      onClick={() => setSelectedSeat(seat.seatNumber)}
                                      className={`w-8 h-8 rounded ${getSeatColor(seat)} text-white text-xs hover:opacity-80 transition-opacity`}
                                      title={seat.passengerName || 'Available'}
                                      data-testid={`seat-${seat.seatNumber}`}
                                    >
                                      {getSeatIcon(seat)}
                                    </button>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Business Class */}
                      <div className="mb-4">
                        <div className="text-xs text-blue-400 mb-2 font-medium">BUSINESS CLASS</div>
                        <div className="space-y-1">
                          {[3, 4, 5, 6].map(row => (
                            <div key={row} className="flex items-center space-x-1">
                              <span className="text-xs text-slate-400 w-6">{row}</span>
                              <div className="flex space-x-1">
                                {['A', 'B', 'C'].map(col => {
                                  const seat = seats.find(s => s.seatNumber === `${row}${col}`);
                                  return seat && (classFilter === 'all' || seat.seatClass === classFilter) ? (
                                    <button
                                      key={`${row}${col}`}
                                      onClick={() => setSelectedSeat(seat.seatNumber)}
                                      className={`w-8 h-8 rounded ${getSeatColor(seat)} text-white text-xs hover:opacity-80 transition-opacity`}
                                      title={seat.passengerName || 'Available'}
                                      data-testid={`seat-${seat.seatNumber}`}
                                    >
                                      {getSeatIcon(seat)}
                                    </button>
                                  ) : null;
                                })}
                              </div>
                              <div className="w-4"></div>
                              <div className="flex space-x-1">
                                {['D', 'E', 'F'].map(col => {
                                  const seat = seats.find(s => s.seatNumber === `${row}${col}`);
                                  return seat && (classFilter === 'all' || seat.seatClass === classFilter) ? (
                                    <button
                                      key={`${row}${col}`}
                                      onClick={() => setSelectedSeat(seat.seatNumber)}
                                      className={`w-8 h-8 rounded ${getSeatColor(seat)} text-white text-xs hover:opacity-80 transition-opacity`}
                                      title={seat.passengerName || 'Available'}
                                      data-testid={`seat-${seat.seatNumber}`}
                                    >
                                      {getSeatIcon(seat)}
                                    </button>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Economy Class - Showing first few rows as example */}
                      <div>
                        <div className="text-xs text-green-400 mb-2 font-medium">ECONOMY CLASS</div>
                        <div className="space-y-1">
                          {[7, 8, 9, 10, 11, 12].map(row => (
                            <div key={row} className="flex items-center space-x-1">
                              <span className="text-xs text-slate-400 w-6">{row}</span>
                              <div className="flex space-x-1">
                                {['A', 'B', 'C'].map(col => {
                                  const seat = seats.find(s => s.seatNumber === `${row}${col}`);
                                  return seat && (classFilter === 'all' || seat.seatClass === classFilter) ? (
                                    <button
                                      key={`${row}${col}`}
                                      onClick={() => setSelectedSeat(seat.seatNumber)}
                                      className={`w-8 h-8 rounded ${getSeatColor(seat)} text-white text-xs hover:opacity-80 transition-opacity`}
                                      title={seat.passengerName || 'Available'}
                                      data-testid={`seat-${seat.seatNumber}`}
                                    >
                                      {getSeatIcon(seat)}
                                    </button>
                                  ) : null;
                                })}
                              </div>
                              <div className="w-4"></div>
                              <div className="flex space-x-1">
                                {['D', 'E', 'F'].map(col => {
                                  const seat = seats.find(s => s.seatNumber === `${row}${col}`);
                                  return seat && (classFilter === 'all' || seat.seatClass === classFilter) ? (
                                    <button
                                      key={`${row}${col}`}
                                      onClick={() => setSelectedSeat(seat.seatNumber)}
                                      className={`w-8 h-8 rounded ${getSeatColor(seat)} text-white text-xs hover:opacity-80 transition-opacity`}
                                      title={seat.passengerName || 'Available'}
                                      data-testid={`seat-${seat.seatNumber}`}
                                    >
                                      {getSeatIcon(seat)}
                                    </button>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Seat Information Panel */}
            <div className="space-y-4">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Occupancy Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-400">First Class</span>
                      <span className="text-white">{counts.first}/12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-400">Business</span>
                      <span className="text-white">{counts.business}/24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-400">Economy</span>
                      <span className="text-white">{counts.economy}/120</span>
                    </div>
                    <hr className="border-slate-600" />
                    <div className="flex justify-between items-center font-semibold">
                      <span className="text-white">Total Occupied</span>
                      <span className="text-cyan-400">{counts.total}/{mockConfiguration.totalSeats}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-600 rounded"></div>
                      <span className="text-slate-300">Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-slate-300">Occupied</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span className="text-slate-300">Blocked</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                      <span className="text-slate-300">Selected</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {selectedSeat && (
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Seat {selectedSeat}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const seat = seats.find(s => s.seatNumber === selectedSeat);
                      return seat ? (
                        <div className="space-y-3">
                          <div>
                            <p className="text-slate-300 text-sm">Class</p>
                            <Badge className={
                              seat.seatClass === 'first' ? 'bg-purple-500/20 text-purple-400' :
                              seat.seatClass === 'business' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-green-500/20 text-green-400'
                            }>
                              {seat.seatClass.toUpperCase()}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-slate-300 text-sm">Status</p>
                            <p className="text-white">{seat.status.replace('_', ' ').toUpperCase()}</p>
                          </div>
                          {seat.passengerName && (
                            <div>
                              <p className="text-slate-300 text-sm">Passenger</p>
                              <p className="text-white">{seat.passengerName}</p>
                            </div>
                          )}
                          <Button className="w-full bg-blue-600 hover:bg-blue-700" data-testid="button-modify-seat">
                            Modify Seat
                          </Button>
                        </div>
                      ) : null;
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}