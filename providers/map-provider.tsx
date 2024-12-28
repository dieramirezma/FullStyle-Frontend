// Since the map will be laoded and displayed on client side

// Import necessary modules and functions from external libraries and our own project
import { type Libraries, useJsApiLoader } from '@react-google-maps/api'
import { type ReactNode } from 'react'

// Define a list of libraries to load from the Google Maps API
const libraries = ['places', 'drawing', 'geometry']

// Define a function component called MapProvider that takes a children prop
export async function MapProvider ({ children }: { children: ReactNode }) {
  // Load the Google Maps JavaScript API asynchronously
  const { isLoaded: scriptLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    libraries: libraries as Libraries
  })

  if (loadError != null) return <p>Encountered error while loading google maps</p>

  if (!scriptLoaded) return <p>Map Script is loading ...</p>

  // Return the children prop wrapped by this MapProvider component
  return await children
}
