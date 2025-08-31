import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { Checklist, ChecklistProgress } from "@shared/schema";

interface ChecklistPanelProps {
  flightId?: string;
  aircraftType?: string;
}

export function ChecklistPanel({ flightId, aircraftType }: ChecklistPanelProps) {
  const { data: checklists } = useQuery({
    queryKey: ["/api/checklists", { aircraftType }],
    enabled: !!aircraftType,
  });

  const { data: progress } = useQuery({
    queryKey: ["/api/flights", flightId, "checklist-progress"],
    enabled: !!flightId,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ checklistId, completedItems }: { checklistId: string; completedItems: string[] }) => {
      const response = await apiRequest(
        "POST",
        `/api/flights/${flightId}/checklist-progress`,
        { 
          checklistId, 
          completedItems,
          status: completedItems.length === getChecklistItems(checklistId).length ? "completed" : "in_progress"
        }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/flights", flightId, "checklist-progress"] 
      });
    },
  });

  const getChecklistItems = (checklistId: string) => {
    const checklist = checklists?.find((c: Checklist) => c.id === checklistId);
    return checklist?.items || [];
  };

  const getChecklistProgress = (checklistId: string) => {
    return progress?.find((p: ChecklistProgress) => p.checklistId === checklistId);
  };

  const getCompletedItems = (checklistId: string): string[] => {
    const checklistProgress = getChecklistProgress(checklistId);
    return checklistProgress?.completedItems || [];
  };

  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    const completedItems = getCompletedItems(checklistId);
    const newCompletedItems = completedItems.includes(itemId)
      ? completedItems.filter(id => id !== itemId)
      : [...completedItems, itemId];
    
    updateProgressMutation.mutate({ checklistId, completedItems: newCompletedItems });
  };

  const getChecklistStatus = (checklistId: string) => {
    const items = getChecklistItems(checklistId);
    const completed = getCompletedItems(checklistId);
    
    if (completed.length === 0) return "pending";
    if (completed.length === items.length) return "completed";
    return "in_progress";
  };

  const getCompletionPercentage = (checklistId: string) => {
    const items = getChecklistItems(checklistId);
    const completed = getCompletedItems(checklistId);
    return items.length > 0 ? (completed.length / items.length) * 100 : 0;
  };

  return (
    <div className="p-4 border-b border-border" data-testid="panel-checklists">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg font-semibold">Checklists</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 space-y-3">
        {checklists?.map((checklist: Checklist) => {
          const status = getChecklistStatus(checklist.id);
          const percentage = getCompletionPercentage(checklist.id);
          const items = getChecklistItems(checklist.id);
          const completedItems = getCompletedItems(checklist.id);
          
          return (
            <div
              key={checklist.id}
              className={cn(
                "p-3 rounded-lg border",
                status === "in_progress" 
                  ? "bg-accent/20 border-accent" 
                  : status === "completed"
                  ? "bg-chart-5/20 border-chart-5"
                  : "bg-muted border-border"
              )}
              data-testid={`checklist-${checklist.category}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{checklist.name}</span>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    status === "in_progress" && "text-accent border-accent",
                    status === "completed" && "text-chart-5 border-chart-5",
                    status === "pending" && "text-muted-foreground"
                  )}
                >
                  {status === "in_progress" ? "ACTIVE" : status.toUpperCase()}
                </Badge>
              </div>
              
              {status !== "pending" && (
                <div className="space-y-2">
                  <Progress value={percentage} className="h-1" />
                  <div className="space-y-1 text-xs">
                    {items.slice(0, 3).map((item: any) => (
                      <div 
                        key={item.id} 
                        className="flex items-center space-x-2 cursor-pointer hover:bg-background/50 p-1 rounded"
                        onClick={() => toggleChecklistItem(checklist.id, item.id)}
                        data-testid={`checklist-item-${item.id}`}
                      >
                        {completedItems.includes(item.id) ? (
                          <CheckCircle2 className="w-3 h-3 text-chart-5" />
                        ) : (
                          <Circle className="w-3 h-3 text-muted-foreground" />
                        )}
                        <span className={cn(
                          completedItems.includes(item.id) 
                            ? "text-muted-foreground line-through" 
                            : "text-foreground"
                        )}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <div className="text-muted-foreground text-xs">
                        +{items.length - 3} more items...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </div>
  );
}
