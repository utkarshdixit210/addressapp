import { useState, useEffect } from 'react';

export const useGoogleMapsStatus = (apiKey: string) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkMapsStatus = () => {
      if (!apiKey) {
        setError('API key is missing');
        return;
      }

      const handleError = (e: ErrorEvent) => {
        if (e.error?.message?.includes('BillingNotEnabledMapError')) {
          setError('billing-not-enabled');
        }
      };

      window.addEventListener('error', handleError);
      return () => window.removeEventListener('error', handleError);
    };

    checkMapsStatus();
  }, [apiKey]);

  return { error };
};