'use client'

import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps'

interface GoogleMapComponentProps {
  position: {
    lat: number
    lng: number
  }
}

function GoogleMapComponent ({ position }: GoogleMapComponentProps) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultCenter={position}
        defaultZoom={15}
        mapId="fullstyle location"
        style={{ width: '100%', height: '400px' }}
      >
        <AdvancedMarker position={position} />
      </Map>
    </APIProvider>
  )
}

export default GoogleMapComponent
