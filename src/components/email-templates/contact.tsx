import { type ContactFormData } from '@/types/contact.template'

export const ContactTemplate: React.FC<Readonly<ContactFormData>> = ({
  name, email, message
}) => (
  <div>
    <h1>{ name } te ha enviado un mensaje!</h1>
    <h2>Contenido del mensaje:</h2>
    <p>Nombre: {name}</p>
    <p>Correo: {email}</p>
    <p>Mensaje: {message}</p>
    <p>Fecha: {new Date().toISOString()}</p>
    <small>No olvides responder al correo</small>
  </div>
)
