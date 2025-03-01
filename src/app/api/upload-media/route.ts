// app/api/upload-image/route.ts
import { type NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_CDN_URL ?? '',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY ?? '',
    secretAccessKey: process.env.R2_SECRET_KEY ?? ''
  }
})

export async function POST (request: NextRequest) {
  try {
    // Usando la API FormData nativa para manejar la subida de archivos
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No se proporcionó ninguna imagen' },
        { status: 400 }
      )
    }

    // Verificar que sea una imagen
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'El archivo debe ser una imagen' },
        { status: 400 }
      )
    }

    // Obtener los bytes del archivo
    const fileBuffer = await file.arrayBuffer()
    const fileExtension = file.name.split('.').pop() ?? 'jpg'
    const fileName = `${uuidv4()}.${fileExtension}`

    // Subir a R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME ?? '',
      Key: fileName,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type
    })

    await s3Client.send(command)

    // Construir la URL de la imagen
    const imageUrl = `${process.env.R2_CDN_URL_DEV}/${fileName}`

    return NextResponse.json({
      success: true,
      url: imageUrl
    })
  } catch (error) {
    console.error('Error al subir imagen:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error al procesar la imagen',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
