'use client';

import React from 'react';
import { Check, Crown, Sparkles, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import WidgetWompi from '@/components/widget-wompi';
import { plans } from './data';

interface Plan {
  id: number;
  title: string;
  price: string;
  description: string;
  features: string[];
  button: string;
  popular: boolean;
  icon: 'star' | 'sparkles' | 'crown';
}

interface CardPlansProps extends Plan {
  onSelectPlan: (plan: Plan) => void;
}

function CardPlans({
  id,
  title,
  price,
  description,
  features,
  button,
  popular,
  icon,
  onSelectPlan,
  ...plan
}: CardPlansProps) {
  const getIcon = () => {
    switch (icon) {
      case 'star':
        return <Star className="h-6 w-6 text-primary" />;
      case 'sparkles':
        return <Sparkles className="h-6 w-6 text-primary" />;
      case 'crown':
        return <Crown className="h-6 w-6 text-primary" />;
      default:
        return null;
    }
  };

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
            <span className="text-sm font-normal text-muted-foreground">
              {title.toLowerCase() === 'prueba' ? '/mes' : '/año'}
            </span>
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
          onClick={() => onSelectPlan({ id, title, price, description, features, button, popular, icon })}
        >
          {button}
        </Button>
      </CardFooter>
    </Card>
  );
}

function CheckoutDialog({ plan, isOpen, onClose }: {
  plan: Plan | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!plan) return null;

  const priceNumber = plan.price.replace(/[^0-9]/g, '');
  const subtotal = parseInt(priceNumber);
  const discount = 0;
  const total = subtotal - discount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl pointer-events-auto">
        <DialogHeader>
          <DialogTitle>Resumen de la Orden</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Plan {plan.title}</h3>
              <p className="text-sm text-muted-foreground">Facturación anual</p>
            </div>
            <p className="font-medium">${subtotal.toLocaleString()}{plan.title.toLowerCase() === 'prueba' ? '/mes' : '/año'}</p>
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

          <div className="pt-4">
            <WidgetWompi amount={parseInt(priceNumber)} isOpen={isOpen} label="Pagar suscripción" onClose={onClose}
              paymentType="SUB"
              itemId={plan.title} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = React.useState<Plan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-8">Planes de Suscripción</h2>
      <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
        {plans.map((plan) => (
          <CardPlans
            key={plan.id}
            {...plan}
            onSelectPlan={handleSelectPlan}
          />
        ))}
      </div>
      <CheckoutDialog
        plan={selectedPlan}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
