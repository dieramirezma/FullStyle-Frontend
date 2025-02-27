export const AppointmentCancellationEmail: React.FC<
    Readonly<{
        customerName: string
        siteName: string
        siteAddress: string
        sitePhone: string
        serviceName: string
        workerName: string
        appointmentDate: string
        appointmentTime: string
    }>
> = ({
    customerName,
    siteName,
    siteAddress,
    sitePhone,
    serviceName,
    workerName,
    appointmentDate,
    appointmentTime
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
            <h2 style={{ color: '#d9534f', textAlign: 'center' }}>📅 Cita Cancelada</h2>
            <p>Hola <strong>{customerName}</strong>,</p>
            <p>Has cancelado tu cita en <strong>{siteName}</strong>. Lamentamos que no puedas asistir en esta ocasión.</p>

            <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h3 style={{ marginBottom: '5px', color: '#d9534f' }}>{serviceName}</h3>

                <hr style={{ margin: '10px 0' }} />

                <p><strong>📅 Fecha:</strong> {appointmentDate}</p>
                <p><strong>⏰ Hora:</strong> {appointmentTime} hrs</p>
                <p><strong>👤 Profesional:</strong> {workerName}</p>

                <hr style={{ margin: '10px 0' }} />

                <h4 style={{ marginBottom: '5px', color: '#333' }}>📍 Ubicación</h4>
                <p>{siteName}</p>
                <p>{siteAddress}</p>
                <p>📞 {sitePhone}</p>
            </div>

            <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
                Si deseas agendar una nueva cita, puedes hacerlo en nuestra plataforma en cualquier momento.
            </p>

            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#007bff', textAlign: 'center' }}>
                — El equipo de FullStyle
            </p>
        </div>
    )
