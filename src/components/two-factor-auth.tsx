'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { useSession } from 'next-auth/react'
import { Clipboard, Loader2, Smartphone } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import apiClient from '@/utils/apiClient'

export default function TwoFactorAuth () {
  const [otpUrl, setOtpUrl] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    const fetch2FA = async () => {
      if (!session?.user?.email) return

      setIsLoading(true)
      try {
        const res = await apiClient.post('enable-2fa', { email: session.user.email })
        if (res.data.otpauth_url) {
          setOtpUrl(res.data.otpauth_url)
        }
      } catch (err) {
        console.log('Failed to generate 2FA QR code. Please try again.')
        // toast.error('Failed to generate 2FA QR code')
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user?.email) {
      fetch2FA()
    }
  }, [session])

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!session?.user?.email) {
      setError('Sesión expirada. Por favor, inicia sesión de nuevo.')
      return
    }

    if (!otp || otp.length < 6) {
      setError('Por favor, ingresa el código de verificación de 6 dígitos.')
      return
    }

    setError('')
    setIsVerifying(true)

    try {
      await apiClient.post('verify-2fa', { email: session.user.email, otp })
      toast.success('Autenticación en dos factores activado con éxito')
      router.push('/customer')
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Error al verificar el código')
      toast.error('Error al verificar el código')
    } finally {
      setIsVerifying(false)
    }
  }

  const copyOtpUrl = () => {
    if (otpUrl) {
      navigator.clipboard.writeText(otpUrl)
      toast.success('Authentication URL copied to clipboard')
    }
  }

  const handleCancel = () => {
    const isManager = session?.user?.is_manager
    if (isManager) router.push('/owner')
    else router.push('/customer')
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Autenticación en dos factores</CardTitle>
        <CardDescription>Mejora la seguridad de tu cuenta con la autenticación en dos factores</CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading
          ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Generando tu llave secreta.</span>
          </div>
            )
          : (
          <>
            {otpUrl
              ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Step 1: Scan QR Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Escanea este código con tu aplicación de autenticación favorita (Google Authenticator, Authy, etc.)
                  </p>
                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    <QRCodeSVG value={otpUrl} size={200} />
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={copyOtpUrl}>
                    <Clipboard className="h-4 w-4 mr-2" />
                    Copy Setup Key
                  </Button>
                </div>

                <Separator />

                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Step 2: Enter Verification Code</h3>
                    <p className="text-sm text-muted-foreground">Ingresa el número de seis dígitos</p>
                    <div className="flex justify-center py-2">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                        render={({ slots }) => (
                          <InputOTPGroup>
                            {slots.map((slot, index) => (
                              <InputOTPSlot key={index} {...slot} />
                            ))}
                          </InputOTPGroup>
                        )}
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" className="w-full" disabled={isVerifying || otp.length < 6}>
                      {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Verifica y activa
                    </Button>
                  </div>
                </form>
              </div>
                )
              : (
              <div className="py-8 text-center space-y-4">
                <Smartphone className="h-12 w-12 mx-auto text-primary" />
                <p>Ingresa el número de autenticación de tu app</p>

                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="flex justify-center py-2">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                      render={({ slots }) => (
                        <InputOTPGroup>
                          {slots.map((slot, index) => (
                            <InputOTPSlot key={index} {...slot} />
                          ))}
                        </InputOTPGroup>
                      )}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isVerifying || otp.length < 6}>
                    {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verifica el código
                  </Button>
                </form>
              </div>
                )}
          </>
            )}
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleCancel} disabled={isLoading || isVerifying}>
          Cancelar
        </Button>
      </CardFooter>
    </Card>
  )
}
