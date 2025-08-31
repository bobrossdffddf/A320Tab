import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { LoginPage } from "@/components/auth/login-page";
import { PilotDashboard } from "@/pages/pilot/dashboard";
import { GroundCrewDashboard } from "@/pages/ground-crew/dashboard";
import { ATCDashboard } from "@/pages/atc/dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Route based on user role
  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'ground_crew':
        return GroundCrewDashboard;
      case 'atc':
        return ATCDashboard;
      case 'pilot':
      default:
        return PilotDashboard;
    }
  };

  return (
    <Switch>
      <Route path="/" component={getDashboardComponent()} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen bg-slate-900">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
