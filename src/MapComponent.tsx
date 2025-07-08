import { useState, useCallback } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

const center = { lat: -16.5, lng: -68.15 }
const containerStyle = { width: '100vw', height: '100vh' }

function MapComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
    const bounds = new google.maps.LatLngBounds(center)
    map.fitBounds(bounds)
  }, [])

  const onUnmount = useCallback(() => setMap(null), [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Aquí van marcadores, círculos, capas... */}
    </GoogleMap>
  ) : (
    <div>Cargando mapa…</div>
  )
}

export default MapComponent;