interface EmailTemplateProps {
  name: string
  email: string
  message: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
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
