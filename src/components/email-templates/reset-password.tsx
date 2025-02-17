import { type ResetPasswordFormData } from '@/types/reset-password.template'

export const ResetPasswordTemplate: React.FC<Readonly<ResetPasswordFormData>> = ({ name, email }) => (
  <div>
    <h1>Hola, {name}</h1>
    <p>Has solicitado restablecer tu contraseña.</p>
    <p>Haz clic en el siguiente enlace para continuar con el proceso:</p>
    <a href={'http://localhost:3000/customer'} target="_blank" rel="noopener noreferrer">
      Restablecer contraseña
    </a>
    <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
    <small>Atentamente, el equipo de soporte.</small>
  </div>
)
