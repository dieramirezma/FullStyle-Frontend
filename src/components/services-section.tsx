import AppointmentIcon from './icons/appointment-icon'
import EmployeesIcon from './icons/employees-icon'
import PaymentIcon from './icons/payment-icon'
import { RankingIcon } from './icons/ranking-icon'

function ServicesSection () {
  return (
    <section id='services' className='flex mt-10 gap-20 items-center w-full md:flex-row flex-col-reverse'>
      <article className='flex flex-col gap-5 w-full items-center'>
        <h2 className='subtitle text-left w-full'>
          ¿Qué le ofrecemos a tu negocio?
        </h2>
        <div className='flex flex-col gap-5 md:w-3/4'>
          <div className='flex items-center gap-5 border-t-2 border-l-2 border-primary p-5'>
            <EmployeesIcon width='50'/>
            <p>Gestión de empleados</p>
          </div>
          <div className='flex items-center md:justify-end gap-5 border-b-2 border-r-2 border-primary p-5'>
            <AppointmentIcon width='50' />
            <p>Agenda de citas para clientes</p>
          </div>
          <div className='flex items-center gap-5 border-t-2 border-l-2 border-primary p-5'>
            <PaymentIcon width='50'/>
            <p>Sistema de pagos integrado</p>
          </div>
          <div className='flex items-center md:justify-end gap-5 border-b-2 border-r-2 border-primary p-5'>
            <RankingIcon width='50'/>
            <p>Visibilidad de tu negocio</p>
          </div>
        </div>
      </article>
    </section>
  )
}

export default ServicesSection
