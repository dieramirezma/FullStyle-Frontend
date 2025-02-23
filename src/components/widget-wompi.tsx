'use client'

import { useEffect, useRef } from 'react'

interface WidgetWompiProps {
  amount: number
  isOpen: boolean
}

function WidgetWompi ({ amount, isOpen }: WidgetWompiProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || !containerRef.current) return

    const loadWompiWidget = async () => {
      try {
        // Obtener datos del servidor
        const response = await fetch('/api/wompi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ amount })
        })
        const data = await response.json()

        // Crear y configurar el script
        const script = document.createElement('script')
        script.id = 'wompi-script'
        script.src = 'https://checkout.wompi.co/widget.js'
        script.setAttribute('data-render', 'button')
        script.setAttribute('data-public-key', data.publicKey)
        script.setAttribute('data-currency', data.currency)
        script.setAttribute('data-amount-in-cents', data.amountInCents)
        script.setAttribute('data-reference', data.reference)
        script.setAttribute('data-signature:integrity', data.hash)

        // Limpiar contenedor y agregar nuevo script
        if (containerRef.current) {
          containerRef.current.innerHTML = ''
          containerRef.current.appendChild(script)
        }
      } catch (error) {
        console.error('Error loading Wompi widget:', error)
      }
    }

    loadWompiWidget()

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [isOpen, amount])

  return <div ref={containerRef} className="w-full flex justify-center"></div>
}

export default WidgetWompi
