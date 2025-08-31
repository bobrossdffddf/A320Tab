import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Plus } from "lucide-react";

interface AircraftConfigProps {
  onConfigSave?: (config: AircraftConfiguration) => void;
}

interface AircraftConfiguration {
  name: string;
  type: string;
  seatingLayout: {
    firstClass?: {
      rows: number;
      seatsPerRow: number;
      seatMap: string;
    };
    business?: {
      rows: number;
      seatsPerRow: number;
      seatMap: string;
    };
    economy: {
      rows: number;
      seatsPerRow: number;
      seatMap: string;
    };
  };
  servicePoints: Array<{
    type: string;
    position: string;
    status: string;
  }>;
}

export function AircraftConfig({ onConfigSave }: AircraftConfigProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<AircraftConfiguration>({
    name: "",
    type: "",
    seatingLayout: {
      economy: {
        rows: 30,
        seatsPerRow: 6,
        seatMap: "3-3"
      }
    },
    servicePoints: [
      { type: "door", position: "forward", status: "closed" },
      { type: "fuel", position: "wing", status: "disconnected" },
      { type: "catering", position: "forward", status: "disconnected" },
      { type: "baggage", position: "aft", status: "disconnected" }
    ]
  });

  const presets = [
    {
      name: "Boeing 737-800",
      type: "Boeing 737-800",
      seatingLayout: {
        firstClass: { rows: 2, seatsPerRow: 4, seatMap: "2-2" },
        economy: { rows: 30, seatsPerRow: 6, seatMap: "3-3" }
      }
    },
    {
      name: "Airbus A320",
      type: "Airbus A320",
      seatingLayout: {
        business: { rows: 3, seatsPerRow: 4, seatMap: "2-2" },
        economy: { rows: 27, seatsPerRow: 6, seatMap: "3-3" }
      }
    },
    {
      name: "Boeing 777-200ER",
      type: "Boeing 777-200ER",
      seatingLayout: {
        firstClass: { rows: 2, seatsPerRow: 8, seatMap: "2-2-2" },
        business: { rows: 5, seatsPerRow: 6, seatMap: "2-2-2" },
        economy: { rows: 35, seatsPerRow: 9, seatMap: "3-3-3" }
      }
    }
  ];

  const handlePresetSelect = (presetName: string) => {
    const preset = presets.find(p => p.name === presetName);
    if (preset) {
      setConfig({
        ...config,
        name: preset.name,
        type: preset.type,
        seatingLayout: preset.seatingLayout
      });
    }
  };

  const handleSave = () => {
    if (onConfigSave) {
      onConfigSave(config);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="button-aircraft-config">
          <Settings className="h-4 w-4 mr-2" />
          Configure Aircraft
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aircraft Configuration</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="aircraft-name">Aircraft Name</Label>
              <Input
                id="aircraft-name"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                placeholder="e.g., Boeing 737-800"
                data-testid="input-aircraft-name"
              />
            </div>
            <div>
              <Label htmlFor="aircraft-type">Aircraft Type</Label>
              <Input
                id="aircraft-type"
                value={config.type}
                onChange={(e) => setConfig({ ...config, type: e.target.value })}
                placeholder="e.g., Boeing 737-800"
                data-testid="input-aircraft-type"
              />
            </div>
          </div>

          {/* Presets */}
          <div>
            <Label>Load Preset Configuration</Label>
            <Select onValueChange={handlePresetSelect}>
              <SelectTrigger className="w-full mt-2" data-testid="select-aircraft-preset">
                <SelectValue placeholder="Choose a preset aircraft configuration" />
              </SelectTrigger>
              <SelectContent>
                {presets.map((preset) => (
                  <SelectItem key={preset.name} value={preset.name}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Seating Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seating Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* First Class */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>First Class Rows</Label>
                  <Input
                    type="number"
                    value={config.seatingLayout.firstClass?.rows || 0}
                    onChange={(e) => setConfig({
                      ...config,
                      seatingLayout: {
                        ...config.seatingLayout,
                        firstClass: {
                          ...config.seatingLayout.firstClass,
                          rows: parseInt(e.target.value) || 0,
                          seatsPerRow: config.seatingLayout.firstClass?.seatsPerRow || 4,
                          seatMap: config.seatingLayout.firstClass?.seatMap || "2-2"
                        }
                      }
                    })}
                    data-testid="input-first-class-rows"
                  />
                </div>
                <div>
                  <Label>Seats Per Row</Label>
                  <Input
                    type="number"
                    value={config.seatingLayout.firstClass?.seatsPerRow || 4}
                    onChange={(e) => setConfig({
                      ...config,
                      seatingLayout: {
                        ...config.seatingLayout,
                        firstClass: {
                          ...config.seatingLayout.firstClass,
                          rows: config.seatingLayout.firstClass?.rows || 0,
                          seatsPerRow: parseInt(e.target.value) || 4,
                          seatMap: config.seatingLayout.firstClass?.seatMap || "2-2"
                        }
                      }
                    })}
                    data-testid="input-first-class-seats"
                  />
                </div>
                <div>
                  <Label>Layout (e.g., 2-2)</Label>
                  <Input
                    value={config.seatingLayout.firstClass?.seatMap || "2-2"}
                    onChange={(e) => setConfig({
                      ...config,
                      seatingLayout: {
                        ...config.seatingLayout,
                        firstClass: {
                          ...config.seatingLayout.firstClass,
                          rows: config.seatingLayout.firstClass?.rows || 0,
                          seatsPerRow: config.seatingLayout.firstClass?.seatsPerRow || 4,
                          seatMap: e.target.value
                        }
                      }
                    })}
                    data-testid="input-first-class-layout"
                  />
                </div>
              </div>

              {/* Economy Class */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Economy Rows</Label>
                  <Input
                    type="number"
                    value={config.seatingLayout.economy.rows}
                    onChange={(e) => setConfig({
                      ...config,
                      seatingLayout: {
                        ...config.seatingLayout,
                        economy: {
                          ...config.seatingLayout.economy,
                          rows: parseInt(e.target.value) || 30
                        }
                      }
                    })}
                    data-testid="input-economy-rows"
                  />
                </div>
                <div>
                  <Label>Seats Per Row</Label>
                  <Input
                    type="number"
                    value={config.seatingLayout.economy.seatsPerRow}
                    onChange={(e) => setConfig({
                      ...config,
                      seatingLayout: {
                        ...config.seatingLayout,
                        economy: {
                          ...config.seatingLayout.economy,
                          seatsPerRow: parseInt(e.target.value) || 6
                        }
                      }
                    })}
                    data-testid="input-economy-seats"
                  />
                </div>
                <div>
                  <Label>Layout (e.g., 3-3)</Label>
                  <Input
                    value={config.seatingLayout.economy.seatMap}
                    onChange={(e) => setConfig({
                      ...config,
                      seatingLayout: {
                        ...config.seatingLayout,
                        economy: {
                          ...config.seatingLayout.economy,
                          seatMap: e.target.value
                        }
                      }
                    })}
                    data-testid="input-economy-layout"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              data-testid="button-cancel-config"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              data-testid="button-save-config"
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}