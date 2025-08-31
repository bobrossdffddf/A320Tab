import WebSocket from 'ws';
import { EventEmitter } from 'events';

export interface ATC24Aircraft {
  [callsign: string]: {
    heading: number;
    playerName: string;
    altitude: number;
    aircraftType: string;
    position: {
      y: number;
      x: number;
    };
    speed: number;
    wind: string;
    isOnGround?: boolean;
    groundSpeed: number;
  };
}

export interface ATC24Controller {
  holder: string | null;
  claimable: boolean;
  airport: string;
  position: string;
  queue: string[];
}

export interface ATC24ATIS {
  airport: string;
  letter: string;
  content: string;
  lines: string[];
  editor: string | null;
}

class ATC24Client extends EventEmitter {
  private ws: WebSocket | null = null;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private readonly maxReconnectAttempts = 5;
  private reconnectAttempts = 0;

  constructor() {
    super();
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket('wss://24data.ptfs.app/wss');
      
      this.ws.on('open', () => {
        console.log('Connected to ATC24 WebSocket');
        this.reconnectAttempts = 0;
        this.emit('connected');
      });

      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing ATC24 message:', error);
        }
      });

      this.ws.on('error', (error) => {
        console.error('ATC24 WebSocket error:', error);
        this.emit('error', error);
      });

      this.ws.on('close', () => {
        console.log('ATC24 WebSocket disconnected');
        this.ws = null;
        this.scheduleReconnect();
      });

    } catch (error) {
      console.error('Failed to connect to ATC24:', error);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached for ATC24');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    console.log(`Reconnecting to ATC24 in ${delay}ms...`);
    
    this.reconnectInterval = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  private handleMessage(message: { t: string; d: any }) {
    switch (message.t) {
      case 'ACFT_DATA':
        this.emit('aircraft_data', message.d as ATC24Aircraft);
        break;
      case 'EVENT_ACFT_DATA':
        this.emit('event_aircraft_data', message.d as ATC24Aircraft);
        break;
      case 'FLIGHT_PLAN':
        this.emit('flight_plan', message.d);
        break;
      case 'EVENT_FLIGHT_PLAN':
        this.emit('event_flight_plan', message.d);
        break;
      case 'CONTROLLERS':
        this.emit('controllers', message.d as ATC24Controller[]);
        break;
      case 'ATIS':
        this.emit('atis', message.d as ATC24ATIS);
        break;
      default:
        console.log('Unknown ATC24 message type:', message.t);
    }
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public disconnect() {
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const atc24Client = new ATC24Client();