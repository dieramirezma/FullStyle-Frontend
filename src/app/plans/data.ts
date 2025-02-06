export interface Plan {
  id: number
  title: string
  price: string
  description: string
  features: string[]
  button: string
  popular: boolean
  icon: 'star' | 'sparkles' | 'crown'
}

export const plans: Plan[] = [
  {
    id: 1,
    title: 'Básico',
    price: '300.000',
    description: 'Para negocios pequeños que están comenzando',
    features: [
      'Hasta 50 clientes',
      'Sistema de reservas básico',
      'Gestión de clientes',
      'Calendario de citas',
      'Notificaciones por email'
    ],
    // button: 'Comenzar Gratis',
    button: 'Compra Ahora',
    popular: false,
    icon: 'star'
  },
  {
    id: 2,
    title: 'Profesional',
    price: '500.000',
    description: 'Para negocios en crecimiento',
    features: [
      'Hasta 100 clientes',
      'Sistema de reservas avanzado',
      'Gestión de inventario',
      'Reportes y análisis',
      'Notificaciones SMS y email',
      'App móvil para clientes',
      'Programa de fidelización'
    ],
    // button: 'Comenzar 14 días gratis',
    button: 'Compra Ahora',
    popular: true,
    icon: 'sparkles'
  },
  {
    id: 3,
    title: 'Premium',
    price: "1'500.000",
    description: 'Para grandes negocios y franquicias',
    features: [
      'Hasta 500 clientes',
      'Sistema de reservas personalizado',
      'Múltiples ubicaciones',
      'API personalizada',
      'Integración con POS',
      'Soporte prioritario 24/7',
      'Marketing automatizado',
      'Personalización total'
    ],
    // button: 'Contactar Ventas',
    button: 'Compra Ahora',
    popular: false,
    icon: 'crown'
  }
]
