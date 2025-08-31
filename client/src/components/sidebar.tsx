import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plane, 
  Menu, 
  TowerControl, 
  Headphones, 
  ClipboardCheck, 
  Users, 
  MessageSquare, 
  MapPin 
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Flight } from "@shared/schema";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  currentFlight?: Flight;
}

export function Sidebar({ collapsed, onToggle, currentFlight }: SidebarProps) {
  const [location] = useLocation();
  
  const navItems = [
    { 
      href: "/", 
      icon: TowerControl, 
      label: "Ground Control", 
      active: location === "/" 
    },
    { 
      href: "/atc", 
      icon: Headphones, 
      label: "ATC Assistant", 
      active: location === "/atc" 
    },
    { 
      href: "/checklists", 
      icon: ClipboardCheck, 
      label: "Checklists", 
      active: location === "/checklists" 
    },
    { 
      href: "/seating", 
      icon: Users, 
      label: "Seating", 
      active: location === "/seating" 
    },
    { 
      href: "/communications", 
      icon: MessageSquare, 
      label: "Communications", 
      active: location === "/communications" 
    },
    { 
      href: "/airports", 
      icon: MapPin, 
      label: "Airports", 
      active: location === "/airports" 
    },
  ];

  return (
    <div 
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
      data-testid="sidebar-navigation"
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Plane className="text-sidebar-accent text-xl" />
          {!collapsed && (
            <span className="font-bold text-lg text-sidebar-foreground" data-testid="text-logo">
              PTFS
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-sidebar-foreground hover:text-sidebar-accent"
          data-testid="button-sidebar-toggle"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer",
                item.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/10 text-sidebar-foreground hover:text-sidebar-accent"
              )}
              data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </div>
          </Link>
        ))}
      </nav>
      
      {/* Status Panel */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border" data-testid="panel-flight-status">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-chart-5 rounded-full status-indicator"></div>
            <span className="text-sm text-sidebar-foreground">System Online</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div data-testid="text-flight-number">
              Flight: {currentFlight?.flightNumber || "PTFS001"}
            </div>
            <div data-testid="text-current-airport">
              Airport: {currentFlight?.departureAirport || "KLAX"}
            </div>
            {currentFlight?.status && (
              <Badge 
                variant="outline" 
                className="mt-2 text-xs"
                data-testid="badge-flight-status"
              >
                {currentFlight.status.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
