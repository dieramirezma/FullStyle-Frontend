import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient'

export interface TransactionData {
    amount: number
    paymentmethod: string
    appointment_id: string
    customer_email: string
}
export interface SubscriptionData {
    subscriptionactive: boolean
    subscriptiontype: string
    subscriptionstartdate: Date
    subscriptionfinishdate: Date
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
        const headersList = headers();
        const timestamp = (await headersList).get('wompi-timestamp');
        const nonce = (await headersList).get('wompi-nonce');
        const transmissionId = (await headersList).get('wompi-transmission-id');
        const signature = (await headersList).get('wompi-signature');

        console.log('Headers:', timestamp, nonce, transmissionId, signature);

        if (!timestamp || !nonce || !transmissionId || !signature) {
            return NextResponse.json(
                { error: 'Missing required headers' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const eventData = JSON.stringify(body);

        const isValid = await verifySignature(
            timestamp,
            nonce,
            transmissionId,
            eventData,
            signature
        );

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }

        const event = body.event;
        const data = body.data;
        const reference = data.transaction.reference;
        const status = data.transaction.status;

        // Extraer el tipo de pago y el ID real de la referencia
        const [paymentType, userId, itemId, originalReference] = reference.split('_');

        if (event === 'transaction.updated' && status === 'APPROVED') {
            // Diferentes endpoints según el tipo de pago
            const baseUrl = process.env.API_BASE_URL;

            switch (paymentType) {
                case 'SUB': // Subscripción
                    const subscriptionData: SubscriptionData = {
                        subscriptionactive: status == 'APPROVED' ? true : false,
                        subscriptiontype: itemId,
                        subscriptionstartdate: new Date(),
                        subscriptionfinishdate: itemId == 'prueba' ? new Date(new Date().setMonth(new Date().getMonth() + 1)) : new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                    }
                    await apiClient.post(`subscription/${userId}`, subscriptionData)
                    break;

                case 'SRV': // Servicio
                    const transactionData: TransactionData = {
                        amount: data.transaction.amount_in_cents / 100,
                        paymentmethod: data.transaction.payment_method_type,
                        appointment_id: itemId,
                        customer_email: data.transaction.customer_email ?? '',
                    }

                    await apiClient.post('payment', transactionData)
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