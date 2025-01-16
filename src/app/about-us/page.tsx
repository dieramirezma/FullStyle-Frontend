import { Handshake, Target } from 'lucide-react'

function Page () {
  return (
    <main className='flex flex-col gap-20 px-10 md:px-28 mb-10'>
      <section className='flex flex-col items-center gap-10 pt-20'>
        <h1 className='title'><Target className='inline-block text-secondary mr-2' />Visión</h1>
        <p className='text-center'>
          Para 2028, seremos la plataforma líder en la gestión del 10% de sitios de estética en Bogotá, ofreciendo una solución que facilite operaciones diarias de agendamiento y gestión, potenciando el éxito de propietarios y mejorando la experiencia de los clientes.
        </p>
        <h1 className='title'><Handshake className='inline-block text-secondary mr-2' />Misión</h1>
        <p className='text-center'>
          Facilitar la gestión de reservas y pagos en sitios de estética mediante una plataforma accesible y confiable, ayudando a propietarios a ahorrar tiempo y mejorar la relación con sus clientes directos.
        </p>
      </section>
    </main>
  )
}

export default Page
