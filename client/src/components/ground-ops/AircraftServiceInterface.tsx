import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Fuel, 
  Truck, 
  Users, 
  Package, 
  Zap, 
  DoorOpen,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface ServicePoint {
  id: string;
  type: 'fuel' | 'catering' | 'baggage' | 'ground_power' | 'cargo_door' | 'jetbridge' | 'pushback';
  label: string;
  status: 'available' | 'requested' | 'in_progress' | 'completed';
  position: { x: number; y: number };
  estimatedTime?: number;
  progress?: number;
}

interface Aircraft {
  registration: string;
  type: string;
  gate: string;
  fuelLevel: number;
  passengerCount: number;
  cargoWeight: number;
}

const mockAircraft: Aircraft = {
  registration: 'N737AB',
  type: 'Boeing 737-800',
  gate: 'A12',
  fuelLevel: 75,
  passengerCount: 156,
  cargoWeight: 2500
};

const mockServicePoints: ServicePoint[] = [
  { id: 'fuel', type: 'fuel', label: 'Fuel Truck', status: 'in_progress', position: { x: 15, y: 65 }, progress: 65 },
  { id: 'catering1', type: 'catering', label: 'Catering Truck', status: 'completed', position: { x: 75, y: 35 } },
  { id: 'catering2', type: 'catering', label: 'Aft Catering', status: 'requested', position: { x: 75, y: 75 } },
  { id: 'baggage1', type: 'baggage', label: 'Baggage Truck', status: 'available', position: { x: 85, y: 85 } },
  { id: 'baggage2', type: 'baggage', label: 'Baggage Truck', status: 'available', position: { x: 85, y: 15 } },
  { id: 'ground_power', type: 'ground_power', label: 'Ground Power Unit', status: 'completed', position: { x: 25, y: 35 } },
  { id: 'jetbridge', type: 'jetbridge', label: 'Jet Bridge', status: 'completed', position: { x: 10, y: 45 } },
  { id: 'cargo_door', type: 'cargo_door', label: 'Cargo Door', status: 'available', position: { x: 60, y: 85 } },
  { id: 'pushback', type: 'pushback', label: 'Pushback Tug', status: 'available', position: { x: 5, y: 55 } }
];

interface AircraftServiceInterfaceProps {
  onBack: () => void;
}

export function AircraftServiceInterface({ onBack }: AircraftServiceInterfaceProps) {
  const [servicePoints, setServicePoints] = useState(mockServicePoints);
  const [selectedService, setSelectedService] = useState<ServicePoint | null>(null);

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'fuel': return <Fuel className="h-4 w-4" />;
      case 'catering': return <Package className="h-4 w-4" />;
      case 'baggage': return <Truck className="h-4 w-4" />;
      case 'ground_power': return <Zap className="h-4 w-4" />;
      case 'cargo_door': return <DoorOpen className="h-4 w-4" />;
      case 'jetbridge': return <Users className="h-4 w-4" />;
      case 'pushback': return <ArrowLeft className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-gray-500';
      case 'requested': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500 animate-pulse';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const requestService = (serviceId: string) => {
    setServicePoints(prev => 
      prev.map(point => 
        point.id === serviceId 
          ? { ...point, status: 'requested' as const }
          : point
      )
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center">
              <Button 
                onClick={onBack}
                variant="ghost" 
                size="sm" 
                className="mr-4 text-slate-400 hover:text-white"
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              Ground Services - {mockAircraft.registration}
            </CardTitle>
            <Badge className="bg-cyan-500/20 text-cyan-400">
              Gate {mockAircraft.gate}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Aircraft Diagram */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{mockAircraft.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-96 bg-slate-800 rounded-lg overflow-hidden" data-testid="aircraft-diagram">
                    {/* Aircraft Silhouette */}
                    <svg
                      viewBox="0 0 400 200"
                      className="absolute inset-0 w-full h-full"
                      style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))' }}
                    >
                      {/* Fuselage */}
                      <ellipse cx="200" cy="100" rx="150" ry="20" fill="#374151" stroke="#6B7280" strokeWidth="2"/>
                      {/* Wings */}
                      <ellipse cx="200" cy="100" rx="180" ry="8" fill="#374151" stroke="#6B7280" strokeWidth="2"/>
                      {/* Tail */}
                      <polygon points="50,100 30,90 30,110" fill="#374151" stroke="#6B7280" strokeWidth="2"/>
                      <polygon points="45,80 25,70 35,90" fill="#374151" stroke="#6B7280" strokeWidth="2"/>
                      {/* Engines */}
                      <ellipse cx="160" cy="120" rx="15" ry="8" fill="#374151" stroke="#6B7280" strokeWidth="2"/>
                      <ellipse cx="240" cy="120" rx="15" ry="8" fill="#374151" stroke="#6B7280" strokeWidth="2"/>
                    </svg>
                    
                    {/* Service Points */}
                    {servicePoints.map((point) => (
                      <button
                        key={point.id}
                        onClick={() => setSelectedService(point)}
                        className={`absolute w-6 h-6 rounded-full border-2 border-white ${getStatusColor(point.status)} hover:scale-110 transition-transform`}
                        style={{ 
                          left: `${point.position.x}%`, 
                          top: `${point.position.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        data-testid={`service-point-${point.id}`}
                      >
                        {point.status === 'in_progress' && point.progress && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {point.progress}%
                          </div>
                        )}
                      </button>
                    ))}
                    
                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-slate-900/80 p-3 rounded">
                      <h4 className="text-white text-sm font-medium mb-2">Service Status</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                          <span className="text-slate-300">Available</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span className="text-slate-300">Requested</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-slate-300">In Progress</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-slate-300">Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Service Details Panel */}
            <div className="space-y-4">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Aircraft Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Fuel Level</span>
                      <span className="text-white">{mockAircraft.fuelLevel}%</span>
                    </div>
                    <Progress value={mockAircraft.fuelLevel} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-300">Passengers</p>
                      <p className="text-white font-semibold">{mockAircraft.passengerCount}</p>
                    </div>
                    <div>
                      <p className="text-slate-300">Cargo</p>
                      <p className="text-white font-semibold">{mockAircraft.cargoWeight} lbs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {selectedService && (
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center">
                      {getServiceIcon(selectedService.type)}
                      <span className="ml-2">{selectedService.label}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Badge className={getStatusColor(selectedService.status).replace('bg-', 'bg-') + '/20 text-white'}>
                      {selectedService.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    
                    {selectedService.status === 'in_progress' && selectedService.progress && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">Progress</span>
                          <span className="text-white">{selectedService.progress}%</span>
                        </div>
                        <Progress value={selectedService.progress} className="h-2" />
                      </div>
                    )}
                    
                    {selectedService.estimatedTime && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">ETA: {selectedService.estimatedTime} min</span>
                      </div>
                    )}
                    
                    {selectedService.status === 'available' && (
                      <Button 
                        onClick={() => requestService(selectedService.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        data-testid={`button-request-service-${selectedService.id}`}
                      >
                        Request Service
                      </Button>
                    )}
                    
                    {selectedService.status === 'requested' && (
                      <div className="text-center">
                        <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-yellow-400 text-sm">Service requested</p>
                        <p className="text-slate-400 text-xs">Waiting for crew assignment</p>
                      </div>
                    )}
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