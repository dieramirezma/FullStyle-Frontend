import { buttonVariants } from '@/components/ui/button'
import { Shield } from 'lucide-react'
import Link from 'next/link'

function DataPolicy () {
  return (
    <main className='flex flex-col gap-20 px-10 md:px-28 mb-10'>
      <div id='data-policy' className='flex flex-col items-center gap-10'>
        <section className='flex pt-20 gap-10 flex-col'>
          <h1 className='title'>
            <Shield className='inline-block text-primary mr-2' />Política de Tratamiento de Datos
          </h1>
          <article className='flex flex-col gap-5'>
            <p>
              En <span className='text-secondary'>FullStyle</span>, nos comprometemos a proteger la privacidad de nuestros usuarios y a garantizar la seguridad de sus datos personales. Esta política de tratamiento de datos describe cómo recopilamos, utilizamos, almacenamos y protegemos la información personal de nuestros usuarios.
            </p>
            <h2 className='subtitle'><Shield className='inline-block text-primary mr-2' />Responsable del Tratamiento</h2>
            <p>
              El responsable del tratamiento de los datos personales es FullStyle, con domicilio en Bogotá y correo electrónico <Link href='mailto:oficial.fullstyle@gmail.com'>oficial.fullstyle@gmail.com</Link>.
            </p>
            <h2 className='subtitle'><Shield className='inline-block text-primary mr-2' />Finalidad del Tratamiento</h2>
            <p>
              Los datos personales recopilados serán utilizados para las siguientes finalidades:
            </p>
            <ul className='list-disc list-inside'>
              <li>Gestionar las citas y pagos de los clientes.</li>
              <li>Crear y administrar negocios virtuales.</li>
              <li>Administrar empleados y recibir pagos de servicios y reservas.</li>
              <li>Enviar comunicaciones relacionadas con los servicios ofrecidos.</li>
            </ul>
            <h2 className='subtitle'><Shield className='inline-block text-primary mr-2' />Datos Personales Recopilados</h2>
            <p>
              <strong>Clientes:</strong> Nombre, correo electrónico y contraseña.
            </p>
            <p>
              <strong>Gerentes de Negocios:</strong> Nombre, correo electrónico, contraseña, número de teléfono, datos de cuenta bancaria para realizar los depósitos de las reservas y dirección del negocio.
            </p>
            <h2 className='subtitle'><Shield className='inline-block text-primary mr-2' />Derechos de los Titulares</h2>
            <p>
              Los titulares de los datos personales tienen los siguientes derechos:
            </p>
            <ul className='list-disc list-inside'>
              <li>Conocer, actualizar y rectificar sus datos personales.</li>
              <li>Solicitar la supresión de sus datos personales cuando consideren que no están siendo tratados conforme a los principios, derechos y garantías constitucionales y legales.</li>
              <li>Acceder de manera gratuita a sus datos personales que hayan sido objeto de tratamiento.</li>
            </ul>
            <h2 className='subtitle'><Shield className='inline-block text-primary mr-2' />Procedimiento para Ejercer los Derechos</h2>
            <p>
              Para ejercer sus derechos, los titulares de los datos personales pueden enviar una solicitud por escrito a <span className='text-secondary'><Link href='mailto:oficial.fullstyle@gmail.com'>oficial.fullstyle@gmail.com</Link></span>, especificando claramente el derecho que desean ejercer y adjuntando una copia de su documento de identidad.
            </p>
            <h2 className='subtitle'><Shield className='inline-block text-primary mr-2' />Medidas de Seguridad</h2>
            <p>
              Implementamos medidas técnicas y organizativas adecuadas para proteger los datos personales contra el acceso no autorizado, la pérdida, la alteración o la divulgación. Las contraseñas son encriptadas con algoritmos de alta confianza y seguridad.
            </p>
            <h2 className='subtitle'><Shield className='inline-block text-primary mr-2' />Actualización de la Política</h2>
            <p>
              Esta política de tratamiento de datos puede ser actualizada periódicamente para reflejar cambios en nuestras prácticas de privacidad. Las actualizaciones serán publicadas en nuestro sitio web.
            </p>
            <h2 className='subtitle'><Shield className='inline-block text-primary mr-2' />Contacto</h2>
            <p>
              Si tienes alguna pregunta o inquietud sobre esta política de tratamiento de datos, puedes contactarnos a través de <span className='text-secondary'><Link href='mailto:oficial.fullstyle@gmail.com'>oficial.fullstyle@gmail.com</Link></span>.
            </p>
            <h2 className='subtitle'><Shield className='inline-block text-primary mr-2' />Consentimiento</h2>
            <p>
              Al utilizar nuestro sitio web, los usuarios aceptan los términos de esta política de tratamiento de datos y consienten el tratamiento de sus datos personales conforme a lo establecido en la misma.
            </p>
            <p>
              Esta política está alineada con las disposiciones del <span className='text-secondary'><Link href='https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=53646' target='_blank'>Decreto 1377 de 2013</Link></span>, que reglamenta parcialmente la Ley 1581 de 2012.

            </p>
          </article>
        </section>
        <section className='text-center'>
          <Link
            href='mailto:oficial.fullstyle@gmail.com'
            className={`${buttonVariants({ variant: 'default' })}`}
          >
            Contactar para más información
          </Link>
        </section>
      </div>
    </main>
  )
}

export default DataPolicy
