import { useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";

const center = { lat: -16.91, lng:  -64.65 };
const containerStyle = { width: "100%", height: "150px" };

interface MapComponentProps {
  onMapClick: (lat: number, lng: number) => void;
}

function MapComponent({ onMapClick }: MapComponentProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  });

  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const clickedLat = e.latLng.lat();
      const clickedLng = e.latLng.lng();
      setSelectedPosition({ lat: clickedLat, lng: clickedLng });
      onMapClick(clickedLat, clickedLng);
    }
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onLoad={onLoad}
      onClick={handleMapClick}
    >
      {selectedPosition && (
        <Marker
          position={selectedPosition}
        />
      )}
    </GoogleMap>
  ) : (
    <div>Cargando mapa…</div>
  );
}

export default MapComponent;
