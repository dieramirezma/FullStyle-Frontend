import { NextResponse } from 'next/server'

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY // Usa una variable de entorno

export async function GET (req: Request) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'Falta la dirección' }, { status: 400 })
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`

  try {
    const res = await fetch(url)
    const data = await res.json()

    if (data.status !== 'OK') {
      return NextResponse.json({ error: 'No se encontró la dirección indicada' }, { status: 404 })
    }

    if (data.results[0].types[0] !== 'street_address' && data.results[0].types[0] !== 'premise') {
      return NextResponse.json({ error: 'Dirección no válida' }, { status: 400 })
    }

    // sent geometry location and formatted address
    const formattedAddress = data.results[0].formatted_address.split(',')[0]

    return NextResponse.json({ location: data.results[0].geometry.location, formatted_address: formattedAddress })
  } catch (error) {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
