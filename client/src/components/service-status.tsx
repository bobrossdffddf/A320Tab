import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Fuel, 
  UtensilsCrossed, 
  Luggage, 
  Zap, 
  Plus 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { ServiceRequest } from "@shared/schema";

interface ServiceStatusProps {
  flightId?: string;
}

export function ServiceStatus({ flightId }: ServiceStatusProps) {
  const { data: services } = useQuery({
    queryKey: ["/api/flights", flightId, "services"],
    enabled: !!flightId,
  });

  const createServiceMutation = useMutation({
    mutationFn: async (serviceType: string) => {
      const response = await apiRequest(
        "POST",
        `/api/flights/${flightId}/services`,
        {
          serviceType,
          requestedBy: "Pilot",
          priority: "normal",
          notes: `Requested ${serviceType} service`,
        }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/flights", flightId, "services"] 
      });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ serviceId, status }: { serviceId: string; status: string }) => {
      const response = await apiRequest(
        "PATCH",
        `/api/services/${serviceId}`,
        { status }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/flights", flightId, "services"] 
      });
    },
  });

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case "fuel":
        return Fuel;
      case "catering":
        return UtensilsCrossed;
      case "baggage":
        return Luggage;
      case "ground_power":
        return Zap;
      default:
        return Fuel;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-chart-5";
      case "in_progress":
        return "text-accent";
      case "cancelled":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "COMPLETE";
      case "in_progress":
        return "IN PROGRESS";
      case "cancelled":
        return "CANCELLED";
      default:
        return "PENDING";
    }
  };

  const defaultServices = [
    { type: "fuel", name: "Fuel", status: "completed" },
    { type: "baggage", name: "Baggage", status: "in_progress" },
    { type: "catering", name: "Catering", status: "pending" },
    { type: "ground_power", name: "Ground Power", status: "completed" },
  ];

  const serviceData = services && Array.isArray(services) && services.length > 0 ? services : defaultServices;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold" data-testid="text-services-title">
          Services
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {Array.isArray(serviceData) ? serviceData.map((service: any, index: number) => {
          const IconComponent = getServiceIcon(service.serviceType || service.type);
          const status = service.status;
          const isInProgress = status === "in_progress";
          
          return (
            <div
              key={service.id || index}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                isInProgress 
                  ? "bg-accent/20 border border-accent" 
                  : "bg-muted"
              )}
              onClick={() => {
                if (service.id && status === "in_progress") {
                  updateServiceMutation.mutate({ 
                    serviceId: service.id, 
                    status: "completed" 
                  });
                }
              }}
              data-testid={`service-${service.serviceType || service.type}`}
            >
              <div className="flex items-center space-x-3">
                <IconComponent className={cn("h-5 w-5", getStatusColor(status))} />
                <span className="text-sm font-medium">
                  {service.name || service.serviceType}
                </span>
              </div>
              <Badge 
                variant="outline" 
                className={cn("text-xs", getStatusColor(status))}
              >
                {getStatusBadge(status)}
              </Badge>
            </div>
          );
        }) : null}
        
        <Button 
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => createServiceMutation.mutate("fuel")}
          disabled={!flightId || createServiceMutation.isPending}
          data-testid="button-request-service"
        >
          <Plus className="h-4 w-4 mr-2" />
          Request Service
        </Button>
      </CardContent>
    </Card>
  );
}
