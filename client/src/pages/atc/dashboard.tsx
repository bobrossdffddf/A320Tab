import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Radio, 
  Plane,
  Users, 
  LogOut,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useATC24 } from '@/hooks/use-atc24';

export function ATCDashboard() {
  const { user, logout } = useAuth();
  const { aircraftList, controllers } = useATC24();
  const [activeTab, setActiveTab] = useState('traffic');

  const airborneAircraft = aircraftList.filter(aircraft => !aircraft.isOnGround);
  const groundedAircraft = aircraftList.filter(aircraft => aircraft.isOnGround);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Radio className="h-8 w-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">ATC Control Center</h1>
              <p className="text-slate-300">Air Traffic Control - {user?.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              ATC Controller
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
                  <p className="text-sm text-slate-400">Total Aircraft</p>
                  <p className="text-2xl font-bold text-white">{aircraftList.length}</p>
                </div>
                <Plane className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Airborne</p>
                  <p className="text-2xl font-bold text-white">{airborneAircraft.length}</p>
                </div>
                <Radio className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">On Ground</p>
                  <p className="text-2xl font-bold text-white">{groundedAircraft.length}</p>
                </div>
                <MapPin className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Controllers</p>
                  <p className="text-2xl font-bold text-white">{controllers.filter(c => c.holder).length}</p>
                </div>
                <Radio className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Plane className="h-5 w-5 mr-2 text-green-400" />
                Airborne Traffic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {airborneAircraft.map((aircraft) => (
                  <div key={aircraft.callsign} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                    <div>
                      <p className="font-medium text-white">{aircraft.callsign}</p>
                      <p className="text-sm text-slate-400">{aircraft.aircraftType}</p>
                      <p className="text-xs text-slate-500">Pilot: {aircraft.playerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white">{aircraft.altitude} ft</p>
                      <p className="text-xs text-slate-400">{aircraft.speed} kts</p>
                      <p className="text-xs text-slate-400">{aircraft.heading}°</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-orange-400" />
                Ground Traffic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {groundedAircraft.map((aircraft) => (
                  <div key={aircraft.callsign} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                    <div>
                      <p className="font-medium text-white">{aircraft.callsign}</p>
                      <p className="text-sm text-slate-400">{aircraft.aircraftType}</p>
                      <p className="text-xs text-slate-500">Pilot: {aircraft.playerName}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-orange-500/20 text-orange-400">
                        Ground
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}