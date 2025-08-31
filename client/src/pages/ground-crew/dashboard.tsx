import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wrench, 
  MessageSquare, 
  Truck,
  Users, 
  LogOut,
  Clock,
  CheckCircle,
  AlertTriangle,
  Fuel,
  UtensilsCrossed
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useATC24 } from '@/hooks/use-atc24';

export function GroundCrewDashboard() {
  const { user, logout } = useAuth();
  const { aircraftList } = useATC24();
  const [activeTab, setActiveTab] = useState('services');

  const groundedAircraft = aircraftList.filter(aircraft => aircraft.isOnGround);
  
  const mockServices = [
    { id: 1, type: 'fuel', aircraft: 'N123AB', status: 'in_progress', priority: 'high', eta: '10 min' },
    { id: 2, type: 'catering', aircraft: 'DL456', status: 'pending', priority: 'normal', eta: '15 min' },
    { id: 3, type: 'baggage', aircraft: 'UA789', status: 'completed', priority: 'normal', eta: 'Complete' },
    { id: 4, type: 'maintenance', aircraft: 'AA321', status: 'pending', priority: 'urgent', eta: '30 min' },
  ];

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'fuel': return <Fuel className="h-4 w-4" />;
      case 'catering': return <UtensilsCrossed className="h-4 w-4" />;
      case 'baggage': return <Truck className="h-4 w-4" />;
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Wrench className="h-8 w-8 text-green-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Ground Operations Control</h1>
              <p className="text-slate-300">Welcome back, {user?.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-green-400 border-green-400">
              Ground Crew
            </Badge>
            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Aircraft on Ground</p>
                  <p className="text-2xl font-bold text-white">{groundedAircraft.length}</p>
                </div>
                <Truck className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Services</p>
                  <p className="text-2xl font-bold text-white">{mockServices.filter(s => s.status === 'in_progress').length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Pending Tasks</p>
                  <p className="text-2xl font-bold text-white">{mockServices.filter(s => s.status === 'pending').length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Completed</p>
                  <p className="text-2xl font-bold text-white">{mockServices.filter(s => s.status === 'completed').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Active Service Requests</CardTitle>
            <CardDescription className="text-slate-300">
              Manage ground services for aircraft
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-slate-600 rounded">
                      {getServiceIcon(service.type)}
                    </div>
                    <div>
                      <p className="font-medium text-white capitalize">{service.type} Service</p>
                      <p className="text-sm text-slate-400">Aircraft: {service.aircraft}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={`${service.priority === 'urgent' ? 'bg-red-500/20 text-red-400' : service.priority === 'high' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {service.priority}
                    </Badge>
                    <Badge className={`${service.status === 'completed' ? 'bg-green-500/20 text-green-400' : service.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {service.status}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm text-white">{service.eta}</p>
                      <p className="text-xs text-slate-400">ETA</p>
                    </div>
                    <Button size="sm" variant="outline">
                      {service.status === 'pending' ? 'Start' : service.status === 'in_progress' ? 'Complete' : 'View'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}