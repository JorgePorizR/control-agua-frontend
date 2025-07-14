import { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";

interface EditableMapComponentProps {
  initialPosition: { lat: number; lng: number };
  zoomLevel?: number;
  onMapClick: (lat: number, lng: number) => void;
}

const containerStyle = { width: "100%", height: "160px" };

function EditableMapComponent({
  initialPosition,
  zoomLevel = 12,
  onMapClick,
}: EditableMapComponentProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  });

  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number }>(
    initialPosition
  );

  useEffect(() => {
    setSelectedPosition(initialPosition);
  }, [initialPosition]);

  const onLoad = useCallback((map: google.maps.Map) => {
    map.setZoom(zoomLevel);
    map.panTo(initialPosition);
  }, [initialPosition, zoomLevel]);

  const onUnmount = useCallback(() => {}, []);

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
      center={selectedPosition}
      zoom={zoomLevel}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleMapClick}
    >
      <Marker position={selectedPosition} />
    </GoogleMap>
  ) : (
    <div>Cargando mapa…</div>
  );
}

export default EditableMapComponent;
