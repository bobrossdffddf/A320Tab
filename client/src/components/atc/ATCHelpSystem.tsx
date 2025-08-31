import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Headphones, 
  Send, 
  Clock,
  Radio,
  ArrowLeft,
  PhoneCall,
  MessageCircle
} from 'lucide-react';

interface ATCRequest {
  id: string;
  type: 'clearance' | 'taxi' | 'takeoff' | 'landing' | 'frequency_change' | 'weather';
  status: 'pending' | 'acknowledged' | 'approved' | 'denied';
  request: string;
  response?: string;
  timestamp: string;
  frequency?: string;
}

interface ATCController {
  position: string;
  frequency: string;
  controller: string;
  available: boolean;
}

const mockControllers: ATCController[] = [
  { position: 'Ground Control', frequency: '121.9', controller: 'ATC_Ground', available: true },
  { position: 'Tower', frequency: '119.1', controller: 'ATC_Tower', available: true },
  { position: 'Departure', frequency: '124.3', controller: 'ATC_Departure', available: false },
  { position: 'Approach', frequency: '125.7', controller: 'ATC_Approach', available: true }
];

const mockRequests: ATCRequest[] = [
  {
    id: '1',
    type: 'clearance',
    status: 'approved',
    request: 'PTFS001 requesting IFR clearance to KLAX',
    response: 'PTFS001 cleared to KLAX via GREKO3 departure, runway 24L, squawk 2347',
    timestamp: '14:25',
    frequency: '121.9'
  },
  {
    id: '2',
    type: 'taxi',
    status: 'pending',
    request: 'PTFS001 requesting taxi to runway 24L',
    timestamp: '14:28',
    frequency: '121.9'
  }
];

interface ATCHelpSystemProps {
  onBack: () => void;
}

export function ATCHelpSystem({ onBack }: ATCHelpSystemProps) {
  const [requests, setRequests] = useState(mockRequests);
  const [newRequest, setNewRequest] = useState('');
  const [selectedController, setSelectedController] = useState<ATCController | null>(null);
  const [activeFrequency, setActiveFrequency] = useState('121.9');

  const quickRequests = [
    { type: 'clearance', text: 'Requesting IFR clearance' },
    { type: 'taxi', text: 'Requesting taxi clearance' },
    { type: 'takeoff', text: 'Ready for takeoff' },
    { type: 'frequency_change', text: 'Request frequency change' },
    { type: 'weather', text: 'Request current weather' }
  ];

  const sendATCRequest = (requestText: string, type: string = 'clearance') => {
    const newATCRequest: ATCRequest = {
      id: Date.now().toString(),
      type: type as ATCRequest['type'],
      status: 'pending',
      request: requestText,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      frequency: activeFrequency
    };

    setRequests(prev => [...prev, newATCRequest]);
    setNewRequest('');

    // Log to server console
    console.log(`[ATC REQUEST] ${activeFrequency} - ${requestText}`);

    // Simulate ATC response after 2-5 seconds
    setTimeout(() => {
      setRequests(prev => prev.map(req => 
        req.id === newATCRequest.id 
          ? { 
              ...req, 
              status: 'acknowledged',
              response: getSimulatedResponse(type, requestText)
            }
          : req
      ));
    }, Math.random() * 3000 + 2000);
  };

  const getSimulatedResponse = (type: string, request: string): string => {
    const responses = {
      clearance: 'Cleared as filed, runway 24L, squawk 2347',
      taxi: 'Taxi to runway 24L via taxiway Alpha, hold short',
      takeoff: 'Cleared for takeoff runway 24L, fly heading 240',
      frequency_change: 'Contact departure 124.3, good day',
      weather: 'Wind 240 at 8, visibility 10, ceiling 2500 scattered'
    };
    return responses[type as keyof typeof responses] || 'Roger, standby';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'acknowledged': return 'bg-blue-500/20 text-blue-400';
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'denied': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
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
              ATC Communications
            </CardTitle>
            <Badge className="bg-cyan-500/20 text-cyan-400 flex items-center space-x-2">
              <Radio className="h-4 w-4" />
              <span>Active: {activeFrequency}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ATC Controllers Panel */}
            <div className="space-y-4">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Available Controllers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockControllers.map((controller, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        controller.frequency === activeFrequency 
                          ? 'bg-blue-500/20 border-blue-500/50' 
                          : 'bg-slate-600/50 border-slate-500 hover:bg-slate-600/70'
                      }`}
                      onClick={() => setActiveFrequency(controller.frequency)}
                      data-testid={`controller-${controller.position.toLowerCase().replace(' ', '-')}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">{controller.position}</p>
                          <p className="text-sm text-slate-300">{controller.frequency}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${controller.available ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          {controller.available && (
                            <PhoneCall className="h-4 w-4 text-green-400" />
                          )}
                        </div>
                      </div>
                      {controller.controller && (
                        <p className="text-xs text-slate-400 mt-1">{controller.controller}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quickRequests.map((quick, index) => (
                    <Button
                      key={index}
                      onClick={() => sendATCRequest(quick.text, quick.type)}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left"
                      data-testid={`quick-request-${quick.type}`}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {quick.text}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Communications Log */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-700/50 border-slate-600 h-96">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center">
                    <Headphones className="h-5 w-5 mr-2 text-cyan-400" />
                    Communications Log
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-col h-80">
                    {/* Messages Area */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {requests.map((request) => (
                          <div key={request.id} className="space-y-2">
                            {/* Request */}
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center space-x-2 text-xs">
                                <Badge className="bg-blue-500/20 text-blue-400">
                                  PILOT
                                </Badge>
                                <span className="text-slate-400">{request.frequency}</span>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span className="text-slate-400">{request.timestamp}</span>
                                </div>
                                <Badge className={getStatusColor(request.status)}>
                                  {request.status.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="bg-blue-600 text-white p-3 rounded-lg ml-auto max-w-xs">
                                <p className="text-sm">{request.request}</p>
                              </div>
                            </div>

                            {/* Response */}
                            {request.response && (
                              <div className="flex flex-col space-y-1">
                                <div className="flex items-center space-x-2 text-xs">
                                  <Badge className="bg-green-500/20 text-green-400">
                                    ATC
                                  </Badge>
                                  <span className="text-slate-400">{request.frequency}</span>
                                </div>
                                <div className="bg-slate-600 text-white p-3 rounded-lg max-w-xs">
                                  <p className="text-sm">{request.response}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    {/* Message Input */}
                    <div className="p-4 border-t border-slate-600">
                      <div className="flex space-x-2">
                        <Input
                          value={newRequest}
                          onChange={(e) => setNewRequest(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendATCRequest(newRequest)}
                          placeholder="Type your ATC request..."
                          className="flex-1 bg-slate-600 border-slate-500 text-white"
                          data-testid="input-atc-request"
                        />
                        <Button 
                          onClick={() => sendATCRequest(newRequest)}
                          disabled={!newRequest.trim()}
                          className="bg-blue-600 hover:bg-blue-700"
                          data-testid="button-send-atc-request"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        Connected to {activeFrequency} • Press Enter to send
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}