import React, { useState } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { VerifyEmail } from './components/auth/VerifyEmail';
import { Header } from './components/layout/Header';
import { LocationPermissionModal } from './components/LocationPermissionModal';
import { Map } from './components/Map';
import { AddressForm } from './components/AddressForm';
import { AddressList } from './components/AddressList';
import { GOOGLE_MAPS_CONFIG } from './config/maps';
import { useGeolocation } from './hooks/useGeolocation';
import { useAddressManager } from './hooks/useAddressManager';

function App() {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const {
    user,
    isLoading: authLoading,
    error: authError,
    login,
    register,
    logout,
  } = useAuth();

  const {
    currentLocation,
    selectedLocation,
    permissionStatus,
    getCurrentLocation,
    setSelectedLocation,
  } = useGeolocation();

  const { addresses, addAddress, editAddress, deleteAddress } = useAddressManager();

  const handleLogin = async (email: string, password: string) => {
    const success = await login({ email, password });
    if (success) {
      setShowPermissionModal(true);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    const success = await register({ name, email, password });
    if (success) {
      setShowPermissionModal(true);
    }
  };

  const handleEnableLocation = async () => {
    await getCurrentLocation();
    setShowPermissionModal(false);
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setSelectedLocation({
        latitude: e.latLng.lat(),
        longitude: e.latLng.lng(),
      });
    }
  };

  if (!user) {
    return showLoginForm ? (
      <LoginForm
        onSubmit={handleLogin}
        onRegisterClick={() => setShowLoginForm(false)}
        isLoading={authLoading}
        error={authError}
      />
    ) : (
      <RegisterForm
        onSubmit={handleRegister}
        onLoginClick={() => setShowLoginForm(true)}
        isLoading={authLoading}
        error={authError}
      />
    );
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_CONFIG.apiKey}>
      <div className="min-h-screen bg-gray-100">
        <Header user={user} onLogout={logout} />

        {showPermissionModal && (
          <LocationPermissionModal
            onEnableLocation={handleEnableLocation}
            onManualSearch={() => setShowPermissionModal(false)}
          />
        )}

        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {selectedLocation && (
              <Map
                center={{
                  lat: selectedLocation.latitude,
                  lng: selectedLocation.longitude,
                }}
                onMarkerDragEnd={handleMarkerDragEnd}
              />
            )}

            <div className="p-6">
              {!showAddressForm ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Saved Addresses</h2>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add New Address
                    </button>
                  </div>
                  <AddressList
                    addresses={addresses}
                    onEdit={editAddress}
                    onDelete={deleteAddress}
                    onSelect={(address) => {
                      setSelectedLocation({
                        latitude: address.latitude,
                        longitude: address.longitude,
                      });
                    }}
                  />
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Add New Address</h2>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <AddressForm
                    onSubmit={(address) => {
                      addAddress(address);
                      setShowAddressForm(false);
                    }}
                    initialLocation={selectedLocation}
                    onLocationChange={setSelectedLocation}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </LoadScript>
  );
}

export default App;