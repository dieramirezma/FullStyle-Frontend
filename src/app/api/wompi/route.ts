import { NextResponse } from 'next/server';

async function encodeString(stringToEncode: string) {
  const encondedText = new TextEncoder().encode(stringToEncode);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encondedText);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function POST(request: Request) {
  const { amount, paymentType, paymentManner, itemId, userId, serviceString } = await request.json();

  const amountInCents = `${amount * 100}`;
  const currency = 'COP';
  const integritySecret = process.env.WOMPI_INTEGRITY_KEY;

  // Crear una referencia que incluya el tipo de pago
  var reference = '';
  const uniqueId = crypto.randomUUID();
  if (serviceString === undefined) {
    reference = `${paymentType}_${userId}_${itemId}_${uniqueId}`;
  } else { reference = `${paymentType}_${userId}_${itemId}_${serviceString}_${paymentManner}_${uniqueId}`; }

  const concatenatedString = `${reference}${amountInCents}${currency}${integritySecret}`;

  const hash = await encodeString(concatenatedString);

  return NextResponse.json({
    reference,
    hash,
    amountInCents,
    currency,
    publicKey: process.env.WOMPI_PUBLIC_TEST_KEY
  });
}