import { useQuery } from "@tanstack/react-query";
import type { Aircraft } from "@shared/schema";

export function useAircraft(aircraftId?: string) {
  const { data: aircraft, isLoading, error } = useQuery({
    queryKey: ["/api/aircraft", aircraftId],
    enabled: !!aircraftId,
  });

  return {
    aircraft: aircraft as Aircraft | undefined,
    isLoading,
    error,
  };
}
