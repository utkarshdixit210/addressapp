import React, { useCallback, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';
import { mapOptions, GOOGLE_MAPS_CONFIG } from '../config/maps';
import { ErrorMessage } from './ErrorMessage';

interface MapProps {
  center: { lat: number; lng: number };
  onMarkerDragEnd: (e: google.maps.MapMouseEvent) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

export const Map: React.FC<MapProps> = ({ center, onMarkerDragEnd }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    map.setZoom(15);
  }, [center]);

  if (loadError) {
    return (
      <ErrorMessage
        title="Map Loading Error"
        message="There was an error loading Google Maps. Please check your API key and billing status."
      />
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        options={{
          ...mapOptions,
          gestureHandling: 'greedy',
        }}
      >
        <Marker
          position={center}
          draggable={true}
          onDragEnd={onMarkerDragEnd}
          icon={{
            url: 'data:image/svg+xml;base64,' + btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="#2563EB" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            `),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 40),
          }}
        />
      </GoogleMap>
    </div>
  );
}