import {
  type Aircraft, type InsertAircraft,
  type Flight, type InsertFlight,
  type ServiceRequest, type InsertServiceRequest,
  type Checklist, type InsertChecklist,
  type ChecklistProgress, type InsertChecklistProgress,
  type Communication, type InsertCommunication,
  type SeatingData, type InsertSeatingData,
  type Airport, type InsertAirport
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Aircraft operations
  getAircraft(id: string): Promise<Aircraft | undefined>;
  getAllAircraft(): Promise<Aircraft[]>;
  createAircraft(aircraft: InsertAircraft): Promise<Aircraft>;
  updateAircraft(id: string, aircraft: Partial<InsertAircraft>): Promise<Aircraft | undefined>;

  // Flight operations
  getFlight(id: string): Promise<Flight | undefined>;
  getFlightsByAircraft(aircraftId: string): Promise<Flight[]>;
  getAllFlights(): Promise<Flight[]>;
  createFlight(flight: InsertFlight): Promise<Flight>;
  updateFlight(id: string, flight: Partial<InsertFlight>): Promise<Flight | undefined>;

  // Service request operations
  getServiceRequest(id: string): Promise<ServiceRequest | undefined>;
  getServiceRequestsByFlight(flightId: string): Promise<ServiceRequest[]>;
  getAllServiceRequests(): Promise<ServiceRequest[]>;
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  updateServiceRequest(id: string, request: Partial<InsertServiceRequest>): Promise<ServiceRequest | undefined>;

  // Checklist operations
  getChecklist(id: string): Promise<Checklist | undefined>;
  getChecklistsByAircraftType(aircraftType: string): Promise<Checklist[]>;
  getAllChecklists(): Promise<Checklist[]>;
  createChecklist(checklist: InsertChecklist): Promise<Checklist>;
  
  // Checklist progress operations
  getChecklistProgress(flightId: string, checklistId: string): Promise<ChecklistProgress | undefined>;
  getChecklistProgressByFlight(flightId: string): Promise<ChecklistProgress[]>;
  createOrUpdateChecklistProgress(progress: InsertChecklistProgress): Promise<ChecklistProgress>;

  // Communication operations
  getCommunicationsByFlight(flightId: string): Promise<Communication[]>;
  createCommunication(communication: InsertCommunication): Promise<Communication>;

  // Seating operations
  getSeatingDataByFlight(flightId: string): Promise<SeatingData[]>;
  createOrUpdateSeatingData(seating: InsertSeatingData): Promise<SeatingData>;
  updateSeatStatus(flightId: string, seatNumber: string, status: string, passengerName?: string): Promise<SeatingData | undefined>;

  // Airport operations
  getAirport(icao: string): Promise<Airport | undefined>;
  getAllAirports(): Promise<Airport[]>;
  getPtfsAirports(): Promise<Airport[]>;
  createAirport(airport: InsertAirport): Promise<Airport>;
}

export class MemStorage implements IStorage {
  private aircraft: Map<string, Aircraft> = new Map();
  private flights: Map<string, Flight> = new Map();
  private serviceRequests: Map<string, ServiceRequest> = new Map();
  private checklists: Map<string, Checklist> = new Map();
  private checklistProgress: Map<string, ChecklistProgress> = new Map();
  private communications: Map<string, Communication> = new Map();
  private seatingData: Map<string, SeatingData> = new Map();
  private airports: Map<string, Airport> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize PTFS airports
    const ptfsAirports: Airport[] = [
      { icao: "KLAX", iata: "LAX", name: "Los Angeles International", city: "Los Angeles", country: "USA", isPtfsSupported: true },
      { icao: "KJFK", iata: "JFK", name: "John F. Kennedy International", city: "New York", country: "USA", isPtfsSupported: true },
      { icao: "KORD", iata: "ORD", name: "Chicago O'Hare International", city: "Chicago", country: "USA", isPtfsSupported: true },
      { icao: "KSEA", iata: "SEA", name: "Seattle-Tacoma International", city: "Seattle", country: "USA", isPtfsSupported: true },
      { icao: "KDEN", iata: "DEN", name: "Denver International", city: "Denver", country: "USA", isPtfsSupported: true },
    ];

    ptfsAirports.forEach(airport => {
      this.airports.set(airport.icao, airport);
    });

