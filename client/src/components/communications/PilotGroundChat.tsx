import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  MessageSquare, 
  User, 
  Wrench,
  Headphones,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface ChatMessage {
  id: string;
  sender: string;
  senderRole: 'pilot' | 'ground_crew' | 'atc';
  message: string;
  timestamp: string;
  recipient?: string;
}

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'Captain Smith',
    senderRole: 'pilot',
    message: 'Ready for pushback clearance when you are',
    timestamp: '14:32',
  },
  {
    id: '2',
    sender: 'Ground Control',
    senderRole: 'ground_crew',
    message: 'Fuel truck is on the way, ETA 5 minutes',
    timestamp: '14:33',
  },
  {
    id: '3',
    sender: 'Baggage Team',
    senderRole: 'ground_crew',
    message: 'All bags loaded, cargo door secured',
    timestamp: '14:35',
  },
  {
    id: '4',
    sender: 'Captain Smith',
    senderRole: 'pilot',
    message: 'Thank you, passengers are boarded. Requesting ground power disconnect',
    timestamp: '14:36',
  }
];

interface PilotGroundChatProps {
  flightId?: string;
}

export function PilotGroundChat({ flightId }: PilotGroundChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: user.username,
      senderRole: user.role as 'pilot' | 'ground_crew' | 'atc',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Log to server console
    console.log(`[CHAT] ${user.role.toUpperCase()} ${user.username}: ${newMessage}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'pilot': return <User className="h-4 w-4" />;
      case 'ground_crew': return <Wrench className="h-4 w-4" />;
      case 'atc': return <Headphones className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'pilot': return 'bg-blue-500/20 text-blue-400';
      case 'ground_crew': return 'bg-green-500/20 text-green-400';
      case 'atc': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 h-96">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-cyan-400" />
            Pilot ↔ Ground Crew Communications
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm text-slate-300">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col h-80">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleBadgeColor(msg.senderRole)}>
                      <div className="flex items-center space-x-1">
                        {getRoleIcon(msg.senderRole)}
                        <span className="text-xs">{msg.senderRole.replace('_', ' ').toUpperCase()}</span>
                      </div>
                    </Badge>
                    <span className="text-sm font-medium text-white">{msg.sender}</span>
                    <div className="flex items-center space-x-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    msg.sender === user?.username 
                      ? 'bg-blue-600 text-white ml-auto' 
                      : 'bg-slate-700 text-slate-100'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Message Input */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-slate-700 border-slate-600 text-white"
                disabled={!isConnected}
                data-testid="input-chat-message"
              />
              <Button 
                onClick={sendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Press Enter to send • Messages are logged to server console
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}