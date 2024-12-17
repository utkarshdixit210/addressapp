export interface Address {
  id: string;
  type: 'home' | 'office' | 'other';
  houseNumber: string;
  street: string;
  area: string;
  latitude: number;
  longitude: number;
  fullAddress: string;
}

export interface LocationState {
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
  selectedLocation: {
    latitude: number;
    longitude: number;
  } | null;
  addresses: Address[];
  permissionStatus: 'granted' | 'denied' | 'prompt';
}