# Flight Ground Control System

## Overview

This is a comprehensive flight ground control system built with React, Node.js/Express, and PostgreSQL. The application provides a centralized dashboard for managing aircraft operations, flight planning, service requests, pre-flight checklists, passenger seating, and real-time communications between crew members and ground staff. The system is designed to streamline ground operations and improve coordination during aircraft turnaround processes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom design system (dark theme with cyan accent)
- **Build Tool**: Vite with custom configuration for development and production
- **Real-time Communication**: WebSocket integration for live updates

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with WebSocket support for real-time features
- **Error Handling**: Centralized error handling middleware
- **Request Logging**: Custom logging middleware for API requests
- **Development Setup**: Vite integration for seamless development experience

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon Database serverless connection
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Type Safety**: Full TypeScript integration with Drizzle-Zod for runtime validation

### Database Schema Design
The system uses a relational database with the following core entities:
- **Aircraft**: Registration, type, status, current location, and configuration data
- **Flights**: Flight numbers, aircraft assignments, departure/arrival airports, passenger counts, and fuel data
- **Service Requests**: Fuel, catering, baggage, and ground power service management
- **Checklists**: Pre-flight and operational checklists with progress tracking
- **Communications**: Real-time messaging between crew and ground staff
- **Seating Data**: Passenger seating arrangements and status tracking
- **Airports**: Airport information and operational data

### Authentication and Authorization
The application implements session-based authentication using PostgreSQL session storage with connect-pg-simple middleware. Sessions are configured for secure cookie handling and automatic cleanup.

### Component Architecture
- **Modular Design**: Feature-based component organization
- **Shared Components**: Comprehensive UI component library based on Radix UI
- **Custom Hooks**: Reusable hooks for data fetching, WebSocket connections, and mobile responsiveness
- **Type Safety**: Full TypeScript coverage with shared schema types between client and server

### Real-time Features
- **WebSocket Integration**: Live updates for communications, service status changes, and checklist progress
- **Query Invalidation**: Automatic data synchronization using React Query
- **Connection Management**: Robust WebSocket connection handling with reconnection logic

### Development Tools
- **Hot Reload**: Vite HMR for rapid development
- **Type Checking**: Strict TypeScript configuration
- **Code Quality**: ESLint and Prettier integration
- **Development Banner**: Replit development environment integration

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for state management
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Extensive Radix UI component library for accessible primitives
- **Styling**: Tailwind CSS with PostCSS processing

### Backend Dependencies
- **Server Framework**: Express.js with TypeScript support
- **Database**: Drizzle ORM with PostgreSQL dialect and Neon serverless driver
- **WebSocket**: Native WebSocket server implementation
- **Session Management**: Express sessions with PostgreSQL storage
- **Development**: tsx for TypeScript execution and esbuild for production builds

### Development and Build Tools
- **Build System**: Vite with React plugin and custom configuration
- **TypeScript**: Full type checking with strict configuration
- **Database Tools**: Drizzle Kit for schema management and migrations
- **Replit Integration**: Custom plugins for development environment integration

### UI and UX Dependencies
- **Icon Library**: Lucide React for consistent iconography
- **Form Handling**: React Hook Form with Zod validation resolvers
- **Date Handling**: date-fns for date manipulation and formatting
- **Animations**: Class Variance Authority for component variants
- **Carousel**: Embla Carousel for interactive components