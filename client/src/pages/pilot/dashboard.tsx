import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plane, 
  MessageSquare, 
  ClipboardCheck, 
  Users, 
  LogOut,
  Radio,
  Gauge,
  MapPin,
  Navigation,
  Headphones
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useATC24 } from '@/hooks/use-atc24';
import { FlightPlanSelector } from '@/components/flight-planning/FlightPlanSelector';
import { PilotGroundChat } from '@/components/communications/PilotGroundChat';
import { DynamicSeatingChart } from '@/components/seating/DynamicSeatingChart';
import { ProfessionalChecklist } from '@/components/checklists/ProfessionalChecklist';
import { ATCHelpSystem } from '@/components/atc/ATCHelpSystem';

export function PilotDashboard() {
  const { user, logout } = useAuth();
  const { aircraftList, controllers } = useATC24();
  const [activeView, setActiveView] = useState<'dashboard' | 'flight-plan' | 'chat' | 'seating' | 'checklist' | 'atc'>('dashboard');
  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  const handleFlightSelection = (flight: any) => {
    setSelectedFlight(flight);
    setActiveView('dashboard');
  };

  if (activeView === 'flight-plan') {
    return <FlightPlanSelector onSelectFlight={handleFlightSelection} />;
  }

  if (activeView === 'chat') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <PilotGroundChat flightId={selectedFlight?.id} />
          <Button 
            onClick={() => setActiveView('dashboard')}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
            data-testid="button-back-to-dashboard"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (activeView === 'seating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <DynamicSeatingChart flightId={selectedFlight?.id} />
          <Button 
            onClick={() => setActiveView('dashboard')}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
            data-testid="button-back-to-dashboard"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (activeView === 'checklist') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <ProfessionalChecklist onBack={() => setActiveView('dashboard')} />
        </div>
      </div>
    );
  }

  if (activeView === 'atc') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <ATCHelpSystem onBack={() => setActiveView('dashboard')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Plane className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">PTFS Pilot Operations</h1>
              <p className="text-slate-300">Welcome back, {user?.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-green-400 border-green-400">
              Pilot
            </Badge>
            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Radio className="h-5 w-5 mr-2 text-green-400" />
              Live Aircraft Feed - PTFS Network
            </CardTitle>
            <CardDescription className="text-slate-300">
              Real-time aircraft data from ATC24
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aircraftList.slice(0, 6).map((aircraft) => (
                <Card key={aircraft.callsign} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-white">{aircraft.callsign}</h3>
                        <Badge 
                          variant={aircraft.isOnGround ? "secondary" : "default"}
                          className={aircraft.isOnGround ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"}
                        >
                          {aircraft.isOnGround ? 'Ground' : 'Airborne'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-300">{aircraft.aircraftType}</p>
                      <p className="text-sm text-slate-400">Pilot: {aircraft.playerName}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center text-slate-300">
                            <Gauge className="h-3 w-3 mr-1" />
                            {aircraft.altitude} ft
                          </div>
                          <div className="text-slate-400">{aircraft.speed} kts</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-slate-300">{aircraft.heading}°</div>
                          <div className="text-slate-400">{aircraft.wind}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Flight Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => setActiveView('flight-plan')}
                className="w-full bg-cyan-600 hover:bg-cyan-700" 
                size="lg"
                data-testid="button-flight-plan"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Flight Planning
              </Button>
              <Button 
                onClick={() => setActiveView('chat')}
                className="w-full bg-blue-600 hover:bg-blue-700" 
                size="lg"
                data-testid="button-ground-chat"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Ground Crew
              </Button>
              <Button 
                onClick={() => setActiveView('checklist')}
                className="w-full bg-green-600 hover:bg-green-700" 
                size="lg"
                data-testid="button-checklist"
              >
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Pre-flight Checklist
              </Button>
              <Button 
                onClick={() => setActiveView('seating')}
                className="w-full bg-purple-600 hover:bg-purple-700" 
                size="lg"
                data-testid="button-seating"
              >
                <Users className="h-4 w-4 mr-2" />
                Passenger Seating
              </Button>
              <Button 
                onClick={() => setActiveView('atc')}
                className="w-full bg-orange-600 hover:bg-orange-700" 
                size="lg"
                data-testid="button-atc"
              >
                <Headphones className="h-4 w-4 mr-2" />
                ATC Communications
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Active ATC Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {controllers.map((controller, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                    <div>
                      <p className="text-sm font-medium text-white">{controller.airport} {controller.position}</p>
                      <p className="text-xs text-slate-400">{controller.holder || 'Available'}</p>
                    </div>
                    <Badge 
                      variant={controller.holder ? "default" : "secondary"}
                      className={controller.holder ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}
                    >
                      {controller.holder ? 'Active' : 'Open'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-slate-700/30 rounded">
                  <p className="text-sm text-white">Ground Crew</p>
                  <p className="text-xs text-slate-300">Aircraft ready for boarding</p>
                  <p className="text-xs text-slate-500">2 min ago</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded">
                  <p className="text-sm text-white">Fuel Service</p>
                  <p className="text-xs text-slate-300">Fueling complete - 15,000 lbs</p>
                  <p className="text-xs text-slate-500">5 min ago</p>
                </div>
                <Button className="w-full" variant="outline">
                  View All Messages
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}