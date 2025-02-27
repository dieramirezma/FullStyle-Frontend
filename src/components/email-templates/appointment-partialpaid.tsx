export const PartialPaymentConfirmationEmail: React.FC<
    Readonly<{
        customerName: string
        siteName: string
        siteAddress: string
        sitePhone: string
        serviceName: string
        serviceDescription?: string
        workerName: string
        appointmentDate: string
        appointmentTime: string
        servicePrice: number
        partialPayment: number
        serviceDuration: number
    }>
> = ({
    customerName,
    siteName,
    siteAddress,
    sitePhone,
    serviceName,
    serviceDescription,
    workerName,
    appointmentDate,
    appointmentTime,
    servicePrice,
    partialPayment,
    serviceDuration
}) => (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            textAlign: 'left'
        }}>
            <h2 style={{ color: '#333', textAlign: 'center' }}>Confirmación de Pago de Reserva</h2>
            <p>Hola <strong>{customerName}</strong>,</p>
            <p>Tu pago parcial para la reserva de tu cita ha sido confirmado con éxito. Aquí están los detalles:</p>

            <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h3 style={{ marginBottom: '5px', color: '#007bff' }}>{serviceName}</h3>
                <p style={{ fontSize: '14px', color: '#555' }}>{serviceDescription ?? 'Sin descripción'}</p>

                <hr style={{ margin: '10px 0' }} />

                <p><strong>📅 Fecha:</strong> {appointmentDate}</p>
                <p><strong>⏰ Hora:</strong> {appointmentTime} hrs</p>
                <p><strong>👤 Profesional:</strong> {workerName}</p>
                <p><strong>⏳ Duración:</strong> {serviceDuration} minutos</p>

                <hr style={{ margin: '10px 0' }} />

                <h4 style={{ marginBottom: '5px', color: '#333' }}>📍 Ubicación</h4>
                <p>{siteName}</p>
                <p>{siteAddress}</p>
                <p>📞 {sitePhone}</p>

                <hr style={{ margin: '10px 0' }} />

                <h4 style={{ marginBottom: '5px', color: '#333' }}>💰 Detalles del pago</h4>
                <p><strong>Monto total del servicio:</strong> ${servicePrice}</p>
                <p><strong>Monto pagado:</strong> ${partialPayment}</p>
                <p><strong>Monto pendiente:</strong> ${servicePrice - partialPayment}</p>
            </div>

            <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
                Recuerda que el saldo pendiente deberá ser cancelado el día de tu cita. Si tienes alguna duda, no dudes en contactarnos.
            </p>

            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#007bff', textAlign: 'center' }}>
                — El equipo de FullStyle
            </p>
        </div>
    )
