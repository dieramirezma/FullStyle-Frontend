import { PaymentFailureEmail } from '@/components/email-templates/appointment-rejected'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      customerName,
      customerEmail,
      appointmentDate,
      appointmentTime,
      servicePrice
    } = body

    // Generar el contenido del correo
    const emailContent = await PaymentFailureEmail({
      customerName,
      appointmentDate,
      appointmentTime,
      servicePrice
    })

    // Enviar correo al usuario
    const { data: responseData, error } = await resend.emails.send({
      from: 'soporte@full-style.com',
      to: [customerEmail],
      subject: 'Pago rechazado - No se agendó tu cita',
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
    const values = {
      customerName: session?.user?.name,
      customerEmail: session?.user?.email,
      siteName: siteDetail[0].name,
      serviceName: serviceDetail[0].service_name,
      appointmentDate: format(new Date(selectedSlot), 'EEEE, d MMMM yyyy'),
      appointmentTime: format(new Date(selectedSlot), 'HH:mm'),
      servicePrice: serviceDetail[0].price
    }

    const responseEmail = await fetch('/api/send-email/payment-failure', {
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

