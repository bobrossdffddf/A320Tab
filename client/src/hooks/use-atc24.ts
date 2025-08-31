import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface ATC24Aircraft {
  [callsign: string]: {
    heading: number;
    playerName: string;
    altitude: number;
    aircraftType: string;
    position: { y: number; x: number };
    speed: number;
    wind: string;
    isOnGround?: boolean;
    groundSpeed: number;
  };
}

export interface ATC24Controller {
  holder: string | null;
  claimable: boolean;
  airport: string;
  position: string;
  queue: string[];
}

export function useATC24() {
  const [aircraftData, setAircraftData] = useState<ATC24Aircraft>({});
  const [controllers, setControllers] = useState<ATC24Controller[]>([]);

  // Fetch initial data
  const { data: initialAircraft } = useQuery({
    queryKey: ['/api/atc24/aircraft'],
    refetchInterval: 3000, // Poll every 3 seconds as recommended
  });

  const { data: initialControllers } = useQuery({
    queryKey: ['/api/atc24/controllers'],
    refetchInterval: 6000, // Poll every 6 seconds as recommended
  });

  useEffect(() => {
    if (initialAircraft) {
      setAircraftData(initialAircraft);
    }
  }, [initialAircraft]);

  useEffect(() => {
    if (initialControllers) {
      setControllers(initialControllers);
    }
  }, [initialControllers]);

  // Convert aircraft data to array for easier use
  const aircraftList = Object.entries(aircraftData).map(([callsign, data]) => ({
    callsign,
    ...data,
  }));

  return {
    aircraftData,
    aircraftList,
    controllers,
    isConnected: true, // We'll implement real-time status later
  };
}