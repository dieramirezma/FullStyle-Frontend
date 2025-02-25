import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient'

export interface TransactionData {
    amount: number
    paymentmethod: string
    appointment_id: number
}
export interface AppointmentData {
    appointmenttime: string,
    status: string,
    worker_id: number,
    site_id: number,
    service_id: number,
    client_id: number
}
export interface SubscriptionData {
    subscriptionactive: boolean
    subscriptiontype: string
    subscriptionstartdate: string
    subscriptionfinishdate: string
}

async function verifySignature(
    timestamp: string,
    nonce: string,
    transmissionId: string,
    eventData: string,
    signature: string
) {
    const secret = process.env.WOMPI_EVENTS_KEY;
    if (!secret) throw new Error('WOMPI_EVENTS_KEY is not defined');

    const concatenatedData = `${timestamp}.${nonce}.${transmissionId}.${eventData}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(concatenatedData);
    const key = encoder.encode(secret);

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, data);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const calculatedSignature = signatureArray
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');

    console.log('Calculated signature:', calculatedSignature);
    console.log('Received signature:', signature);
    return calculatedSignature === signature;
}

export async function POST(request: Request) {
    try {
        // const headersList = headers();
        // const timestamp = (await headersList).get('wompi-timestamp');
        // const nonce = (await headersList).get('wompi-nonce');
        // const transmissionId = (await headersList).get('wompi-transmission-id');
        // const signature = (await headersList).get('X-Event-Checksum');


        // if (!timestamp || !nonce || !transmissionId || !signature) {
        //     return NextResponse.json(
        //         { error: 'Missing required headers' },
        //         { status: 400 }
        //     );
        // }

        const body = await request.json();
        const eventData = JSON.stringify(body);

        // const isValid = await verifySignature(
        //     timestamp,
        //     nonce,
        //     transmissionId,
        //     eventData,
        //     signature
        // );

        // if (!isValid) {
        //     return NextResponse.json(
        //         { error: 'Invalid signature' },
        //         { status: 401 }
        //     );
        // }

        const event = body.event;
        const data = body.data;
        const reference = data.transaction.reference;
        const status = data.transaction.status;

        // Extraer el tipo de pago y el ID real de la referencia
        const [paymentType, userId, itemId, appointmenttime, appointmentStatus, worker_id, site_id, service_id, client_id, finalReference] = reference.split('_');

        if (event === 'transaction.updated' && status === 'APPROVED') {
            // Diferentes endpoints según el tipo de pago
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;

            switch (paymentType) {
                case 'SUB': // Subscripción
                    // Crear fechas base
                    const startDate = new Date();

                    // Calcular la fecha de finalización
                    let finishDate = new Date(startDate);
                    if (itemId === 'prueba') {
                        // Si es de prueba, añadir un mes
                        finishDate.setMonth(startDate.getMonth() + 1);
                    } else {
                        // Si no, añadir un año
                        finishDate.setFullYear(startDate.getFullYear() + 1);
                    }

                    // Formatear las fechas como strings en formato ISO
                    const formattedStartDate = startDate.toISOString().split('.')[0]; // '2025-02-24T12:00:00'
                    const formattedFinishDate = finishDate.toISOString().split('.')[0]; // '2026-02-24T12:00:00'

                    const subscriptionData: SubscriptionData = {
                        subscriptionactive: status === 'APPROVED',
                        subscriptiontype: itemId,
                        subscriptionstartdate: formattedStartDate,
                        subscriptionfinishdate: formattedFinishDate
                    }

                    console.log('Usuario:', userId, 'Datos de suscripción:', subscriptionData);

                    // Usar fetch directamente en lugar de apiClient
                    const subResponse = await fetch(`${baseUrl}/subscription/${userId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(subscriptionData)
                    });
                    break; // Asegúrate de tener un break aquí para que no continúe al caso siguiente

                case 'SRV': // Servicio
                    // console.log('originalReference', originalReference)
                    // const [appointmenttime, appointmentStatus, worker_id, site_id, service_id, client_id, finalReference] = originalReference.split('_');
                    console.log(appointmenttime, appointmentStatus, worker_id, site_id, service_id, client_id)
                    const appointmentData: AppointmentData = {
                        appointmenttime: appointmenttime,
                        status: appointmentStatus,
                        worker_id: parseInt(worker_id),
                        site_id: parseInt(site_id),
                        service_id: parseInt(service_id),
                        client_id: parseInt(client_id)
                    }

                    console.log(appointmentData)
                    // Usar fetch directamente en lugar de apiClient
                    const serviceResponse = await fetch(`${baseUrl}/appointment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(appointmentData)
                    });

                    // Verificar si la respuesta es exitosa
                    if (!serviceResponse.ok) {
                        const errorData = await serviceResponse.json();
                        console.error('Error en la respuesta de cita:', errorData);
                        throw new Error(`Error en la creación de cita: ${serviceResponse.status}`);
                    }

                    // Obtener el JSON de la respuesta para extraer el ID
                    const appointmentResult = await serviceResponse.json();
                    const appointmentId = appointmentResult.id; // Asumiendo que la API devuelve el ID como "id"

                    const transactionData: TransactionData = {
                        amount: data.transaction.amount_in_cents / 100,
                        paymentmethod: data.transaction.payment_method_type,
                        appointment_id: appointmentId // Usar el ID obtenido de la respuesta anterior
                    }

                    console.log(transactionData)
                    // Usar fetch directamente en lugar de apiClient
                    const paymentResponse = await fetch(`${baseUrl}/payment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(transactionData)
                    });

                    if (!paymentResponse.ok) {
                        const errorData = await paymentResponse.json();
                        console.error('Error en la respuesta de pago:', errorData);
                        throw new Error(`Error en el pago: ${paymentResponse.status}`);
                    }
                    break;

                default:
                    console.log(`Unknown payment type: ${paymentType}`);
            }
        } else if (status === 'DECLINED' || status === 'ERROR' || status === 'VOIDED') {
            // Manejar fallos según el tipo de pago
            // const baseUrl = process.env.API_BASE_URL;

            // switch (paymentType) {
            //     case 'SUB':
            //         await fetch(`${baseUrl}/api/subscriptions/failed`, {
            //             method: 'POST',
            //             headers: {
            //                 'Content-Type': 'application/json',
            //             },
            //             body: JSON.stringify({
            //                 reference: realReference,
            //                 status,
            //                 reason: data.transaction.status_message,
            //             }),
            //         });
            //         break;

            //     case 'SRV':
            //         await fetch(`${baseUrl}/api/services/payment/failed`, {
            //             method: 'POST',
            //             headers: {
            //                 'Content-Type': 'application/json',
            //             },
            //             body: JSON.stringify({
            //                 reference: realReference,
            //                 status,
            //                 reason: data.transaction.status_message,
            //             }),
            //         });
            //         break;
            // }
        }

        return NextResponse.json({ status: 'ok' });

    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}