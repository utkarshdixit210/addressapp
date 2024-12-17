import React, { useState, useEffect } from 'react';
import { Home, Building2, Users, MapPin, Loader2 } from 'lucide-react';
import { Address } from '../types/address';
import { geocodeAddress, reverseGeocode } from '../utils/geocoding';
import debounce from 'lodash/debounce';

interface AddressFormProps {
  onSubmit: (address: Omit<Address, 'id'>) => void;
  initialLocation?: { latitude: number; longitude: number };
  onLocationChange?: (location: { latitude: number; longitude: number }) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  initialLocation,
  onLocationChange,
}) => {
  const [formData, setFormData] = useState({
    type: 'home' as const,
    houseNumber: '',
    street: '',
    area: '',
  });
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  useEffect(() => {
    if (initialLocation) {
      updateAddressFromCoordinates(initialLocation.latitude, initialLocation.longitude);
    }
  }, [initialLocation]);

  const updateAddressFromCoordinates = async (latitude: number, longitude: number) => {
    setIsGeocoding(true);
    setGeocodeError(null);

    try {
      const result = await reverseGeocode(latitude, longitude);
      if (result) {
        setFormData(prev => ({
          ...prev,
          houseNumber: result.components.street_number || '',
          street: result.components.route || '',
          area: [result.components.sublocality, result.components.locality]
            .filter(Boolean)
            .join(', '),
        }));
      }
    } catch (error) {
      setGeocodeError('Failed to get address details');
    } finally {
      setIsGeocoding(false);
    }
  };

  const debouncedGeocodeAddress = debounce(async (address: string) => {
    setIsGeocoding(true);
    setGeocodeError(null);

    try {
      const result = await geocodeAddress(address);
      if (result && onLocationChange) {
        onLocationChange({
          latitude: result.latitude,
          longitude: result.longitude,
        });
      }
    } catch (error) {
      setGeocodeError('Failed to locate address');
    } finally {
      setIsGeocoding(false);
    }
  }, 1000);

  useEffect(() => {
    const fullAddress = [formData.houseNumber, formData.street, formData.area]
      .filter(Boolean)
      .join(' ');
    
    if (fullAddress.length > 5) {
      debouncedGeocodeAddress(fullAddress);
    }

    return () => {
      debouncedGeocodeAddress.cancel();
    };
  }, [formData.houseNumber, formData.street, formData.area]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initialLocation) {
      const fullAddress = [formData.houseNumber, formData.street, formData.area]
        .filter(Boolean)
        .join(', ');

      onSubmit({
        ...formData,
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
        fullAddress,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-4 justify-center">
        {[
          { type: 'home' as const, icon: Home, label: 'Home' },
          { type: 'office' as const, icon: Building2, label: 'Office' },
          { type: 'other' as const, icon: Users, label: 'Other' },
        ].map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type }))}
            className={`flex flex-col items-center p-4 rounded-lg ${
              formData.type === type
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Icon className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            House/Flat/Block No.
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.houseNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, houseNumber: e.target.value }))}
              className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street/Road
          </label>
          <input
            type="text"
            value={formData.street}
            onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area/Locality
          </label>
          <input
            type="text"
            value={formData.area}
            onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      {geocodeError && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {geocodeError}
        </div>
      )}

      <button
        type="submit"
        disabled={isGeocoding}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isGeocoding && <Loader2 className="w-5 h-5 animate-spin" />}
        {isGeocoding ? 'Verifying address...' : 'Save Address'}
      </button>
    </form>
  );
};