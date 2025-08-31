import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  discordId: text("discord_id").notNull().unique(),
  username: text("username").notNull(),
  avatar: text("avatar"),
  role: text("role").notNull().default("pilot"), // pilot, ground_crew, atc
  createdAt: timestamp("created_at").defaultNow(),
});

export const aircraft = pgTable("aircraft", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  registration: text("registration").notNull().unique(),
  type: text("type").notNull(), // "Boeing 737-800", etc.
  status: text("status").notNull().default("active"), // active, maintenance, retired
  currentAirport: text("current_airport").notNull(),
  configuration: jsonb("configuration").notNull(), // seating layout, service points
  createdAt: timestamp("created_at").defaultNow(),
});

export const flights = pgTable("flights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  flightNumber: text("flight_number").notNull(),
  aircraftId: varchar("aircraft_id").references(() => aircraft.id),
  departureAirport: text("departure_airport").notNull(),
  arrivalAirport: text("arrival_airport").notNull(),
  status: text("status").notNull().default("planning"), // planning, boarding, departed, arrived
  scheduledDeparture: timestamp("scheduled_departure"),
  actualDeparture: timestamp("actual_departure"),
  passengerCount: integer("passenger_count").default(0),
  fuelData: jsonb("fuel_data"), // fuel levels, weight data
  createdAt: timestamp("created_at").defaultNow(),
});

export const serviceRequests = pgTable("service_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  flightId: varchar("flight_id").references(() => flights.id),
  serviceType: text("service_type").notNull(), // fuel, catering, baggage, ground_power
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, cancelled
  priority: text("priority").notNull().default("normal"), // low, normal, high, urgent
  requestedBy: text("requested_by").notNull(),
  assignedTo: text("assigned_to"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const checklists = pgTable("checklists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // cockpit_prep, before_start, engine_start, etc.
  items: jsonb("items").notNull(), // array of checklist items
  aircraftType: text("aircraft_type").notNull(),
  version: text("version").notNull().default("1.0"),
});

export const checklistProgress = pgTable("checklist_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  flightId: varchar("flight_id").references(() => flights.id),
  checklistId: varchar("checklist_id").references(() => checklists.id),
  completedItems: jsonb("completed_items").notNull().default([]), // array of completed item IDs
  status: text("status").notNull().default("pending"), // pending, in_progress, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const communications = pgTable("communications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  flightId: varchar("flight_id").references(() => flights.id),
  sender: text("sender").notNull(),
  senderRole: text("sender_role").notNull(), // pilot, ground_control, catering, fuel, baggage
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  readBy: jsonb("read_by").default([]), // array of user IDs who have read the message
});

export const seatingData = pgTable("seating_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  flightId: varchar("flight_id").references(() => flights.id),
  seatNumber: text("seat_number").notNull(),
  status: text("status").notNull().default("available"), // available, occupied, blocked
  passengerName: text("passenger_name"),
  seatClass: text("seat_class").notNull(), // first, business, economy
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const airports = pgTable("airports", {
  icao: text("icao").primaryKey(),
  iata: text("iata"),
  name: text("name").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  isPtfsSupported: boolean("is_ptfs_supported").default(true),
});

// Insert schemas
export const insertAircraftSchema = createInsertSchema(aircraft).omit({
  id: true,
  createdAt: true,
});

export const insertFlightSchema = createInsertSchema(flights).omit({
  id: true,
  createdAt: true,
});

export const insertServiceRequestSchema = createInsertSchema(serviceRequests).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertChecklistSchema = createInsertSchema(checklists).omit({
  id: true,
});

export const insertChecklistProgressSchema = createInsertSchema(checklistProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommunicationSchema = createInsertSchema(communications).omit({
  id: true,
  timestamp: true,
  readBy: true,
});

export const insertSeatingDataSchema = createInsertSchema(seatingData).omit({
  id: true,
  updatedAt: true,
});

export const insertAirportSchema = createInsertSchema(airports);

// Types
export type Aircraft = typeof aircraft.$inferSelect;
export type InsertAircraft = z.infer<typeof insertAircraftSchema>;

export type Flight = typeof flights.$inferSelect;
export type InsertFlight = z.infer<typeof insertFlightSchema>;

export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;

export type Checklist = typeof checklists.$inferSelect;
export type InsertChecklist = z.infer<typeof insertChecklistSchema>;

export type ChecklistProgress = typeof checklistProgress.$inferSelect;
export type InsertChecklistProgress = z.infer<typeof insertChecklistProgressSchema>;

export type Communication = typeof communications.$inferSelect;
export type InsertCommunication = z.infer<typeof insertCommunicationSchema>;

export type SeatingData = typeof seatingData.$inferSelect;
export type InsertSeatingData = z.infer<typeof insertSeatingDataSchema>;

export type Airport = typeof airports.$inferSelect;
export type InsertAirport = z.infer<typeof insertAirportSchema>;

export type User = typeof users.$inferSelect;
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
