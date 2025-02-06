'use client'

import { Check, Crown, Sparkles, Star } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { useRouter } from 'next/navigation'

interface CardPlansProps {
  id: number
  title: string
  price: string
  description: string
  features: string[]
  button: string
  popular: boolean
  icon: 'star' | 'sparkles' | 'crown'
}

function CardPlans ({ id, title, price, description, features, button, popular, icon }: CardPlansProps) {
  const router = useRouter()

  const getIcon = () => {
    switch (icon) {
      case 'star':
        return <Star className="h-6 w-6 text-primary" />
      case 'sparkles':
        return <Sparkles className="h-6 w-6 text-primary" />
      case 'crown':
        return <Crown className="h-6 w-6 text-primary" />
      default:
        return null
    }
  }

  return (
    <Card className="flex flex-col relative">
      <div className="absolute -top-4 left-0 right-0 flex justify-center">
        {popular && <Badge className="bg-primary text-primary-foreground">Más Popular</Badge>}
      </div>
      <CardHeader className="flex-1">
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          {getIcon()}
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-3xl font-bold">
            ${price}
            <span className="text-sm font-normal text-muted-foreground">/año</span>
          </p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 text-primary mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant="default"
          onClick={() => { router.push(`/plans/${id}`) }}
        >
          {button}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CardPlans
