export const PaymentFailureEmail: React.FC<
    Readonly<{
        customerName: string
        appointmentDate: string
        appointmentTime: string
        servicePrice: number
    }>
> = ({
    customerName,
    appointmentDate,
    appointmentTime,
    servicePrice
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
            <h2 style={{ color: '#d9534f', textAlign: 'center' }}>⚠️ Pago Rechazado</h2>
            <p>Hola <strong>{customerName}</strong>,</p>
            <p>Lamentamos informarte que el pago para la reserva de tu cita ha sido rechazado. Debido a esto, la cita no ha sido agendada.</p>

            <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <hr style={{ margin: '10px 0' }} />

                <p><strong>📅 Fecha tentativa:</strong> {appointmentDate}</p>
                <p><strong>⏰ Hora tentativa:</strong> {appointmentTime} hrs</p>
                <p><strong>💰 Monto del servicio:</strong> ${servicePrice}</p>
            </div>

            <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
                Puedes intentar nuevamente con otro método de pago o contactar con nuestro soporte para más información.
            </p>

            <p style={{ fontSize: '14px', color: '#666' }}>
                Si necesitas ayuda, no dudes en comunicarte con nosotros.
            </p>

            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#007bff', textAlign: 'center' }}>
                — El equipo de FullStyle
            </p>
        </div>
    )
