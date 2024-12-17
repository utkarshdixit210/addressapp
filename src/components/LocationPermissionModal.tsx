import React from 'react';
import { MapPin, Search } from 'lucide-react';

interface LocationPermissionModalProps {
  onEnableLocation: () => void;
  onManualSearch: () => void;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  onEnableLocation,
  onManualSearch,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="text-center">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Enable Location Services</h2>
          <p className="text-gray-600 mb-6">
            To provide you with the best delivery experience, we need access to your location.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onEnableLocation}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Enable Location
          </button>
          <button
            onClick={onManualSearch}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search Manually
          </button>
        </div>
      </div>
    </div>
  );
}