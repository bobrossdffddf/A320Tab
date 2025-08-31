import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import session from "express-session";
import { storage } from "./storage";
import { z } from "zod";
import passport, { requireAuth, requireRole } from "./auth";
import { 
  insertFlightSchema, 
  insertServiceRequestSchema, 
  insertCommunicationSchema,
  insertSeatingDataSchema,
  insertChecklistProgressSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
  }));

  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Authentication routes
  app.get('/auth/discord', passport.authenticate('discord'));
  
  app.get('/auth/discord/callback', 
    passport.authenticate('discord', { failureRedirect: '/login?error=auth_failed' }),
    (req, res) => {
      res.redirect('/');
    }
  );

  app.post('/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ error: 'Logout failed' });
      res.json({ success: true });
    });
  });

  app.get('/api/auth/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  });

  // ATC24 API integration
  app.get('/api/atc24/aircraft', async (req, res) => {
    try {
      const response = await fetch('https://24data.ptfs.app/acft-data');
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ATC24 aircraft data' });
    }
  });

  app.get('/api/atc24/controllers', async (req, res) => {
    try {
      const response = await fetch('https://24data.ptfs.app/controllers');
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ATC24 controllers' });
    }
  });
  // Aircraft routes (protected)
  app.get("/api/aircraft", requireAuth, async (req, res) => {
    try {
      const aircraft = await storage.getAllAircraft();
      res.json(aircraft);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch aircraft" });
    }
  });

  app.get("/api/aircraft/:id", requireAuth, async (req, res) => {
    try {
      const aircraft = await storage.getAircraft(req.params.id);
      if (!aircraft) {
        return res.status(404).json({ error: "Aircraft not found" });
      }
      res.json(aircraft);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch aircraft" });
    }
  });

  // Flight routes (protected)
  app.get("/api/flights", requireAuth, async (req, res) => {
    try {
      const flights = await storage.getAllFlights();
      res.json(flights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flights" });
    }
  });

  app.get("/api/flights/:id", requireAuth, async (req, res) => {
    try {
      const flight = await storage.getFlight(req.params.id);
      if (!flight) {
        return res.status(404).json({ error: "Flight not found" });
      }
      res.json(flight);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flight" });
    }
  });

  app.post("/api/flights", requireAuth, async (req, res) => {
    try {
      const validatedData = insertFlightSchema.parse(req.body);
      const flight = await storage.createFlight(validatedData);
      res.status(201).json(flight);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid flight data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create flight" });
    }
  });

  app.patch("/api/flights/:id", requireAuth, async (req, res) => {
    try {
      const partialData = insertFlightSchema.partial().parse(req.body);
      const flight = await storage.updateFlight(req.params.id, partialData);
      if (!flight) {
        return res.status(404).json({ error: "Flight not found" });
      }
      res.json(flight);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid flight data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update flight" });
    }
  });

  // Service request routes
  app.get("/api/flights/:flightId/services", async (req, res) => {
    try {
      const services = await storage.getServiceRequestsByFlight(req.params.flightId);
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service requests" });
    }
  });

  app.post("/api/flights/:flightId/services", async (req, res) => {
    try {
      const validatedData = insertServiceRequestSchema.parse({
        ...req.body,
        flightId: req.params.flightId,
      });
      const service = await storage.createServiceRequest(validatedData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid service request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create service request" });
    }
  });

  app.patch("/api/services/:id", async (req, res) => {
    try {
      const partialData = insertServiceRequestSchema.partial().parse(req.body);
      const service = await storage.updateServiceRequest(req.params.id, partialData);
      if (!service) {
        return res.status(404).json({ error: "Service request not found" });
      }
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid service request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update service request" });
    }
  });

  // Communication routes
  app.get("/api/flights/:flightId/communications", async (req, res) => {
    try {
      const communications = await storage.getCommunicationsByFlight(req.params.flightId);
      res.json(communications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch communications" });
    }
  });

  app.post("/api/flights/:flightId/communications", async (req, res) => {
    try {
      const validatedData = insertCommunicationSchema.parse({
        ...req.body,
        flightId: req.params.flightId,
      });
      const communication = await storage.createCommunication(validatedData);
      res.status(201).json(communication);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid communication data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create communication" });
    }
  });

  // Seating routes
  app.get("/api/flights/:flightId/seating", async (req, res) => {
    try {
      const seatingData = await storage.getSeatingDataByFlight(req.params.flightId);
      res.json(seatingData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch seating data" });
    }
  });

  app.post("/api/flights/:flightId/seating", async (req, res) => {
    try {
      const validatedData = insertSeatingDataSchema.parse({
        ...req.body,
        flightId: req.params.flightId,
      });
      const seating = await storage.createOrUpdateSeatingData(validatedData);
      res.status(201).json(seating);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid seating data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update seating data" });
    }
  });

  app.patch("/api/flights/:flightId/seating/:seatNumber", async (req, res) => {
    try {
      const { status, passengerName } = req.body;
      const seating = await storage.updateSeatStatus(req.params.flightId, req.params.seatNumber, status, passengerName);
      if (!seating) {
        return res.status(404).json({ error: "Seat not found" });
      }
      res.json(seating);
    } catch (error) {
      res.status(500).json({ error: "Failed to update seat status" });
    }
  });

  // Checklist routes
  app.get("/api/checklists", async (req, res) => {
    try {
      const { aircraftType } = req.query;
      const checklists = aircraftType 
        ? await storage.getChecklistsByAircraftType(aircraftType as string)
        : await storage.getAllChecklists();
      res.json(checklists);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch checklists" });
    }
  });

  app.get("/api/flights/:flightId/checklist-progress", async (req, res) => {
    try {
      const progress = await storage.getChecklistProgressByFlight(req.params.flightId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch checklist progress" });
    }
  });

  app.post("/api/flights/:flightId/checklist-progress", async (req, res) => {
    try {
      const validatedData = insertChecklistProgressSchema.parse({
        ...req.body,
        flightId: req.params.flightId,
      });
      const progress = await storage.createOrUpdateChecklistProgress(validatedData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid checklist progress data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update checklist progress" });
    }
  });

  // Airport routes
  app.get("/api/airports", async (req, res) => {
    try {
      const { ptfsOnly } = req.query;
      const airports = ptfsOnly === "true" 
        ? await storage.getPtfsAirports()
        : await storage.getAllAirports();
      res.json(airports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch airports" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'join_flight') {
          (ws as any).flightId = data.flightId;
        }
        
        if (data.type === 'send_message') {
          const communication = await storage.createCommunication({
            flightId: data.flightId,
            sender: data.sender,
            senderRole: data.senderRole,
            message: data.message,
          });
          
          // Broadcast to all clients in the same flight
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && (client as any).flightId === data.flightId) {
              client.send(JSON.stringify({
                type: 'new_message',
                data: communication,
              }));
            }
          });
        }
        
        if (data.type === 'service_update') {
          const service = await storage.updateServiceRequest(data.serviceId, { status: data.status });
          
          // Broadcast service update
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && (client as any).flightId === data.flightId) {
              client.send(JSON.stringify({
                type: 'service_updated',
                data: service,
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
  });

  return httpServer;
}
