import { LatLngLiteral } from "leaflet";
import { useState } from "react";

type UseGeolocationReturnType = {
  isLoading: boolean;
  position: LatLngLiteral | null;
  error: string | null;
  getPosition: () => void;
};

export function useGeolocation(defaultPostion = null):  UseGeolocationReturnType {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState<null | LatLngLiteral>(defaultPostion);
  const [error, setError] = useState<null | string>(null);

  function getPosition() {
    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return { isLoading, position, error, getPosition };
}