import CardPlans from '@/components/card-plans'
import { plans } from './data'

export default function SubscriptionPlans () {
  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-8">Planes de Suscripción</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {plans.map((plan, index) => (
          <CardPlans
            key={plan.id}
            id={plan.id}
            title={plan.title}
            price={plan.price}
            description={plan.description}
            features={plan.features}
            button={plan.button}
            popular={plan.popular}
            icon={plan.icon}
          />
        ))}
      </div>
    </div>
  )
}