    // Initialize default aircraft configuration
    const boeing737Config = {
      seatingLayout: {
        firstClass: { rows: 2, seatsPerRow: 4, seatMap: "2-2" },
        economy: { rows: 30, seatsPerRow: 6, seatMap: "3-3" }
      },
      servicePoints: [
        { type: "door", position: "forward", status: "closed" },
        { type: "fuel", position: "wing", status: "disconnected" },
        { type: "catering", position: "forward", status: "disconnected" },
        { type: "baggage", position: "aft", status: "disconnected" }
      ]
    };

    // Initialize default aircraft
    const defaultAircraft: Aircraft = {
      id: randomUUID(),
      registration: "N737PT",
      type: "Boeing 737-800",
      status: "active",
      currentAirport: "KLAX",
      configuration: boeing737Config,
      createdAt: new Date(),
    };

    this.aircraft.set(defaultAircraft.id, defaultAircraft);

    // Initialize default flight
    const defaultFlight: Flight = {
      id: randomUUID(),
      flightNumber: "PTFS001",
      aircraftId: defaultAircraft.id,
      departureAirport: "KLAX",
      arrivalAirport: "KJFK",
      status: "planning",
      scheduledDeparture: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      actualDeparture: null,
      passengerCount: 162,
      fuelData: {
        leftWing: 5746,
        center: 8540,
        rightWing: 5746,
        total: 20032
      },
      createdAt: new Date(),
    };

    this.flights.set(defaultFlight.id, defaultFlight);

    // Initialize default checklists
    const cockpitPrepChecklist: Checklist = {
      id: randomUUID(),
      name: "Cockpit Preparation",
      category: "cockpit_prep",
      items: [
        { id: "1", text: "Battery Switch - ON", completed: true },
        { id: "2", text: "APU Start", completed: false },
        { id: "3", text: "Hydraulic Pumps - ON", completed: false },
        { id: "4", text: "Fuel Pumps - ON", completed: false }
      ],
      aircraftType: "Boeing 737-800",
      version: "1.0"
    };

