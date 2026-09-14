export type VehicleCategory = 'standard' | 'heavy';

export type CarparkType =
  | 'Multi-Storey'
  | 'Surface'
  | 'Basement'
  | 'Mechanised'
  | 'Open-Air Heavy Park';

export type AvailabilityStatus = 'available' | 'limited' | 'full';

export interface CarparkItem {
  id: string;
  code: string;
  name: string;
  address: string;
  estate: string;
  vehicleCategory: VehicleCategory;
  carparkType: CarparkType;
  totalLots: number;
  availableLots: number;
  motorcycleLots?: {
    total: number;
    available: number;
  };
  heightLimitMeters: number | null;
  rates: string;
  nightParking: boolean;
  gracePeriodMinutes: number;
  distanceKm: number;
  driveMinutes: number;
  x: number; // 0-100% on schematic map
  y: number; // 0-100% on schematic map
  features: string[];
  lastUpdated: string;
}

export type ActiveScreen = 'standard' | 'heavy';
