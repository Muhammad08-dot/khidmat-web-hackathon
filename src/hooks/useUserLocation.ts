import { useState, useCallback } from 'react';
import type { LocationCoords } from '../types';
import { PAKISTAN_CITIES } from '../constants';

interface UserLocationState {
  coords: LocationCoords | null;
  loading: boolean;
  error: string | null;
  detectLocation: () => Promise<LocationCoords>;
}

export const useUserLocation = (defaultCity: string = 'Lahore'): UserLocationState => {
  const [coords, setCoords] = useState<LocationCoords | null>(PAKISTAN_CITIES[defaultCity] || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = useCallback((): Promise<LocationCoords> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        const fallback = PAKISTAN_CITIES[defaultCity] || { lat: 31.5204, lng: 74.3587 };
        setError('Geolocation not supported by browser.');
        resolve(fallback);
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const detected = {
            lat: Math.round(position.coords.latitude * 10000) / 10000,
            lng: Math.round(position.coords.longitude * 10000) / 10000
          };
          setCoords(detected);
          setLoading(false);
          resolve(detected);
        },
        (err) => {
          console.warn('Geolocation failed or denied:', err.message);
          setError(err.message);
          setLoading(false);
          const fallback = PAKISTAN_CITIES[defaultCity] || { lat: 31.5204, lng: 74.3587 };
          resolve(fallback);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }, [defaultCity]);

  return { coords, loading, error, detectLocation };
};
