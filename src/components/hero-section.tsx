'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Fullstyle from './icons/fullstyle'
import { buttonVariants } from './ui/button'
import { Separator } from '@/components/ui/separator'

function HeroSection() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const benefitVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3
      }
    }
  }

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
            Revoluciona tu negocio de belleza con FullStyle: La herramienta que transforma tu barbería o salón
          </h1>
          <p>
            En un mundo donde el tiempo es oro, muchos negocios de barbería y estética enfrentan retos como la falta de organización, pérdida de clientes por citas mal gestionadas, y la dificultad de hacer crecer su presencia en un mercado competitivo. {' '}
            <motion.span
              className='text-secondary'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              FullStyle es la plataforma ideal para simplificar tus operaciones diarias, mejorar la experiencia de tus clientes y llevar tu negocio al siguiente nivel.
            </motion.span>
          </p>
        </motion.article>
      </motion.section>

      <motion.section
        className='text-center w-full'
        {...fadeIn}
      >
        <motion.h2
          className='subtitle mb-5'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Separator className="my-8" />
          ¿Por qué FullStyle?
        </motion.h2>
        <motion.div
          className='flex justify-between md:flex-row flex-col gap-5'
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            'Optimización de la gestión',
            'Incremento de ingresos',
            'Experiencia del cliente',
            'Facilidad de uso'
          ].map((benefit, index) => (
            <motion.p
              key={benefit}
              className={`p-5 ${index % 2 === 0
                ? 'border-t-2 border-l-2'
                : 'border-b-2 border-r-2'
                } border-primary`}
              variants={benefitVariants}
              whileHover="hover"
            >
              {benefit}
            </motion.p>
          ))}
        </motion.div>
      </motion.section>

      <Separator className="my-4" />
      <motion.section
        className='text-center'
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <h2 className='subtitle mb-5'>
          ¿Listo para transformar tu negocio?
        </h2>
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
