export interface Bike {
  dockNumber: number;
  isElectric: boolean;
  isAvailable: boolean;
  battery: number;
}

export interface Kiosk {
  id: number;
  name: string;
  coordinates: [number, number];
  totalDocks: number;
  docksAvailable: number;
  bikesAvailable: number;
  classicBikesAvailable: number;
  smartBikesAvailable: number;
  electricBikesAvailable: number;
  rewardBikesAvailable: number;
  rewardDocksAvailable: number;
  kioskStatus: string;
  kioskPublicStatus: string;
  kioskConnectionStatus: string;
  kioskType: number;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZipCode: string;
}

export interface Geometry {
  coordinates: [number, number];
  type: 'Point';
}

export interface BikesFeature {
  geometry: Geometry;
  properties: Kiosk;
}

export interface GetBikesDto {
  last_updated: string; // iso string
  features: BikesFeature[];
  properties: Kiosk;
  bikes: Bike[];
  kioskId: number;
  latitude: number;
  longitude: number;
}

export interface GetBikesResponseDto {
  kiosksData: {
    available: BikesFeature[];
    warning: BikesFeature[];
    critical: BikesFeature[];
  };
  lastUpdated: string;
}
