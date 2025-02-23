import { encodeString } from '@/utils/encodeString'
import { NextResponse } from 'next/server'

export async function POST (request: Request) {
  const { amount } = await request.json()

  const amountInCents = `${amount * 100}`
  const currency = 'COP'
  const integritySecret = process.env.WOMPI_INTEGRITY_KEY
  const reference = crypto.randomUUID()
  const concatenatedString = `${reference}${amountInCents}${currency}${integritySecret}`

  const hash = await encodeString(concatenatedString)

  return NextResponse.json({
    reference,
    hash,
    amountInCents,
    currency,
    publicKey: process.env.WOMPI_PUBLIC_TEST_KEY
  })
}
