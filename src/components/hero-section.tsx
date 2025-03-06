'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Fullstyle from './icons/fullstyle'
import { buttonVariants } from './ui/button'
import { Separator } from '@/components/ui/separator'
import AppointmentIcon from './icons/appointment-icon'
import EmployeesIcon from './icons/employees-icon'
import PaymentIcon from './icons/payment-icon'
import { RankingIcon } from './icons/ranking-icon'

function HeroSection () {
  const services = [
    {
      icon: <EmployeesIcon />,
      title: 'Gestión de empleados',
      description: 'Administra fácilmente los horarios, turnos y disponibilidad de tu equipo en un solo lugar.'
    },
    {
      icon: <AppointmentIcon />,
      title: 'Agenda de citas para clientes',
      description: 'Ofrece a tus clientes una forma rápida y sencilla de agendar citas, reduciendo cancelaciones y optimizando tu tiempo.'
    },
    {
      icon: <PaymentIcon />,
      title: 'Sistema de pagos integrado',
      description: 'Facilita los pagos con opciones seguras y automatizadas, mejorando la experiencia de tus clientes y tu flujo de caja.'
    },
    {
      icon: <RankingIcon />,
      title: 'Visibilidad de tu negocio',
      description: 'Aumenta tu presencia en línea y atrae más clientes con herramientas de marketing y promoción digital.'
    }
  ]

  return (
    <div id='hero' className='flex flex-col items-center gap-10'>
      <motion.section
        className='flex pt-20 gap-20 items-center md:flex-row flex-col-reverse'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Fullstyle width='200' />
        </motion.div>
        <motion.article
          className='flex flex-col gap-5'
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h1 className='title'>
            Gestiona tu negocio de belleza sin complicaciones y atrae más clientes con FullStyle
          </h1>
          <p>
            Olvídate de las citas perdidas, el desorden en la agenda y la falta de visibilidad. Con FullStyle, simplificas la gestión de tu barbería o salón, ofreciendo a tus clientes una experiencia fácil y profesional. Automatiza tus reservas, evita cancelaciones de última hora y haz que tu negocio crezca sin esfuerzo.
          </p>
        </motion.article>
      </motion.section>
      <div className="p-8 bg-white" id="services">
        <h2 className="subtitle text-left w-full mb-4">
          Convierte tu negocio en un éxito con estas herramientas
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
              className="p-6 bg-gray-100 rounded-lg shadow-lg cursor-pointer"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-blue-600 w-12 h-12">
                  {service.icon}
                </div>
                <h3 className="font-semibold text-lg">
                  {service.title}
                </h3>
                <p className='text-sm '>
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />
      <motion.section
        className='text-center'
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <h2 className='subtitle mb-5'>
          ¡Empieza hoy con FullStyle y experimenta la diferencia!
        </h2>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href='/register'
            className={`${buttonVariants({ variant: 'default' })}`}
          >
            SOLICITA UNA DEMO
          </Link>
        </motion.div>
      </motion.section>
    </div>
  )
}

export default HeroSection
