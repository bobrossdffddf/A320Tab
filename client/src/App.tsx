import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import ATCPage from "@/pages/atc";
import ChecklistsPage from "@/pages/checklists";
import SeatingPage from "@/pages/seating";
import CommunicationsPage from "@/pages/communications";
import AirportsPage from "@/pages/airports";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/atc" component={ATCPage} />
      <Route path="/checklists" component={ChecklistsPage} />
      <Route path="/seating" component={SeatingPage} />
      <Route path="/communications" component={CommunicationsPage} />
      <Route path="/airports" component={AirportsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
