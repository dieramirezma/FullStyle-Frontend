import { notFound } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { plans } from '../data'
import WidgetWompi from '@/components/widget-wompi'

export default async function PlanCheckout ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const plan = plans.find((p) => p.id === parseInt(id))

  if (plan === undefined) {
    notFound()
  }

  // Convertir el precio a número eliminando caracteres no numéricos
  const subtotal = parseInt(plan.price.replace(/[^0-9]/g, ''))
  const discount = 0 // Por ahora sin descuento
  const total = subtotal - discount

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Resumen de la Orden</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Plan {plan.title}</h3>
                <p className="text-sm text-muted-foreground">Facturación anual</p>
              </div>
              <p className="font-medium">${subtotal.toLocaleString()}/año</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Descuento anual (20%)</span>
                  <span>-${discount.toLocaleString()}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-24">
              <WidgetWompi amount={parseInt(plan.price.replace('.', ''))} isOpen={false} label={''} paymentType={'SUB'} itemId={''} onClose={function (): void {
                throw new Error('Function not implemented.')
              } }/>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
