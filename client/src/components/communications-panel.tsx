import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";
import type { Communication } from "@shared/schema";

interface CommunicationsPanelProps {
  flightId?: string;
}

export function CommunicationsPanel({ flightId }: CommunicationsPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  const [sender] = useState("Pilot"); // This would come from user context
  const [senderRole] = useState("pilot");

  const { data: communications, refetch } = useQuery({
    queryKey: ["/api/flights", flightId, "communications"],
    enabled: !!flightId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest(
        "POST",
        `/api/flights/${flightId}/communications`,
        {
          sender,
          senderRole,
          message,
        }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/flights", flightId, "communications"] 
      });
      setNewMessage("");
    },
  });

  // WebSocket for real-time messages
  const { sendMessage, lastMessage } = useWebSocket(flightId);

  useEffect(() => {
    if (lastMessage?.type === "new_message") {
      refetch();
    }
  }, [lastMessage, refetch]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !flightId) return;
    
    // Send via WebSocket for real-time updates
    sendMessage({
      type: "send_message",
      flightId,
      sender,
      senderRole,
      message: newMessage.trim(),
    });
    
    // Also send via API for persistence
    sendMessageMutation.mutate(newMessage.trim());
  };

  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: false 
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "pilot":
        return "text-accent";
      case "ground_control":
        return "text-chart-2";
      case "catering":
        return "text-chart-3";
      case "fuel":
        return "text-chart-4";
      case "baggage":
        return "text-chart-5";
      default:
        return "text-foreground";
    }
  };

  const isOwnMessage = (communication: Communication) => {
    return communication.sender === sender;
  };

  return (
    <div className="flex-1 flex flex-col p-4" data-testid="panel-communications">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Ground Crew Chat</CardTitle>
          <div className="flex items-center space-x-2">
            <Circle className="w-2 h-2 text-chart-5 fill-current" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
      </CardHeader>
      
      {/* Chat Messages */}
      <ScrollArea className="flex-1 mb-4" data-testid="container-chat-messages">
        <div className="space-y-3">
          {communications && Array.isArray(communications) ? communications.map((communication: Communication) => (
            <div
              key={communication.id}
              className={cn(
                "chat-bubble rounded-lg p-3",
                isOwnMessage(communication)
                  ? "bg-accent/20 ml-8"
                  : "bg-muted"
              )}
              data-testid={`message-${communication.id}`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className={cn("text-xs font-medium", getRoleColor(communication.senderRole))}>
                  {communication.sender}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatTime(communication.timestamp!)}
                </span>
              </div>
              <p className="text-sm">{communication.message}</p>
            </div>
          )) : null}
        </div>
      </ScrollArea>
      
      {/* Chat Input */}
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
          disabled={!flightId}
          data-testid="input-chat-message"
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={!newMessage.trim() || !flightId || sendMessageMutation.isPending}
          data-testid="button-send-message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
