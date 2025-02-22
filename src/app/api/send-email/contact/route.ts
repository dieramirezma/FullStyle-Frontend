import { ContactTemplate } from '@/components/email-templates/contact'
import { type ContactFormData } from '@/types/contact.template'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST (request: Request) {
  try {
    const body: ContactFormData = await request.json()

    const { name, email, message } = body

    const emailContent = await ContactTemplate({ name, email, message })
    const { data: responseData, error } = await resend.emails.send({
      from: 'soporte@full-style.com',
      to: ['soporte@full-style.com'],
      subject: 'Contacto desde el sitio web FullStyle',
      react: emailContent
    })

    if (error !== null && error !== undefined) {
      console.error(error)
      throw new Error(error.message)
    }

    return Response.json(responseData)
  } catch (error) {
    console.error(error)
    return Response.json({ error }, { status: 500 })
  }
}
