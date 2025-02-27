import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import * as crypto from 'crypto'
import { format } from 'date-fns'

export interface TransactionData {
  amount: number
  paymentmethod: string
  appointment_id: number
  status: string
}

export interface AppointmentData {
  appointmenttime: string
  status: string
  worker_id: number
  site_id: number
  service_id: number
  client_id: number
}

export interface SubscriptionData {
  subscriptionactive: boolean
  subscriptiontype: string
  subscriptionstartdate: string
  subscriptionfinishdate: string
}

// Implementación simplificada usando el módulo crypto de Node.js
function verifySignature (body: any, receivedSignature: string) {
  const secret = process.env.WOMPI_EVENTS_KEY
  if (!secret) throw new Error('WOMPI_EVENTS_KEY is not defined')

  // Extraer los properties del evento
  const properties = body.signature?.properties || []
  const data = body.data
  let concatenatedValues = ''

  // Paso 1: Concatenar los valores de properties en el orden especificado
  for (const prop of properties) {
    // Navegar la estructura anidada usando el path de la propiedad
    const pathParts = prop.split('.')
    let value = data

    for (const part of pathParts) {
      if (value && typeof value === 'object') {
        value = value[part]
      } else {
        value = undefined
        break
      }
    }

    // Concatenar el valor si existe
    if (value !== undefined) {
      concatenatedValues += value.toString()
    }
  }

  // Paso 2: Concatenar el timestamp
  concatenatedValues += body.timestamp.toString()

  // Paso 3: Concatenar el secreto
  concatenatedValues += secret

  // Paso 4: Generar el hash SHA-256 usando el módulo crypto directamente
  const calculatedSignature = crypto
    .createHash('sha256')
    .update(concatenatedValues)
    .digest('hex')

  // Comparar firmas (la documentación muestra ejemplos en mayúsculas)
  return calculatedSignature.toLowerCase() === receivedSignature.toLowerCase()
}

// Función para obtener detalles del cliente
async function getClientDetails (clientId: number) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const response = await fetch(`${baseUrl}user/${clientId}`)
  console.log('user:', response)

  if (!response.ok) {
    throw new Error(`Error al obtener detalles del cliente: ${response.status}`)
  }

  return await response.json()
}

// Función para obtener detalles de la cita
async function getAppointmentDetails (appointmentId: number) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const response = await fetch(`${baseUrl}appointmentdetail?id=${appointmentId}`)
  console.log('appointment:', response)

  if (!response.ok) {
    throw new Error(`Error al obtener detalles de la cita: ${response.status}`)
  }

  return await response.json()
}

