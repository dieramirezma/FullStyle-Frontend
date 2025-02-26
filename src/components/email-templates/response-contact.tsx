export const AutoReplyTemplate: React.FC<Readonly<{ name: string }>> = ({ name }) => (
  <div style={{
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center'
  }}>
    <h1 style={{ color: '#333' }}>¡Hola {name}! 👋</h1>
    <p>Gracias por contactarnos en <strong>FullStyle</strong>. Hemos recibido tu mensaje y nuestro equipo te responderá pronto. ⏳</p>
    <hr />
    <p style={{ fontSize: '14px', color: '#666' }}>
      📧 Este es un mensaje automático, no es necesario responder.
    </p>
    <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#007bff' }}>
      — El equipo de FullStyle
    </p>
  </div>
)
