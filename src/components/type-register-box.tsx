import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export default function TypeRegisterBox () {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl">Registro</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="font-semibold text-lg">Te estás registrando como:</p>
        <div className="grid gap-6">
          <Link
            href="/register/customer"
            className="group rounded-lg border p-4 transition-colors hover:border-primary hover:bg-muted"
          >
            <div className="space-y-2">
              <span className="block text-xl font-medium transition-colors group-hover:text-primary sm:text-2xl">
                Cliente
              </span>
              <p className="text-sm text-muted-foreground sm:text-base">Buscas algún servicio o centro de estética</p>
            </div>
          </Link>

          <Link
            href="/register/owner"
            className="group rounded-lg border p-4 transition-colors hover:border-primary hover:bg-muted"
          >
            <div className="space-y-2">
              <span className="block text-xl font-medium transition-colors group-hover:text-primary sm:text-2xl">
                Dueño de estética
              </span>
              <p className="text-sm text-muted-foreground sm:text-base">Buscas gestionar tu centro de estética</p>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
