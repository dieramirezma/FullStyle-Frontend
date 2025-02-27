import { AppointmentConfirmationEmail } from '@/components/email-templates/appointment-fullpaid'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      customerName,
      customerEmail,
      siteName,
      siteAddress,
      sitePhone,
      serviceName,
      serviceDescription,
      workerName,
      appointmentDate,
      appointmentTime,
      servicePrice,
      serviceDuration
    } = body

    // Generar el contenido del correo
    const emailContent = await AppointmentConfirmationEmail({
      customerName,
      siteName,
      siteAddress,
      sitePhone,
      serviceName,
      serviceDescription,
      workerName,
      appointmentDate,
      appointmentTime,
      servicePrice,
      serviceDuration
    })

    // Enviar correo al usuario
    const { data: responseData, error } = await resend.emails.send({
      from: 'soporte@full-style.com',
      to: [customerEmail],
      subject: 'Confirmación de tu reserva - FullStyle',
      react: emailContent
    })

    if (error) {
      console.error('Error al enviar el correo:', error)
      throw new Error(error.message)
    }

    return Response.json({ message: 'Correo enviado con éxito', responseData })
  } catch (error) {
    console.error('Error en el servidor:', error)
    return Response.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}

/*
  * Example:
    if (!serviceDetail || !siteDetail || !workerDetail) {
      throw new Error('Missing required details')
    }

    const values = {
      customerName: session?.user?.name,
      customerEmail: session?.user?.email,
      siteName: siteDetail[0].name,
      siteAddress: siteDetail[0].address,
      sitePhone: siteDetail[0].phone,
      serviceName: serviceDetail[0].service_name,
      serviceDescription: serviceDetail[0].description,
      workerName: workerDetail[0].name,
      appointmentDate: format(new Date(selectedSlot), 'EEEE, d MMMM yyyy'),
      appointmentTime: format(new Date(selectedSlot), 'HH:mm'),
      servicePrice: serviceDetail[0].price,
      serviceDuration: serviceDetail[0].duration
    }

    const responseEmail = await fetch('/api/send-email/appointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })

    if (!responseEmail.ok) {
      throw new Error('Error al enviar el mensaje.')
    }
*/
