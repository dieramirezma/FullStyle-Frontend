// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

interface LoginResponse {
  access_token: string
  refresh_token: string
  manager: boolean
  user: {
    id: number
    email: string
    name: string
    password: string
    active: boolean
    token: string
  }
}

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Correo', type: 'email' },
        password: { label: 'Contraseña', type: 'password' }
      },
      async authorize (credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}login`, {
          method: 'POST',
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const user: LoginResponse = await res.json()
        if (res.ok && (user.access_token != null)) {
          return {
            id: user.user.id,
            email: user.user.email,
            name: user.user.name,
            active: user.user.active,
            token: user.access_token,
            is_manager: user.manager
          }
        } else {
          return null
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt ({ token, user, account }) {
      if ((account != null) && account.provider === 'google') {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}login_google`, {
            method: 'POST',
            body: JSON.stringify({
              email: user?.email,
              token: account.id_token
            }),
            headers: { 'Content-Type': 'application/json' }
          })

          if (!res.ok) throw new Error('Error al autenticar con Google')

          const userData: LoginResponse = await res.json()

          token.accessToken = userData.access_token
          token.refreshToken = userData.refresh_token
          token.user = userData.user
        } catch (error) {
          console.log('error', error)
        }
      } else if (user != null) {
        token.accessToken = user.token
        token.user = user
      }
      return token
    },
    async session ({ session, token }) {
      session.accessToken = token.accessToken as string
      session.user = token.user as LoginResponse['user']
      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
