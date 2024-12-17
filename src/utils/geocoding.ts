import { GOOGLE_MAPS_CONFIG } from '../config/maps';

export const geocodeAddress = async (address: string): Promise<{
  latitude: number;
  longitude: number;
  formattedAddress: string;
} | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_MAPS_CONFIG.apiKey}`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const { lat, lng } = result.geometry.location;
      return {
        latitude: lat,
        longitude: lng,
        formattedAddress: result.formatted_address,
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<{
  address: string;
  components: {
    street_number?: string;
    route?: string;
    sublocality?: string;
    locality?: string;
  };
} | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_CONFIG.apiKey}`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const components: { [key: string]: string } = {};
      
      result.address_components.forEach((component: any) => {
        const type = component.types[0];
        components[type] = component.long_name;
      });

      return {
        address: result.formatted_address,
        components: {
          street_number: components.street_number,
          route: components.route,
          sublocality: components.sublocality,
          locality: components.locality,
        },
      };
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};