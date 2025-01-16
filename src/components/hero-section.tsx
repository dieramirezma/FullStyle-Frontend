import Link from 'next/link'
import Fullstyle from './icons/fullstyle'
import { buttonVariants } from './ui/button'

function HeroSection () {
  return (
    <div id='hero' className='flex flex-col items-center gap-10'>
      <section className='flex pt-20 gap-20 items-center md:flex-row flex-col-reverse'>
        <div>
          <Fullstyle width='200'/>
        </div>
        <article className='flex flex-col gap-5'>
          <h1 className='title'>
            Revoluciona tu negocio de belleza con FullStyle: La herramienta que transforma tu barbería o salón
          </h1>
          <p>
            En un mundo donde el tiempo es oro, muchos negocios de barbería y estética enfrentan retos como la falta de organización, pérdida de clientes por citas mal gestionadas, y la dificultad de hacer crecer su presencia en un mercado competitivo. <span className='text-secondary'>FullStyle es la plataforma ideal para simplificar tus operaciones diarias, mejorar la experiencia de tus clientes y llevar tu negocio al siguiente nivel.</span>
          </p>
        </article>
      </section>
      <section className='text-center w-full'>
        <h2 className='subtitle mb-5'>
          ¿Por qué FullStyle?
        </h2>
        <div className='flex justify-between md:flex-row flex-col gap-5'>
          <p className='border-t-2 border-l-2 border-primary p-5 hover:scale-105 transition-transform duration-500'>
            Optimización de la gestión
          </p>
          <p className='border-b-2 border-r-2 border-primary p-5 hover:scale-105 transition-transform duration-500'>
            Incremento de ingresos
          </p>
          <p className='border-t-2 border-l-2 border-primary p-5 hover:scale-105 transition-transform duration-500'>
            Experiencia del cliente
          </p>
          <p className='border-b-2 border-r-2 border-primary p-5 hover:scale-105 transition-transform duration-500'>
            Facilidad de uso
          </p>
        </div>
      </section>
      <section className='text-center'>
        <h2 className='subtitle mb-5'>
          ¿Listo para transformar tu negocio? ¡Empieza hoy con FullStyle y experimenta la diferencia!
        </h2>
        <Link
          href='/register'
          className={`${buttonVariants({ variant: 'default' })}`}
        >
          SOLICITA UNA DEMO
        </Link>
      </section>
    </div>
  )
}

export default HeroSection
