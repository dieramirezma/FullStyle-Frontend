import { type ContactFormData } from '@/types/contact.template'

export const ContactTemplate: React.FC<Readonly<ContactFormData>> = ({
  name, email, message
}) => (
  <div style={{
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9'
  }}>
    <h1 style={{ color: '#333' }}>📩 Nuevo mensaje de {name}</h1>
    <p><strong>Nombre:</strong> {name}</p>
    <p><strong>Correo:</strong> <a href={`mailto:${email}`} style={{ color: '#007bff' }}>{email}</a></p>
    <p><strong>Mensaje:</strong></p>
    <blockquote style={{
      fontStyle: 'italic',
      backgroundColor: '#fff',
      padding: '10px',
      borderLeft: '4px solid #007bff'
    }}>
      {message}
    </blockquote>
    <p><strong>Fecha:</strong> {new Date().toLocaleString()}</p>
    <hr />
    <p style={{ fontSize: '12px', color: '#666' }}>
      🔔 No olvides responder este mensaje lo antes posible.
    </p>
  </div>
)
