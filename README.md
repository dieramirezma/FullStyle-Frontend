# FullStyle-Frontend

Este es un proyecto desarrollado con [Next.js](https://nextjs.org), inicializado con [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Descripción del Proyecto

FullStyle-Frontend es una aplicación web construida con Next.js, diseñada para ofrecer una experiencia de usuario fluida y optimizada. Utiliza tecnologías web modernas y mejores prácticas para garantizar alto rendimiento y escalabilidad.

## Instalación y Configuración

### Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/fullstyle-frontend.git
cd fullstyle-frontend
```

### Instalar dependencias:

```bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

### Ejecutar el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación en funcionamiento.

Puedes comenzar a editar la página modificando `app/page.tsx`. Los cambios se reflejarán automáticamente.

Este proyecto utiliza [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) para optimizar y cargar fuentes automáticamente.

## Variables de Entorno

Para ejecutar este proyecto, necesitas agregar las siguientes variables de entorno en un archivo `.env`:

### Configuración General
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api/
```

### Google Maps
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_google_maps
```

### Autenticación con Google
```
GOOGLE_CLIENT_ID=tu_cliente_id_google
GOOGLE_CLIENT_SECRET=tu_secreto_google
```

### Resend (Correo Electrónico)
```
RESEND_API_KEY=tu_api_key_resend
```

### NextAuth (Autenticación)
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secreto_nextauth
```

### Wompi Sandbox (Pasarela de pagos)
```
NEXT_PUBLIC_WOMPI_PUBLIC_TEST_KEY=tu_public_test_key_wompi
NEXT_PUBLIC_WOMPI_INTEGRITY_KEY=tu_integrity_key_wompi
WOMPI_PRIVATE_TEST_KEY=tu_private_test_key_wompi
WOMPI_PUBLIC_TEST_KEY=tu_public_key_wompi
WOMPI_INTEGRITY_KEY=tu_integrity_key_wompi
WOMPI_EVENTS_KEY=tu_events_key_wompi
WOMPI_PRIVATE_EVENTS_PROD_KEY=tu_private_events_prod_key_wompi
```

### Cloudflare R2 (Almacenamiento en la nube)
```
R2_CDN_URL=https://tu_url_cdn_r2
R2_CDN_URL_DEV=https://tu_url_cdn_dev_r2
R2_BUCKET_NAME=tu_nombre_bucket_r2
R2_TOKEN_VALUE=tu_token_r2
R2_ACCESS_KEY=tu_access_key_r2
R2_SECRET_KEY=tu_secret_key_r2
```

## Más Información

Para aprender más sobre Next.js, consulta los siguientes recursos:

- [Documentación de Next.js](https://nextjs.org/docs) - Aprende sobre las características y la API de Next.js.
- [Aprende Next.js](https://nextjs.org/learn) - Un tutorial interactivo sobre Next.js.
- [Repositorio de Next.js en GitHub](https://github.com/vercel/next.js) - Tus comentarios y contribuciones son bienvenidos.

## Despliegue en Vercel

La forma más sencilla de desplegar esta aplicación es usando la plataforma [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), creada por los desarrolladores de Next.js.

Consulta la [documentación de despliegue en Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para obtener más detalles.

