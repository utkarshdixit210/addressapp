import { useState, useCallback } from 'react';
import { LocationState } from '../types/address';
import { reverseGeocode } from '../utils/geocoding';

export const useGeolocation = () => {
  const [state, setState] = useState<Pick<LocationState, 'currentLocation' | 'selectedLocation' | 'permissionStatus'>>({
    currentLocation: null,
    selectedLocation: null,
    permissionStatus: 'prompt',
  });

  const getCurrentLocation = useCallback(async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const location = { latitude, longitude };
      
      setState(prev => ({
        ...prev,
        currentLocation: location,
        selectedLocation: location,
      }));

      // Get address for the location
      const address = await reverseGeocode(latitude, longitude);
      return { location, address };
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }, []);

  const checkPermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setState(prev => ({ ...prev, permissionStatus: result.state as LocationState['permissionStatus'] }));
      
      if (result.state === 'granted') {
        await getCurrentLocation();
      }
    } catch (error) {
      console.error('Error checking permission:', error);
    }
  }, [getCurrentLocation]);

  return {
    ...state,
    getCurrentLocation,
    checkPermission,
    setSelectedLocation: (location: { latitude: number; longitude: number }) =>
      setState(prev => ({ ...prev, selectedLocation: location })),
  };
};