// Función para enviar el correo de confirmación PAGO COMPLETO
async function sendConfirmationFullPaidEmail (clientData: any, appointmentData: any) {
  try {
    const appointmentDate = new Date(appointmentData[0].appointmenttime)

    const values = {
      customerName: clientData?.name || 'Cliente',
      customerEmail: clientData?.email,
      siteName: appointmentData[0].site.name,
      siteAddress: appointmentData[0].site.address,
      sitePhone: appointmentData[0].site.phone,
      serviceName: appointmentData[0].service.name,
      serviceDescription: appointmentData[0].service.description,
      workerName: appointmentData[0].worker.name,
      appointmentDate: format(appointmentDate, 'EEEE, d MMMM yyyy'),
      appointmentTime: format(appointmentDate, 'HH:mm'),
      servicePrice: appointmentData[0].service.price,
      serviceDuration: appointmentData[0].service.duration
    }
    console.log('email service values:', values)

    // URL del API de envío de correo (ajustar según sea necesario)
    const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    const emailEndpoint = `${frontendUrl}/api/send-email/appointment-fullpaid`

    const response = await fetch(emailEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error al enviar correo: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error al enviar el correo de confirmación:', error)
    throw error
  }
}// Función para enviar el correo de confirmación PAGO PARCIAL
async function sendConfirmationPartialPaidEmail (clientData: any, appointmentData: any, partialAmount: number) {
  try {
    const appointmentDate = new Date(appointmentData[0].appointmenttime)

    const values = {
      customerName: clientData?.name || 'Cliente',
      customerEmail: clientData?.email,
      siteName: appointmentData[0].site.name,
      siteAddress: appointmentData[0].site.address,
      sitePhone: appointmentData[0].site.phone,
      serviceName: appointmentData[0].service.name,
      serviceDescription: appointmentData[0].service.description,
      workerName: appointmentData[0].worker.name,
      appointmentDate: format(appointmentDate, 'EEEE, d MMMM yyyy'),
      appointmentTime: format(appointmentDate, 'HH:mm'),
      servicePrice: appointmentData[0].service.price,
      partialPayment: partialAmount,
      serviceDuration: appointmentData[0].service.duration
    }
    console.log('email service values:', values)

    // URL del API de envío de correo (ajustar según sea necesario)
    const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    const emailEndpoint = `${frontendUrl}/api/send-email/appointment-partialpaid`

    const response = await fetch(emailEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error al enviar correo: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error al enviar el correo de confirmación:', error)
    throw error
  }
}// Función para enviar el correo de confirmación SUBSCRIPCION
async function sendSubscriptionConfirmationEmail (clientData: any, subscriptionData: any) {
  try {
    const subscriptionStartDate = new Date(subscriptionData.subscriptionstartdate)
    const subscriptionFinishDate = new Date(subscriptionData.subscriptionfinishdate)

    const values = {
      ownerName: clientData.name,
      ownerEmail: clientData.email,
      subscriptionPlan: subscriptionData.subscriptiontype,
      paymentDate: format(subscriptionStartDate, 'EEEE, d MMMM yyyy'),
      finishDate: format(subscriptionFinishDate, 'EEEE, d MMMM yyyy')
    }
    console.log('email service values:', values)

    // URL del API de envío de correo (ajustar según sea necesario)
    const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    const emailEndpoint = `${frontendUrl}/api/send-email/subscription`

    const response = await fetch(emailEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error al enviar correo: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error al enviar el correo de confirmación:', error)
    throw error
  }
}
// Función para enviar el correo notificacion de pago rechazado
async function sendRejectedPaymentEmail (clientData: any, rejectionData: any) {
  try {
    const appointmentDate = new Date(rejectionData.appointmenttime)

    const values = {
      customerName: clientData?.name,
      customerEmail: clientData?.email,
      appointmentDate: format(appointmentDate, 'EEEE, d MMMM yyyy'),
      appointmentTime: format(appointmentDate, 'HH:mm'),
      servicePrice: rejectionData.price
    }
    console.log('email service values:', values)

    // URL del API de envío de correo (ajustar según sea necesario)
    const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    const emailEndpoint = `${frontendUrl}/api/send-email/appointment-rejected`

    const response = await fetch(emailEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error al enviar correo: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error al enviar el correo de confirmación:', error)
    throw error
  }
}
export async function POST (request: Request) {
  try {
    const headersList = headers()
    const signature = (await headersList).get('X-Event-Checksum')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing required signature header' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Verificar la firma usando el método simplificado
    const isValid = verifySignature(body, signature)

    if (!isValid) {
      console.log('La firma no es válida')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    console.log('Firma verificada correctamente')
    const event = body.event
    const data = body.data
    const reference = data.transaction.reference
    const status = data.transaction.status

    // El resto del código permanece igual
    const [paymentType, userId, itemId, appointmenttime, appointmentStatus, worker_id, site_id, service_id, client_id, paymentManner, finalReference] = reference.split('_')

    // Obtener los detalles del cliente
    console.log('userId: ', userId)
    const clientDetails = await getClientDetails(parseInt(userId))
    console.log('clientDetails:', clientDetails)

    if (event === 'transaction.updated' && status === 'APPROVED') {
      // Diferentes endpoints según el tipo de pago
      const baseUrl = process.env.NEXT_PUBLIC_API_URL

      switch (paymentType) {
        case 'SUB': // Subscripción
          // Crear fechas base
          const startDate = new Date()

          // Calcular la fecha de finalización
          const finishDate = new Date(startDate)
          if (itemId === 'prueba') {
            // Si es de prueba, añadir un mes
            finishDate.setMonth(startDate.getMonth() + 1)
          } else {
            // Si no, añadir un año
            finishDate.setFullYear(startDate.getFullYear() + 1)
          }

          // Formatear las fechas como strings en formato ISO
          const formattedStartDate = startDate.toISOString().split('.')[0]
          const formattedFinishDate = finishDate.toISOString().split('.')[0]

          const subscriptionData: SubscriptionData = {
            subscriptionactive: status === 'APPROVED',
            subscriptiontype: itemId,
            subscriptionstartdate: formattedStartDate,
            subscriptionfinishdate: formattedFinishDate
          }

          // Usar fetch directamente en lugar de apiClient
          const subResponse = await fetch(`${baseUrl}subscription/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscriptionData)
          })

          if (!subResponse.ok) {
            throw new Error(`Error en la creación de suscripción: ${subResponse.status}`)
          }// --- Enviar correo de confirmación ---
          try {
            // Enviar el correo de confirmación
            await sendSubscriptionConfirmationEmail(clientDetails, subscriptionData)


            console.log('Correo de confirmación enviado correctamente')
          } catch (emailError) {
            // No fallar todo el webhook si hay error en el correo
            console.error('Error al enviar el correo, pero el pago se procesó correctamente:', emailError)
          }

          break

        case 'SRV': // Servicio
          const appointmentData: AppointmentData = {
            appointmenttime,
            status: appointmentStatus,
            worker_id: parseInt(worker_id),
            site_id: parseInt(site_id),
            service_id: parseInt(service_id),
            client_id: parseInt(client_id)
          }
          console.log('appointmentData:', appointmentData)
          // Usar fetch directamente en lugar de apiClient
          const serviceResponse = await fetch(`${baseUrl}appointment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentData)
          })

          // Verificar si la respuesta es exitosa
              if (!serviceResponse.ok) {
            const errorData = await serviceResponse.json()
            console.log(errorData)
            throw new Error(`Error en la creación de cita: ${serviceResponse.status}`)
          }

          // Obtener el JSON de la respuesta para extraer el ID
          const appointmentResult = await serviceResponse.json()
          const appointmentId = appointmentResult.id

          const transactionData: TransactionData = {
            amount: data.transaction.amount_in_cents / 100,
            paymentmethod: data.transaction.payment_method_type,
            appointment_id: appointmentId,
            status: 'paid'

          }
          console.log('transactionData:', transactionData)
          // Usar fetch directamente en lugar de apiClient
          const paymentResponse = await fetch(`${baseUrl}payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
          })

          if (!paymentResponse.ok) {
            throw new Error(`Error en el pago: ${paymentResponse.status}`)
          }

          // --- Enviar correo de confirmación ---
          try {
            if (paymentManner === 'FULL') {
              // Obtener los detalles de la cita
              const appointmentDetails = await getAppointmentDetails(appointmentId)
              console.log('appointmentDetails:', appointmentDetails)

              // Enviar el correo de confirmación
              await sendConfirmationFullPaidEmail(clientDetails, appointmentDetails)

              console.log('Correo de confirmación enviado correctamente')
            } else if (paymentManner === 'PART') {
              // Obtener los detalles de la cita
              const appointmentDetails = await getAppointmentDetails(appointmentId)
              console.log('appointmentDetails:', appointmentDetails)

              // Enviar el correo de confirmación
              await sendConfirmationPartialPaidEmail(clientDetails, appointmentDetails, data.transaction.amount_in_cents / 100)

              console.log('Correo de confirmación enviado correctamente')
            }
          } catch (emailError) {
            // No fallar todo el webhook si hay error en el correo
            console.error('Error al enviar el correo, pero el pago se procesó correctamente:', emailError)
          }

          break

        default:
          console.log(`Unknown payment type: ${paymentType}`)
      }
    } else if (status === 'DECLINED' || status === 'ERROR' || status === 'VOIDED') {
      // Obtener los detalles del cliente
      const clientDetails = await getClientDetails(parseInt(client_id))
      console.log('clientDetails:', clientDetails)
      // Manejar fallos según el tipo de pago
      // paymentType, userId, itemId, appointmenttime, appointmentStatus, worker_id, site_id, service_id, client_id, paymentManner
      const rejectionData = {
        appointmenttime,
        price: data.transaction.amount_in_cents / 100
      }
      sendRejectedPaymentEmail(clientDetails, rejectionData)
      console.log(`Payment failed with status: ${status}`)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
