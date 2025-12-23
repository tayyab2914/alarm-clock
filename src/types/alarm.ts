export interface Alarm {
  id: string;
  time: string; // HH:MM format
  enabled: boolean;
  label?: string;
}

export interface Dot {
  id: number;
  x: number;
  y: number;
  connected: boolean;
}
