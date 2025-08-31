import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ClipboardCheck, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
  PlayCircle,
  PauseCircle
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  critical: boolean;
  notes?: string;
}

interface Checklist {
  id: string;
  name: string;
  category: 'cockpit_prep' | 'before_start' | 'engine_start' | 'taxi' | 'before_takeoff' | 'after_landing';
  status: 'pending' | 'in_progress' | 'completed';
  items: ChecklistItem[];
}

const mockChecklists: Checklist[] = [
  {
    id: '1',
    name: 'Cockpit Preparation',
    category: 'cockpit_prep',
    status: 'completed',
    items: [
      { id: '1a', text: 'Circuit breakers - CHECK', completed: true, critical: true },
      { id: '1b', text: 'External power - CONNECT', completed: true, critical: false },
      { id: '1c', text: 'Battery switch - ON', completed: true, critical: true },
      { id: '1d', text: 'Navigation lights - ON', completed: true, critical: false }
    ]
  },
  {
    id: '2',
    name: 'Before Start',
    category: 'before_start',
    status: 'in_progress',
    items: [
      { id: '2a', text: 'Fuel quantity - CHECK', completed: true, critical: true },
      { id: '2b', text: 'Flight controls - FREE AND CORRECT', completed: true, critical: true },
      { id: '2c', text: 'Flight instruments - CHECK', completed: false, critical: true },
      { id: '2d', text: 'Radios and transponder - SET', completed: false, critical: false },
      { id: '2e', text: 'Autopilot - DISCONNECT', completed: false, critical: true }
    ]
  },
  {
    id: '3',
    name: 'Engine Start',
    category: 'engine_start',
    status: 'pending',
    items: [
      { id: '3a', text: 'Area clear - CHECK', completed: false, critical: true },
      { id: '3b', text: 'Engine start switch - START', completed: false, critical: true },
      { id: '3c', text: 'Oil pressure - CHECK', completed: false, critical: true },
      { id: '3d', text: 'Engine parameters - NORMAL', completed: false, critical: true }
    ]
  }
];

interface ProfessionalChecklistProps {
  onBack: () => void;
}

export function ProfessionalChecklist({ onBack }: ProfessionalChecklistProps) {
  const [checklists, setChecklists] = useState(mockChecklists);
  const [activeChecklist, setActiveChecklist] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(prev => prev.map(checklist => {
      if (checklist.id === checklistId) {
        const updatedItems = checklist.items.map(item => 
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        
        const completedCount = updatedItems.filter(item => item.completed).length;
        const totalCount = updatedItems.length;
        
        let newStatus: 'pending' | 'in_progress' | 'completed';
        if (completedCount === 0) {
          newStatus = 'pending';
        } else if (completedCount === totalCount) {
          newStatus = 'completed';
        } else {
          newStatus = 'in_progress';
        }
        
        return { ...checklist, items: updatedItems, status: newStatus };
      }
      return checklist;
    }));
  };

  const startChecklist = (checklistId: string) => {
    setActiveChecklist(checklistId);
    setIsRunning(true);
  };

  const getProgress = (checklist: Checklist) => {
    const completed = checklist.items.filter(item => item.completed).length;
    return (completed / checklist.items.length) * 100;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cockpit_prep': return '🛠️';
      case 'before_start': return '🔋';
      case 'engine_start': return '🚁';
      case 'taxi': return '🛣️';
      case 'before_takeoff': return '🛫';
      case 'after_landing': return '🛬';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-500/20 text-gray-400';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const activeChecklistData = activeChecklist ? checklists.find(c => c.id === activeChecklist) : null;

  return (
    <div className="space-y-6">
      {!activeChecklist ? (
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
                Professional Checklists
              </CardTitle>
              <Badge className="bg-cyan-500/20 text-cyan-400">
                Boeing 737-800
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {checklists.map((checklist) => (
                <Card key={checklist.id} className="bg-slate-700/50 border-slate-600 hover:bg-slate-700/70 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getCategoryIcon(checklist.category)}</span>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{checklist.name}</h3>
                            <p className="text-sm text-slate-400">{checklist.category.replace('_', ' ').toUpperCase()}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(checklist.status)}>
                          {checklist.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Progress</span>
                          <span className="text-white">
                            {checklist.items.filter(item => item.completed).length}/{checklist.items.length}
                          </span>
                        </div>
                        <Progress value={getProgress(checklist)} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">
                          {checklist.items.filter(item => item.critical).length} critical items
                        </div>
                        <Button 
                          onClick={() => startChecklist(checklist.id)}
                          size="sm"
                          className={checklist.status === 'completed' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'}
                          data-testid={`button-start-checklist-${checklist.id}`}
                        >
                          {checklist.status === 'completed' ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Review
                            </>
                          ) : (
                            <>
                              <PlayCircle className="h-4 w-4 mr-2" />
                              {checklist.status === 'in_progress' ? 'Continue' : 'Start'}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : activeChecklistData && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white flex items-center">
                <Button 
                  onClick={() => setActiveChecklist(null)}
                  variant="ghost" 
                  size="sm" 
                  className="mr-4 text-slate-400 hover:text-white"
                  data-testid="button-back-to-list"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                {activeChecklistData.name}
              </CardTitle>
              <div className="flex items-center space-x-4">
                <Badge className={getStatusColor(activeChecklistData.status)}>
                  {activeChecklistData.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <Button
                  onClick={() => setIsRunning(!isRunning)}
                  size="sm"
                  variant="outline"
                  data-testid="button-toggle-checklist"
                >
                  {isRunning ? (
                    <>
                      <PauseCircle className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Resume
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Checklist Progress</span>
                  <span className="text-white">
                    {activeChecklistData.items.filter(item => item.completed).length}/{activeChecklistData.items.length}
                  </span>
                </div>
                <Progress value={getProgress(activeChecklistData)} className="h-3" />
              </div>
              
              <div className="space-y-3">
                {activeChecklistData.items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`p-4 rounded-lg border transition-colors ${
                      item.completed 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : item.critical 
                          ? 'bg-red-500/10 border-red-500/30' 
                          : 'bg-slate-700/50 border-slate-600'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-slate-400 w-6">{index + 1}.</span>
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={() => toggleChecklistItem(activeChecklistData.id, item.id)}
                          className="border-slate-500"
                          data-testid={`checkbox-item-${item.id}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className={`text-white ${item.completed ? 'line-through opacity-60' : ''}`}>
                            {item.text}
                          </p>
                          {item.critical && (
                            <AlertTriangle className="h-4 w-4 text-red-400" title="Critical item" />
                          )}
                        </div>
                        {item.notes && (
                          <p className="text-sm text-slate-400 mt-1">{item.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.completed && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                        {item.critical && (
                          <Badge variant="outline" className="text-red-400 border-red-400 text-xs">
                            CRITICAL
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {activeChecklistData.status === 'completed' && (
                <div className="text-center p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Checklist Complete!</h3>
                  <p className="text-slate-300">All items have been verified. You may proceed to the next checklist.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}