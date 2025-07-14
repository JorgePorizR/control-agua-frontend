import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface StaticMapComponentProps {
  lat: number;
  lng: number;
}

const StaticMapComponent: React.FC<StaticMapComponentProps> = ({ lat, lng }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  });

  if (!isLoaded) {
    return <div>Cargando mapa...</div>;
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden shadow-md">
      <GoogleMap
        center={{ lat, lng }}
        zoom={15}
        mapContainerStyle={{ width: "100%", height: "100%" }}
      >
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    </div>
  );
};

export default StaticMapComponent;
