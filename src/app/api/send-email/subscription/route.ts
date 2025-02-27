import { SubscriptionConfirmationEmail } from '@/components/email-templates/subscription'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      ownerName,
      ownerEmail,
      subscriptionPlan,
      paymentDate,
      finishDate
    } = body

    // Generar el contenido del correo
    const emailContent = await SubscriptionConfirmationEmail({
      ownerName,
      subscriptionPlan,
      paymentDate,
      finishDate
    })

    // Enviar correo al usuario
    const { data: responseData, error } = await resend.emails.send({
      from: 'soporte@full-style.com',
      to: [ownerEmail],
      subject: '¡Tu suscripción a FullStyle está activa!',
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
      ownerName: session?.user?.name,
      ownerEmail: session?.user?.email,
      subscriptionPlan: subscriptionDetail[0].plan_name,
      paymentDate: format(new Date(), 'EEEE, d MMMM yyyy'),
    }

    const responseEmail = await fetch('/api/send-email/subscription', {
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
