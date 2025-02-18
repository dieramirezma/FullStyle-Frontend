'use client'

import { motion } from 'framer-motion'
import AppointmentIcon from './icons/appointment-icon'
import EmployeesIcon from './icons/employees-icon'
import PaymentIcon from './icons/payment-icon'
import { RankingIcon } from './icons/ranking-icon'

function ServicesSection () {
  const services = [
    {
      icon: <EmployeesIcon />,
      title: 'Gestión de empleados'
    },
    {
      icon: <AppointmentIcon />,
      title: 'Agenda de citas para clientes'
    },
    {
      icon: <PaymentIcon />,
      title: 'Sistema de pagos integrado'
    },
    {
      icon: <RankingIcon />,
      title: 'Visibilidad de tu negocio'
    }
  ]

  return (
    <div className="p-8">
      <h2 className="subtitle text-left w-full mb-4">
        ¿Qué le ofrecemos a tu negocio?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                delay: index * 0.2,
                duration: 0.5
              }
            }}
            viewport={{ once: true }}
            className="p-6 bg-white rounded-lg shadow-lg cursor-pointer"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-blue-600 w-12 h-12">
                {service.icon}
              </div>
              <h3 className="font-semibold text-lg">
                {service.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ServicesSection
