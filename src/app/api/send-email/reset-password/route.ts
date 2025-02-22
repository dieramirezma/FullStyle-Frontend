import { ResetPasswordTemplate } from '@/components/email-templates/reset-password'
import { type ResetPasswordFormData } from '@/types/reset-password.template'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST (request: Request) {
  try {
    const body: ResetPasswordFormData = await request.json()

    const { name, email } = body

    const emailContent = await ResetPasswordTemplate({ name, email })

    const { data, error } = await resend.emails.send({
      from: 'soporte@full-style.com',
      to: [email],
      subject: 'Recuperación de contraseña',
      react: emailContent
    })

    if (error) return Response.json({ error }, { status: 500 })

    return Response.json(data)
  } catch (error) {
    return Response.json({ error }, { status: 500 })
  }
}
