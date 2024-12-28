import { EmailTemplate } from '@/components/email-template'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  email: string
  message: string
}

export async function POST (request: Request) {
  try {
    const body: ContactFormData = await request.json()

    const { name, email, message } = body
    console.log('name ', name)
    console.log(body)
    const emailContent = await EmailTemplate({ name, email, message })
    const { data: responseData, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['dieramirezma@unal.edu.co'],
      subject: 'Contacto desde el sitio web FullStyle',
      react: emailContent
    })

    if (error !== null && error !== undefined) {
      return Response.json({ error }, { status: 500 })
    }

    return Response.json(responseData)
  } catch (error) {
    console.error(error)
    return Response.json({ error }, { status: 500 })
  }
}
