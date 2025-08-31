import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/sidebar";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Radio, 
  Plane, 
  TowerControl,
  MapPin,
  Clock
} from "lucide-react";
import { useAircraft } from "@/hooks/use-aircraft";
import type { Flight } from "@shared/schema";

export default function ATCPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [selectedFrequency, setSelectedFrequency] = useState("121.9");

  const { data: flights } = useQuery({
    queryKey: ["/api/flights"],
  });

  const currentFlight = flights && Array.isArray(flights) ? flights[0] : undefined;
  const { aircraft } = useAircraft(currentFlight?.aircraftId);

  const frequencies = [
    { name: "Tower", freq: "121.9", active: true },
    { name: "Ground", freq: "121.7", active: false },
    { name: "Approach", freq: "119.1", active: false },
    { name: "Departure", freq: "120.9", active: false },
    { name: "ATIS", freq: "128.05", active: false },
  ];

  const [currentScenario, setCurrentScenario] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [score, setScore] = useState(0);
  const [scenarioComplete, setScenarioComplete] = useState(false);

  const trainingScenarios = [
    {
      id: 1,
      title: "Ground Control - Pushback Request",
      atcCall: "PTFS001, LAX Ground, pushback approved, face north, advise ready to taxi",
      correctResponse: "Pushback approved, face north, will advise ready to taxi, PTFS001",
      hints: ["Acknowledge pushback approval", "Confirm direction", "State you'll advise when ready"],
      explanation: "Always acknowledge pushback clearance and confirm the direction you'll be facing."
    },
    {
      id: 2,
      title: "Ground Control - Taxi Instructions",
      atcCall: "PTFS001, taxi to runway 24L via Alpha, Charlie, hold short of runway 24L",
      correctResponse: "Taxi to runway 24L via Alpha, Charlie, hold short 24L, PTFS001",
      hints: ["Repeat the runway", "Confirm the taxi route", "Acknowledge hold short instruction"],
      explanation: "Always read back runway assignments, taxi routes, and hold short instructions."
    },
    {
      id: 3,
      title: "Tower Control - Takeoff Clearance",
      atcCall: "PTFS001, runway 24L, cleared for takeoff, fly heading 240, contact departure 120.9",
      correctResponse: "Runway 24L, cleared for takeoff, heading 240, contact departure 120.9, PTFS001",
      hints: ["Confirm runway", "Acknowledge takeoff clearance", "Read back heading and frequency"],
      explanation: "Takeoff clearances must include runway confirmation and all assigned instructions."
    },
    {
      id: 4,
      title: "Emergency - Engine Failure on Takeoff",
      atcCall: "PTFS001, say intentions, emergency services standing by",
      correctResponse: "PTFS001 declaring emergency, engine failure, requesting immediate return to land runway 24L",
      hints: ["Declare emergency", "State the problem", "Request what you need"],
      explanation: "In emergencies, clearly state the nature of the problem and your intentions."
    },
    {
      id: 5,
      title: "Approach Control - Vectors to Final",
      atcCall: "PTFS001, turn left heading 180, descend and maintain 3000, expect vectors to ILS 24L approach",
      correctResponse: "Left heading 180, descend and maintain 3000, expect vectors ILS 24L, PTFS001",
      hints: ["Confirm the heading", "Read back altitude", "Acknowledge approach expectation"],
      explanation: "Vector instructions require precise readback of headings and altitudes."
    }
  ];

  const handleResponseSubmit = () => {
    const scenario = trainingScenarios[currentScenario];
    const responseWords = userResponse.toLowerCase().split(' ');
    const correctWords = scenario.correctResponse.toLowerCase().split(' ');
    
    // Simple scoring based on key words present
    let matches = 0;
    correctWords.forEach(word => {
      if (responseWords.some(userWord => userWord.includes(word) || word.includes(userWord))) {
        matches++;
      }
    });
    
    const scenarioScore = Math.round((matches / correctWords.length) * 100);
    setScore(prevScore => prevScore + scenarioScore);
    setScenarioComplete(true);
  };

  const nextScenario = () => {
    if (currentScenario < trainingScenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setUserResponse("");
      setScenarioComplete(false);
    }
  };

  const resetTraining = () => {
    setCurrentScenario(0);
    setUserResponse("");
    setScore(0);
    setScenarioComplete(false);
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
              <h1 className="text-2xl font-bold" data-testid="text-page-title">ATC Assistant</h1>
              <p className="text-muted-foreground">Air Traffic Control Communications</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-chart-5/20 text-chart-5 border-chart-5">
                <div className="w-2 h-2 bg-chart-5 rounded-full mr-2"></div>
                ATC ONLINE
              </Badge>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Radio Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Frequency Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Radio className="h-5 w-5 mr-2" />
                  Radio Frequencies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {frequencies.map((freq) => (
                  <div
                    key={freq.freq}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedFrequency === freq.freq
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedFrequency(freq.freq)}
                    data-testid={`freq-${freq.name.toLowerCase()}`}
                  >
                    <div>
                      <div className="font-medium">{freq.name}</div>
                      <div className="text-sm text-muted-foreground">{freq.freq} MHz</div>
                    </div>
                    {freq.active && (
                      <Badge variant="outline" className="bg-chart-5/20 text-chart-5">
                        ACTIVE
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Audio Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Audio Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Microphone</span>
                  <Button
                    variant={micEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMicEnabled(!micEnabled)}
                    data-testid="button-microphone"
                  >
                    {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Speakers</span>
                  <Button
                    variant={speakerEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSpeakerEnabled(!speakerEnabled)}
                    data-testid="button-speakers"
                  >
                    {speakerEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="75"
                    className="w-full"
                    data-testid="slider-volume"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Flight Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plane className="h-5 w-5 mr-2" />
                  Current Flight
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Callsign:</span>
                    <span className="font-mono">{currentFlight?.flightNumber || "PTFS001"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Aircraft:</span>
                    <span>{aircraft?.type || "Boeing 737-800"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Departure:</span>
                    <span>{currentFlight?.departureAirport || "KLAX"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Arrival:</span>
                    <span>{currentFlight?.arrivalAirport || "KJFK"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ATC Training Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scenario Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <TowerControl className="h-5 w-5 mr-2" />
                    ATC Training Simulator
                  </span>
                  <Badge variant="outline" className="font-mono">
                    Scenario {currentScenario + 1}/{trainingScenarios.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">{trainingScenarios[currentScenario].title}</h4>
                  <div className="bg-background border border-border rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <Badge variant="destructive" className="text-xs mr-2">ATC</Badge>
                      <span className="text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1 inline" />
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="font-mono text-sm">{trainingScenarios[currentScenario].atcCall}</p>
                  </div>
                </div>

                {!scenarioComplete ? (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Your Response:</label>
                    <textarea
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      placeholder="Type your radio response here..."
                      className="w-full p-3 border rounded-lg min-h-24 resize-none"
                      data-testid="textarea-atc-response"
                    />
                    <Button 
                      onClick={handleResponseSubmit}
                      disabled={!userResponse.trim()}
                      className="w-full"
                      data-testid="button-submit-response"
                    >
                      Submit Response
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Correct Response:</h4>
                      <p className="font-mono text-sm">{trainingScenarios[currentScenario].correctResponse}</p>
                    </div>
                    
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Explanation:</h4>
                      <p className="text-sm">{trainingScenarios[currentScenario].explanation}</p>
                    </div>

                    <div className="flex space-x-2">
                      {currentScenario < trainingScenarios.length - 1 ? (
                        <Button onClick={nextScenario} className="flex-1" data-testid="button-next-scenario">
                          Next Scenario
                        </Button>
                      ) : (
                        <Button onClick={resetTraining} className="flex-1" data-testid="button-restart-training">
                          Restart Training
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress & Tips Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Training Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-chart-5 mb-1">{score}</div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Points for this Scenario:</h4>
                  <ul className="space-y-1">
                    {trainingScenarios[currentScenario].hints.map((hint, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></div>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-medium text-sm">Standard Phraseology Reminders:</h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-muted rounded">
                      <strong>Always end with your callsign:</strong> "...PTFS001"
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <strong>Read back critical items:</strong> Runways, altitudes, headings
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <strong>Use standard terms:</strong> "Roger", "Wilco", "Unable"
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <strong>Keep it concise:</strong> Clear and brief communications
                    </div>
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