    this.checklists.set(cockpitPrepChecklist.id, cockpitPrepChecklist);
  }

  // Aircraft operations
  async getAircraft(id: string): Promise<Aircraft | undefined> {
    return this.aircraft.get(id);
  }

  async getAllAircraft(): Promise<Aircraft[]> {
    return Array.from(this.aircraft.values());
  }

  async createAircraft(insertAircraft: InsertAircraft): Promise<Aircraft> {
    const id = randomUUID();
    const aircraft: Aircraft = {
      ...insertAircraft,
      id,
      createdAt: new Date(),
    };
    this.aircraft.set(id, aircraft);
    return aircraft;
  }

  async updateAircraft(id: string, insertAircraft: Partial<InsertAircraft>): Promise<Aircraft | undefined> {
    const existing = this.aircraft.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...insertAircraft };
    this.aircraft.set(id, updated);
    return updated;
  }

  // Flight operations
  async getFlight(id: string): Promise<Flight | undefined> {
    return this.flights.get(id);
  }

  async getFlightsByAircraft(aircraftId: string): Promise<Flight[]> {
    return Array.from(this.flights.values()).filter(f => f.aircraftId === aircraftId);
  }

  async getAllFlights(): Promise<Flight[]> {
    return Array.from(this.flights.values());
  }

  async createFlight(insertFlight: InsertFlight): Promise<Flight> {
    const id = randomUUID();
    const flight: Flight = {
      ...insertFlight,
      id,
      createdAt: new Date(),
    };
    this.flights.set(id, flight);
    return flight;
  }

  async updateFlight(id: string, insertFlight: Partial<InsertFlight>): Promise<Flight | undefined> {
    const existing = this.flights.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...insertFlight };
    this.flights.set(id, updated);
    return updated;
  }

  // Service request operations
  async getServiceRequest(id: string): Promise<ServiceRequest | undefined> {
    return this.serviceRequests.get(id);
  }

  async getServiceRequestsByFlight(flightId: string): Promise<ServiceRequest[]> {
    return Array.from(this.serviceRequests.values()).filter(r => r.flightId === flightId);
  }

  async getAllServiceRequests(): Promise<ServiceRequest[]> {
    return Array.from(this.serviceRequests.values());
  }

  async createServiceRequest(insertRequest: InsertServiceRequest): Promise<ServiceRequest> {
    const id = randomUUID();
    const request: ServiceRequest = {
      ...insertRequest,
      id,
      createdAt: new Date(),
      completedAt: null,
    };
    this.serviceRequests.set(id, request);
    return request;
  }

  async updateServiceRequest(id: string, insertRequest: Partial<InsertServiceRequest>): Promise<ServiceRequest | undefined> {
    const existing = this.serviceRequests.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...insertRequest };
    if (insertRequest.status === "completed") {
      updated.completedAt = new Date();
    }
    this.serviceRequests.set(id, updated);
    return updated;
  }

  // Checklist operations
  async getChecklist(id: string): Promise<Checklist | undefined> {
    return this.checklists.get(id);
  }

  async getChecklistsByAircraftType(aircraftType: string): Promise<Checklist[]> {
    return Array.from(this.checklists.values()).filter(c => c.aircraftType === aircraftType);
  }

  async getAllChecklists(): Promise<Checklist[]> {
    return Array.from(this.checklists.values());
  }

  async createChecklist(insertChecklist: InsertChecklist): Promise<Checklist> {
    const id = randomUUID();
    const checklist: Checklist = {
      ...insertChecklist,
      id,
    };
    this.checklists.set(id, checklist);
    return checklist;
  }

  // Checklist progress operations
  async getChecklistProgress(flightId: string, checklistId: string): Promise<ChecklistProgress | undefined> {
    const key = `${flightId}-${checklistId}`;
    return this.checklistProgress.get(key);
  }

  async getChecklistProgressByFlight(flightId: string): Promise<ChecklistProgress[]> {
    return Array.from(this.checklistProgress.values()).filter(p => p.flightId === flightId);
  }

  async createOrUpdateChecklistProgress(insertProgress: InsertChecklistProgress): Promise<ChecklistProgress> {
    const key = `${insertProgress.flightId}-${insertProgress.checklistId}`;
    const existing = this.checklistProgress.get(key);
    
    if (existing) {
      const updated = {
        ...existing,
        ...insertProgress,
        updatedAt: new Date(),
      };
      this.checklistProgress.set(key, updated);
      return updated;
    } else {
      const id = randomUUID();
      const progress: ChecklistProgress = {
        ...insertProgress,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.checklistProgress.set(key, progress);
      return progress;
    }
  }

  // Communication operations
  async getCommunicationsByFlight(flightId: string): Promise<Communication[]> {
    return Array.from(this.communications.values())
      .filter(c => c.flightId === flightId)
      .sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime());
  }

  async createCommunication(insertCommunication: InsertCommunication): Promise<Communication> {
    const id = randomUUID();
    const communication: Communication = {
      ...insertCommunication,
      id,
      timestamp: new Date(),
      readBy: [],
    };
    this.communications.set(id, communication);
    return communication;
  }

  // Seating operations
  async getSeatingDataByFlight(flightId: string): Promise<SeatingData[]> {
    return Array.from(this.seatingData.values()).filter(s => s.flightId === flightId);
  }

  async createOrUpdateSeatingData(insertSeating: InsertSeatingData): Promise<SeatingData> {
    const key = `${insertSeating.flightId}-${insertSeating.seatNumber}`;
    const existing = Array.from(this.seatingData.values())
      .find(s => s.flightId === insertSeating.flightId && s.seatNumber === insertSeating.seatNumber);
    
    if (existing) {
      const updated = {
        ...existing,
        ...insertSeating,
        updatedAt: new Date(),
      };
      this.seatingData.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const seating: SeatingData = {
        ...insertSeating,
        id,
        updatedAt: new Date(),
      };
      this.seatingData.set(id, seating);
      return seating;
    }
  }

  async updateSeatStatus(flightId: string, seatNumber: string, status: string, passengerName?: string): Promise<SeatingData | undefined> {
    const existing = Array.from(this.seatingData.values())
      .find(s => s.flightId === flightId && s.seatNumber === seatNumber);
    
    if (existing) {
      const updated = {
        ...existing,
        status,
        passengerName: passengerName || existing.passengerName,
        updatedAt: new Date(),
      };
      this.seatingData.set(existing.id, updated);
      return updated;
    }
    return undefined;
  }

  // Airport operations
  async getAirport(icao: string): Promise<Airport | undefined> {
    return this.airports.get(icao);
  }

  async getAllAirports(): Promise<Airport[]> {
    return Array.from(this.airports.values());
  }

  async getPtfsAirports(): Promise<Airport[]> {
    return Array.from(this.airports.values()).filter(a => a.isPtfsSupported);
  }

  async createAirport(insertAirport: InsertAirport): Promise<Airport> {
    const airport: Airport = { ...insertAirport };
    this.airports.set(airport.icao, airport);
    return airport;
  }
}

export const storage = new MemStorage();
