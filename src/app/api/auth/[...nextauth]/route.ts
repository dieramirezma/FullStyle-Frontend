// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

interface LoginResponse {
  access_token: string
  refresh_token: string
  user: {
    id: number
    email: string
    name: string
    password: string
    active: boolean
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
        console.log('user authenticated', user)
        if (res.ok && (user.access_token != null)) {
          console.log('user', user)

          return {
            id: user.user.id,
            email: user.user.email,
            name: user.user.name,
            active: user.user.active,
            token: user.access_token
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
    async jwt ({ token, user }) {
      if (user != null) {
        token.accessToken = user.token
      }
      return token
    },
    async session ({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
