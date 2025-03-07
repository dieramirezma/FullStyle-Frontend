'use client'

import { motion } from 'framer-motion'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import GoogleMapComponent from './map'
import { Textarea } from './ui/textarea'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.'
  }).max(50, {
    message: 'El nombre debe tener máximo 50 caracteres.'
  }),
  email: z.string().email({
    message: 'El correo debe ser válido.'
  }).max(50, {
    message: 'El correo debe tener máximo 50 caracteres.'
  }),
  message: z.string().min(10, {
    message: 'El mensaje debe tener al menos 10 caracteres.'
  }).max(200, {
    message: 'El mensaje debe tener máximo 200 caracteres.'
  })
})

function ContactSection () {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: 'Hola! Estoy interesado en los servicios mencionados. ¿Podemos agendar una cita?'
    }
  })

  async function onSubmit (values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/send-email/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      if (!response.ok) {
        form.reset()
        throw new Error('Error al enviar el mensaje.')
      }

      toast.success('Mensaje enviado con éxito', {
        description: new Date().toLocaleString()
      })
    } catch (error) {
      toast.error('Error al enviar el mensaje', {
        description: 'Por favor intenta más tarde.'
      })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <motion.section
      id='contact'
      className='flex my-10 gap-20 items-center w-full md:flex-row flex-col-reverse'
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
    >
      <article className='flex flex-col gap-5 w-full'>
        <motion.h2
          className='subtitle text-left w-full'
          variants={itemVariants}
        >
          Contáctanos
        </motion.h2>
        <div className='flex gap-5 md:flex-row flex-col'>
          <motion.div
            className='flex-1'
            variants={itemVariants}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <motion.div
                  variants={itemVariants}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input
                            className='h-12'
                            placeholder="Tu nombre aquí"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo</FormLabel>
                        <FormControl>
                          <Input
                            className='h-12'
                            placeholder="tucorreo@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                >
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensaje</FormLabel>
                        <FormControl>
                          <Textarea
                            className='h-32 resize-none'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant='outline'
                    type="submit"
                  >
                    Enviar
                  </Button>
                </motion.div>
              </form>
            </Form>
          </motion.div>
          <motion.div
            className='flex-1'
            variants={itemVariants}
          >
            <GoogleMapComponent position={{
              lat: 4.637379162836954,
              lng: -74.08382826724461
            }}
            />
          </motion.div>
        </div>
      </article>
    </motion.section>
  )
}

export default ContactSection
